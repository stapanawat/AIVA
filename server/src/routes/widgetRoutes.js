const express = require('express');
const router = express.Router();
const prisma = require('../config/db');
const { generateResponse } = require('../services/geminiService');

// 1. Get widget config (unauthenticated, public for widget script)
router.get('/config', async (req, res, next) => {
  try {
    const { clientId } = req.query;
    if (!clientId) {
      return res.status(400).json({ error: 'clientId is required.' });
    }

    // Get brand profile settings
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      select: {
        id: true,
        name: true,
        aiName: true,
        aiPersona: true,
        integrations: {
          where: { platform: 'WEBSITE' }
        }
      }
    });

    if (!client) {
      return res.status(404).json({ error: 'Client not found.' });
    }

    const websiteIntegration = client.integrations[0];
    const themeColor = websiteIntegration?.config?.themeColor || '#4f46e5';
    const greeting = websiteIntegration?.config?.greeting || 'สวัสดีค่ะ มีอะไรให้ช่วยไหมคะ';

    res.json({
      clientId: client.id,
      brandName: client.name,
      aiName: client.aiName || 'AIVA Agent',
      themeColor,
      greeting
    });
  } catch (error) {
    next(error);
  }
});

// 2. Handle widget incoming message
router.post('/message', async (req, res, next) => {
  try {
    const { clientId, chatId, message } = req.body;
    if (!clientId || !chatId || !message) {
      return res.status(400).json({ error: 'clientId, chatId, and message are required.' });
    }

    // Retrieve or create chat session
    let chat = await prisma.chat.findFirst({
      where: { clientId, id: chatId, platform: 'WEB' }
    });

    if (!chat) {
      chat = await prisma.chat.create({
        data: {
          id: chatId, // use client-generated UUID
          clientId,
          customerName: 'Website Visitor',
          platform: 'WEB',
          status: 'BOT_HANDLING'
        }
      });
    }

    // Save customer message
    await prisma.message.create({
      data: {
        chatId: chat.id,
        sender: 'CUSTOMER',
        content: message
      }
    });

    // Fetch message history for context
    const history = await prisma.message.findMany({
      where: { chatId: chat.id },
      orderBy: { createdAt: 'desc' },
      take: 6
    });

    // Call Gemini for response
    const aiReply = await generateResponse(clientId, message, history.reverse());

    // Save bot response
    const savedReply = await prisma.message.create({
      data: {
        chatId: chat.id,
        sender: 'BOT',
        content: aiReply
      }
    });

    res.json({
      sender: 'BOT',
      content: aiReply,
      createdAt: savedReply.createdAt
    });
  } catch (error) {
    next(error);
  }
});

// 3. Serve the embeddable script
router.get('/script.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  const host = `${req.protocol}://${req.get('host')}`;
  
  const scriptContent = `
(function() {
  const scriptTag = document.currentScript;
  const urlParams = new URLSearchParams(scriptTag.src.split('?')[1]);
  const clientId = urlParams.get('clientId');
  
  if (!clientId) {
    console.error('AIVA Widget: clientId is required in script tag query parameters.');
    return;
  }

  // Load Widget Config
  fetch('${host}/api/widget/config?clientId=' + clientId)
    .then(res => res.json())
    .then(config => {
      initWidget(config);
    })
    .catch(err => console.error('AIVA Widget: Failed to load configuration', err));

  function initWidget(config) {
    // Inject Styles
    const style = document.createElement('style');
    style.innerHTML = \`
      .aiva-chat-widget { position: fixed; bottom: 20px; right: 20px; z-index: 10000; font-family: sans-serif; }
      .aiva-chat-bubble { width: 60px; height: 60px; border-radius: 30px; background-color: \${config.themeColor}; color: white; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: transform 0.2s; }
      .aiva-chat-bubble:hover { transform: scale(1.05); }
      .aiva-chat-box { width: 350px; height: 500px; background: white; border-radius: 20px; box-shadow: 0 8px 24px rgba(0,0,0,0.15); display: none; flex-direction: column; overflow: hidden; position: absolute; bottom: 75px; right: 0; border: 1px solid #f1f5f9; }
      .aiva-chat-header { background-color: \${config.themeColor}; color: white; padding: 15px; display: flex; align-items: center; justify-content: space-between; }
      .aiva-chat-title { font-weight: bold; font-size: 14px; }
      .aiva-chat-messages { flex: 1; padding: 15px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; background-color: #f8fafc; }
      .aiva-message { max-width: 80%; padding: 8px 12px; border-radius: 12px; font-size: 13px; line-height: 1.4; word-break: break-word; }
      .aiva-message.customer { background-color: \${config.themeColor}; color: white; align-self: flex-end; border-bottom-right-radius: 2px; }
      .aiva-message.bot { background-color: #e2e8f0; color: #1e293b; align-self: flex-start; border-bottom-left-radius: 2px; }
      .aiva-chat-input-area { padding: 10px; display: flex; gap: 8px; border-top: 1px solid #e2e8f0; background: white; }
      .aiva-chat-input { flex: 1; border: 1px solid #cbd5e1; padding: 8px 12px; border-radius: 10px; font-size: 13px; outline: none; }
      .aiva-chat-send { background-color: \${config.themeColor}; color: white; border: none; padding: 8px 15px; border-radius: 10px; font-size: 13px; font-weight: bold; cursor: pointer; }
    \`;
    document.head.appendChild(style);

    // Create Widget Container
    const container = document.createElement('div');
    container.className = 'aiva-chat-widget';

    // Bubble
    const bubble = document.createElement('div');
    bubble.className = 'aiva-chat-bubble';
    bubble.innerHTML = \\\`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin: auto;"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>\\\`;
    
    // Chat Box
    const chatBox = document.createElement('div');
    chatBox.className = 'aiva-chat-box';
    chatBox.innerHTML = \\\`
      <div class="aiva-chat-header">
        <span class="aiva-chat-title">\\\${config.brandName}</span>
        <button id="aiva-close-btn" style="background: none; border: none; color: white; cursor: pointer; font-size: 16px;">✕</button>
      </div>
      <div class="aiva-chat-messages" id="aiva-msg-container">
        <div class="aiva-message bot">\\\${config.greeting}</div>
      </div>
      <div class="aiva-chat-input-area">
        <input type="text" class="aiva-chat-input" placeholder="พิมพ์ข้อความ..." id="aiva-chat-field" />
        <button class="aiva-chat-send" id="aiva-send-btn">ส่ง</button>
      </div>
    \\\`;

    container.appendChild(bubble);
    container.appendChild(chatBox);
    document.body.appendChild(container);

    // Get Session / Chat ID
    let chatId = localStorage.getItem('aiva_chat_session_' + clientId);
    if (!chatId) {
      chatId = 'web-' + Math.random().toString(36).substring(2) + '-' + Date.now();
      localStorage.setItem('aiva_chat_session_' + clientId, chatId);
    }

    // Toggle Chatbox
    bubble.addEventListener('click', () => {
      const show = chatBox.style.display === 'flex';
      chatBox.style.display = show ? 'none' : 'flex';
    });

    document.getElementById('aiva-close-btn').addEventListener('click', () => {
      chatBox.style.display = 'none';
    });

    // Send Message
    const inputField = document.getElementById('aiva-chat-field');
    const sendBtn = document.getElementById('aiva-send-btn');
    const msgContainer = document.getElementById('aiva-msg-container');

    function sendMessage() {
      const text = inputField.value.trim();
      if (!text) return;

      inputField.value = '';

      // Append Customer Message
      const userMsg = document.createElement('div');
      userMsg.className = 'aiva-message customer';
      userMsg.innerText = text;
      msgContainer.appendChild(userMsg);
      msgContainer.scrollTop = msgContainer.scrollHeight;

      // Call Backend
      fetch('\\\${host}/api/widget/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId, chatId, message: text })
      })
        .then(r => r.json())
        .then(data => {
          const botMsg = document.createElement('div');
          botMsg.className = 'aiva-message bot';
          botMsg.innerText = data.content;
          msgContainer.appendChild(botMsg);
          msgContainer.scrollTop = msgContainer.scrollHeight;
        })
        .catch(err => {
          console.error('AIVA Widget: Error sending message', err);
        });
    }

    sendBtn.addEventListener('click', sendMessage);
    inputField.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
  }
})();
`;
  res.send(scriptContent);
});

module.exports = router;
