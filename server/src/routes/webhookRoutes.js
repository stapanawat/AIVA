const express = require('express');
const router = express.Router();
const prisma = require('../config/db');
const { generateResponse } = require('../services/geminiService');

/**
 * Direct simulator endpoint to test the AI Agent response
 * POST /api/webhooks/simulate-bot
 * Body: { clientId: string, chatId: string, message: string }
 */
router.post('/simulate-bot', async (req, res, next) => {
  try {
    const { clientId, chatId, message } = req.body;

    if (!clientId || !chatId || !message) {
      return res.status(400).json({ error: 'clientId, chatId, and message are required.' });
    }

    // 1. Fetch or verify the Chat workspace
    let chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: { client: true }
    });

    if (!chat) {
      return res.status(404).json({ error: 'Chat session not found.' });
    }

    if (chat.clientId !== clientId) {
      return res.status(403).json({ error: 'Chat belongs to another tenant client.' });
    }

    // 2. Save customer message
    await prisma.message.create({
      data: {
        chatId,
        sender: 'CUSTOMER',
        content: message
      }
    });

    // 3. Retrieve recent chat history for context
    const history = await prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: 'desc' },
      take: 8
    });

    // Reverse history to have chronological order
    const formattedHistory = history.reverse();

    // 4. Generate AI response using Gemini and context
    const replyText = await generateResponse(clientId, message, formattedHistory);

    // 5. Save AI reply to DB
    const savedReply = await prisma.message.create({
      data: {
        chatId,
        sender: 'BOT',
        content: replyText
      }
    });

    // 6. Update chat last active timestamp
    await prisma.chat.update({
      where: { id: chatId },
      data: { updatedAt: new Date() }
    });

    res.json({
      message: 'AI response generated and saved.',
      reply: savedReply
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Mock LINE OA Webhook endpoint
 * POST /api/webhooks/line
 */
router.post('/line', async (req, res, next) => {
  try {
    const { events } = req.body;
    if (!events || events.length === 0) {
      return res.sendStatus(200);
    }

    for (const event of events) {
      if (event.type === 'message' && event.message.type === 'text') {
        const userMessage = event.message.text;
        const lineUserId = event.source.userId;

        // Find or map Client ID associated with the Webhook token (mock maps to active client)
        // For testing purposes, we grab the first client in the database
        const firstClient = await prisma.client.findFirst();
        if (!firstClient) continue;

        const clientId = firstClient.id;

        // Retrieve or create chat session
        let chat = await prisma.chat.findFirst({
          where: { clientId, customerContact: lineUserId, platform: 'LINE' }
        });

        if (!chat) {
          chat = await prisma.chat.create({
            data: {
              clientId,
              customerName: 'LINE Customer',
              customerContact: lineUserId,
              platform: 'LINE',
              status: 'BOT_HANDLING'
            }
          });
        }

        // Save incoming customer message
        await prisma.message.create({
          data: {
            chatId: chat.id,
            sender: 'CUSTOMER',
            content: userMessage
          }
        });

        // Fetch recent messages
        const history = await prisma.message.findMany({
          where: { chatId: chat.id },
          orderBy: { createdAt: 'desc' },
          take: 6
        });

        // Extract replyToken for sending back message
        const replyToken = event.replyToken;

        // Request Gemini to generate a response
        const aiReply = await generateResponse(clientId, userMessage, history.reverse());

        // Save bot reply
        await prisma.message.create({
          data: {
            chatId: chat.id,
            sender: 'BOT',
            content: aiReply
          }
        });

        console.log(`[LINE Bot Auto-Reply SUCCESS]: ${aiReply}`);
        
        // Invoke LINE Message Reply API
        if (replyToken && process.env.LINE_CHANNEL_ACCESS_TOKEN) {
          try {
            const lineResponse = await fetch('https://api.line.me/v2/bot/message/reply', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`
              },
              body: JSON.stringify({
                replyToken: replyToken,
                messages: [{ type: 'text', text: aiReply }]
              })
            });

            if (!lineResponse.ok) {
              const errText = await lineResponse.text();
              console.error('[LINE Reply API Error]', errText);
            }
          } catch (lineErr) {
            console.error('[LINE Reply Fetch Error]', lineErr);
          }
        }
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('[LINE Webhook Router Error]:', error);
    res.sendStatus(500);
  }
});

module.exports = router;
