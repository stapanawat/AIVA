// ==========================================
// AIVA - Central Mock Data Store
// รวม mock data ทั้งหมดไว้ที่เดียว แยกตาม module
// ==========================================

// ==========================================
// MODULE: PLATFORM (Platform.jsx)
// ==========================================
export const MOCK_STATS = { 
  tokensUsed: 425000, 
  tokenLimit: 500000, 
  totalChats: 28450, 
  resolvedByAI: 95, 
  activeAgents: 2 
};

export const MOCK_KNOWLEDGE = [
  { id: 1, type: 'pdf', name: 'PriceList_Summer2026.pdf', size: '2.4 MB', status: 'Trained', date: '05/06/2026', tokens: '1,250' },
  { id: 2, type: 'pdf', name: 'Promotion_Rules.pdf', size: '1.1 MB', status: 'Trained', date: '02/06/2026', tokens: '840' },
  { id: 3, type: 'url', name: 'https://sparexth.com/shipping-policy', size: '-', status: 'Trained', date: '01/06/2026', tokens: '320' },
  { id: 4, type: 'pdf', name: 'SizeChart_Standard.pdf', size: '1.8 MB', status: 'Trained', date: '06/06/2026', tokens: '412' },
  { id: 5, type: 'pdf', name: 'June_Promotion_Banner.pdf', size: '3.1 MB', status: 'Trained', date: '05/06/2026', tokens: '680' }
];

export const MOCK_INBOX_LIST = [
  { id: 'C-001', user: 'Khun Praew (VIP)', platform: 'Line OA', query: 'รุ่นที่ไลฟ์เมื่อคืนยังมีของไหมคะ?', status: 'AI Replied', time: '10:05 AM', tags: ['VIP', 'โอนไว'] },
  { id: 'C-002', user: 'Katty', platform: 'Line OA', query: 'ส่งสลิปโอนเงิน ยอด 1,290 บาท', status: 'AI Replied', time: '09:15 AM', tags: ['รอตรวจสอบ'] },
  { id: 'C-003', user: 'MewMew', platform: 'Facebook', query: 'ได้รับของแล้วแต่ไซส์ไม่พอดี ขอเปลี่ยนค่ะ', status: 'Handover', time: '08:30 AM', tags: ['เคลมบ่อย'] },
  { id: 'C-004', user: 'Shopper99', platform: 'TikTok Shop', query: 'สอบถามไซส์เสื้อค่ะ', status: 'AI Replied', time: '11:20 AM', tags: ['ลูกค้าใหม่'] },
  { id: 'C-005', user: 'LazadaCustomer', platform: 'Lazada', query: 'ขอใบกำกับภาษี', status: 'Handover', time: '11:45 AM', tags: ['B2B'] }
];

export const MOCK_CHATS = {
  'C-001': [
    { sender: 'user', text: 'สอบถามเดรสสีแดง รุ่นที่พส.ใส่รีวิวเมื่อคืนค่ะ', time: '10:00 AM' },
    { sender: 'ai', text: 'สวัสดีค่ะคุณลูกค้า 🙏 เดรสสีแดงรุ่น Ruby ตอนนี้พร้อมส่งไซส์ S และ M ค่ะ ราคา 1,290 บาท จัดส่งฟรีนะคะ', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=400&fit=crop', time: '10:01 AM' },
    { sender: 'user', text: 'รุ่นที่ไลฟ์เมื่อคืนยังมีของไหมคะ?', time: '10:05 AM' },
    { sender: 'ai', text: 'ยังมีพร้อมส่งทั้ง 2 ไซส์เลยค่ะ! รับไซส์อะไรดีคะ แอดมินจะได้สรุปยอดให้ค่ะ 💕', buttons: ['รับไซส์ S', 'รับไซส์ M'], time: '10:05 AM' }
  ],
  'C-002': [
    { sender: 'user', text: 'เอาไซส์ M ค่ะ โอนเลย', time: '09:10 AM' },
    { sender: 'ai', text: 'รับทราบค่ะ เดรส Ruby ไซส์ M 1 ชุด ยอดรวม 1,290 บาท รบกวนโอนเข้าบัญชี: กสิกรไทย 012-345-6789 ชื่อบจก. สแปร์เอ็กซ์ ค่ะ', time: '09:10 AM' },
    { sender: 'user', text: 'ส่งสลิปโอนเงิน ยอด 1,290 บาท', image: 'https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=200&h=300&fit=crop', isSlip: true, time: '09:15 AM' },
    { sender: 'ai', text: 'ได้รับยอดเงินเรียบร้อยค่ะ 🎉 ขอบคุณที่อุดหนุนนะคะ ทางเราจะจัดส่งสินค้าให้ในวันพรุ่งนี้ค่ะ', time: '09:16 AM' }
  ],
  'C-003': [
    { sender: 'user', text: 'ได้รับของแล้วแต่ไซส์ไม่พอดี ขอเปลี่ยนค่ะ', time: '08:30 AM' },
    { sender: 'ai', text: 'ต้องขออภัยในความไม่สะดวกด้วยนะคะ 🙏 ทางเรามีนโยบายรับเปลี่ยนสินค้าภายใน 7 วันค่ะ รบกวนคุณลูกค้าถ่ายรูปสินค้าและป้ายแท็กส่งมาให้ทางเราหน่อยนะคะ เดี๋ยวจะมีแอดมินเข้ามาดูแลให้ทันทีเลยค่ะ', time: '08:30 AM' },
    { sender: 'ai', text: 'ระหว่างรอแอดมิน คุณลูกค้าสนใจดูคอลเลกชันใหม่ล่าสุดเพิ่มเติมไหมคะ? 👗', carousel: [
      { title: 'เซ็ตสูท 2 ชิ้น', price: '฿1,590', image: 'https://images.unsplash.com/photo-1515347619362-75fc38e55395?w=200&h=200&fit=crop' },
      { title: 'เดรสยาวลายดอก', price: '฿1,890', image: 'https://images.unsplash.com/photo-1572804013309-8c98e4f509f6?w=200&h=200&fit=crop' }
    ], time: '08:31 AM'}
  ],
  'C-004': [
    { sender: 'user', text: 'สอบถามไซส์เสื้อค่ะ อก 34 ใส่ไซส์ไหนคะ?', time: '11:20 AM' },
    { sender: 'ai', text: 'อก 34 แนะนำไซส์ M ค่ะ ใส่สบายไม่รัดเกินไปค่ะ 💖', time: '11:20 AM' }
  ],
  'C-005': [
    { sender: 'user', text: 'ขอใบกำกับภาษี', time: '11:45 AM' },
    { sender: 'ai', text: 'รบกวนคุณลูกค้าพิมพ์ ชื่อ-นามสกุล ที่อยู่ และเลขประจำตัวผู้เสียภาษี ไว้ได้เลยค่ะ เดี๋ยวแอดมินจะรีบดำเนินการให้นะคะ 🙏', time: '11:45 AM' }
  ]
};

export const MOCK_LEADS = [
  { id: 1, date: '07/06/2026', name: 'คุณแพรว (VIP)', platform: 'Line OA', contact: '081-999-8888', intent: 'CF เดรสรุ่น Summer (Size M)', status: 'Converted', estValue: 1290, persona: ['สายเปย์', 'ชอบของแถม', 'ซื้อซ้ำ'], nextAction: 'ส่งโปรซื้อคู่ถูกกว่า', actionColor: 'bg-emerald-500' },
  { id: 2, date: '06/06/2026', name: 'คุณนิว', platform: 'Facebook', contact: 'new.fashion@gmail.com', intent: 'สนใจสมัครตัวแทนจำหน่าย', status: 'New', estValue: 15000, persona: ['นักลงทุน', 'เน้นกำไร', 'ตอบแชทช้า'], nextAction: 'ส่งตารางเรทราคาส่ง', actionColor: 'bg-indigo-500' },
  { id: 3, date: '06/06/2026', name: 'Minnie', platform: 'Instagram', contact: 'IG Direct', intent: 'ขอดูรูปชุดเซ็ต 2 ชิ้น', status: 'Contacted', estValue: 1590, persona: ['เปรียบเทียบราคา', 'เน้นดูรูปรีวิว'], nextAction: 'เสนอส่วนลด 5%', actionColor: 'bg-amber-500' },
  { id: 4, date: '05/06/2026', name: 'Shopper99', platform: 'TikTok Shop', contact: 'TikTok Inbox', intent: 'ถามไซส์เสื้อ อก 34', status: 'New', estValue: 890, persona: ['วัยรุ่น', 'ช้อปกลางคืน'], nextAction: 'รีบทักปิดการขาย', actionColor: 'bg-rose-500' }
];

export const MOCK_RULES = [
  { id: 1, name: 'ลูกค้าถามแล้วเงียบ (ทวงตะกร้า)', delay: '24h', message: 'คุณลูกค้ายังสนใจสินค้ารายการนี้อยู่ไหมคะ? วันนี้ทาง...', active: true },
  { id: 2, name: 'ขอรีวิวหลังได้รับสินค้า', delay: '7d', message: 'ได้รับสินค้าเรียบร้อยไหมคะ? แวะมารีวิวให้ทางร้าน 5 ...', active: false },
];

export const MOCK_PIPELINE = [
  { id: 1, name: 'Khun Praew (VIP)', intent: 'CF เดรส Summer', score: 'Hot', stage: 'Pending Payment', value: 1290, time: '10 นาทีที่แล้ว' },
  { id: 2, name: 'MewMew', intent: 'CF เซ็ตบำรุงผิว', score: 'Hot', stage: 'Pending Payment', value: 3210, time: '1 ชม. ที่แล้ว' },
  { id: 3, name: 'คุณตูน', intent: 'ถามไซส์เสื้อ', score: 'Warm', stage: 'Contacted', value: 1290, time: '1 วันที่แล้ว' },
];

export const MOCK_BRANCHES = [
  { id: 'b1', name: 'สาขาเซ็นทรัลลาดพร้าว', manager: 'คุณแพรว', status: 'Active', chats: 1250, revenue: 45000, customAi: false },
  { id: 'b2', name: 'สาขาเมกาบางนา', manager: 'คุณนิว', status: 'Active', chats: 840, revenue: 32000, customAi: true },
  { id: 'b3', name: 'สาขาสยามพารากอน', manager: 'คุณตูน', status: 'Maintenance', chats: 0, revenue: 0, customAi: false }
];

export const MOCK_LEAD_SCORES = [
  { id: 1, name: 'Khun Praew', score: 98, reason: 'สอบถามช่องทางการโอนเงินและระยะเวลาส่ง แนะนำให้รีบส่งเลขบัญชี', aiEnabled: true },
  { id: 2, name: 'MewMew', score: 95, reason: 'ต้องการสั่งซื้อเซ็ตบำรุงผิว แต่ลังเลเรื่องไซส์ แนะนำให้เสนอโปรแถมฟรี', aiEnabled: false },
  { id: 3, name: 'คุณตูน', score: 88, reason: 'ถามรายละเอียดสินค้าครบแล้ว เงียบไป 1 ชม. น่าจะรอตัดสินใจ', aiEnabled: true }
];

export const MOCK_LOST_REVENUES = [
  { id: 1, name: 'คุณนิว', product: 'เดรส Summer', value: 1290, reason: 'บ่นว่าค่าส่ง 50 บาทแพงไป แล้วเงียบหาย', action: 'ส่งโค้ดส่งฟรี', btnColor: 'bg-emerald-600', autoEnabled: false },
  { id: 2, name: 'Khun May', product: 'เซ็ตบำรุงผิว', value: 3210, reason: 'บอกว่ารอเงินเดือนออกสิ้นเดือน (อีก 3 วัน)', action: 'ตั้งแจ้งเตือนทักแชท', btnColor: 'bg-indigo-600', autoEnabled: true },
  { id: 3, name: 'Katty', product: 'กระเป๋าหนัง', value: 2500, reason: 'สินค้าหมดสต็อกตอนนั้น (ตอนนี้ของเข้าแล้ว)', action: 'แจ้งของเข้า', btnColor: 'bg-amber-600', autoEnabled: false }
];

export const MOCK_FEEDBACK_LIST = [
  { id: 100234, type: 'bug', title: 'เชื่อมต่อ Facebook ไม่ได้', description: 'กด Connect แล้วขึ้น Error 500 หมุนค้างเลยครับ', status: 'In Progress', date: '06/06/2026' },
  { id: 100235, type: 'feature', title: 'อยากให้ AI ส่งรูปภาพในแชทได้', description: 'เวลาลูกค้าขอดูรูปสินค้าเพิ่มเติม อยากให้ AI ดึงรูปใน Catalog ส่งให้ได้เลย', status: 'Pending', date: '01/06/2026' }
];

export const MOCK_TEAM_MEMBERS = [
  { id: 'u1', name: 'สมชาย ใจดี', email: 'owner@globaltech.com', role: 'OWNER', status: 'Active', branch: 'All Branches' }
];

export const MOCK_REPLY_COMMENTS = [
  { platform: 'Facebook', icon: 'Facebook', color: 'text-blue-500', user: 'Khun Praew', comment: 'ชุดนี้มีสีขาวไหมคะ?', aiReply: 'สวัสดีค่ะคุณ Khun Praew 🙏 ชุดนี้มีสีขาวพร้อมส่งไซส์ S และ M ค่ะ สนใจรับไซส์ไหนแจ้งใน Inbox ได้เลยนะคะ 💕', time: '5 นาทีที่แล้ว', isReview: false, action: 'Comment-to-DM', sentiment: 'positive' },
  { platform: 'Lazada', icon: 'ShoppingCart', color: 'text-indigo-800', user: 'User998', comment: 'ส่งของไวมาก แพ็คเกจดีเยี่ยม', aiReply: 'ขอบคุณมากค่ะสำหรับรีวิว 5 ดาว ⭐️ โอกาสหน้าเชิญแวะมาช้อปปิ้งกับเราใหม่นะคะ!', time: '1 ชม. ที่แล้ว', isReview: true, rating: 5, action: 'Auto Reply', sentiment: 'positive' },
  { platform: 'Instagram', icon: 'Instagram', color: 'text-pink-500', user: 'MewMew', comment: 'ราคาเท่าไหร่คะ?', aiReply: 'สวัสดีค่ะ รุ่นนี้ราคา 1,290 บาท จัดส่งฟรีค่ะ แอดมินส่งรายละเอียดเพิ่มเติมให้ทาง DM แล้วนะคะ 🥰', time: '3 ชม. ที่แล้ว', isReview: false, action: 'Comment-to-DM', sentiment: 'neutral' },
  { platform: 'Facebook', icon: 'Facebook', color: 'text-blue-500', user: 'Spammer', comment: 'รับสมัครคนกดไลค์คลิป รายได้ดี แอดไลน์ @xyz', aiReply: '[ ซ่อนคอมเมนต์อัตโนมัติ ]', time: '5 ชม. ที่แล้ว', isReview: false, hidden: true, action: 'Hide Spam', sentiment: 'negative' },
  { platform: 'Facebook', icon: 'Facebook', color: 'text-blue-500', user: 'AngryCustomer', comment: 'ส่งของช้ามาก แย่สุดๆ ไม่ซื้อแล้ว', aiReply: 'ต้องขออภัยในความล่าช้าอย่างสูงค่ะ 🙏 ทางเรากำลังเร่งตรวจสอบสถานะพัสดุให้ทันที รบกวนคุณลูกค้าเช็ค Inbox นะคะ', time: '10 นาทีที่แล้ว', isReview: false, isAlert: true, sentiment: 'negative', action: 'Crisis Alert' }
];


// ==========================================
// MODULE: SUPER ADMIN (SuperAdmin.jsx)
// ==========================================
export const MOCK_PARTNERS = [
  { 
    id: 'P88942', name: 'สมชาย ใจดี', email: 'somchai@globaltech.com', type: 'บุคคลธรรมดา', tier: 'Gold (25%)', rev: 125400, clients: 48, kyc: 'Approved',
    subPartners: [
      { id: 'SP1001', name: 'สมหญิง รักดี', rev: 45000, clients: 12 },
      { id: 'SP1002', name: 'บจก. เอสเอ็มอี โซลูชั่น', rev: 32000, clients: 8 }
    ] 
  },
  { 
    id: 'P11223', name: 'บจก. มาร์เก็ตติ้ง จำกัด', email: 'contact@mktg.co.th', type: 'นิติบุคคล', tier: 'Bronze (15%)', rev: 12000, clients: 5, kyc: 'Pending',
    subPartners: []
  },
  { 
    id: 'P99887', name: 'มาลี สวยงาม', email: 'malee.s@gmail.com', type: 'บุคคลธรรมดา', tier: 'Bronze (15%)', rev: 0, clients: 0, kyc: 'Rejected',
    subPartners: []
  },
  { 
    id: 'P44556', name: 'ธนาพล ยอดเยี่ยม', email: 'thanapol@yahoo.com', type: 'บุคคลธรรมดา', tier: 'Silver (18%)', rev: 85000, clients: 22, kyc: 'Approved',
    subPartners: [
      { id: 'SP1003', name: 'เอกราช เก่งกล้า', rev: 15000, clients: 3 }
    ]
  },
];

export const MOCK_CUSTOMERS = [
  { id: 'A849201', name: 'คุณสมชาย ใจดี', business: 'บริษัท โกลบอลเทค จำกัด', partner: 'P88942', plan: 'Advanced', mrr: 11900, usage: 85, status: 'Active' },
  { id: 'A592014', name: 'พญ. วลัยลักษณ์', business: 'สมชาย คลินิก เวชกรรม', partner: 'P88942', plan: 'Pro', mrr: 4900, usage: 42, status: 'Active' },
  { id: 'A110293', name: 'คุณกิตติ สุขใจ', business: 'ร้านกาแฟ สุขใจ', partner: 'P11223', plan: 'Basic', mrr: 990, usage: 5, status: 'Pending' },
  { id: 'A992834', name: 'อ. วิทยา พัฒนา', business: 'โรงเรียนพัฒนาศึกษา', partner: 'DIRECT', plan: 'Pro', mrr: 4900, usage: 92, status: 'Active' },
  { id: 'A772183', name: 'บจก. อสังหาทูเดย์', business: 'อสังหาทูเดย์ พร็อพเพอร์ตี้', partner: 'DIRECT', plan: 'Advanced', mrr: 11900, usage: 60, status: 'Active' },
];

export const MOCK_PAYOUT_DATA = {
  '2026-06': { netTotal: 124500, whtTotal: 3850, count: 45, hold: 2, list: [
    { partnerId: 'P88942', name: 'สมชาย ใจดี', type: 'บุคคล', tier: 'Gold(25%)', kyc: 'Approved', sales: 215000, comm: 53750, wht: 1612.5, net: 52137.5, status: 'Ready' },
    { partnerId: 'P11223', name: 'บริษัท มาร์เก็ตติ้ง จำกัด', type: 'นิติบุคคล', tier: 'Bronze(15%)', kyc: 'Pending', sales: 12000, comm: 1800, wht: 54, net: 1746, status: 'Hold' },
    { partnerId: 'P44556', name: 'ธนาพล ยอดเยี่ยม', type: 'บุคคล', tier: 'Silver(18%)', kyc: 'Approved', sales: 85000, comm: 15300, wht: 459, net: 14841, status: 'Paid' },
  ]},
  '2026-05': { netTotal: 78327, whtTotal: 2476, count: 38, hold: 7, list: [
    { partnerId: 'P88942', name: 'สมชาย ใจดี', type: 'บุคคล', tier: 'Gold(25%)', kyc: 'Approved', sales: 160000, comm: 40000, wht: 1200, net: 38800, status: 'Paid' },
    { partnerId: 'P11223', name: 'บริษัท มาร์เก็ตติ้ง จำกัด', type: 'นิติบุคคล', tier: 'Bronze(15%)', kyc: 'Pending', sales: 5000, comm: 750, wht: 22.5, net: 727.5, status: 'Hold' },
  ]}
};

export const MOCK_TICKETS = [
  { id: 'TK-1002', sender: 'CUSTOMER', name: 'โรงเรียนพัฒนาศึกษา', issue: 'AI ตอบข้อมูลโปรโมชั่นผิด', type: 'Bug', status: 'In Progress', time: '2 ชม. ที่แล้ว' },
  { id: 'TK-1003', sender: 'PARTNER', name: 'สมชาย ใจดี (P88942)', issue: 'สอบถามเรื่องเอกสาร 50 ทวิ ของเดือนที่แล้ว', type: 'Billing', status: 'Pending', time: '5 ชม. ที่แล้ว' },
  { id: 'TK-1004', sender: 'CUSTOMER', name: 'ร้านกาแฟ สุขใจ', issue: 'อยากให้ AI ส่งรูปเมนูให้ลูกค้าได้ด้วย', type: 'Feature', status: 'Resolved', time: '1 วันที่แล้ว' },
];

export const MOCK_ANNOUNCEMENTS = [
  { id: 'ANC-001', title: 'แคมเปญพิเศษ Q3: ทำยอดทะลุ 5 แสนรับโบนัส 5%', type: 'Campaign', audience: 'PARTNER', target: 'All Partners', date: '05/06/2026', views: 84, status: 'Active' },
  { id: 'ANC-004', title: 'Flash Sale: อัปเกรดเป็น Advanced ลด 20% นาน 3 เดือน', type: 'Promotion', audience: 'CUSTOMER', target: 'Pro & Basic Plans', date: '03/06/2026', views: 1250, status: 'Active' },
  { id: 'ANC-002', title: 'อัปเดตฟีเจอร์ Multi-PDF Upload พร้อมใช้งานแล้ว', type: 'Product Update', audience: 'BOTH', target: 'All Users', date: '01/06/2026', views: 3420, status: 'Active' },
  { id: 'ANC-003', title: 'เชิญร่วมสัมมนา AIVA Partner Summit 2026', type: 'Event', audience: 'PARTNER', target: 'Gold & Silver', date: '25/05/2026', views: 45, status: 'Ended' },
];


// ==========================================
// MODULE: PARTNER (Partner.jsx)
// ==========================================
export const MOCK_TRACKING_LINKS = [
  { id: 1, name: 'ลิงก์หลัก (Default)', source: 'ORGANIC', clicks: 1245, signups: 86, paid: 12, earnings: 22500, code: 'P88942' },
  { id: 2, name: 'ยิงแอด เฟสบุ๊ค เดือน 6', source: 'FB_ADS', clicks: 850, signups: 42, paid: 5, earnings: 8500, code: 'P88942_FB' },
  { id: 3, name: 'คลิปรีวิวสอนใช้งาน TikTok', source: 'TIKTOK', clicks: 2300, signups: 115, paid: 18, earnings: 34200, code: 'P88942_TK' }
];

export const MOCK_SUB_PARTNERS = [
  { id: 'SP99201', name: 'คุณนิว', sales: 160000, clients: 12, joined: '01/05/2026' },
  { id: 'SP99202', name: 'คุณตูน', sales: 65000, clients: 5, joined: '15/05/2026' },
  { id: 'SP99203', name: 'คุณก้อย', sales: 25000, clients: 2, joined: '02/06/2026' }
];

export const MOCK_PARTNER_CLIENTS = [
  { id: 'C1001', name: 'บจก. เอบีซี', plan: 'Advanced', ltv: 11900, source: 'Direct', status: 'Active', expiresIn: 45 },
  { id: 'C1002', name: 'คุณนิว', plan: 'Pro', ltv: 4900, source: 'SP99201', status: 'Active', expiresIn: 12 },
  { id: 'C1003', name: 'คลินิกใจดี', plan: 'Basic', ltv: 990, source: 'Direct', status: 'Pending', expiresIn: null },
  { id: 'C1004', name: 'ร้านสมใจมินิมาร์ท', plan: 'Pro', ltv: 4900, source: 'SP99202', status: 'Active', expiresIn: 5 },
  { id: 'C1005', name: 'บจก. วายแซดเอ็กซ์', plan: 'Advanced', ltv: 23800, source: 'Direct', status: 'Active', expiresIn: 120 }
];

export const MOCK_BILLING_HISTORY = [
  { invoiceNo: 'SPX-2026-06001', date: '05/06/2026', plan: 'AIVA Pro', billingCycle: 'monthly', price: 4900, status: 'Paid' },
  { invoiceNo: 'SPX-2026-05002', date: '05/05/2026', plan: 'AIVA Pro', billingCycle: 'monthly', price: 4900, status: 'Paid' },
  { invoiceNo: 'SPX-2026-04003', date: '05/04/2026', plan: 'AIVA Pro', billingCycle: 'monthly', price: 4900, status: 'Paid' },
  { invoiceNo: 'SPX-2026-03004', date: '05/03/2026', plan: 'AIVA Pro', billingCycle: 'monthly', price: 4900, status: 'Paid' }
];

