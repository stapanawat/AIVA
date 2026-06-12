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
    
    // Check specific Google GenAI error status codes
    const status = error?.status || error?.code || error?.status_code;
    const msg = error?.message || '';
    
    if (status === 503 || msg.includes('high demand') || msg.includes('UNAVAILABLE')) {
      return 'ขออภัยด้วยนะคะ ขณะนี้มีผู้ใช้งานระบบ AI หนาแน่นชั่วคราว เดี๋ยวจะมีแอดมินเข้ามาช่วยเหลือดูแลโดยตรงทันทีค่ะ';
    }
    
    if (status === 429 || msg.includes('depleted') || msg.includes('RESOURCE_EXHAUSTED')) {
      return 'ขออภัยด้วยนะคะ โควตาการใช้งานของระบบตอบกลับอัตโนมัติหมดชั่วคราว เดี๋ยวจะมีแอดมินเข้ามาช่วยเหลือดูแลโดยตรงทันทีค่ะ';
    }
    
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

const generateGoalStrategy = async (target, months, currentMRR, currentCustomers) => {
  try {
    const prompt = `You are an expert SaaS business consultant and CFO AI advisor.
The user has set a sales goal of ฿${Number(target).toLocaleString()} over the next ${months} months.
Current Business Stats:
- Monthly Recurring Revenue (MRR): ฿${Number(currentMRR).toLocaleString()}
- Active Customer Count: ${currentCustomers}

Please calculate:
1. The target monthly recurring revenue required to hit this goal.
2. Cost breakdown estimations (e.g. AI API usage, sales commissions, marketing/ads, server hosting, operation/salaries).
3. A list of 5 concrete, actionable strategies (as bullet points) to acquire customers, upsell current users, or reduce churn.

Reply in a structured JSON format with EXACTLY these fields:
{
  "monthlyTarget": number,
  "costs": {
    "api": number,
    "comm": number,
    "mkt": number,
    "server": number,
    "op": number,
    "total": number
  },
  "profit": number,
  "actions": [
    { "type": "partner" | "campaign" | "marketing" | "product" | "retention", "text": "string description" },
    ... (exactly 5 items)
  ]
}`;

    if (!ai) {
      const costAPI = target * 0.06;
      const costComm = target * 0.22;
      const costMkt = target * 0.15;
      const costServer = target * 0.04;
      const costOp = target * 0.10;
      const totalCost = costAPI + costComm + costMkt + costServer + costOp;
      return {
        monthlyTarget: target / months,
        costs: { api: costAPI, comm: costComm, mkt: costMkt, server: costServer, op: costOp, total: totalCost },
        profit: target - totalCost,
        actions: [
          { type: 'partner', text: `รับสมัคร Partner ระดับ Gold/Silver เพิ่มอีก 15 ราย` },
          { type: 'campaign', text: `จัดแคมเปญแจกโบนัสคอมมิชชันเพิ่ม 3% สำหรับยอดขายที่เกินเป้า` },
          { type: 'marketing', text: `เน้นทำการตลาดกลุ่มเป้าหมาย SME บนช่องทาง Facebook/TikTok` },
          { type: 'product', text: `ออกฟีเจอร์ Premium เชื่อมต่อระบบ POS เพื่อดันแผน Advanced` },
          { type: 'retention', text: `จัดสัมมนาช่วยเหลือแนะนำเคล็ดลับเพื่อลดอัตรา Churn Rate` }
        ]
      };
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error('[Gemini Goal Strategy Error]:', error);
    throw error;
  }
};

const generateFeedbackInsights = async (feedbacks) => {
  try {
    const feedbackSummary = feedbacks.map((f, i) => `[Feedback #${i+1}] Platform: ${f.client?.name || 'Client'}, Title: ${f.title}, Desc: ${f.description}, CreatedAt: ${f.createdAt}`).join('\n');

    const prompt = `You are a product manager and AI customer feedback analyst.
Here is a list of active feedback and support tickets from AIVA SaaS platform users:
${feedbackSummary || 'No feedback submitted yet.'}

Please analyze:
1. The overall customer sentiment (a decimal number out of 5.0, e.g. 4.5).
2. The most used or requested feature category.
3. Identify the TOP 3 most urgent/frequent pain points or feedback requests.
4. Suggest a timeline roadmap (Q3/Q4 split) to solve these items.

Reply in a structured JSON format with EXACTLY these fields:
{
  "sentiment": number,
  "mostUsedFeature": "string name",
  "topFeedbacks": [
    { "rank": number, "title": "string title", "priority": "High Priority" | "Feature Request", "desc": "short description of issue & count", "pkg": "string tier affected", "barColor": "bg-rose-500" | "bg-amber-500" | "bg-emerald-500" }
  ],
  "roadmap": {
    "q3_phase1": { "title": "string title", "desc": "string summary", "bullets": ["bullet 1", "bullet 2"] },
    "q3_phase2": { "title": "string title", "desc": "string summary", "bullets": ["bullet 1", "bullet 2"] },
    "q4": { "title": "string title", "desc": "string summary", "bullets": ["bullet 1", "bullet 2"] }
  }
}`;

    if (!ai || feedbacks.length === 0) {
      return {
        sentiment: 4.8,
        mostUsedFeature: "Multi-PDF Sync",
        topFeedbacks: [
          { rank: 1, title: "การเชื่อมต่อ POS ล่มบ่อย", priority: "High Priority", desc: "พบการแจ้งปัญหาเกี่ยวกับเครื่อง POS ของลูกค้าร้านอาหาร", pkg: "Advanced Plan", barColor: "bg-rose-500" },
          { rank: 2, title: "ต้องการ AI ช่วยตอบคอมเมนต์ Facebook", priority: "Feature Request", desc: "ลูกค้าร้องขอระบบจัดการตอบคอมเมนต์และไลก์อัตโนมัติ", pkg: "Pro Plan", barColor: "bg-amber-500" },
          { rank: 3, title: "ระบบสรุปยอดขายรายวันผ่าน LINE", priority: "Feature Request", desc: "แจ้งสรุปยอดหลังปิดร้านสำหรับเจ้าของกิจการผ่านแชท", pkg: "Basic & Pro Plan", barColor: "bg-emerald-500" }
        ],
        roadmap: {
          q3_phase1: { title: "Q3/Phase 1: Stability First", desc: "มุ่งเน้นแก้ปัญหาที่มีผลกระทบต่อ Churn Rate ทันที", bullets: ["ปรับปรุงการเชื่อมต่อ API ของ POS เสถียรขึ้น", "เพิ่มความจุอัปโหลดไฟล์คู่มือ PDF"] },
          q3_phase2: { title: "Q3/Phase 2: Social Commerce", desc: "ตอบโจทย์ฟีเจอร์ตอบโพสต์เพื่อเพิ่มการต่ออายุ", bullets: ["เปิดตัว AI Auto-Comment Reply เฟสแรก", "รองรับ Instagram DM Webhook"] },
          q4: { title: "Q4: Exec & Analytics", desc: "ดึงดูดลูกค้าระดับพรีเมียมและกลุ่มผู้บริหาร", bullets: ["ส่งรายงานบรีฟยอดขายผ่าน LINE Voice", "การประเมินวิเคราะห์พยากรณ์รายได้ถัดไป"] }
        }
      };
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error('[Gemini Feedback Insights Error]:', error);
    throw error;
  }
};

const generateSupportChatResponse = async (userMessage, chatHistory = [], partnerRole = 'PARTNER_MAIN') => {
  try {
    const roleText = partnerRole === 'PARTNER_MAIN' ? 'Main Partner' : 'Sub-Partner';
    const systemInstruction = `
You are the AIVA AI Support Assistant, helping our registered business partners (${roleText}).
Provide polite, highly helpful, and accurate answers in Thai, utilizing emojis to be friendly.

AIVA Partner Program Quick Rules:
- Main Partner commission tiers:
  * Gold (25% rate) for monthly sales >= ฿150,000
  * Silver (18% rate) for monthly sales >= ฿50,000
  * Bronze (15% rate) otherwise
- Sub-Partner commission tiers:
  * Gold (15% rate) for monthly sales >= ฿150,000
  * Silver (10% rate) for monthly sales >= ฿50,000
  * Bronze (7% rate) otherwise
- Team override commission (only for Main Partners):
  * 10% override on Sub-Partner monthly sales if they achieve >= ฿150,000
  * 5% override if they achieve >= ฿50,000
- Withdrawals and payouts:
  * Payouts are processed on the 5th of every month.
  * Subject to 3% withholding tax (ภาษีหัก ณ ที่จ่าย 3%) under Thai law.
  * Withdrawable amount = Net Commission - (Paid + Pending).

If asked about something unrelated, politely steer the conversation back to the AIVA Partner Program or support.
`;

    if (!ai) {
      return `สวัสดีค่ะ! ทีมงาน AIVA Support ได้รับข้อความ: "${userMessage}" แล้วค่ะ ยินดีช่วยเหลือคุณที่เป็นพาร์ทเนอร์ในบทบาท ${roleText} นะคะ`;
    }

    const contents = [];
    for (const msg of chatHistory) {
      contents.push({
        role: msg.sender === 'partner' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      });
    }

    contents.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.6,
        maxOutputTokens: 600,
      }
    });

    return response.text || 'ขออภัยด้วยค่ะ ไม่สามารถวิเคราะห์คำตอบได้ในขณะนี้';
  } catch (error) {
    console.error('[Gemini Support Chat Error]:', error);
    return 'ขออภัยด้วยนะคะ ระบบตอบกลับอัตโนมัติขัดข้องชั่วคราว มีคำถามอะไรฝากไว้ได้เลยค่ะ';
  }
};

module.exports = {
  generateResponse,
  generateMarketingCopy,
  generateGoalStrategy,
  generateFeedbackInsights,
  generateSupportChatResponse
};
