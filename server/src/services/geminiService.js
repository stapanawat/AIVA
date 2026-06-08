const { GoogleGenAI } = require('@google/genai');
const prisma = require('../config/db');

// Initialize Google Gen AI client if API key is provided
let ai = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
} else {
  console.warn('[Gemini Service] GEMINI_API_KEY is not set. Falling back to mock responses.');
}

/**
 * Generates an automated chat reply based on the client's knowledge base and message history.
 * @param {string} clientId - The ID of the tenant client
 * @param {string} userMessage - The new incoming user message
 * @param {Array} chatHistory - Array of messages in format [{ sender: 'CUSTOMER'|'BOT'|'AGENT', content: string }]
 * @returns {Promise<string>} - The AI response
 */
const generateResponse = async (clientId, userMessage, chatHistory = []) => {
  try {
    // 1. Fetch trained knowledge base content for this client
    const knowledgeBase = await prisma.knowledge.findMany({
      where: { clientId, status: 'TRAINED' },
      select: { title: true, content: true }
    });

    const contextText = knowledgeBase
      .map(entry => `Document Title: ${entry.title}\nContent:\n${entry.content}`)
      .join('\n\n---\n\n');

    // 2. Fetch the client's business settings to personalize persona
    const client = await prisma.client.findUnique({
      where: { id: clientId }
    });

    const brandName = client ? client.name : 'AIVA Agent';

    // 3. Define the System Instruction / Prompt Tuning
    const systemInstruction = `
You are AIVA (AI Virtual Assistant), a friendly, helpful, and highly professional sales and customer service assistant for "${brandName}".

Your goal is to answer client queries, capture leads, and close sales by using ONLY the provided Knowledge Base context. 
If the customer asks something that is NOT in the Knowledge Base, reply politely that you are a sales assistant, and you will forward this query to a human agent immediately to assist them better. Do not invent details.

CRITICAL INSTRUCTIONS:
- Answer in Thai. Use polite particles like "ค่ะ" or "ครับ" based on a friendly tone.
- Make answers concise, structured, and easy to read. Use emojis where appropriate.
- Refer to the provided Knowledge Base below to answer queries.

[Knowledge Base Context]:
${contextText || 'No specific document content uploaded yet. Answer general shop queries politely.'}
`;

    if (!ai) {
      // Mock fallback if API key is missing
      return `[MOCK] สวัสดีค่ะ ยินดีต้อนรับสู่ ${brandName}! ได้รับข้อความ: "${userMessage}" แล้วค่ะ (เปิดใช้งาน GEMINI_API_KEY ใน .env เพื่อทดลองระบบ AI จริง)`;
    }

    // 4. Formulate the contents payload incorporating system instruction and history
    // For @google/genai, we can structure contents as history
    const contents = [];
    
    // Append formatted history
    for (const msg of chatHistory) {
      contents.push({
        role: msg.sender === 'CUSTOMER' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      });
    }

    // Append current message
    contents.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
        maxOutputTokens: 800,
      }
    });

    return response.text || 'ขออภัยด้วยค่ะ ไม่สามารถประมวลผลคำตอบได้ในขณะนี้';
  } catch (error) {
    console.error('[Gemini Service Error]:', error);
    return 'ขออภัยด้วยนะคะ ระบบตอบกลับของทางร้านขัดข้องชั่วคราว เดี๋ยวจะมีแอดมินเข้ามาช่วยเหลือดูแลโดยตรงทันทีค่ะ';
  }
};

/**
 * Generates marketing copy or script based on prompt and platform target
 * @param {string} promptText - The prompt description (e.g. "โปรโมชั่น 6.6 เสื้อยืดลายดอก")
 * @param {string} platform - Target platform (e.g. "Facebook", "TikTok")
 * @returns {Promise<string>} - Generated copy text
 */
const generateMarketingCopy = async (promptText, platform = 'Facebook') => {
  try {
    const prompt = `ช่วยเขียนแคปชั่นโฆษณา/สคริปต์นำเสนอ สำหรับแพลตฟอร์ม ${platform} ในหัวข้อ/จุดขายดังนี้:\n"${promptText}"\n\nขอคำโฆษณาที่สะดุดตา น่าดึงดูดใจ มีการใช้ Emojis ตกแต่งให้อ่านง่าย และลงท้ายด้วยคำกระตุ้นการตัดสินใจ (Call to Action) ที่ดี`;

    if (!ai) {
      return `[MOCK COPY FOR ${platform.toUpperCase()}]\n✨ โปรโมชั่นสุดพิเศษที่คุณห้ามพลาด! ✨\nช้อปเลยสินค้าสุดปัง: ${promptText}\n🎉 สนใจพิมพ์รับสิทธิ์ใต้โพสต์นี้เลยค่ะ! (เปิดใช้งาน GEMINI_API_KEY ใน .env เพื่อทดลองระบบ AI จริง)`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.8,
      }
    });

    return response.text || 'ไม่สามารถสร้างแคปชั่นได้ในขณะนี้';
  } catch (error) {
    console.error('[Gemini Marketing Copy Gen Error]:', error);
    throw error;
  }
};

module.exports = {
  generateResponse,
  generateMarketingCopy
};
