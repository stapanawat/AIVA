const { Queue, Worker } = require('bullmq');
const IORedis = require('ioredis');
const prisma = require('../config/db');
const { generateResponse } = require('../services/geminiService');

const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379', 10);

let chatReplyQueue = null;
let chatReplyWorker = null;
let isRedisAvailable = false;

/**
 * core processing logic for generating AI reply and sending it to platform APIs
 */
async function processChatJob(data) {
  const { clientId, chatId, userMessage, platform, replyToken, customerContact } = data;
  
  try {
    // 1. Fetch recent messages for history context
    const history = await prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: 'desc' },
      take: 6
    });
    
    // Reverse history to keep chronological order
    const formattedHistory = history.reverse();

    // 2. Generate response using Gemini
    const aiReply = await generateResponse(clientId, userMessage, formattedHistory);

    // 3. Save bot reply to DB
    const savedReply = await prisma.message.create({
      data: {
        chatId,
        sender: 'BOT',
        content: aiReply
      }
    });

    // 4. Update chat last active timestamp
    await prisma.chat.update({
      where: { id: chatId },
      data: { updatedAt: new Date() }
    });

    console.log(`[Asynchronous Worker SUCCESS] Platform: ${platform}, Client: ${clientId}, Chat: ${chatId}`);

    // 5. Send message back to platform API
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
            console.error('[Queue LINE API Error]', errText);
          }
        } catch (lineErr) {
          console.error('[Queue LINE Fetch Error]', lineErr);
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
      
      if (pageAccessToken && customerContact) {
        try {
          const fbResponse = await fetch(`https://graph.facebook.com/v18.0/me/messages?access_token=${pageAccessToken}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              recipient: { id: customerContact },
              message: { text: aiReply }
            })
          });

          if (!fbResponse.ok) {
            const errText = await fbResponse.text();
            console.error('[Queue Facebook API Error]', errText);
          }
        } catch (fbErr) {
          console.error('[Queue Facebook Fetch Error]', fbErr);
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
      
      if (pageAccessToken && customerContact) {
        try {
          const igResponse = await fetch(`https://graph.facebook.com/v18.0/me/messages?access_token=${pageAccessToken}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              recipient: { id: customerContact },
              message: { text: aiReply }
            })
          });

          if (!igResponse.ok) {
            const errText = await igResponse.text();
            console.error('[Queue Instagram API Error]', errText);
          }
        } catch (igErr) {
          console.error('[Queue Instagram Fetch Error]', igErr);
        }
      }
    } else if (platform === 'TIKTOK') {
      const integration = await prisma.integration.findUnique({
        where: {
          clientId_platform: {
            clientId,
            platform: 'TIKTOK'
          }
        }
      });
      const accessToken = integration?.config?.accessToken;
      
      if (accessToken && customerContact) {
        try {
          const ttResponse = await fetch(`https://open-api.tiktok.com/message/send/`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Access-Token': accessToken
            },
            body: JSON.stringify({
              recipient_open_id: customerContact,
              message_content: { text: aiReply }
            })
          });

          if (!ttResponse.ok) {
            const errText = await ttResponse.text();
            console.error('[Queue TikTok API Error]', errText);
          }
        } catch (ttErr) {
          console.error('[Queue TikTok Fetch Error]', ttErr);
        }
      }
    }

    return savedReply;
  } catch (error) {
    console.error('[Asynchronous Worker Error]:', error);
    throw error;
  }
}

// Setup connection and events
try {
  const connection = new IORedis({
    host: REDIS_HOST,
    port: REDIS_PORT,
    maxRetriesPerRequest: null,
    connectTimeout: 3000,
    retryStrategy(times) {
      // Limit retries in development if Redis isn't running locally
      if (times > 3) {
        console.warn('[Queue Redis]: Local Redis connection timed out. Worker falling back to inline mode.');
        isRedisAvailable = false;
        return null; // Stop retrying
      }
      return Math.min(times * 100, 2000);
    }
  });

  connection.on('connect', () => {
    console.log(`[Queue Redis]: Connection established at ${REDIS_HOST}:${REDIS_PORT}`);
    isRedisAvailable = true;
  });

  connection.on('error', (err) => {
    // Suppress spammy log outputs but keep users informed
    if (isRedisAvailable) {
      console.warn('[Queue Redis Connection Error]:', err.message);
    }
    isRedisAvailable = false;
  });

  chatReplyQueue = new Queue('chat-replies', { connection });

  chatReplyWorker = new Worker('chat-replies', async (job) => {
    console.log(`[Queue Worker]: Processing job ${job.id} for platform: ${job.data.platform}`);
    return await processChatJob(job.data);
  }, { 
    connection,
    concurrency: 5 // Process up to 5 messages concurrently
  });

  chatReplyWorker.on('completed', (job) => {
    console.log(`[Queue Worker]: Job ${job.id} completed successfully.`);
  });

  chatReplyWorker.on('failed', (job, err) => {
    console.error(`[Queue Worker]: Job ${job.id} failed:`, err);
  });

} catch (initErr) {
  console.warn('[Queue Initialization Error]: falling back to synchronous execution.', initErr.message);
  isRedisAvailable = false;
}

/**
 * Push chat job to queue or run it inline if Redis is down
 */
async function queueChatReply(data) {
  if (isRedisAvailable && chatReplyQueue) {
    try {
      await chatReplyQueue.add('process-reply', data, {
        attempts: 3,
        backoff: { type: 'exponential', delay: 1000 }
      });
      return { status: 'queued' };
    } catch (err) {
      console.warn('[Queue Add Fail]: Executing inline fallback.', err.message);
    }
  }

  // Fallback inline execution
  console.log(`[Queue Fallback]: Processing chat reply inline for chatId: ${data.chatId}`);
  await processChatJob(data);
  return { status: 'processed_inline' };
}

module.exports = {
  queueChatReply,
  processChatJob
};
