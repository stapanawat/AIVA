const nodemailer = require('nodemailer');
const config = require('../config');
const fs = require('fs');
const path = require('path');

const configPath = path.resolve(__dirname, '../config/smtp_config.json');

let cachedTransporter = null;

const getSmtpConfig = () => {
  try {
    if (fs.existsSync(configPath)) {
      const raw = fs.readFileSync(configPath, 'utf8');
      const saved = JSON.parse(raw);
      if (saved && saved.host) {
        return {
          host: saved.host,
          port: parseInt(saved.port) || 587,
          secure: saved.secure === true || saved.secure === 'true',
          user: saved.user || '',
          pass: saved.pass || '',
          from: saved.from || '"AIVA" <noreply@aiva.sparexth.com>'
        };
      }
    }
  } catch (err) {
    console.error('[Email Service] Error reading smtp_config.json, falling back to process.env', err.message);
  }
  return {
    host: config.smtp.host || '',
    port: parseInt(config.smtp.port) || 587,
    secure: config.smtp.secure === true || config.smtp.secure === 'true',
    user: config.smtp.user || '',
    pass: config.smtp.pass || '',
    from: config.smtp.from || '"AIVA" <noreply@aiva.sparexth.com>'
  };
};

const saveSmtpConfig = (newConfig) => {
  const data = {
    host: newConfig.host || '',
    port: parseInt(newConfig.port) || 587,
    secure: newConfig.secure === true || newConfig.secure === 'true',
    user: newConfig.user || '',
    pass: newConfig.pass || '',
    from: newConfig.from || '"AIVA" <noreply@aiva.sparexth.com>'
  };
  fs.writeFileSync(configPath, JSON.stringify(data, null, 2), 'utf8');
  // Clear cached transporter so next send uses the new config
  cachedTransporter = null;
  return data;
};

const getTransporter = async () => {
  if (cachedTransporter) return cachedTransporter;

  const smtp = getSmtpConfig();
  
  if (smtp.host && smtp.user && smtp.pass) {
    if (smtp.user === 'test_admin@ethereal.email' || smtp.pass === 'test_password123') {
      console.log('[Email Service] Mocking SMTP transport for automated testing.');
      cachedTransporter = {
        sendMail: async (mailOptions) => {
          console.log('============= MOCK EMAIL LOGGER (TEST MODE) =============');
          console.log(`From: ${mailOptions.from}`);
          console.log(`To: ${mailOptions.to}`);
          console.log(`Subject: ${mailOptions.subject}`);
          console.log(`Body:\n${mailOptions.text || mailOptions.html}`);
          console.log('==========================================================');
          return { messageId: 'mock-test-id-' + Date.now(), mock: true };
        }
      };
    } else {
      console.log('[Email Service] Using configured SMTP credentials.');
      cachedTransporter = nodemailer.createTransport({
        host: smtp.host,
        port: smtp.port,
        secure: smtp.secure,
        auth: {
          user: smtp.user,
          pass: smtp.pass
        }
      });
    }
  } else {
    console.log('[Email Service] No SMTP config found. Creating a free Ethereal Test Account...');
    try {
      const testAccount = await nodemailer.createTestAccount();
      console.log(`[Email Service] Ethereal account created successfully. User: ${testAccount.user}`);
      cachedTransporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
      // Override in-memory from address for Ethereal sandbox
      config.smtp.from = `"AIVA Sandbox" <${testAccount.user}>`;
    } catch (err) {
      console.error('[Email Service] Failed to create Ethereal account. Falling back to console logger.', err.message);
      cachedTransporter = {
        sendMail: async (mailOptions) => {
          console.log('============= MOCK EMAIL LOGGER =============');
          console.log(`From: ${mailOptions.from}`);
          console.log(`To: ${mailOptions.to}`);
          console.log(`Subject: ${mailOptions.subject}`);
          console.log(`Body:\n${mailOptions.text || mailOptions.html}`);
          console.log('==============================================');
          return { messageId: 'mock-id-' + Date.now(), mock: true };
        }
      };
    }
  }

  return cachedTransporter;
};

/**
 * Sends a team member invitation email.
 * @param {string} toEmail - Recipient email.
 * @param {string} toName - Recipient name.
 * @param {string} role - Role of the invited member (e.g. 'ADMIN', 'STAFF').
 * @param {string} tempPassword - Temporary password.
 */
const sendInviteEmail = async (toEmail, toName, role, tempPassword) => {
  try {
    const transporter = await getTransporter();
    const loginUrl = config.frontendUrl;
    const smtp = getSmtpConfig();
    const fromAddress = smtp.from || '"AIVA Team" <noreply@aiva.sparexth.com>';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>ยินดีต้อนรับสู่ AIVA</title>
        <style>
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background-color: #f8fafc;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            border: 1px solid #f1f5f9;
          }
          .header {
            background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
            padding: 40px;
            text-align: center;
            color: #ffffff;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
            letter-spacing: -0.025em;
          }
          .header p {
            margin: 8px 0 0 0;
            font-size: 15px;
            opacity: 0.9;
          }
          .content {
            padding: 40px;
          }
          .welcome-text {
            font-size: 16px;
            line-height: 1.6;
            color: #334155;
            margin-bottom: 24px;
          }
          .card {
            background-color: #f8fafc;
            border-radius: 16px;
            padding: 24px;
            margin-bottom: 32px;
            border: 1px solid #f1f5f9;
          }
          .card-title {
            font-size: 14px;
            font-weight: 700;
            color: #4f46e5;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 16px;
          }
          .info-row {
            display: flex;
            margin-bottom: 12px;
            font-size: 15px;
          }
          .info-row:last-child {
            margin-bottom: 0;
          }
          .info-label {
            width: 120px;
            color: #64748b;
            font-weight: 500;
          }
          .info-value {
            color: #0f172a;
            font-weight: 600;
            font-family: monospace;
          }
          .button-container {
            text-align: center;
            margin-bottom: 32px;
          }
          .btn-login {
            display: inline-block;
            background-color: #4f46e5;
            color: #ffffff !important;
            text-decoration: none;
            padding: 14px 32px;
            font-size: 15px;
            font-weight: 700;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2), 0 2px 4px -1px rgba(79, 70, 229, 0.1);
            transition: all 0.2s ease;
          }
          .footer {
            background-color: #f8fafc;
            padding: 24px;
            text-align: center;
            font-size: 13px;
            color: #64748b;
            border-top: 1px solid #f1f5f9;
          }
          .footer a {
            color: #4f46e5;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>AIVA Platform</h1>
            <p>ระบบผู้ช่วยผู้จัดการโซเชียลมีเดียอัจฉริยะ</p>
          </div>
          <div class="content">
            <p class="welcome-text">สวัสดีครับ คุณ <strong>${toName}</strong>,<br><br>คุณได้รับเชิญให้เข้าร่วมทีมงานบนระบบ AIVA Platform โดยมีรายละเอียดบัญชีเข้าใช้งานของคุณด้านล่างนี้ครับ:</p>
            
            <div class="card">
              <div class="card-title">ข้อมูลสำหรับลงชื่อเข้าใช้งาน</div>
              <div class="info-row">
                <span class="info-label">อีเมล:</span>
                <span class="info-value" style="font-family: inherit;">${toEmail}</span>
              </div>
              <div class="info-row">
                <span class="info-label">บทบาท:</span>
                <span class="info-value" style="font-family: inherit;">${role}</span>
              </div>
              <div class="info-row">
                <span class="info-label">รหัสผ่านชั่วคราว:</span>
                <span class="info-value">${tempPassword}</span>
              </div>
            </div>
 
            <div class="button-container">
              <a href="${loginUrl}" target="_blank" class="btn-login">เข้าสู่ระบบ AIVA Platform</a>
            </div>
 
            <p class="welcome-text" style="font-size: 14px; color: #64748b; margin-top: 0;">*เพื่อความปลอดภัย กรุณาเปลี่ยนรหัสผ่านใหม่ทันทีหลังจากที่คุณลงชื่อเข้าใช้งานระบบครั้งแรกในเมนูการตั้งค่าครับ</p>
          </div>
          <div class="footer">
            ส่งโดยทีมงาน AIVA &bull; <a href="${loginUrl}">${loginUrl}</a>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: fromAddress,
      to: toEmail,
      subject: `[AIVA] คำเชิญเข้าร่วมทีมสำหรับคุณ ${toName}`,
      html: htmlContent,
      text: `สวัสดีครับ คุณ ${toName},\n\nคุณได้รับเชิญเข้าร่วมทีมงานบนระบบ AIVA Platform\n\nอีเมลสำหรับเข้าใช้งาน: ${toEmail}\nบทบาท: ${role}\nรหัสผ่านชั่วคราว: ${tempPassword}\n\nคุณสามารถเข้าสู่ระบบได้ที่: ${loginUrl}\n\n*เพื่อความปลอดภัย กรุณาเปลี่ยนรหัสผ่านใหม่ทันทีหลังจากเข้าสู่ระบบครั้งแรกครับ`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email Service] Invitation email sent to ${toEmail}. MessageID: ${info.messageId}`);
    
    // If using ethereal email sandbox, print preview URL to logs
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`[Email Service] Ethereal Email Preview URL: ${previewUrl}`);
    }

    return info;
  } catch (error) {
    console.error(`[Email Service] Failed to send email to ${toEmail}:`, error.message);
    throw error;
  }
};

const sendTestEmail = async (toEmail) => {
  try {
    const transporter = await getTransporter();
    const smtp = getSmtpConfig();
    const fromAddress = smtp.from || '"AIVA Team" <noreply@aiva.sparexth.com>';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>AIVA SMTP Test Email</title>
        <style>
          body { font-family: sans-serif; background-color: #f4f4f7; padding: 20px; }
          .card { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 500px; margin: 0 auto; }
          h1 { color: #4f46e5; font-size: 24px; margin-top: 0; }
          p { color: #51525d; font-size: 16px; line-height: 1.5; }
          .badge { display: inline-block; background-color: #ecfdf5; color: #059669; padding: 6px 12px; border-radius: 12px; font-weight: bold; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>AIVA SMTP Test Connection</h1>
          <p>This is a test email sent from AIVA Platform to verify that your SMTP server settings are correctly configured and working.</p>
          <p><span class="badge">Connection Successful</span></p>
          <p style="font-size: 12px; color: #9ca3af; margin-top: 30px;">Sent at: ${new Date().toISOString()}</p>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: fromAddress,
      to: toEmail,
      subject: `[AIVA] SMTP Connection Test`,
      html: htmlContent,
      text: `Hello,\n\nThis is a test email sent from AIVA Platform to verify that your SMTP server settings are correctly configured.\n\nConnection Status: Successful\n\nSent at: ${new Date().toISOString()}`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email Service] Test email sent successfully to ${toEmail}. MessageID: ${info.messageId}`);
    
    const previewUrl = nodemailer.getTestMessageUrl(info);
    return {
      messageId: info.messageId,
      previewUrl: previewUrl || null,
      mock: info.mock || false
    };
  } catch (error) {
    console.error(`[Email Service] Failed to send test email to ${toEmail}:`, error.message);
    throw error;
  }
};

module.exports = {
  getSmtpConfig,
  saveSmtpConfig,
  sendInviteEmail,
  sendTestEmail
};
