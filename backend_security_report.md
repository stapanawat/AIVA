# รายงานโครงสร้างระบบหลังบ้านและการรักษาความปลอดภัย (Backend & Security Architecture Report)

เอกสารฉบับนี้สรุปโครงสร้างสถาปัตยกรรมระบบหลังบ้านของ **AIVA** ที่ได้พัฒนาขึ้นมาในโฟลเดอร์ `server` โดยเน้นไปที่ความมั่นคงปลอดภัย (Security), การรองรับการขยายตัว (Scalability), และการป้องกันช่องโหว่ความปลอดภัยหลักตามมาตรฐาน OWASP Top 10

---

## 1. โครงสร้างโฟลเดอร์เพื่อการขยายตัว (Scalable Directory Structure)

โครงสร้างโฟลเดอร์ถูกแยกตามหน้าที่ชัดเจน (Separation of Concerns) เพื่อให้ง่ายต่อการขยายฟีเจอร์ในอนาคต:

```text
server/
├── prisma/
│   ├── dev.db              # SQLite Database สำหรับ Local Dev
│   ├── schema.prisma       # โครงสร้างตารางฐานข้อมูล (Data Models)
│   └── seed.js             # สคริปต์สร้างข้อมูลจำลองตั้งต้น (Seed Data)
├── src/
│   ├── config/
│   │   ├── db.js           # เชื่อมต่อและบริหารจัดการ Prisma Client
│   │   └── index.js        # ไฟล์รวบรวมค่าคอนฟิกและ Environment Variables
│   ├── controllers/
│   │   └── authController.js # ควบคุม Logic การสมัคร, ล็อกอิน, ล็อกเอาต์, และต่ออายุโทเคน
│   ├── middlewares/
│   │   ├── auth.js         # ยืนยันสิทธิ์เข้าถึงผ่าน JWT Access Token
│   │   ├── authorize.js    # ตรวจสอบสิทธิ์ (RBAC) และสิทธิ์การเข้าถึงข้อมูล Multi-Tenant
│   │   ├── errorHandler.js # จัดการ Exception/Error ทั่วทั้งระบบอย่างปลอดภัย
│   │   └── validate.js     # ทำความสะอาดข้อมูลอินพุตและตรวจสอบโครงสร้างข้อมูล
│   ├── routes/
│   │   ├── authRoutes.js   # เสนอแนะ Endpoint `/api/auth/*`
│   │   └── index.js        # จุดศูนย์รวมเราต์เตอร์หลัก
│   ├── app.js              # กำหนดค่า Express Application, Cors, Helmet
│   └── server.js           # จุดเริ่มต้นและสั่งรันระบบ (Server Bootstrapper)
├── .env                    # ไฟล์จัดเก็บความลับของเซิร์ฟเวอร์
├── package.json            # ไฟล์จัดการ Dependencies และรันสคริปต์
└── README.md
```

---

## 2. การป้องกันช่องโหว่ความปลอดภัย (Security Implementations)

### 2.1 การป้องกันการโจมตี Injection (Anti-Injection)
* **SQL Injection Prevention:** เลือกใช้ **Prisma ORM** ซึ่งใช้การคิวรีแบบ Parameterized Queries ภายใต้ระบบเตรียมส่งคำสั่งการคิวรี (Prepared Statements) เสมอ ทำให้แฮกเกอร์ไม่สามารถเขียนโค้ด SQL แปลกปลอมเข้ามาทำงานในฐานข้อมูลได้
* **XSS (Cross-Site Scripting) & Parameter Validation:** ใช้ไลบรารี **Express-Validator** ใน `src/middlewares/validate.js` เพื่อทำความสะอาดและตรวจสอบข้อมูลนำเข้าอย่างเคร่งครัด
  - ฟังก์ชัน `.trim()` และ `.escape()` ถูกใช้ในการแปลงอักขระพิเศษของ HTML (เช่น `<`, `>`, `&`, `"`, `'`) เป็นอักขระปลอดภัย เพื่อตัดวงจรการฝัง JavaScript โจมตี
  - การกำหนดค่าชนิดข้อมูลอย่างเข้มงวด เช่น `.isEmail()`, `.isLength()`, `.isFloat()` ทำให้ไม่สามารถส่งพารามิเตอร์แปลกปลอมเข้ามาพังระบบได้
* **HTTP Hardening (Helmet):** การลงทะเบียน `helmet()` ในไฟล์ `src/app.js` ช่วยเพิ่ม Header ป้องกันการโจมตีเว็บเบราว์เซอร์ เช่น:
  - `X-Content-Type-Options: nosniff` (ป้องกัน MIME Sniffing)
  - `X-Frame-Options: SAMEORIGIN` (ป้องกัน Clickjacking)

### 2.2 การป้องกัน Broken Access Control
* **Role-Based Access Control (RBAC):** กำหนดฟังก์ชัน `authorizeRoles(...allowedRoles)` ในไฟล์ `src/middlewares/authorize.js` เพื่อป้องกันสิทธิ์เข้าถึงของแต่ละหน้า Endpoint
  - ตัวอย่างการใช้งาน:
    - เส้นทาง API สำหรับแอดมินจำกัดที่: `authorizeRoles('SUPER_ADMIN')`
    - เส้นทาง API ของพาร์ทเนอร์จำกัดที่: `authorizeRoles('PARTNER_MAIN', 'PARTNER_SUB')`
* **Multi-Tenant Protection (Data Ownership Validation):** พัฒนาระบบ Middleware `checkTenantAccess(resourceModel)` เพื่อแก้ไขข้อบกพร่อง Broken Object-Level Authorization (BOLA)
  - ระบบจะตรวจสอบรหัสร้านค้าของผู้ที่เรียกใช้งาน (`req.user.clientId`) และเทียบกับความเป็นเจ้าของของแถวข้อมูลในตารางทรัพยากรนั้นๆ เสมอ (เช่น การดึงแชทลูกค้า, ข้อมูลประวัติตั๋ว FAQ) หากรหัส tenant ไม่ตรงกัน ระบบจะสกัดกั้นการเข้าถึงทันทีและตอบกลับ `403 Access Denied`

### 2.3 ระบบยืนยันตัวตน JWT Auth + Refresh Token Rotation (RTR)
* **การเก็บ Token ที่ปลอดภัย:**
  - **Access Token:** มีอายุสั้น (15 นาที) ถูกส่งผ่าน HTTP Header (`Authorization: Bearer <token>`) เพื่อใช้เรียกขอข้อมูลทั่วไป
  - **Refresh Token:** มีอายุยาว (7 วัน) ถูกจัดเก็บลงบนเว็บเบราว์เซอร์ในรูปแบบ **httpOnly Cookie** พร้อมตั้งค่า `secure=true` (ส่งผ่าน HTTPS เท่านั้น), `sameSite='strict'` (ป้องกันการโจมตี CSRF) และไม่ยอมให้โค้ด JavaScript ฝั่งคลื่นดึงไปอ่านได้ เพื่อป้องกันการขโมยโทเคน
* **Refresh Token Rotation (RTR):** บริหารจัดการโทเคนผ่านตาราง `RefreshToken` ในฐานข้อมูลเพื่อป้องกันช่องโหว่ Replay Attacks
  - ทุกครั้งที่มีการขอต่ออายุ (Refresh) โทเคน Access Token ระบบจะทำการ **Revoke (ยกเลิก)** โทเคน Refresh Token อันเก่าทันที และทำการสร้างคู่โทเคนใหม่ส่งกลับไปแทน (Token Rotation)
  - หากแฮกเกอร์ขโมยโทเคนเก่าไปใช้งานซ้ำ ระบบจะตรวจจับได้ทันทีว่าโทเคนนั้นถูกเปลี่ยนสถานะเป็น Revoked ไปแล้ว และจะทำการ **ยกเลิกทุกโทเคน (Revoke All Sessions)** ของผู้ใช้รายนั้นทันที เพื่อบังคับให้เข้าสู่ระบบใหม่ทั้งหมด เป็นการรักษาความปลอดภัยระดับสูงสุด

---

## 3. ข้อมูลบัญชีจำลองตั้งต้น (Seeded Mock Accounts)

หลังจากรันคำสั่ง `npx prisma db seed` เรียบร้อยแล้ว ระบบมีข้อมูลล็อกอินตั้งต้นเพื่อตรวจสอบสิทธิ์และความปลอดภัยดังนี้:

| บทบาท (Role) | บัญชีผู้ใช้ (Username/Email) | รหัสผ่าน (Password) | รายละเอียด |
| --- | --- | --- | --- |
| **Super Admin** | `ROOT-01` | `password` | สิทธิ์สูงสุด ควบคุม KYC และรายการถอนเงินคอมมิชชัน |
| **Partner** | `P88942` | `password` | สิทธิ์พาร์ทเนอร์ สมชาย ใจดี, คอมมิชชัน 18% |
| **Client Owner** | `admin@globaltech.com` | `password` | เจ้าของร้านค้า Global Tech, แพลน PRO |

---
*จัดทำโดย: Senior QA Automation Engineer & Full-Stack Developer*
*วันที่: 8 มิถุนายน 2569*
