const express = require('express');
const router = express.Router();
const prisma = require('../config/db');
const { generateResponse } = require('../services/geminiService');
const { queueChatReply } = require('../queues/chatQueue');

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

        // Queue the response processing asynchronously
        await queueChatReply({
          clientId,
          chatId: chat.id,
          userMessage,
          platform: 'LINE',
          replyToken: event.replyToken,
          customerContact: lineUserId
        });
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
    console.log('[Facebook Webhook POST Received]:', JSON.stringify(req.body, null, 2));
    const { entry } = req.body;
    if (!entry || entry.length === 0) {
      return res.sendStatus(200);
    }

    let clientId = req.params.clientId;
    if (!clientId) {
      const pageId = entry[0]?.id;
      if (pageId) {
        const integrations = await prisma.integration.findMany({
          where: { platform: 'FACEBOOK', status: 'ACTIVE' }
        });
        const match = integrations.find(i => i.config && i.config.pageId === pageId);
        if (match) {
          clientId = match.clientId;
        }
      }

      if (!clientId) {
        const firstClient = await prisma.client.findFirst();
        if (!firstClient) return res.sendStatus(200);
        clientId = firstClient.id;
      }
    }

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

          // Queue the response processing asynchronously
          await queueChatReply({
            clientId,
            chatId: chat.id,
            userMessage,
            platform: 'FACEBOOK',
            customerContact: senderId
          });
        }
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('[Facebook Webhook Error]:', error);
    res.sendStatus(500);
  }
};

// Instagram Webhook Handler Function
const handleInstagramWebhook = async (req, res, next) => {
  try {
    console.log('[Instagram Webhook POST Received]:', JSON.stringify(req.body, null, 2));
    const { entry } = req.body;
    if (!entry || entry.length === 0) {
      return res.sendStatus(200);
    }

    let clientId = req.params.clientId;
    if (!clientId) {
      const pageId = entry[0]?.id;
      if (pageId) {
        const integrations = await prisma.integration.findMany({
          where: { platform: 'INSTAGRAM', status: 'ACTIVE' }
        });
        const match = integrations.find(i => i.config && i.config.pageId === pageId);
        if (match) {
          clientId = match.clientId;
        }
      }

      if (!clientId) {
        const firstClient = await prisma.client.findFirst();
        if (!firstClient) return res.sendStatus(200);
        clientId = firstClient.id;
      }
    }

    for (const item of entry) {
      const messaging = item.messaging;
      if (!messaging) continue;
      for (const event of messaging) {
        if (event.message && event.message.text) {
          const userMessage = event.message.text;
          const senderId = event.sender.id;

          // Retrieve or create chat session
          let chat = await prisma.chat.findFirst({
            where: { clientId, customerContact: senderId, platform: 'INSTAGRAM' }
          });

          if (!chat) {
            chat = await prisma.chat.create({
              data: {
                clientId,
                customerName: 'Instagram Customer',
                customerContact: senderId,
                platform: 'INSTAGRAM',
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

          // Queue the response processing asynchronously
          await queueChatReply({
            clientId,
            chatId: chat.id,
            userMessage,
            platform: 'INSTAGRAM',
            customerContact: senderId
          });
        }
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('[Instagram Webhook Error]:', error);
    res.sendStatus(500);
  }
};

// TikTok Webhook Handler Function
const handleTikTokWebhook = async (req, res, next) => {
  try {
    const { event, content, open_id } = req.body;
    if (!content || !open_id) {
      return res.sendStatus(200);
    }

    let clientId = req.params.clientId;
    if (!clientId) {
      const firstClient = await prisma.client.findFirst();
      if (!firstClient) return res.sendStatus(200);
      clientId = firstClient.id;
    }

    // Retrieve or create chat session
    let chat = await prisma.chat.findFirst({
      where: { clientId, customerContact: open_id, platform: 'TIKTOK' }
    });

    if (!chat) {
      chat = await prisma.chat.create({
        data: {
          clientId,
          customerName: 'TikTok Customer',
          customerContact: open_id,
          platform: 'TIKTOK',
          status: 'BOT_HANDLING'
        }
      });
    }

    // Save incoming customer message
    await prisma.message.create({
      data: {
        chatId: chat.id,
        sender: 'CUSTOMER',
        content: content
      }
    });

    // Queue the response processing asynchronously
    await queueChatReply({
      clientId,
      chatId: chat.id,
      userMessage: content,
      platform: 'TIKTOK',
      customerContact: open_id
    });

    res.sendStatus(200);
  } catch (error) {
    console.error('[TikTok Webhook Error]:', error);
    res.sendStatus(500);
  }
};

// Lazada Webhook Handler Function
const handleLazadaWebhook = async (req, res, next) => {
  try {
    const { message_id, content, buyer_id } = req.body;
    if (!content || !buyer_id) {
      return res.sendStatus(200);
    }

    let clientId = req.params.clientId;
    if (!clientId) {
      const firstClient = await prisma.client.findFirst();
      if (!firstClient) return res.sendStatus(200);
      clientId = firstClient.id;
    }

    // Retrieve or create chat session
    let chat = await prisma.chat.findFirst({
      where: { clientId, customerContact: buyer_id, platform: 'LAZADA' }
    });

    if (!chat) {
      chat = await prisma.chat.create({
        data: {
          clientId,
          customerName: 'Lazada Customer',
          customerContact: buyer_id,
          platform: 'LAZADA',
          status: 'BOT_HANDLING'
        }
      });
    }

    // Save incoming customer message
    await prisma.message.create({
      data: {
        chatId: chat.id,
        sender: 'CUSTOMER',
        content: content
      }
    });

    // Queue the response processing asynchronously
    await queueChatReply({
      clientId,
      chatId: chat.id,
      userMessage: content,
      platform: 'LAZADA',
      customerContact: buyer_id
    });

    res.sendStatus(200);
  } catch (error) {
    console.error('[Lazada Webhook Error]:', error);
    res.sendStatus(500);
  }
};

// Webhook verification endpoint for Facebook/Instagram
const verifyFacebookWebhook = (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  const VERIFY_TOKEN = process.env.FACEBOOK_VERIFY_TOKEN || 'aiva_verify_token';

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('[Facebook/Instagram Webhook Verified Successfully]');
      return res.status(200).send(challenge);
    } else {
      console.warn('[Facebook/Instagram Webhook Verification Failed]: Token mismatch');
      return res.sendStatus(403);
    }
  }
  return res.sendStatus(400);
};

// Mount Webhook endpoints supporting both standard and parameterized clientIds
router.post('/line', handleLineWebhook);
router.post('/line/:clientId', handleLineWebhook);

router.get('/facebook', verifyFacebookWebhook);
router.get('/facebook/:clientId', verifyFacebookWebhook);
router.post('/facebook', handleFacebookWebhook);
router.post('/facebook/:clientId', handleFacebookWebhook);

router.get('/instagram', verifyFacebookWebhook);
router.get('/instagram/:clientId', verifyFacebookWebhook);
router.post('/instagram', handleInstagramWebhook);
router.post('/instagram/:clientId', handleInstagramWebhook);

router.post('/tiktok', handleTikTokWebhook);
router.post('/tiktok/:clientId', handleTikTokWebhook);

router.post('/lazada', handleLazadaWebhook);
router.post('/lazada/:clientId', handleLazadaWebhook);

module.exports = router;

