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

// LINE Webhook Handler Function
const handleLineWebhook = async (req, res, next) => {
  try {
    const { events } = req.body;
    if (!events || events.length === 0) {
      return res.sendStatus(200);
    }

    let clientId = req.params.clientId;
    if (!clientId) {
      const firstClient = await prisma.client.findFirst();
      if (!firstClient) {
        console.warn('[LINE Webhook] No client found in database to fallback to');
        return res.sendStatus(200);
      }
      clientId = firstClient.id;
    }

    // Lookup client's LINE integration
    const integration = await prisma.integration.findUnique({
      where: {
        clientId_platform: {
          clientId,
          platform: 'LINE'
        }
      }
    });

    const channelAccessToken = integration?.config?.channelAccessToken || process.env.LINE_CHANNEL_ACCESS_TOKEN;

    for (const event of events) {
      if (event.type === 'message' && event.message.type === 'text') {
        const userMessage = event.message.text;
        const lineUserId = event.source.userId;

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

        console.log(`[LINE Bot Auto-Reply SUCCESS] client ${clientId}: ${aiReply}`);
        
        // Invoke LINE Message Reply API
        if (replyToken && channelAccessToken) {
          try {
            const lineResponse = await fetch('https://api.line.me/v2/bot/message/reply', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${channelAccessToken}`
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
};

// Facebook Webhook Handler Function
const handleFacebookWebhook = async (req, res, next) => {
  try {
    const { entry } = req.body;
    if (!entry || entry.length === 0) {
      return res.sendStatus(200);
    }

    let clientId = req.params.clientId;
    if (!clientId) {
      const firstClient = await prisma.client.findFirst();
      if (!firstClient) return res.sendStatus(200);
      clientId = firstClient.id;
    }

    const integration = await prisma.integration.findUnique({
      where: {
        clientId_platform: {
          clientId,
          platform: 'FACEBOOK'
        }
      }
    });

    const pageAccessToken = integration?.config?.pageAccessToken;
    
    for (const item of entry) {
      const messaging = item.messaging;
      if (!messaging) continue;
      for (const event of messaging) {
        if (event.message && event.message.text) {
          const userMessage = event.message.text;
          const senderId = event.sender.id;

          // Retrieve or create chat session
          let chat = await prisma.chat.findFirst({
            where: { clientId, customerContact: senderId, platform: 'FACEBOOK' }
          });

          if (!chat) {
            chat = await prisma.chat.create({
              data: {
                clientId,
                customerName: 'Facebook Customer',
                customerContact: senderId,
                platform: 'FACEBOOK',
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

          // Generate AI reply
          const aiReply = await generateResponse(clientId, userMessage, history.reverse());

          // Save bot reply
          await prisma.message.create({
            data: {
              chatId: chat.id,
              sender: 'BOT',
              content: aiReply
            }
          });

          console.log(`[Facebook Bot Auto-Reply SUCCESS] client ${clientId}: ${aiReply}`);

          // Invoke Facebook Send API if token is configured
          if (pageAccessToken) {
            try {
              const fbResponse = await fetch(`https://graph.facebook.com/v18.0/me/messages?access_token=${pageAccessToken}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  recipient: { id: senderId },
                  message: { text: aiReply }
                })
              });
              if (!fbResponse.ok) {
                const errText = await fbResponse.text();
                console.error('[Facebook Send API Error]', errText);
              }
            } catch (fbErr) {
              console.error('[Facebook Send Fetch Error]', fbErr);
            }
          }
        }
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('[Facebook Webhook Error]:', error);
    res.sendStatus(500);
  }
};

// Mount Webhook endpoints supporting both standard and parameterized clientIds
router.post('/line', handleLineWebhook);
router.post('/line/:clientId', handleLineWebhook);

router.post('/facebook', handleFacebookWebhook);
router.post('/facebook/:clientId', handleFacebookWebhook);

module.exports = router;
