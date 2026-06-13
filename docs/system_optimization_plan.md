# แผนพัฒนาและเพิ่มประสิทธิภาพระบบ AIVA (System Optimization Plan)
> [!NOTE]
> เอกสารฉบับนี้จัดทำขึ้นเพื่อวางแนวทางปรับปรุงสถาปัตยกรรมระบบ **AIVA (AI Virtual Assistant)** ให้มีประสิทธิภาพสูง (High Performance) มีความยืดหยุ่น (Flexibility) และสามารถรองรับผู้ใช้งานพร้อมกันจำนวนมาก (High Concurrency & Scalability) โดยอ้างอิงจากโครงสร้างระบบปัจจุบัน (Node.js Express + Prisma ORM + PostgreSQL + Gemini API)

---

## 1. ภาพรวมสถาปัตยกรรมระบบแบบกระจาย (Scalable Distributed Architecture)
โครงสร้างแบบ Monolithic ในปัจจุบันทำงานแบบซิงโครนัส (Synchronous) ซึ่งเมื่อมีผู้ใช้แชทเข้ามาพร้อมกันจำนวนมาก จะเกิดคอขวดที่การเชื่อมต่อฐานข้อมูล (Database Connection) และการรอผลลัพธ์จาก Gemini API (Network Latency) 

เราควรปรับเปลี่ยนสถาปัตยกรรมเป็นแบบ **Event-Driven & Microservices/Distributed Services** ดังแผนภูมิด้านล่าง:

```mermaid
graph TD
    %% Clients & Entry Points
    User[ลูกค้าผ่าน LINE / FB / Web Widget] -->|HTTPS Webhook / REST| LB[Load Balancer: Nginx / AWS ALB]
    LB -->|กระจายโหลด HTTP| API1[API Server - Node 1]
    LB -->|กระจายโหลด HTTP| API2[API Server - Node 2]
    
    %% Queue & Workers
    API1 -->|1. Push Job| MQ[(Redis Message Queue / BullMQ)]
    API2 -->|1. Push Job| MQ
    API1 -->|ตอบรับทันที 200 OK| User
    
    %% Workers processing
    MQ -->|2. Pull Job| W1[Background Worker 1]
    MQ -->|2. Pull Job| W2[Background Worker 2]
    
    %% Cache & Database
    W1 -->|3. Query KB/Context| Cache[(Redis Cache)]
    W1 -->|4. DB Access| DB_Proxy[pgBouncer / AWS RDS Proxy]
    DB_Proxy -->|Read/Write| DB_Master[(PostgreSQL Master)]
    DB_Master -->|Replicate| DB_Replica[(PostgreSQL Read Replica)]
    Cache -->|Cache Miss| DB_Replica
    
    %% AI & Platforms
    W1 -->|5. call LLM| Gemini[Google Gemini API]
    W1 -->|6. Reply Message| LineAPI[LINE/FB Messaging API]
    LineAPI --> User

    %% Styling
    style MQ fill:#f9f,stroke:#333,stroke-width:2px
    style Cache fill:#ff9,stroke:#333,stroke-width:2px
    style Gemini fill:#bbf,stroke:#333,stroke-width:2px
```

---

## 2. การแยกส่วนประมวลผล Webhook แบบไม่ประสานเวลา (Asynchronous Webhook Processing)

### 🔴 ปัญหาปัจจุบัน (Current Bottleneck)
ใน [webhookRoutes.js](file:///C:/Users/User/pj_bright/AIVA/server/src/routes/webhookRoutes.js) เมื่อลูกค้าส่งข้อความเข้ามา ระบบจะทำขั้นตอนเหล่านี้ตามลำดับ:
1. ดึงประวัติการคุยจาก PostgreSQL
2. ค้นหาความรู้ (Knowledge Base) ทั้งหมดของลูกค้า
3. เรียกใช้งาน `generateResponse()` (Gemini API) ซึ่งเป็น Network Call ที่ใช้เวลา 1-3 วินาที
4. บันทึกคำตอบกลับลงฐานข้อมูล
5. เรียกใช้ LINE Messaging API เพื่อตอบกลับ
6. ส่งการตอบกลับ HTTP 200 OK ไปยัง LINE

หากมีข้อความเข้ามาพร้อมกัน 500-1,000 ข้อความ:
* Node.js Event Loop จะรับภาระงานหนักและ Connection Pool ของ Prisma จะเต็มอย่างรวดเร็ว
* LINE Webhook มี Timeout ภายใน 1-3 วินาที หากระบบประมวลผลช้า LINE จะส่งข้อความซ้ำเข้ามาเรื่อยๆ (Retry Flood) ทำให้ระบบพัง (Cascade Failure)

### 🟢 แนวทางการแก้ไข (Optimization Solution)
ใช้ระบบ **Message Queue (Redis + BullMQ)** เข้ามาคั่นกลาง:
1. **API Webhook รับสาย**: รับ Event จาก LINE/Facebook บันทึกข้อความดิบลงใน Database แล้วสร้าง Job ส่งเข้าไปยัง Queue (Redis) จากนั้นตอบกลับ `HTTP 200 OK` ทันทีภายในเวลา **< 100ms**
2. **Background Workers**: มี Node.js Process แยกต่างหาก (หรือใช้ PM2 clusters) คอยดึงงานจาก Queue ไปประมวลผล (อ่านข้อมูล, ค้นหา Context, เรียก Gemini API, ส่งข้อความกลับผ่าน LINE API)

#### ตัวอย่างการปรับปรุงโค้ด Webhook ด้วย BullMQ:
```javascript
// server/src/queues/chatQueue.js
const { Queue } = require('bullmq');
const redisConnection = { host: process.env.REDIS_HOST || '127.0.0.1', port: 6379 };

const chatReplyQueue = new Queue('chat-replies', { connection: redisConnection });

module.exports = { chatReplyQueue };

// server/src/routes/webhookRoutes.js (Refactored LINE Webhook)
const { chatReplyQueue } = require('../queues/chatQueue');

const handleLineWebhook = async (req, res, next) => {
  try {
    const { events } = req.body;
    if (!events || events.length === 0) return res.sendStatus(200);

    const clientId = req.params.clientId;

    for (const event of events) {
      if (event.type === 'message' && event.message.type === 'text') {
        // 1. บันทึกข้อความลง Database ทันที (สถานะ PENDING หรือบันทึกแค่ Customer Message)
        const chatSession = await getOrCreateChatSession(clientId, event.source.userId);
        await saveCustomerMessage(chatSession.id, event.message.text);

        // 2. ส่งงานเข้า Queue ให้ Worker ทำงานต่อเบื้องหลัง
        await chatReplyQueue.add('process-reply', {
          clientId,
          chatId: chatSession.id,
          userMessage: event.message.text,
          replyToken: event.replyToken,
          platform: 'LINE'
        }, {
          attempts: 3, // ลองใหม่หากเกิด Error (เช่น API ล่ม)
          backoff: { type: 'exponential', delay: 1000 }
        });
      }
    }
    // ตอบกลับ LINE ทันทีเพื่อป้องกันการส่งข้อความซ้ำ
    res.sendStatus(200); 
  } catch (error) {
    console.error('Webhook Error:', error);
    res.sendStatus(500);
  }
};
```

---

## 3. การเพิ่มประสิทธิภาพฐานข้อมูล (Database Scaling & Prisma Optimizations)

ฐานข้อมูลคือหัวใจสำคัญในการรองรับปริมาณการใช้งานระดับสูง เราสามารถเพิ่มประสิทธิภาพฐานข้อมูล PostgreSQL และการใช้งานผ่าน Prisma ได้ดังนี้:

### 3.1 การเพิ่มดัชนีฐานข้อมูล (Database Indexing)
จาก [schema.prisma](file:///C:/Users/User/pj_bright/AIVA/server/prisma/schema.prisma) ตารางต่างๆ มีการสืบค้นข้อมูลบ่อยครั้งแต่ยังไม่มีดัชนีที่เหมาะสม การสืบค้นแบบ Full Table Scan ภายใต้ปริมาณข้อมูลระดับล้านแถวจะช้ามาก ควรเพิ่ม Index ในจุดที่สืบค้นบ่อย:

```prisma
// ปรับปรุง schema.prisma
model Chat {
  id              String    @id @default(uuid())
  clientId        String
  customerName    String
  customerContact String?
  platform        String    @default("WEB")
  status          String    @default("BOT_HANDLING")
  leadScore       Int       @default(0)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  client          Client    @relation(fields: [clientId], references: [id], onDelete: Cascade)
  messages        Message[]
  leads           Lead[]

  // เพิ่ม Indexes เพื่อประสิทธิภาพในการค้นหาแชทและกรองสถานะ
  @@index([clientId])
  @@index([customerContact, platform])
  @@index([status])
}

model Message {
  id        String   @id @default(uuid())
  chatId    String
  sender    String   
  content   String
  createdAt DateTime @default(now())
  
  chat      Chat     @relation(fields: [chatId], references: [id], onDelete: Cascade)

  // เพิ่ม Index เพื่อความรวดเร็วในการดึงประวัติการคุยล่าสุด
  @@index([chatId, createdAt])
}

model Knowledge {
  id        String   @id @default(uuid())
  clientId  String
  type      String   
  title     String
  sourceUrl String?
  content   String
  fileSize  Int?     @default(0)
  tokens    Int      @default(0)
  status    String   @default("TRAINED")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  client    Client   @relation(fields: [clientId], references: [id], onDelete: Cascade)

  // ดึงข้อมูลความรู้เพื่อป้อน AI บ่อยมากตาม clientId
  @@index([clientId, status])
}
```

### 3.2 ระบบจัดการจุดเชื่อมต่อฐานข้อมูล (Database Connection Pooling)
*   **คอขวด**: PostgreSQL สร้างโปรเซสแยกสำหรับแต่ละ Connection ทำให้ไม่สามารถรองรับการเชื่อมต่อเกินความจำเป็นได้ (โดยทั่วไปรับได้สูงสุด 100-500 connections)
*   **ทางแก้**: ติดตั้ง **pgBouncer** หรือใช้งาน **AWS RDS Proxy** คั่นกลางระหว่าง App Server และ PostgreSQL
*   การตั้งค่า URL ใน `.env`:
    ```env
    # เชื่อมต่อผ่าน pgBouncer (Port 6432) เพื่อจัดการ connection pool
    DATABASE_URL="postgresql://user:password@localhost:6432/aiva_db?pgbouncer=true&connection_limit=10"
    ```

### 3.3 การอ่านข้อมูลจากเครื่องสำรอง (Read Replicas)
การสืบค้นข้อมูลเพื่อวิเคราะห์ เช่น รายงานบิล ยอดขายของพาร์ทเนอร์ หรือประวัติแชทเก่า สามารถส่งไปอ่านที่ Read Replica เพื่อลดภาระการทำงานของเครื่องหลัก (Database Master) ได้โดยใช้ฟีเจอร์ Prisma Read Replicas Extension:

```javascript
const { PrismaClient } = require('@prisma/client');
const { readReplicas } = require('@prisma/extension-read-replicas');

const prisma = new PrismaClient()
  .$extends(readReplicas({
    url: process.env.DATABASE_URL_REPLICA
  }));
```

---

## 4. ปรับปรุงระบบค้นหาความรู้ AI ด้วยเทคนิค RAG (Retrieval-Augmented Generation)

### 🔴 ปัญหาปัจจุบัน
ใน [geminiService.js](file:///C:/Users/User/pj_bright/AIVA/server/src/services/geminiService.js#L21-L29) ระบบจะดึงข้อมูลเอกสารทั้งหมดใน Knowledge Base ของลูกค้ารายนั้นขึ้นมา:
```javascript
const knowledgeBase = await prisma.knowledge.findMany({
  where: { clientId, status: 'TRAINED' },
  select: { title: true, content: true }
});
```
เมื่อความรู้ของร้านค้ามีมากขึ้น (เช่น ไฟล์คู่มือหนา 100 หน้า, ข้อมูลสินค้ากว่า 1,000 รายการ) การดึงข้อมูลทั้งหมดมาส่งเข้า LLM ในทุกๆ ข้อความที่ลูกค้าส่งมาจะส่งผลเสียร้ายแรง:
1. **Cost สูง**: จำนวน Token ที่ใช้งานเพิ่มขึ้นมหาศาล สิ้นเปลืองงบประมาณระบบ
2. **ความเร็วต่ำ**: ยิ่ง Token ยาว Gemini ก็ยิ่งประมวลผลช้าลง
3. **หลุดประเด็น (Lost in the Middle)**: ข้อมูลยาวไปทำให้ AI สับสนและตอบไม่ตรงคำถาม

### 🟢 แนวทางการแก้ไข (Optimization Solution)
ใช้สถาปัตยกรรม **RAG แบบค้นหาเวกเตอร์ (Vector Search)**:
1. **Chunking**: ตอนที่ลูกค้าอัปโหลดเอกสาร ให้ตัดแบ่งข้อมูลออกเป็นท่อนสั้นๆ (เช่น ความยาวท่อนละ 500-1,000 ตัวอักษร)
2. **Embedding**: นำข้อมูลท่อนเหล่านั้นไปผ่าน Embedding Model (เช่น `text-embedding-004` ของ Google) เพื่อแปลงเป็นเวกเตอร์ 768 มิติ
3. **Vector Database**: บันทึกเวกเตอร์ลงในฐานข้อมูลที่รองรับเวกเตอร์ เช่น **pgvector** ใน PostgreSQL, Pinecone, หรือ Qdrant
4. **Semantic Search**: เมื่อลูกค้าส่งคำถามเข้ามา ให้นำคำถามไปแปลงเป็นเวกเตอร์ แล้วค้นหาเวกเตอร์ของข้อมูลในฐานข้อมูลที่ "ใกล้เคียงกันที่สุด" (Cosine Similarity) ออกมาเพียง 3-5 ท่อน ส่งให้ Gemini ตอบคำถาม

```mermaid
flowchart TD
    subgraph ตอนอัปโหลดเอกสาร (Upload Phase)
        Doc[เอกสารคู่มือ PDF/URL] --> Chunk[ตัดเป็นท่อนๆ 500 ตัวอักษร]
        Chunk --> Embed[แปลงเป็น Vector ด้วย Embedding Model]
        Embed --> VecDB[(PostgreSQL + pgvector)]
    end
    
    subgraph ตอนประมวลผลแชท (Chat Phase)
        Question[คำถาม: ครีมนี้ช่วยเรื่องฝ้าไหม?] --> EmbedQ[แปลงคำถามเป็น Vector]
        EmbedQ --> Search[ค้นหา Cosine Similarity ใน pgvector]
        VecDB -->|ดึงมาแค่ 3 ท่อนที่เกี่ยวข้อง| Search
        Search --> Prompt[ส่งเฉพาะ 3 ท่อนนั้น + คำถาม ให้ Gemini]
        Prompt --> LLM[Gemini 2.5 Flash]
        LLM --> Response[คำตอบกลับไปยังลูกค้า]
    end
```

---

## 5. การจัดการแคชประสิทธิภาพสูง (High-Performance Caching)

การเข้าถึงฐานข้อมูลทุกครั้งที่มีการประมวลผลคำถามเป็นเรื่องฟุ่มเฟือย ควรจัดลำดับข้อมูลที่สามารถบันทึกลงใน **Redis Cache** ได้:

| ประเภทข้อมูล | วิธีการ Cache | ประโยชน์ |
| :--- | :--- | :--- |
| **ข้อมูล Settings ของ Client** (Persona, ชื่อบอท, คีย์ API) | Cache ลงใน Redis ด้วย TTL 1 ชั่วโมง (หรือใช้ Cache Invalidation ตอนกดบันทึกใหม่) | ลดภาระคิวรี่ของตาราง Client ในทุกข้อความลง 100% |
| **ประวัติการแชทล่าสุด** (Recent Messages) | บันทึกประวัติการสนทนา 5-10 ข้อความล่าสุดใน Redis List | ดึงประวัติมาป้อนให้ Gemini ได้ใน < 5ms โดยไม่ต้องอ่าน PostgreSQL |
| **Session ของ User & Token** | จัดเก็บ Refresh Token และสิทธิ์การใช้งานใน Redis | ตรวจสอบสิทธิ์ API Gateway ได้รวดเร็วขึ้น |

---

## 6. แนวทางระดับโค้ดหน้าบ้าน (Frontend Performance Optimizations)

จากโครงสร้างหน้าเว็บฝั่ง React 19 ในโปรเจกต์ `AIVA`:
*   **Code Splitting / Lazy Loading**: ใช้ `React.lazy()` และ `Suspense` สำหรับแยก Bundle แต่ละหน้าเว็บแดชบอร์ดขนาดใหญ่ (เช่น Platform Client, Partner Portal, Super Admin) ทำให้หน้า Landing Page โหลดได้ทันที ไม่ต้องดาวน์โหลดโค้ดหลังบ้านไปทั้งหมด
*   **State Management & Caching**: นำ **TanStack Query (React Query)** เข้ามาใช้จัดเก็บข้อมูลที่เชื่อมต่อกับ API ตัวชี้วัดแดชบอร์ด เพื่อลดการเรียก API ซ้ำซ้อนเมื่อเปลี่ยนหน้าสลับไปมา
*   **CDN (Content Delivery Network)**: ฝากไฟล์ Static Assets (CSS, JS, Images, PDFs) ไว้บน Cloudflare หรือ AWS CloudFront เพื่อลดโหลดบน Express Server และช่วยให้ลูกค้าเข้าถึงหน้าเว็บได้เร็วที่สุดจากทุกหนแห่ง

---

## 7. แผนปฏิบัติงานและผลลัพธ์ที่คาดหวัง (Action Plan & Roadmap)

เราสามารถจัดสรรระยะการทำงานในการปรับปรุงระบบออกเป็น 3 ระยะหลัก:

```mermaid
gantt
    title ลำดับขั้นตอนการ Optimization ระบบ AIVA
    dateFormat  YYYY-MM-DD
    section ระยะที่ 1: ด่วนที่สุด
    เพิ่ม Database Indexes และเปิด Connection Pool      :active, p1, 2026-06-14, 3d
    แยกการประมวลผล Gemini ผ่าน Message Queue          :active, p2, after p1, 4d
    section ระยะที่ 2: เพิ่มประสิทธิภาพ
    พัฒนาระบบค้นหาความรู้ผ่าน RAG (Vector Search)      :p3, after p2, 7d
    ติดตั้ง Redis Caching สำหรับ Client Settings       :p4, after p2, 3d
    section ระยะที่ 3: ความทนทานระดับสูง
    ติดตั้ง Load Balancer และแยก Workers เป็น Cluster   :p5, after p4, 5d
    ติดตั้งระบบ Monitoring & Logging (Grafana/Datadog)   :p6, after p5, 4d
```

> [!IMPORTANT]
> **เป้าหมายที่คาดว่าจะได้รับหลังการปรับปรุงระบบ (KPI Improvements):**
> 1. **Response Time Webhook**: ลดลงจาก 1,500ms - 3,000ms เหลือ **< 150ms** สำหรับการตอบรับเหตุการณ์ (Event Acknowledgement) ป้องกันปัญหาระบบหน่วง
> 2. **ความหนาแน่นผู้ใช้งาน (Throughput)**: รองรับการเข้าชมหน้าเว็บและการแชทพร้อมกันได้เพิ่มขึ้น **10 เท่า** โดยใช้ทรัพยากรเซิร์ฟเวอร์เท่าเดิม
> 3. **ค่าใช้จ่าย AI API**: ประหยัดค่าใช้จ่ายการประมวลผล Token ของ Gemini ลง **40% - 60%** ด้วยการเลือกดึงเฉพาะข้อมูลความรู้ที่เกี่ยวข้องผ่าน Vector Search (RAG)
