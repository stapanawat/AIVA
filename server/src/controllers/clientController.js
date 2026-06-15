const prisma = require('../config/db');
const geminiService = require('../services/geminiService');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const storageService = require('../services/storageService');
const emailService = require('../services/emailService');

// 1. Get Dashboard Stats
const getDashboardStats = async (req, res, next) => {
  try {
    const clientId = req.user.clientId;

    // Aggregate stats from the database
    const totalChats = await prisma.chat.count({ where: { clientId } });
    const botHandled = await prisma.chat.count({ where: { clientId, status: 'BOT_HANDLING' } });
    const adminHandled = await prisma.chat.count({ where: { clientId, status: 'ADMIN_HANDLING' } });
    const leadCount = await prisma.lead.count({ where: { clientId } });

    // Calculate mock conversion rate & token percentage
    const conversionRate = totalChats > 0 ? ((leadCount / totalChats) * 100).toFixed(1) : 0;

    // Aggregate actual trained tokens
    const knowledgeTokens = await prisma.knowledge.aggregate({
      where: { clientId },
      _sum: { tokens: true }
    });
    const tokensUsed = knowledgeTokens._sum.tokens || 0;

    // Get chat count stats grouped by day (for week) and week (for month)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const chatsList = await prisma.chat.findMany({
      where: {
        clientId,
        createdAt: { gte: thirtyDaysAgo }
      },
      select: { createdAt: true }
    });

    const weekStats = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toDateString();
      const count = chatsList.filter(c => new Date(c.createdAt).toDateString() === dateStr).length;
      weekStats.push({
        label: d.toLocaleDateString('th-TH', { weekday: 'short' }),
        count
      });
    }

    const monthStats = [];
    for (let i = 3; i >= 0; i--) {
      const start = new Date();
      start.setDate(start.getDate() - (i + 1) * 7);
      const end = new Date();
      end.setDate(end.getDate() - i * 7);
      const count = chatsList.filter(c => {
        const cd = new Date(c.createdAt);
        return cd >= start && cd < end;
      }).length;
      monthStats.push({
        label: `สัปดาห์ที่ ${4 - i}`,
        count
      });
    }

    const totalCount = chatsList.length;
    const finalWeekStats = totalCount > 0 ? weekStats : [
      { label: 'จ.', count: 45 },
      { label: 'อ.', count: 82 },
      { label: 'พ.', count: 58 },
      { label: 'พฤ.', count: 94 },
      { label: 'ศ.', count: 61 },
      { label: 'ส.', count: 75 },
      { label: 'อา.', count: 40 }
    ];
    const finalMonthStats = totalCount > 0 ? monthStats : [
      { label: 'สัปดาห์ที่ 1', count: 240 },
      { label: 'สัปดาห์ที่ 2', count: 310 },
      { label: 'สัปดาห์ที่ 3', count: 280 },
      { label: 'สัปดาห์ที่ 4', count: 350 }
    ];

    res.json({
      totalChats,
      botHandled,
      adminHandled,
      leadCount,
      conversionRate,
      tokensUsed: tokensUsed || 12500, // actual count or default dev value
      tokenLimit: 100000,
      chatStats: {
        week: finalWeekStats,
        month: finalMonthStats
      }
    });
  } catch (error) {
    next(error);
  }
};

// 2. Knowledge Base Operations
const getKnowledgeBase = async (req, res, next) => {
  try {
    const clientId = req.user.clientId;
    const entries = await prisma.knowledge.findMany({
      where: { clientId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(entries);
  } catch (error) {
    next(error);
  }
};

const createKnowledgeEntry = async (req, res, next) => {
  try {
    const clientId = req.user.clientId;
    let { type, title, sourceUrl, content } = req.body;
    let size = 0;
    let fileUploadResult = null;

    if (!type) {
      type = req.file ? 'FILE' : 'TEXT';
    }

    // 1. Handle uploaded file
    if (req.file) {
      const file = req.file;
      size = file.size;
      
      // Auto-assign title if not provided
      if (!title || title.trim() === '') {
        title = file.originalname;
      }
      
      const extension = file.originalname.split('.').pop().toLowerCase();
      if (!['pdf', 'docx', 'doc', 'txt'].includes(extension)) {
        return res.status(400).json({ error: 'Unsupported file type. Only PDF, Word, and TXT files are allowed.' });
      }

      // Upload file asynchronously/synchronously to storage first
      try {
        fileUploadResult = await storageService.uploadFile(file.buffer, file.originalname, file.mimetype);
        sourceUrl = fileUploadResult.url;
      } catch (uploadErr) {
        console.error('File upload to storage failed:', uploadErr);
        return res.status(500).json({ error: 'Failed to upload file to storage.' });
      }

      // Create a PENDING entry in database
      const entry = await prisma.knowledge.create({
        data: {
          clientId,
          type: 'FILE',
          title,
          sourceUrl,
          content: 'กำลังวิเคราะห์และแยกข้อมูลเนื้อหาในไฟล์แบบเบื้องหลัง...', // placeholder until parsed
          fileSize: size,
          tokens: 0,
          status: 'PENDING'
        }
      });

      // Send the immediate response back
      res.status(201).json(entry);

      // Trigger Background Parsing without blocking the HTTP response
      setImmediate(async () => {
        try {
          console.log(`[Background Parser] Starting extraction for knowledge ${entry.id}...`);
          let parsedContent = '';
          const buffer = file.buffer;

          if (extension === 'pdf') {
            let parsedText = '';
            if (typeof pdfParse === 'function') {
              const parsed = await pdfParse(buffer);
              parsedText = parsed.text;
            } else if (pdfParse && typeof pdfParse.PDFParse === 'function') {
              const parser = new pdfParse.PDFParse({ data: buffer });
              const result = await parser.getText();
              parsedText = result.text;
            } else {
              throw new Error('pdf-parse module is not compatible');
            }
            parsedContent = parsedText;
          } else if (extension === 'docx' || extension === 'doc') {
            const result = await mammoth.extractRawText({ buffer });
            parsedContent = result.value;
          } else if (extension === 'txt') {
            parsedContent = buffer.toString('utf-8');
          }

          if (!parsedContent || parsedContent.trim() === '') {
            throw new Error('เนื้อหาเอกสารที่สกัดได้ว่างเปล่าหรือไม่ถูกต้อง');
          }

          const tokens = Math.ceil(parsedContent.length / 4);

          // Update entry in database
          await prisma.knowledge.update({
            where: { id: entry.id },
            data: {
              content: parsedContent,
              tokens,
              status: 'TRAINED',
              updatedAt: new Date()
            }
          });
          console.log(`[Background Parser] Successfully parsed and trained knowledge ${entry.id}. Tokens: ${tokens}`);
        } catch (parseErr) {
          console.error(`[Background Parser] Failed to parse knowledge ${entry.id}:`, parseErr.message);
          await prisma.knowledge.update({
            where: { id: entry.id },
            data: {
              status: 'FAILED',
              content: `การสกัดเนื้อหาล้มเหลว: ${parseErr.message}`,
              updatedAt: new Date()
            }
          });
        }
      });

      return;
    }

    // 2. Non-file (TEXT or URL) flow
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required.' });
    }
    
    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Content is required.' });
    }

    const entry = await prisma.knowledge.create({
      data: {
        clientId,
        type: type.toUpperCase(),
        title,
        sourceUrl: type.toUpperCase() === 'URL' ? sourceUrl : null,
        content,
        fileSize: 0,
        tokens: Math.ceil(content.length / 4),
        status: 'TRAINED'
      }
    });

    res.status(201).json(entry);
  } catch (error) {
    next(error);
  }
};

// 3. Chat Inbox Operations
const getChats = async (req, res, next) => {
  try {
    const clientId = req.user.clientId;
    const chats = await prisma.chat.findMany({
      where: { clientId },
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });
    res.json(chats);
  } catch (error) {
    next(error);
  }
};

const getChatMessages = async (req, res, next) => {
  try {
    const chatId = req.params.id;
    // Note: checkTenantAccess middleware already verified that this chat belongs to req.user.clientId
    const messages = await prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: 'asc' }
    });
    res.json(messages);
  } catch (error) {
    next(error);
  }
};

const sendChatMessage = async (req, res, next) => {
  try {
    const chatId = req.params.id;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Message content is required.' });
    }

    // Save admin message
    const message = await prisma.message.create({
      data: {
        chatId,
        sender: 'AGENT',
        content
      }
    });

    // Update chat status to ADMIN_HANDLING and update timestamp
    const chat = await prisma.chat.update({
      where: { id: chatId },
      data: {
        status: 'ADMIN_HANDLING',
        updatedAt: new Date()
      }
    });

    // Send the message to the corresponding platform API
    const { clientId, platform, customerContact } = chat;

    if (customerContact) {
      if (platform === 'LINE') {
        const integration = await prisma.integration.findUnique({
          where: {
            clientId_platform: {
              clientId,
              platform: 'LINE'
            }
          }
        });
        const channelAccessToken = integration?.config?.channelAccessToken || process.env.LINE_CHANNEL_ACCESS_TOKEN;

        if (channelAccessToken) {
          try {
            const lineResponse = await fetch('https://api.line.me/v2/bot/message/push', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${channelAccessToken}`
              },
              body: JSON.stringify({
                to: customerContact,
                messages: [{ type: 'text', text: content }]
              })
            });

            if (!lineResponse.ok) {
              const errText = await lineResponse.text();
              console.error('[LINE Push API Error]', errText);
            } else {
              console.log(`[LINE Push SUCCESS] Sent manually typed message to user: ${customerContact}`);
            }
          } catch (lineErr) {
            console.error('[LINE Push Fetch Error]', lineErr);
          }
        }
      } else if (platform === 'FACEBOOK') {
        const integration = await prisma.integration.findUnique({
          where: {
            clientId_platform: {
              clientId,
              platform: 'FACEBOOK'
            }
          }
        });
        const pageAccessToken = integration?.config?.pageAccessToken;

        if (pageAccessToken) {
          try {
            const fbResponse = await fetch(`https://graph.facebook.com/v18.0/me/messages?access_token=${pageAccessToken}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                recipient: { id: customerContact },
                message: { text: content }
              })
            });

            if (!fbResponse.ok) {
              const errText = await fbResponse.text();
              console.error('[Facebook Push API Error]', errText);
            }
          } catch (fbErr) {
            console.error('[Facebook Push Fetch Error]', fbErr);
          }
        }
      } else if (platform === 'INSTAGRAM') {
        const integration = await prisma.integration.findUnique({
          where: {
            clientId_platform: {
              clientId,
              platform: 'INSTAGRAM'
            }
          }
        });
        const pageAccessToken = integration?.config?.pageAccessToken;

        if (pageAccessToken) {
          try {
            const igResponse = await fetch(`https://graph.facebook.com/v18.0/me/messages?access_token=${pageAccessToken}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                recipient: { id: customerContact },
                message: { text: content }
              })
            });

            if (!igResponse.ok) {
              const errText = await igResponse.text();
              console.error('[Instagram Push API Error]', errText);
            }
          } catch (igErr) {
            console.error('[Instagram Push Fetch Error]', igErr);
          }
        }
      }
    }

    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
};

// 4. CRM Pipeline Operations
const getLeads = async (req, res, next) => {
  try {
    const clientId = req.user.clientId;
    const leads = await prisma.lead.findMany({
      where: { clientId },
      orderBy: { updatedAt: 'desc' }
    });
    res.json(leads);
  } catch (error) {
    next(error);
  }
};

const createOrUpdateLead = async (req, res, next) => {
  try {
    const clientId = req.user.clientId;
    const { id, name, contact, intent, value, stage } = req.body;

    if (id) {
      // Update existing lead
      // Validate tenant-level authorization
      const existingLead = await prisma.lead.findUnique({
        where: { id }
      });

      if (!existingLead || existingLead.clientId !== clientId) {
        return res.status(403).json({ error: 'Access denied. Lead does not belong to this tenant.' });
      }

      const updatedLead = await prisma.lead.update({
        where: { id },
        data: {
          name,
          contact,
          intent,
          value: value !== undefined ? parseFloat(value) : undefined,
          stage,
          updatedAt: new Date()
        }
      });
      return res.json(updatedLead);
    } else {
      // Create new lead
      if (!name || !contact) {
        return res.status(400).json({ error: 'Name and contact are required.' });
      }

      const newLead = await prisma.lead.create({
        data: {
          clientId,
          name,
          contact,
          intent,
          value: value !== undefined ? parseFloat(value) : 0,
          stage: stage || 'NEW'
        }
      });
      return res.status(201).json(newLead);
    }
  } catch (error) {
    next(error);
  }
};

// 5. Team Operations
const getTeamMembers = async (req, res, next) => {
  try {
    const clientId = req.user.clientId;
    const team = await prisma.teamMember.findMany({
      where: { clientId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            status: true,
            role: true
          }
        }
      }
    });

    const formattedTeam = team.map(member => ({
      id: member.id,
      userId: member.user.id,
      email: member.user.email,
      name: member.user.name,
      role: member.user.role === 'CLIENT_OWNER' ? 'OWNER' : member.role,
      status: member.user.status,
      createdAt: member.createdAt
    }));

    res.json(formattedTeam);
  } catch (error) {
    next(error);
  }
};

const inviteTeamMember = async (req, res, next) => {
  try {
    const clientId = req.user.clientId;
    const { email, name, role } = req.body;

    if (!email || !name) {
      return res.status(400).json({ error: 'Email and name are required.' });
    }

    // 1. Get client details to check active subscription plan limits
    const client = await prisma.client.findUnique({
      where: { id: clientId }
    });

    const plan = client ? client.plan : 'NONE';
    const maxUsers = plan === 'NONE' ? 0 : plan === 'BASIC' ? 1 : plan === 'PRO' ? 5 : 20;

    // 2. Count current team members
    const currentMemberCount = await prisma.teamMember.count({
      where: { clientId }
    });

    // 3. Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email }
    });

    let isAlreadyMember = false;
    if (user) {
      const existingMember = await prisma.teamMember.findUnique({
        where: {
          clientId_userId: {
            clientId,
            userId: user.id
          }
        }
      });
      if (existingMember) {
        isAlreadyMember = true;
      }
    }

    // 4. Enforce plan limit if adding a new member
    if (!isAlreadyMember && currentMemberCount >= maxUsers) {
      const errorMsg = plan === 'NONE'
        ? 'ขออภัยค่ะ คุณต้องสมัครแพ็กเกจก่อนเพื่อเพิ่มสมาชิกทีมค่ะ'
        : `ขออภัยค่ะ คุณใช้โควต้าพนักงานในทีมเต็มแล้วสำหรับแพ็กเกจ ${plan} (สูงสุด ${maxUsers} คน) กรุณาอัปเกรดแพ็กเกจเพื่อเพิ่มสมาชิกเพิ่มค่ะ`;
      return res.status(403).json({
        error: errorMsg
      });
    }

    let isNewUser = false;
    if (!user) {
      isNewUser = true;
      // Create mock user if they don't exist
      // In production, we'd send an email invite. Here we auto-create with a mock password.
      const mockPasswordHash = '$2a$10$wMhBqVly17m1h.W4c4x/..Mv.8g6qFz/qV31.v.P88942.' // bcrypt 'password'
      user = await prisma.user.create({
        data: {
          email,
          passwordHash: mockPasswordHash,
          name,
          role: 'CLIENT_STAFF'
        }
      });
    }

    // Check if already in this team
    const existingMember = await prisma.teamMember.findUnique({
      where: {
        clientId_userId: {
          clientId,
          userId: user.id
        }
      }
    });

    if (existingMember) {
      return res.status(200).json({
        id: existingMember.id,
        userId: user.id,
        email: user.email,
        name: user.name,
        role: existingMember.role,
        status: user.status,
        createdAt: existingMember.createdAt
      });
    }

    const newMember = await prisma.teamMember.create({
      data: {
        clientId,
        userId: user.id,
        role: role || 'STAFF'
      },
      include: {
        user: true
      }
    });

    // Send invitation email in background
    const tempPassword = isNewUser ? 'password' : '(ใช้รหัสผ่านปัจจุบันของคุณ)';
    emailService.sendInviteEmail(newMember.user.email, newMember.user.name, newMember.role, tempPassword)
      .catch(err => {
        console.error('[Email Service Error] Failed to send background invite email:', err);
      });

    res.status(201).json({
      id: newMember.id,
      userId: newMember.user.id,
      email: newMember.user.email,
      name: newMember.user.name,
      role: newMember.role,
      status: newMember.user.status,
      createdAt: newMember.createdAt
    });
  } catch (error) {
    next(error);
  }
};

// 6. Settings Operations
const updateSettings = async (req, res, next) => {
  try {
    const clientId = req.user.clientId;
    const { brandName, aiName, aiPersona, customPrompt, notifyHotLead, notifyDailyReport, bossName, bossEmail, businessType } = req.body;

    if (!brandName) {
      return res.status(400).json({ error: 'Brand name is required.' });
    }

    if (bossName) {
      if (bossName.length > 150) {
        return res.status(400).json({ error: 'ชื่อผู้ใช้ต้องไม่เกิน 150 ตัวอักษร' });
      }
      await prisma.user.update({
        where: { id: req.user.id },
        data: { name: bossName }
      });
    }

    if (bossEmail && bossEmail !== req.user.email) {
      // Check if email already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: bossEmail }
      });
      if (existingUser) {
        return res.status(400).json({ error: 'อีเมลนี้ถูกใช้งานแล้วโดยผู้ใช้อื่น' });
      }
      await prisma.user.update({
        where: { id: req.user.id },
        data: { email: bossEmail }
      });
    }

    const updatedClient = await prisma.client.update({
      where: { id: clientId },
      data: {
        name: brandName,
        aiName,
        aiPersona,
        customPrompt,
        notifyHotLead: notifyHotLead !== undefined ? !!notifyHotLead : undefined,
        notifyDailyReport: notifyDailyReport !== undefined ? !!notifyDailyReport : undefined,
        businessType,
        updatedAt: new Date()
      },
      include: {
        owner: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    res.json({
      message: 'Settings saved successfully!',
      client: updatedClient
    });
  } catch (error) {
    next(error);
  }
};

const getSettings = async (req, res, next) => {
  try {
    const clientId = req.user.clientId;
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      include: {
        owner: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });
    res.json(client);
  } catch (error) {
    next(error);
  }
};

// 7. AI Content Creator
const generateAIContent = async (req, res, next) => {
  try {
    const { prompt, platform } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }
    const result = await geminiService.generateMarketingCopy(prompt, platform || 'Facebook');
    res.json({ result });
  } catch (error) {
    next(error);
  }
};

// 8. Branch Management Operations
const getBranches = async (req, res, next) => {
  try {
    const clientId = req.user.clientId;
    const branches = await prisma.branch.findMany({
      where: { clientId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(branches);
  } catch (error) {
    next(error);
  }
};

const createBranch = async (req, res, next) => {
  try {
    const clientId = req.user.clientId;
    const { name, manager, status } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Branch name is required.' });
    }

    const branch = await prisma.branch.create({
      data: {
        clientId,
        name,
        managerName: manager || 'ไม่มีผู้จัดการ',
        status: status || 'Active'
      }
    });

    res.status(201).json(branch);
  } catch (error) {
    next(error);
  }
};

// 9. Follow-Up Rules Operations
const getFollowUpRules = async (req, res, next) => {
  try {
    const clientId = req.user.clientId;
    const rules = await prisma.followUpRule.findMany({
      where: { clientId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(rules);
  } catch (error) {
    next(error);
  }
};

const createFollowUpRule = async (req, res, next) => {
  try {
    const clientId = req.user.clientId;
    const { name, delay, message } = req.body;

    if (!name || !message) {
      return res.status(400).json({ error: 'Rule name and message are required.' });
    }

    const rule = await prisma.followUpRule.create({
      data: {
        clientId,
        name,
        delay: delay || '24h',
        message,
        active: true
      }
    });

    res.status(201).json(rule);
  } catch (error) {
    next(error);
  }
};

const toggleFollowUpRule = async (req, res, next) => {
  try {
    const clientId = req.user.clientId;
    const ruleId = req.params.id;

    const existingRule = await prisma.followUpRule.findUnique({
      where: { id: ruleId }
    });

    if (!existingRule || existingRule.clientId !== clientId) {
      return res.status(404).json({ error: 'Rule not found or access denied.' });
    }

    const updatedRule = await prisma.followUpRule.update({
      where: { id: ruleId },
      data: {
        active: !existingRule.active
      }
    });

    res.json(updatedRule);
  } catch (error) {
    next(error);
  }
};

// 10. Feedback Operations
const getFeedbacks = async (req, res, next) => {
  try {
    const clientId = req.user.clientId;
    const feedbacks = await prisma.feedback.findMany({
      where: { clientId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(feedbacks);
  } catch (error) {
    next(error);
  }
};

const createFeedback = async (req, res, next) => {
  try {
    const clientId = req.user.clientId;
    const { type, title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required.' });
    }

    const feedback = await prisma.feedback.create({
      data: {
        clientId,
        type: type || 'bug',
        title,
        description,
        status: 'Pending'
      }
    });

    res.status(201).json(feedback);
  } catch (error) {
    next(error);
  }
};

const getLeadScores = async (req, res, next) => {
  try {
    const clientId = req.user.clientId;
    const chats = await prisma.chat.findMany({
      where: { clientId, leadScore: { gt: 0 } },
      orderBy: { leadScore: 'desc' }
    });

    if (chats.length > 0) {
      const formatted = chats.map(c => ({
        id: c.id,
        name: c.customerName,
        score: c.leadScore,
        reason: c.leadScore >= 95 ? 'สนใจในตัวสินค้าสูงและพร้อมสั่งซื้อทันที แนะนำให้ส่งโปรโมชั่นกระตุ้น' : (c.leadScore >= 80 ? 'ลูกค้าถามเงื่อนไขจัดส่งและช่องทางการชำระเงิน' : 'สอบถามราคาและรายละเอียดทั่วไป'),
        aiEnabled: c.status === 'BOT_HANDLING'
      }));
      return res.json(formatted);
    }

    const fallback = [
      { id: 'ls-1', name: 'คุณแพรว', score: 98, reason: 'สอบถามช่องทางการโอนเงินและระยะเวลาส่ง แนะนำให้รีบส่งเลขบัญชี', aiEnabled: true },
      { id: 'ls-2', name: 'MewMew', score: 95, reason: 'ต้องการสั่งซื้อเซ็ตบำรุงผิว แต่ลังเลเรื่องไซส์ แนะนำให้เสนอโปรแถมฟรี', aiEnabled: false },
      { id: 'ls-3', name: 'คุณตูน', score: 88, reason: 'ถามรายละเอียดสินค้าครบแล้ว เงียบไป 1 ชม. น่าจะรอตัดสินใจ', aiEnabled: true }
    ];
    res.json(fallback);
  } catch (error) {
    next(error);
  }
};

const getLostRevenues = async (req, res, next) => {
  try {
    const clientId = req.user.clientId;
    const lostLeads = await prisma.lead.findMany({
      where: { clientId, stage: 'LOST' },
      orderBy: { updatedAt: 'desc' }
    });

    if (lostLeads.length > 0) {
      const formatted = lostLeads.map((l, idx) => ({
        id: l.id,
        name: l.name,
        product: l.intent || 'สินค้าที่สนใจ',
        value: l.value,
        reason: 'เงียบหายหลังจากสรุปยอดชำระเงิน',
        action: idx % 3 === 0 ? 'ส่งโค้ดส่งฟรี' : (idx % 3 === 1 ? 'ตั้งแจ้งเตือนทักแชท' : 'เสนอส่วนลด 5%'),
        btnColor: idx % 3 === 0 ? 'bg-emerald-600' : (idx % 3 === 1 ? 'bg-indigo-600' : 'bg-amber-600'),
        autoEnabled: idx % 2 === 0
      }));
      return res.json(formatted);
    }

    const fallback = [
      { id: 'lr-1', name: 'คุณนิว', product: 'เดรส Summer', value: 1290, reason: 'บ่นว่าค่าส่ง 50 บาทแพงไป แล้วเงียบหาย', action: 'ส่งโค้ดส่งฟรี', btnColor: 'bg-emerald-600', autoEnabled: false },
      { id: 'lr-2', name: 'Khun May', product: 'เซ็ตบำรุงผิว', value: 3210, reason: 'บอกว่ารอเงินเดือนออกสิ้นเดือน (อีก 3 วัน)', action: 'ตั้งแจ้งเตือนทักแชท', btnColor: 'bg-indigo-600', autoEnabled: true },
      { id: 'lr-3', name: 'Katty', product: 'กระเป๋าหนัง', value: 2500, reason: 'สินค้าหมดสต็อกตอนนั้น (ตอนนี้ของเข้าแล้ว)', action: 'แจ้งของเข้า', btnColor: 'bg-amber-600', autoEnabled: false }
    ];
    res.json(fallback);
  } catch (error) {
    next(error);
  }
};

const handleClientSupportChat = async (req, res, next) => {
  try {
    const clientId = req.user.clientId;
    const { message, chatHistory } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message content is required.' });
    }

    const client = await prisma.client.findUnique({
      where: { id: clientId }
    });

    if (!client) {
      return res.status(404).json({ error: 'Client not found.' });
    }

    const geminiService = require('../services/geminiService');
    const aiReply = await geminiService.generateSupportChatResponse(message, chatHistory || [], 'CLIENT');

    res.json({ reply: aiReply });
  } catch (error) {
    next(error);
  }
};

const toggleChatAi = async (req, res, next) => {
  try {
    const { id } = req.params;
    const chat = await prisma.chat.findUnique({
      where: { id }
    });

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    const updated = await prisma.chat.update({
      where: { id },
      data: {
        status: chat.status === 'BOT_HANDLING' ? 'ADMIN_HANDLING' : 'BOT_HANDLING',
        updatedAt: new Date()
      }
    });

    res.json({
      message: 'Chat AI status updated successfully',
      aiEnabled: updated.status === 'BOT_HANDLING'
    });
  } catch (error) {
    next(error);
  }
};

const deleteKnowledgeEntry = async (req, res, next) => {
  try {
    const clientId = req.user.clientId;
    const { id } = req.params;

    const entry = await prisma.knowledge.findUnique({
      where: { id }
    });

    if (!entry || entry.clientId !== clientId) {
      return res.status(404).json({ error: 'Knowledge entry not found or access denied.' });
    }

    await prisma.knowledge.delete({
      where: { id }
    });

    res.json({ message: 'Knowledge entry deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getKnowledgeBase,
  createKnowledgeEntry,
  deleteKnowledgeEntry,
  getChats,
  getChatMessages,
  sendChatMessage,
  getLeads,
  createOrUpdateLead,
  getTeamMembers,
  inviteTeamMember,
  updateSettings,
  getSettings,
  generateAIContent,
  getBranches,
  createBranch,
  getFollowUpRules,
  createFollowUpRule,
  toggleFollowUpRule,
  getFeedbacks,
  createFeedback,
  getLeadScores,
  getLostRevenues,
  handleClientSupportChat,
  toggleChatAi
};
