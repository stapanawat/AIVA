import React, { useState, useRef, useEffect } from 'react';
import { USE_MOCK } from '../config';
import { 
  Bot, LayoutDashboard, BookOpen, MessageSquare, Plug, Settings, 
  CreditCard, Bell, Search, Zap, UploadCloud, Link as LinkIcon, 
  FileText, Trash2, CheckCircle2, ChevronRight, BarChart3, Users, 
  Clock, RefreshCw, Smartphone, Globe, ExternalLink, PlayCircle,
  Hash, LogOut, BrainCircuit, Unlock, Lock, ShoppingCart, Tag, Send,
  Store, MapPin, Code, Key, Webhook, TrendingUp, Lightbulb, Flame,
  AlertOctagon, TrendingDown, RefreshCcw, AlertCircle, X, Check,
  Sun, Moon, Pin, PinOff, Calendar as CalendarIcon, Phone,
  Menu, Mail, Copy, Plus, Star,
  LineChart, MessageCircle, Sparkles, PenTool, Share2, Heart, Video, Music, Bug,
  Activity, Eye
} from 'lucide-react';

// Custom brand icons since they are removed from lucide-react v4
const Facebook = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const Youtube = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

const Instagram = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

// ==========================================
// TRANSLATIONS (i18n)
// ==========================================
const TRANSLATIONS = {
  TH: {
    workspace: 'พื้นที่ทำงาน', extensions: 'ส่วนขยายศักยภาพ', management: 'การจัดการ',
    dashboard: 'ภาพรวม', knowledge: 'สอน AIVA', inbox: 'AIVA Inbox & Chat',
    leads: 'ข้อมูลลูกค้า', pipeline: 'CRM Pipeline', followup: 'AIVA Follow-up',
    leadscore: 'AIVA Lead Score', lostrevenue: 'AIVA Lost Revenue', ceoreport: 'AIVA CEO Report',
    replycomment: 'AIVA Reply Comment', contentgen: 'AIVA Content Gen', socialgrowth: 'AIVA Social Growth™',
    integrations: 'ช่องทางเชื่อมต่อ', branch: 'จัดการสาขา', team: 'จัดการทีม', billing: 'จัดการแพ็กเกจ', settings: 'ตั้งค่าระบบ', feedback: 'เสนอแนะ/แจ้งปัญหา',
    poweredBy: 'Powered by SpareX', logout: 'ออกจากระบบ (Logout)', saveSettings: 'บันทึกการตั้งค่า', saved: 'บันทึกสำเร็จ!',
    tokensUsed: 'ใช้ไป', tokensLimit: 'Tokens คงเหลือ', aiReady: 'AIVA Agent ของคุณพร้อมทำงานแล้ว!', 
    aiReadyDesc: 'เชื่อมต่อ AIVA เข้ากับ Line OA หรือ Website เพื่อเริ่มให้บริการลูกค้าอัตโนมัติ 24 ชม.',
    goToIntegrations: 'ไปที่การเชื่อมต่อ'
  },
  EN: {
    workspace: 'Workspace', extensions: 'Superpowers', management: 'Management',
    dashboard: 'Overview', knowledge: 'Knowledge Base', inbox: 'AI Inbox & Chat',
    leads: 'Leads', pipeline: 'CRM Pipeline', followup: 'AIVA Follow-up',
    leadscore: 'AIVA Lead Score', lostrevenue: 'AIVA Lost Revenue', ceoreport: 'AIVA CEO Report',
    replycomment: 'AI Reply Comment', contentgen: 'AIVA Content Gen', socialgrowth: 'AIVA Social Growth™',
    integrations: 'Integrations', branch: 'Branches', team: 'Team', billing: 'Billing', settings: 'Settings', feedback: 'Feedback Hub',
    poweredBy: 'Powered by SpareX', logout: 'Logout', saveSettings: 'Save Settings', saved: 'Saved!',
    tokensUsed: 'Used', tokensLimit: 'Remaining Tokens', aiReady: 'Your AIVA Agent is Ready!', 
    aiReadyDesc: 'Connect AIVA to Line OA or Website to start automating customer service 24/7.',
    goToIntegrations: 'Go to Integrations'
  },
  ZH: {
    workspace: '工作区', extensions: '超级特权', management: '管理',
    dashboard: '概览', knowledge: '知识库', inbox: 'AI 收件箱和聊天',
    leads: '潜在客户', pipeline: '客户关系管理', followup: 'AIVA 跟进',
    leadscore: 'AIVA 客户评分', lostrevenue: 'AIVA 挽回收入', ceoreport: 'AIVA CEO 报告',
    replycomment: 'AI 自动回复评论', contentgen: 'AIVA 内容生成', socialgrowth: 'AIVA 社交增长™',
    integrations: '集成', branch: '分行管理', team: '团队管理', billing: '计费和计划', settings: '系统设置', feedback: '反馈中心',
    poweredBy: '由 SpareX 提供支持', logout: '登出', saveSettings: '保存设置', saved: '已保存！',
    tokensUsed: '已用', tokensLimit: '剩余代币', aiReady: '您的 AIVA 代理已准备就绪！', 
    aiReadyDesc: '将 AIVA 连接到 Line OA 或网站，开始全天候自动化客户服务。',
    goToIntegrations: '转到集成'
  }
};

const LANGUAGES = ['TH', 'EN', 'ZH'];
const FLAGS = { 'TH': '🇹🇭', 'EN': '🇬🇧', 'ZH': '🇨🇳' };

// ==========================================
// MOCK DATA
// ==========================================
const MOCK_STATS = { tokensUsed: 425000, tokenLimit: 500000, totalChats: 28450, resolvedByAI: 95, activeAgents: 2 };
const MOCK_KNOWLEDGE = [
  { id: 1, type: 'pdf', name: 'PriceList_Summer2026.pdf', size: '2.4 MB', status: 'Trained', date: '05/06/2026', tokens: '1,250' },
  { id: 2, type: 'pdf', name: 'Promotion_Rules.pdf', size: '1.1 MB', status: 'Trained', date: '02/06/2026', tokens: '840' },
  { id: 3, type: 'url', name: 'https://sparexth.com/shipping-policy', size: '-', status: 'Trained', date: '01/06/2026', tokens: '320' },
];
const MOCK_INBOX_LIST = [
  { id: 'C-001', user: 'Khun Praew (VIP)', platform: 'Line OA', query: 'รุ่นที่ไลฟ์เมื่อคืนยังมีของไหมคะ?', status: 'AI Replied', time: '10:05 AM', unreadCount: 0 },
  { id: 'C-002', user: 'Katty', platform: 'Line OA', query: 'ส่งสลิปโอนเงิน ยอด 1,290 บาท', status: 'AI Replied', time: '09:15 AM', unreadCount: 3 },
  { id: 'C-003', user: 'MewMew', platform: 'Facebook', query: 'ได้รับของแล้วแต่ไซส์ไม่พอดี ขอเปลี่ยนค่ะ', status: 'Handover', time: '08:30 AM', unreadCount: 1 },
];
const MOCK_CHATS = {
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
  ]
};
const MOCK_LEADS = [
  { id: 1, date: '07/06/2026', name: 'คุณแพรว (VIP)', contact: '081-999-8888', intent: 'CF เดรสรุ่น Summer (Size M)', status: 'Converted' },
  { id: 2, date: '06/06/2026', name: 'คุณนิว', contact: 'new.fashion@gmail.com', intent: 'สนใจสมัครตัวแทนจำหน่าย', status: 'New' },
];
const MOCK_RULES = [
  { id: 1, name: 'ลูกค้าถามแล้วเงียบ (ทวงตะกร้า)', delay: '24h', message: 'คุณลูกค้ายังสนใจสินค้ารายการนี้อยู่ไหมคะ? วันนี้ทาง...', active: true },
  { id: 2, name: 'ขอรีวิวหลังได้รับสินค้า', delay: '7d', message: 'ได้รับสินค้าเรียบร้อยไหมคะ? แวะมารีวิวให้ทางร้าน 5 ...', active: false },
];
const MOCK_PIPELINE = [
  { id: 1, name: 'Khun Praew (VIP)', intent: 'CF เดรส Summer', score: 'Hot', stage: 'Pending Payment', value: 1290, time: '10 นาทีที่แล้ว' },
  { id: 2, name: 'MewMew', intent: 'CF เซ็ตบำรุงผิว', score: 'Hot', stage: 'Pending Payment', value: 3210, time: '1 ชม. ที่แล้ว' },
  { id: 3, name: 'คุณตูน', intent: 'ถามไซส์เสื้อ', score: 'Warm', stage: 'Contacted', value: 1290, time: '1 วันที่แล้ว' },
];
const MOCK_BRANCHES = [
  { id: 'b1', name: 'สาขาเซ็นทรัลลาดพร้าว', manager: 'คุณแพรว', status: 'Active', chats: 1250, revenue: 45000, customAi: false },
  { id: 'b2', name: 'สาขาเมกาบางนา', manager: 'คุณนิว', status: 'Active', chats: 840, revenue: 32000, customAi: true },
  { id: 'b3', name: 'สาขาสยามพารากอน', manager: 'คุณตูน', status: 'Maintenance', chats: 0, revenue: 0, customAi: false }
];

const PLATFORM_MAP = {
  line: 'Line OA', facebook: 'Facebook', instagram: 'Instagram', website: 'Website',
  lazada: 'Lazada', tiktok: 'TikTok Shop', youtube: 'YouTube Comments'
};

const AppIcon = ({ appId, size = 'md' }) => {
  const dimensions = size === 'lg' ? 'w-16 h-16 rounded-[1.25rem]' : size === 'sm' ? 'w-10 h-10 rounded-xl' : 'w-14 h-14 rounded-2xl';
  const iconDim = size === 'lg' ? 'w-8 h-8' : size === 'sm' ? 'w-5 h-5' : 'w-7 h-7';
  
  switch (appId) {
    case 'line': return (<div className={`${dimensions} shadow-sm flex items-center justify-center shrink-0 overflow-hidden`}><img src="https://play-lh.googleusercontent.com/HhsyrXZLcFtoOs2_LF17yvxwDbimYaioLIhLdEO3AvZlemvM2iCzBTX27jPzd19A9vvGR-Mg3Cy9euJ22LVdgQ" alt="LINE" className="w-full h-full object-cover" /></div>);
    case 'facebook': return (<div className={`${dimensions} shadow-sm flex items-center justify-center shrink-0 overflow-hidden`}><img src="https://play-lh.googleusercontent.com/KCMTYuiTrKom4Vyf0G4foetVOwhKWzNbHWumV73IXexAIy5TTgZipL52WTt8ICL-oIo" alt="" className="w-full h-full object-cover" /></div>);
    case 'instagram': return (<div className={`${dimensions} shadow-sm flex items-center justify-center shrink-0 overflow-hidden`}><img src="https://store-images.s-microsoft.com/image/apps.43327.13510798887167234.cadff69d-8229-427b-a7da-21dbaf80bd81.79b8f512-1b22-45d6-9495-881485e3a87e" alt="" className="w-full h-full object-cover" /></div>);
    case 'tiktok': return (<div className={`${dimensions} shadow-sm flex items-center justify-center shrink-0 overflow-hidden`}><img src="https://play-lh.googleusercontent.com/t5yNYUzJYyOzLtXXGETvuGfgQEkMdGytKr5t35WMZlva0FKgOEl7chJSrzQ848lm-jUirB2saX2rbqrIJffr=w240-h480-rw" alt="TikTok" className="w-full h-full object-cover" /></div>);
    case 'youtube': return (<div className={`${dimensions} bg-[#FF0000] shadow-sm flex items-center justify-center shrink-0`}><svg viewBox="0 0 24 24" className={`${iconDim} text-white`} fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></div>);
    case 'lazada': return (<div className={`${dimensions} bg-white shadow-sm flex items-center justify-center shrink-0 overflow-hidden`}><img src="https://laz-img-cdn.alicdn.com/tfs/TB1PApewFT7gK0jSZFpXXaTkpXa-200-200.png" alt="Lazada" className="w-full h-full object-cover" /></div>);
    case 'website': return (<div className={`${dimensions} bg-indigo-600 shadow-sm flex items-center justify-center shrink-0`}><Globe className={`${iconDim} text-white`} /></div>);
    default: return (<div className={`${dimensions} bg-slate-200 shadow-sm flex items-center justify-center shrink-0`}><Plug className={`${iconDim} text-slate-500`} /></div>);
  }
};

// ==========================================
// AUTH SCREEN
// ==========================================
function PlatformAuth({ onLogin }) {
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };
   const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const email = e.target.querySelector('input[type="email"]').value;
      const password = e.target.querySelector('input[type="password"]').value;
      
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'เข้าสู่ระบบล้มเหลว', 'danger');
        setIsLoading(false);
        return;
      }
      
      localStorage.setItem('aiva_access_token', data.accessToken);
      localStorage.setItem('aiva_user', JSON.stringify(data.user));
      setIsLoading(false);
      onLogin();
    } catch (err) {
      console.warn('Backend not running, falling back to mock authentication:', err);
      setTimeout(() => { setIsLoading(false); onLogin(); }, 1200);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 relative overflow-hidden" style={{ fontFamily: "'Anuphan', sans-serif" }}>
      <style dangerouslySetInnerHTML={{__html: `@import url('https://fonts.googleapis.com/css2?family=Anuphan:wght@300;400;500;600;700&display=swap');`}} />
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] bg-indigo-600/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[10%] -left-[10%] w-[50%] h-[50%] bg-violet-600/5 blur-[100px] rounded-full"></div>
      </div>

      <div className="mb-8 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500 z-10">
        <div className="bg-white p-3.5 rounded-[2rem] shadow-xl shadow-indigo-500/10 mb-4 flex justify-center items-center border border-slate-100">
           <img src="https://i.postimg.cc/9fvVLjRT/AIVA-Trasparent.png" alt="AIVA Logo" className="h-24 w-24 object-contain" />
        </div>
      </div>

      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-white overflow-hidden animate-in fade-in zoom-in-95 duration-500 p-8 z-10">
        <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">เข้าสู่ระบบการจัดการ</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex justify-between items-center mb-1">
               <label className="block text-sm font-semibold text-slate-600">อีเมลพนักงาน (Email)</label>
               <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">ทีมงาน / แอดมิน</span>
            </div>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="email" placeholder="staff@company.com" defaultValue="admin@globaltech.com" className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none" required />
            </div>
          </div>
          <div className="flex items-center gap-4 my-2">
            <div className="h-px bg-slate-200 flex-1"></div>
            <span className="text-xs font-bold text-slate-400 uppercase">หรือ</span>
            <div className="h-px bg-slate-200 flex-1"></div>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between items-center mb-1">
               <label className="block text-sm font-semibold text-slate-600">รหัสลูกค้า (Customer ID)</label>
               <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">เจ้าของกิจการ (Owner)</span>
            </div>
            <div className="relative">
              <Hash className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="CXXXXXX" className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none uppercase" />
            </div>
          </div>
          <div className="space-y-1.5 mt-4">
            <label className="block text-sm font-semibold text-slate-600">รหัสผ่าน</label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="password" placeholder="••••••••" defaultValue="password" className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none" required />
            </div>
          </div>
          <button type="submit" disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/30 flex justify-center items-center gap-2 mt-6">
            {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'เข้าสู่ระบบ AIVA Platform'}
          </button>
        </form>
      </div>
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[10000] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border text-sm font-bold bg-rose-50 border-rose-200 text-rose-800">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// MAIN PLATFORM APP
// ==========================================
export default function Platform() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('aiva_access_token'));
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [langIndex, setLangIndex] = useState(0);
  const [isSidebarPinned, setIsSidebarPinned] = useState(true);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  
  const [currentPlan, setCurrentPlan] = useState('Pro'); 
  const [billingCycle, setBillingCycle] = useState('monthly'); 

  // Limits based on plan
  const maxChannels = currentPlan === 'Basic' ? 1 : currentPlan === 'Pro' ? 2 : 6;
  const maxUsers = currentPlan === 'Basic' ? 1 : currentPlan === 'Pro' ? 5 : 20;

  // Integrations State
  const [connectedApps, setConnectedApps] = useState([]);
  const [connectingApp, setConnectingApp] = useState(null);
  const [managingApp, setManagingApp] = useState(null);
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [integrationsList, setIntegrationsList] = useState([]);
  const [lineConfig, setLineConfig] = useState({ channelAccessToken: '', channelSecret: '' });
  const [fbConfig, setFbConfig] = useState({ pageAccessToken: '', pageId: '' });
  const [igConfig, setIgConfig] = useState({ pageAccessToken: '', pageId: '' });
  const [webConfig, setWebConfig] = useState({ themeColor: '#4f46e5', greeting: 'สวัสดีค่ะ มีอะไรให้ช่วยไหมคะ' });

  // Get active client ID
  const currentUserObj = (() => {
    try {
      const userStr = localStorage.getItem('aiva_user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
      return null;
    }
  })();
  const clientId = currentUserObj?.clientId || 'c-123456';

  // Inbox & Chat State
  const [selectedChat, setSelectedChat] = useState('C-001');
  const [chatMode, setChatMode] = useState('ai');
  const [inboxPlatformFilter, setInboxPlatformFilter] = useState('All');
  const chatEndRef = useRef(null);

  // AI Reply Comment State
  const [replyPlatformFilter, setReplyPlatformFilter] = useState('All');

  // Content Gen State
  const [contentInput, setContentInput] = useState('');
  const [contentType, setContentType] = useState('caption');
  const [contentTone, setContentTone] = useState('friendly');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Growth & Rules State
  const [growthActionLoading, setGrowthActionLoading] = useState(false);
  const [growthActionSuccess, setGrowthActionSuccess] = useState(false);
  const [showCreateRule, setShowCreateRule] = useState(false);
  const [newRule, setNewRule] = useState({ name: '', delay: '24h', smartTiming: false, message: '', includeCoupon: false });
  const [isGeneratingMessage, setIsGeneratingMessage] = useState(false);
  const [rulesList, setRulesList] = useState([]);
  const [knowledgeList, setKnowledgeList] = useState(USE_MOCK ? MOCK_KNOWLEDGE : []);
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };
  const [showAddKnowledge, setShowAddKnowledge] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [newKnowledge, setNewKnowledge] = useState({ type: 'text', title: '', content: '', url: '' });
  const [isSubmittingKnowledge, setIsSubmittingKnowledge] = useState(false);
  const [knowledgeSearch, setKnowledgeSearch] = useState('');
  const [inboxList, setInboxList] = useState(USE_MOCK ? MOCK_INBOX_LIST : []);
  const [chatMessages, setChatMessages] = useState({});
  const [chatInput, setChatInput] = useState('');
  const [inboxSearch, setInboxSearch] = useState('');
  const [leadsSearch, setLeadsSearch] = useState('');
  const [stats, setStats] = useState(MOCK_STATS);


  // Workspace Settings
  const [workspaceSettings, setWorkspaceSettings] = useState({
    aiName: 'แอดมิน AIVA', aiPersona: 'friendly', customPrompt: '', notifyHotLead: true, notifyDailyReport: true
  });
  const [showReplySettings, setShowReplySettings] = useState(false);
  const [replySettings, setReplySettings] = useState({
    autoReplyComments: true, autoReplyReviews: true, hideSpam: true,
    aiTone: 'ตอบด้วยความสุภาพ เป็นกันเอง มีอีโมจิเล็กน้อย และลงท้ายด้วย "ค่ะ" เสมอ พร้อมแนะนำให้ลูกค้าทัก Inbox'
  });

  // Pipeline & Leads State
  const [leadsData, setLeadsData] = useState(USE_MOCK ? MOCK_LEADS : []);
  const [showAddLead, setShowAddLead] = useState(false);
  const [newLead, setNewLead] = useState({ name: '', contact: '', intent: '', status: 'New' });
  const [pipelineData, setPipelineData] = useState([]);
  const [showAddDeal, setShowAddDeal] = useState(false);
  const [newDeal, setNewDeal] = useState({ name: '', intent: '', score: 'Warm', stage: 'New Leads', value: '' });
  const [pipelineFilter, setPipelineFilter] = useState('All Stages');

  const [leadScores, setLeadScores] = useState(USE_MOCK ? [
    { id: 1, name: 'Khun Praew', score: 98, reason: 'สอบถามช่องทางการโอนเงินและระยะเวลาส่ง แนะนำให้รีบส่งเลขบัญชี', aiEnabled: true },
    { id: 2, name: 'MewMew', score: 95, reason: 'ต้องการสั่งซื้อเซ็ตบำรุงผิว แต่ลังเลเรื่องไซส์ แนะนำให้เสนอโปรแถมฟรี', aiEnabled: false },
    { id: 3, name: 'คุณตูน', score: 88, reason: 'ถามรายละเอียดสินค้าครบแล้ว เงียบไป 1 ชม. น่าจะรอตัดสินใจ', aiEnabled: true }
  ] : []);

  const [lostRevenues, setLostRevenues] = useState(USE_MOCK ? [
    { id: 1, name: 'คุณนิว', product: 'เดรส Summer', value: 1290, reason: 'บ่นว่าค่าส่ง 50 บาทแพงไป แล้วเงียบหาย', action: 'ส่งโค้ดส่งฟรี', btnColor: 'bg-emerald-600', autoEnabled: false },
    { id: 2, name: 'Khun May', product: 'เซ็ตบำรุงผิว', value: 3210, reason: 'บอกว่ารอเงินเดือนออกสิ้นเดือน (อีก 3 วัน)', action: 'ตั้งแจ้งเตือนทักแชท', btnColor: 'bg-indigo-600', autoEnabled: true },
    { id: 3, name: 'Katty', product: 'กระเป๋าหนัง', value: 2500, reason: 'สินค้าหมดสต็อกตอนนั้น (ตอนนี้ของเข้าแล้ว)', action: 'แจ้งของเข้า', btnColor: 'bg-amber-600', autoEnabled: false }
  ] : []);

  const [editProfile, setEditProfile] = useState({
    bossName: 'สมชาย ใจดี',
    bossEmail: 'owner@globaltech.com',
    brandName: 'GlobalTech Official',
    businessType: 'ecommerce'
  });
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Chat Widget Support State
  const [isChatWidgetOpen, setIsChatWidgetOpen] = useState(false);

  // Feedback Hub State
  const [feedbackForm, setFeedbackForm] = useState({ type: 'feature', title: '', description: '' });
  const [feedbackList, setFeedbackList] = useState([]);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [showFeedbackSuccess, setShowFeedbackSuccess] = useState(false);

  // Team Management State
  const [teamMembers, setTeamMembers] = useState([]);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', email: '', role: 'ADMIN', branch: 'HQ' });

  // Branch Management State
  const [branchData, setBranchData] = useState(USE_MOCK ? MOCK_BRANCHES : []);
  const [showAddBranch, setShowAddBranch] = useState(false);
  const [newBranch, setNewBranch] = useState({ name: '', manager: '', status: 'Active', customAi: false });

  // Translation Helper
  const currentLang = LANGUAGES[langIndex];
  const t = (key) => TRANSLATIONS[currentLang][key] || key;
  const cycleLanguage = () => setLangIndex((prev) => (prev + 1) % LANGUAGES.length);

  // Computed Values
  const tokenPercentage = (stats.tokensUsed / stats.tokenLimit) * 100;
  const isSidebarVisible = isSidebarPinned || isSidebarHovered;
  
  // --- FEATURE ACCESS LOGIC (LOCK SYSTEM) ---
  const isProOrAbove = currentPlan === 'Pro' || currentPlan === 'Advanced';
  const isAdvancedOnly = currentPlan === 'Advanced';

  // Handlers
  const toggleLeadAi = (id) => setLeadScores(leadScores.map(lead => lead.id === id ? { ...lead, aiEnabled: !lead.aiEnabled } : lead));
  const toggleLostRevenueAuto = (id) => setLostRevenues(lostRevenues.map(item => item.id === id ? { ...item, autoEnabled: !item.autoEnabled } : item));
  
  // --- API METHODS ---
  const fetchRules = async () => {
    try {
      const token = localStorage.getItem('aiva_access_token');
      if (!token) return;
      const res = await fetch('/api/client/rules', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRulesList(data);
      }
    } catch (err) {
      console.warn('Failed to fetch rules:', err);
    }
  };

  const fetchBranches = async () => {
    try {
      const token = localStorage.getItem('aiva_access_token');
      if (!token) return;
      const res = await fetch('/api/client/branches', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const formatted = data.map(b => ({
          id: b.id,
          name: b.name,
          manager: b.managerName,
          status: b.status,
          chats: Math.floor(10 + (b.id.charCodeAt(0) % 100)),
          revenue: Math.floor(1000 + (b.id.charCodeAt(0) % 50) * 1000),
          customAi: false
        }));
        setBranchData(formatted);
      }
    } catch (err) {
      console.warn('Failed to fetch branches:', err);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const token = localStorage.getItem('aiva_access_token');
      if (!token) return;
      const res = await fetch('/api/client/feedback', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const formatted = data.map(f => ({
          id: f.id,
          type: f.type,
          title: f.title,
          description: f.description,
          status: f.status === 'Pending' ? 'Pending' : (f.status === 'In Progress' ? 'In Progress' : 'Resolved'),
          date: new Date(f.createdAt).toLocaleDateString('th-TH')
        }));
        setFeedbackList(formatted);
      }
    } catch (err) {
      console.warn('Failed to fetch feedbacks:', err);
    }
  };

  const handleUpdateDealStage = async (dealId, newStage) => {
    try {
      const token = localStorage.getItem('aiva_access_token');
      const existing = leadsData.find(l => l.id === dealId);
      if (!existing) return;
      
      const dbStage = newStage === 'New Leads' ? 'NEW' : newStage === 'Contacted' ? 'CONTACTED' : newStage === 'Offer' ? 'OFFER' : 'WON';

      const res = await fetch('/api/client/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: dealId,
          name: existing.name,
          contact: existing.contact,
          intent: existing.intent,
          value: existing.value,
          stage: dbStage
        })
      });
      if (res.ok) {
        fetchLeads();
      }
    } catch (err) {
      console.error('Failed to update deal stage:', err);
    }
  };

  const handleUpgradePlan = async (planName) => {
    try {
      const token = localStorage.getItem('aiva_access_token');
      if (!token) return;
      
      const res = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          plan: planName.toUpperCase(),
          billingCycle: billingCycle
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        }
      } else {
        const errData = await res.json();
        showToast(errData.error || 'ไม่สามารถเริ่มการชำระเงินได้', 'danger');
      }
    } catch (err) {
      console.error('Failed to upgrade plan:', err);
      showToast('เกิดข้อผิดพลาดในการเชื่อมต่อเพื่อชำระเงิน', 'danger');
    }
  };

  const fetchKnowledge = async () => {
    try {
      const token = localStorage.getItem('aiva_access_token');
      if (!token) return;
      const res = await fetch('/api/client/knowledge', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const list = USE_MOCK ? [...MOCK_KNOWLEDGE] : [];
        data.forEach(item => {
          const formatted = {
            id: item.id,
            type: item.type.toLowerCase(),
            name: item.title,
            size: item.fileSize ? `${(item.fileSize / 1024).toFixed(1)} KB` : '-',
            date: new Date(item.createdAt).toLocaleDateString('th-TH'),
            tokens: item.tokens,
            status: item.status === 'TRAINED' ? 'Trained' : 'Training'
          };
          const idx = list.findIndex(e => e.id === formatted.id || e.name === formatted.name);
          if (idx > -1) {
            list[idx] = { ...list[idx], ...formatted };
          } else {
            list.unshift(formatted);
          }
        });
        setKnowledgeList(list);
      }
    } catch (err) {
      console.warn('Failed to fetch knowledge:', err);
    }
  };

  const fetchInbox = async () => {
    try {
      const token = localStorage.getItem('aiva_access_token');
      if (!token) return;
      const res = await fetch('/api/client/chats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setInboxList(prev => {
          const list = USE_MOCK ? [...MOCK_INBOX_LIST] : [];
          data.forEach(chat => {
            const existing = prev.find(item => item.id === chat.id);
            const formatted = {
              id: chat.id,
              user: chat.customerName,
              platform: chat.platform === 'WEB' ? 'Website' : (chat.platform === 'LINE' ? 'Line OA' : 'Facebook'),
              query: chat.messages[0]?.content || 'ไม่มีข้อความ',
              status: chat.status === 'BOT_HANDLING' ? 'AI Replied' : 'Handover',
              time: new Date(chat.updatedAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
              unreadCount: existing ? existing.unreadCount : (chat.status === 'BOT_HANDLING' ? 0 : 1)
            };
            const idx = list.findIndex(item => item.id === formatted.id);
            if (idx > -1) {
              list[idx] = { ...list[idx], ...formatted };
            } else {
              list.unshift(formatted);
            }
          });
          return list;
        });
        if (!selectedChat && data.length > 0) {
          setSelectedChat(data[0].id);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch inbox:', err);
    }
  };

  const fetchChatMessages = async (chatId) => {
    try {
      const token = localStorage.getItem('aiva_access_token');
      if (!token) return;
      const res = await fetch(`/api/client/chats/${chatId}/messages`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const formattedMessages = data.map(msg => ({
          sender: msg.sender === 'CUSTOMER' ? 'user' : 'ai',
          text: msg.content,
          time: new Date(msg.createdAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
        }));
        setChatMessages(prev => ({
          ...prev,
          [chatId]: formattedMessages
        }));
      }
    } catch (err) {
      console.warn('Failed to fetch chat messages:', err);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('aiva_access_token');
      if (!token) return;
      const res = await fetch('/api/client/dashboard/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.warn('Failed to fetch stats:', err);
    }
  };

  const handleSendChatMessage = async () => {
    if (!chatInput.trim() || !selectedChat) return;

    if (selectedChat.startsWith('C-') && selectedChat.length <= 5) {
      const newMsg = { sender: 'agent', text: chatInput, time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) };
      setChatMessages(prev => ({
        ...prev,
        [selectedChat]: [...(prev[selectedChat] || []), newMsg]
      }));
      setChatInput('');
      return;
    }

    const messageContent = chatInput;
    setChatInput('');

    try {
      const token = localStorage.getItem('aiva_access_token');
      if (!token) return;
      const res = await fetch(`/api/client/chats/${selectedChat}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: messageContent })
      });

      if (res.ok) {
        fetchChatMessages(selectedChat);
        fetchInbox();
      }
    } catch (err) {
      console.warn('Failed to send message:', err);
    }
  };

  const handleToggleRule = async (id) => {
    try {
      const token = localStorage.getItem('aiva_access_token');
      const res = await fetch(`/api/client/rules/${id}/toggle`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchRules();
      }
    } catch (err) {
      console.warn('Failed to toggle rule:', err);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    
    // Auto-fill title with file name
    setNewKnowledge(prev => ({
      ...prev,
      title: file.name,
      content: `[ไฟล์อัปโหลด: ${file.name}]`
    }));

    if (file.name.endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewKnowledge(prev => ({
          ...prev,
          content: event.target.result
        }));
      };
      reader.readAsText(file);
    } else {
      setNewKnowledge(prev => ({
        ...prev,
        content: `[วิเคราะห์ข้อมูลจากไฟล์: ${file.name}]\n\nขนาดไฟล์: ${(file.size / 1024).toFixed(1)} KB\nประเภทไฟล์: ${file.name.split('.').pop().toUpperCase()}\n\nระบบได้ดึงข้อมูลเนื้อหาจากเอกสารดังกล่าวเพื่อใช้ในการสอน AI เรียบร้อยแล้ว.`
      }));
    }
  };

  const handleAddKnowledge = async () => {
    // If it's a PDF/Word upload but no file is selected AND title/content are also empty, block
    if (newKnowledge.type === 'pdf' && !selectedFile && (!newKnowledge.title.trim() || !newKnowledge.content.trim())) {
      showToast('กรุณาเลือกไฟล์เอกสาร หรือกรอกข้อมูลให้ครบถ้วน', 'danger');
      return;
    }
    if (newKnowledge.type !== 'pdf' && (!newKnowledge.title.trim() || !newKnowledge.content.trim())) {
      showToast('กรุณากรอกหัวข้อและเนื้อหาให้ครบถ้วน', 'danger');
      return;
    }
    
    setIsSubmittingKnowledge(true);
    let success = false;
    try {
      const token = localStorage.getItem('aiva_access_token');
      if (!token) throw new Error('Not authenticated');

      let res;
      if (selectedFile) {
        // Multipart file upload using FormData
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('type', newKnowledge.type.toUpperCase());
        formData.append('title', newKnowledge.title || selectedFile.name);
        
        // If content is already parsed or edited manually, we can pass it
        if (newKnowledge.content) {
          formData.append('content', newKnowledge.content);
        }
        
        res = await fetch('/api/client/knowledge', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
            // Note: Don't set Content-Type header when using FormData; the browser will automatically set it with boundary!
          },
          body: formData
        });
      } else {
        // Standard JSON POST
        const payload = {
          type: newKnowledge.type.toUpperCase(),
          title: newKnowledge.title,
          content: newKnowledge.content,
          sourceUrl: newKnowledge.type === 'url' ? newKnowledge.url : null,
          fileSize: 0
        };
        
        res = await fetch('/api/client/knowledge', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        fetchKnowledge();
        success = true;
        showToast('สอนข้อมูลสำเร็จเรียบร้อยแล้วค่ะ! 🧠', 'success');
      } else {
        const errData = await res.json();
        showToast(errData.error || 'บันทึกข้อมูลคลังความรู้ล้มเหลว', 'danger');
      }
    } catch (err) {
      console.warn('Backend offline, adding knowledge locally:', err);
      const newItem = {
        id: 'k-' + Date.now(),
        type: newKnowledge.type,
        name: newKnowledge.title || (selectedFile ? selectedFile.name : 'เอกสารใหม่'),
        size: selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : (newKnowledge.type === 'pdf' ? '45.2 KB' : '-'),
        date: new Date().toLocaleDateString('th-TH'),
        tokens: Math.ceil((newKnowledge.content || '').length / 4),
        status: 'Trained'
      };
      setKnowledgeList(prev => [newItem, ...prev]);
      success = true;
    } finally {
      setIsSubmittingKnowledge(false);
      if (success) {
        setShowAddKnowledge(false);
        setSelectedFile(null);
        setNewKnowledge({ type: 'text', title: '', content: '', url: '' });
      }
    }
  };

  const handleExportCSV = () => {
    if (!leadsData || leadsData.length === 0) {
      showToast('ไม่มีข้อมูลลีดสำหรับส่งออก', 'danger');
      return;
    }
    showToast('ส่งออกข้อมูลไฟล์ CSV เรียบร้อยแล้วค่ะ!', 'success');
    const headers = ['วันที่เก็บข้อมูล', 'ชื่อลูกค้า', 'ช่องทางติดต่อ', 'ความสนใจ', 'สถานะ'];
    const rows = leadsData.map(lead => [
      lead.date || new Date(lead.createdAt).toLocaleDateString('th-TH'),
      lead.name,
      lead.contact,
      lead.intent || '',
      lead.status
    ]);
    
    const csvContent = "\uFEFF"
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(','))].join('\n');
      
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `aiva_leads_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- API METHODS ---
  const fetchSettings = async () => {
    const formatPlanName = (plan) => {
      if (!plan) return 'Basic';
      const p = plan.toUpperCase();
      if (p === 'PRO') return 'Pro';
      if (p === 'ADVANCED') return 'Advanced';
      return 'Basic';
    };
    try {
      const token = localStorage.getItem('aiva_access_token');
      if (!token) return;
      const res = await fetch('/api/client/settings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const client = await res.json();
        if (client) {
          setWorkspaceSettings({
            aiName: client.aiName || 'แอดมิน AIVA',
            aiPersona: client.aiPersona || 'friendly',
            customPrompt: client.customPrompt || '',
            notifyHotLead: client.notifyHotLead !== null ? client.notifyHotLead : true,
            notifyDailyReport: client.notifyDailyReport !== null ? client.notifyDailyReport : false
          });
          setEditProfile({
            bossName: client.owner?.name || 'สมชาย ใจดี',
            bossEmail: client.owner?.email || 'owner@globaltech.com',
            brandName: client.name || 'GlobalTech Official',
            businessType: 'ecommerce'
          });
          setCurrentPlan(formatPlanName(client.plan));
        }
      }
    } catch (err) {
      console.warn('Failed to fetch settings:', err);
    }
  };

  const handleSaveSettings = async () => {
    try {
      const token = localStorage.getItem('aiva_access_token');
      if (!token) return;
      const res = await fetch('/api/client/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          brandName: editProfile.brandName,
          bossName: editProfile.bossName,
          bossEmail: editProfile.bossEmail,
          aiName: workspaceSettings.aiName,
          aiPersona: workspaceSettings.aiPersona,
          customPrompt: workspaceSettings.customPrompt,
          notifyHotLead: workspaceSettings.notifyHotLead,
          notifyDailyReport: workspaceSettings.notifyDailyReport
        })
      });
      if (res.ok) {
        setSettingsSaved(true);
        setTimeout(() => setSettingsSaved(false), 2000);
        fetchSettings();
      }
    } catch (err) {
      console.error('Failed to save settings:', err);
    }
  };

  const fetchLeads = async () => {
    try {
      const token = localStorage.getItem('aiva_access_token');
      if (!token) return;
      const res = await fetch('/api/client/leads', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const list = USE_MOCK ? [...MOCK_LEADS] : [];
        data.forEach(lead => {
          const formattedLead = {
            id: lead.id,
            name: lead.name,
            contact: lead.contact,
            intent: lead.intent || '',
            score: lead.value > 3000 ? 'Hot' : 'Warm',
            time: 'เพิ่งอัปเดต',
            value: lead.value,
            date: lead.createdAt ? (() => {
              const d = new Date(lead.createdAt);
              const day = String(d.getDate()).padStart(2, '0');
              const month = String(d.getMonth() + 1).padStart(2, '0');
              const year = d.getFullYear();
              return `${day}/${month}/${year}`;
            })() : 'เพิ่งอัปเดต',
            status: lead.stage === 'NEW' ? 'New' : lead.stage === 'CONTACTED' ? 'Contacted' : 'Converted'
          };
          const idx = list.findIndex(item => item.id === formattedLead.id || item.name === formattedLead.name);
          if (idx > -1) {
            list[idx] = { ...list[idx], ...formattedLead };
          } else {
            list.unshift(formattedLead);
          }
        });
        setLeadsData(list);
      }
    } catch (err) {
      console.warn('Failed to fetch leads from server:', err);
    }
  };

  const fetchLeadScores = async () => {
    try {
      const token = localStorage.getItem('aiva_access_token');
      if (!token) return;
      const res = await fetch('/api/client/lead-scores', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setLeadScores(data);
      }
    } catch (err) {
      console.warn('Failed to fetch lead scores:', err);
    }
  };

  const fetchLostRevenues = async () => {
    try {
      const token = localStorage.getItem('aiva_access_token');
      if (!token) return;
      const res = await fetch('/api/client/lost-revenues', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setLostRevenues(data);
      }
    } catch (err) {
      console.warn('Failed to fetch lost revenues:', err);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const token = localStorage.getItem('aiva_access_token');
      if (!token) return;
      const res = await fetch('/api/client/team', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const list = [];
        data.forEach(m => {
          const formatted = {
            id: m.id,
            name: m.name,
            email: m.email,
            role: m.role,
            status: m.status === 'ACTIVE' ? 'Active' : 'Pending',
            branch: 'All Branches'
          };
          const idx = list.findIndex(item => item.email === formatted.email);
          if (idx > -1) {
            list[idx] = { ...list[idx], ...formatted };
          } else {
            list.push(formatted);
          }
        });
        setTeamMembers(list);
      }
    } catch (err) {
      console.warn('Failed to fetch team members from server:', err);
    }
  };

  const handleAddMember = async () => {
    if(!newMember.name || !newMember.email) return;
    try {
      const token = localStorage.getItem('aiva_access_token');
      if (!token) throw new Error('Not authenticated');
      const res = await fetch('/api/client/team/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newMember.name,
          email: newMember.email,
          role: newMember.role || 'STAFF'
        })
      });
      if (res.ok) {
        fetchTeamMembers();
        showToast('ส่งคำเชิญสมาชิกทีมเรียบร้อยแล้วค่ะ!', 'success');
      } else {
        const errData = await res.json();
        showToast(errData.error || 'ไม่สามารถส่งคำเชิญสมาชิกทีมได้', 'danger');
      }
    } catch (err) {
      console.warn('Backend offline, adding team member locally:', err);
      const added = { ...newMember, id: Date.now().toString(), status: 'Pending' };
      setTeamMembers([...teamMembers, added]);
    }
    setShowAddMember(false);
    setNewMember({ name: '', email: '', role: 'ADMIN', branch: 'HQ' });
  };
  const handleRemoveMember = (id) => {
    const memberToDelete = teamMembers.find(m => m.id === id);
    if (memberToDelete?.email === currentUserObj?.email) {
      showToast('คุณไม่สามารถลบตัวเองออกจากทีมได้ค่ะ', 'danger');
      return;
    }
    setTeamMembers(teamMembers.filter(m => m.id !== id));
  };
  
  const handleAddBranch = async () => {
    if(!newBranch.name) return;
    try {
      const token = localStorage.getItem('aiva_access_token');
      const res = await fetch('/api/client/branches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newBranch.name,
          manager: newBranch.manager,
          status: newBranch.status
        })
      });
      if (res.ok) {
        fetchBranches();
        setShowAddBranch(false);
        setNewBranch({ name: '', manager: '', status: 'Active', customAi: false });
        showToast('เพิ่มสาขาใหม่เรียบร้อยแล้วค่ะ!', 'success');
      } else {
        const errData = await res.json();
        showToast(errData.error || 'ไม่สามารถเพิ่มสาขาได้', 'danger');
      }
    } catch (err) {
      console.warn('Failed to add branch:', err);
    }
  };

  const handleAddLead = async () => {
    if(!newLead.name) return;
    try {
      const token = localStorage.getItem('aiva_access_token');
      if (!token) throw new Error('Not authenticated');
      const res = await fetch('/api/client/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newLead.name,
          contact: newLead.contact || 'No contact',
          intent: newLead.intent || '',
          value: 0,
          stage: 'NEW'
        })
      });
      if (res.ok) {
        fetchLeads();
        showToast('เพิ่มข้อมูลลูกค้าใหม่เรียบร้อยแล้วค่ะ!', 'success');
      } else {
        const errData = await res.json();
        showToast(errData.error || 'ไม่สามารถเพิ่มข้อมูลลูกค้าได้', 'danger');
      }
    } catch (err) {
      console.warn('Backend offline, adding lead locally:', err);
      const added = { ...newLead, id: Date.now(), date: new Date().toLocaleDateString('th-TH') };
      setLeadsData([added, ...leadsData]);
    }
    setShowAddLead(false);
    setNewLead({ name: '', contact: '', intent: '', status: 'New' });
  };
  
  const handleGenerateFollowUpMessage = () => {
    setIsGeneratingMessage(true);
    setTimeout(() => {
      setNewRule(prev => ({
        ...prev,
        message: 'สวัสดีค่ะคุณ {ชื่อลูกค้า} 💕 สินค้ารายการ "{ชื่อสินค้า}" ที่คุณลูกค้าสอบถามไว้ ตอนนี้ใกล้จะหมดสต็อกแล้วนะคะ หากสนใจสามารถรับสิทธิ์ส่วนลดพิเศษ หรือสอบถามแอดมินเพิ่มเติมได้เลยค่ะ 🙏'
      }));
      setIsGeneratingMessage(false);
    }, 1500);
  };

  const handleCreateRule = async () => {
    if(!newRule.name || !newRule.message) return;
    try {
      const token = localStorage.getItem('aiva_access_token');
      const res = await fetch('/api/client/rules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newRule.name,
          delay: newRule.delay || '24h',
          message: newRule.message
        })
      });
      if (res.ok) {
        fetchRules();
        setShowCreateRule(false);
        setNewRule({ name: '', delay: '24h', smartTiming: false, message: '', includeCoupon: false });
        showToast('สร้างกฎการติดตามเรียบร้อยแล้วค่ะ!', 'success');
      } else {
        const errData = await res.json();
        showToast(errData.error || 'ไม่สามารถสร้างกฎการติดตามได้', 'danger');
      }
    } catch (err) {
      console.warn('Failed to create rule:', err);
    }
  };
  const handleAddDeal = async () => {
    if(!newDeal.name) return;
    try {
      const token = localStorage.getItem('aiva_access_token');
      const dbStage = newDeal.stage === 'New Leads' ? 'NEW' : newDeal.stage === 'Contacted' ? 'CONTACTED' : newDeal.stage === 'Offer' ? 'OFFER' : 'WON';
      
      const res = await fetch('/api/client/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newDeal.name,
          contact: 'No contact',
          intent: newDeal.intent || '',
          value: Number(newDeal.value) || 0,
          stage: dbStage
        })
      });
      if (res.ok) {
        fetchLeads();
        setShowAddDeal(false);
        setNewDeal({ name: '', intent: '', score: 'Warm', stage: 'New Leads', value: '' });
        showToast('เพิ่มดีลลงใน CRM Pipeline เรียบร้อยแล้วค่ะ!', 'success');
      } else {
        const errData = await res.json();
        showToast(errData.error || 'ไม่สามารถเพิ่มดีลลูกค้าได้', 'danger');
      }
    } catch (err) {
      console.warn('Failed to add deal:', err);
    }
  };
  const handleGrowthAction = () => {
    setGrowthActionLoading(true);
    setTimeout(() => {
      setGrowthActionLoading(false);
      setGrowthActionSuccess(true);
      setTimeout(() => setGrowthActionSuccess(false), 3000);
    }, 1500);
  };
  const handleConnect = (appId) => { 
    if (connectedApps.length >= maxChannels) {
      showToast(`คุณใช้โควต้าเชื่อมต่อครบแล้ว (${maxChannels} ช่องทาง) กรุณาอัปเกรดแพ็กเกจ`, 'danger');
      return;
    }
    setConnectingApp(appId); setIsAuthorizing(false); 
  };
  const fetchIntegrations = async () => {
    try {
      const token = localStorage.getItem('aiva_access_token');
      if (!token) return;
      const res = await fetch('/api/client/integrations', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setIntegrationsList(data);
        const connected = data.map(item => item.platform.toLowerCase());
        setConnectedApps(connected);
        
        // Auto-fill states if active integration already exists
        const line = data.find(i => i.platform === 'LINE');
        if (line && line.config) {
          setLineConfig({
            channelAccessToken: line.config.channelAccessToken || '',
            channelSecret: line.config.channelSecret || ''
          });
        }
        const fb = data.find(i => i.platform === 'FACEBOOK');
        if (fb && fb.config) {
          setFbConfig({
            pageAccessToken: fb.config.pageAccessToken || '',
            pageId: fb.config.pageId || ''
          });
        }
        const ig = data.find(i => i.platform === 'INSTAGRAM');
        if (ig && ig.config) {
          setIgConfig({
            pageAccessToken: ig.config.pageAccessToken || '',
            pageId: ig.config.pageId || ''
          });
        }
        const web = data.find(i => i.platform === 'WEBSITE');
        if (web && web.config) {
          setWebConfig({
            themeColor: web.config.themeColor || '#4f46e5',
            greeting: web.config.greeting || 'สวัสดีค่ะ มีอะไรให้ช่วยไหมคะ'
          });
        }
      }
    } catch (err) {
      console.warn('Failed to fetch integrations:', err);
    }
  };
  const handleOAuthPopup = (platform) => {
    const token = localStorage.getItem('aiva_access_token');
    const width = 500;
    const height = 650;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    
    window.open(
      `/api/client/integrations/oauth/${platform}?token=${token}`,
      `Connect ${platform}`,
      `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes,status=yes`
    );
  };

  const handleAuthorize = async () => {
    setIsAuthorizing(true);
    try {
      const token = localStorage.getItem('aiva_access_token');
      if (!token) throw new Error('Not authenticated');

      let config = {};
      if (connectingApp === 'line') {
        config = lineConfig;
      } else if (connectingApp === 'facebook') {
        config = fbConfig;
      } else if (connectingApp === 'instagram') {
        config = igConfig;
      } else if (connectingApp === 'website') {
        config = webConfig;
      } else {
        config = { connectedAt: new Date().toISOString() };
      }

      const res = await fetch('/api/client/integrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          platform: connectingApp.toUpperCase(),
          config
        })
      });

      if (res.ok) {
        await fetchIntegrations();
        setConnectingApp(null);
        showToast('เชื่อมต่อช่องทางเรียบร้อยแล้วค่ะ!', 'success');
      } else {
        const errData = await res.json();
        showToast(errData.error || 'ไม่สามารถบันทึกการเชื่อมต่อได้', 'danger');
      }
    } catch (err) {
      console.error('Failed to authorize integration:', err);
      // Fallback local mock
      setConnectedApps([...connectedApps, connectingApp]);
      setConnectingApp(null);
    } finally {
      setIsAuthorizing(false);
    }
  };
  const isAuthorizeDisabled = () => {
    if (isAuthorizing) return true;
    if (connectingApp === 'line') {
      return !lineConfig.channelAccessToken?.trim() || !lineConfig.channelSecret?.trim();
    }
    if (connectingApp === 'facebook') {
      return !fbConfig.pageAccessToken?.trim() || !fbConfig.pageId?.trim();
    }
    if (connectingApp === 'instagram') {
      return !igConfig.pageAccessToken?.trim() || !igConfig.pageId?.trim();
    }
    if (connectingApp === 'website') {
      return !webConfig.themeColor?.trim() || !webConfig.greeting?.trim();
    }
    return false;
  };
  const handleDisconnect = async (appId) => {
    try {
      const token = localStorage.getItem('aiva_access_token');
      if (!token) throw new Error('Not authenticated');

      const res = await fetch(`/api/client/integrations/${appId.toUpperCase()}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        await fetchIntegrations();
        setManagingApp(null);
        if (inboxPlatformFilter === PLATFORM_MAP[appId]) setInboxPlatformFilter('All');
        if (replyPlatformFilter === PLATFORM_MAP[appId]) setReplyPlatformFilter('All');
        showToast('ตัดการเชื่อมต่อเรียบร้อยแล้วค่ะ!', 'success');
      } else {
        const errData = await res.json();
        showToast(errData.error || 'ไม่สามารถตัดการเชื่อมต่อได้', 'danger');
      }
    } catch (err) {
      console.error('Failed to disconnect integration:', err);
      // Fallback local mock
      setConnectedApps(connectedApps.filter(id => id !== appId));
      setManagingApp(null);
    }
  };

  const handleGenerateContent = async () => {
    if (!contentInput) return;
    setIsGenerating(true);
    try {
      const token = localStorage.getItem('aiva_access_token');
      const res = await fetch('/api/client/ai/content-gen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          prompt: contentInput,
          platform: contentType === 'caption' ? 'Facebook' : (contentType === 'ad_copy' ? 'Ad Copy' : 'Email')
        })
      });

      if (res.ok) {
        const data = await res.json();
        setGeneratedContent(data.result || '');
        showToast('สร้างคำโฆษณาด้วย AI สำเร็จแล้วค่ะ! ✨', 'success');
      } else {
        const errData = await res.json();
        showToast(errData.error || 'ไม่สามารถสร้างเนื้อหาได้', 'danger');
      }
    } catch (err) {
      console.warn('Failed to generate content:', err);
      setGeneratedContent(`✨ ไอเท็มสุดคิวท์มาแล้ว! ใครกำลังตามหา ${contentInput.substring(0,20)}... ต้องจัดเลยน้าาา 💖 \n\nคุณภาพดี๊ดี ใช้แล้วปังแน่นอน ช้าหมดอดน้าา 🛍️\n\n👉 ทักแชทสั่งซื้อได้เลยค่ะ`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!feedbackForm.title.trim() || !feedbackForm.description.trim()) return;
    setIsSubmittingFeedback(true);
    try {
      const token = localStorage.getItem('aiva_access_token');
      const res = await fetch('/api/client/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          type: feedbackForm.type,
          title: feedbackForm.title,
          description: feedbackForm.description
        })
      });
      if (res.ok) {
        fetchFeedbacks();
        setFeedbackForm({ type: 'feature', title: '', description: '' });
        setIsSubmittingFeedback(false);
        showToast('ส่งคำแนะนำ/ติชมเรียบร้อยแล้วค่ะ! 💖', 'success');
      } else {
        const errData = await res.json();
        showToast(errData.error || 'ไม่สามารถส่งข้อเสนอแนะได้', 'danger');
        setIsSubmittingFeedback(false);
      }
    } catch (err) {
      console.warn('Failed to submit feedback:', err);
      setIsSubmittingFeedback(false);
    }
  };

  // Auto scroll chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedChat, chatMode]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchLeads();
      fetchTeamMembers();
      fetchRules();
      fetchBranches();
      fetchFeedbacks();
      fetchKnowledge();
      fetchInbox();
      fetchStats();
      fetchSettings();
      fetchIntegrations();
      fetchLeadScores();
      fetchLostRevenues();

      // Check payment redirect query params
      const params = new URLSearchParams(window.location.search);
      if (params.get('mock_payment') === 'success' || params.get('payment') === 'success') {
        window.history.replaceState({}, document.title, window.location.pathname);
        setActiveTab('billing');
        showToast('ชำระเงินสำเร็จและอัปเดตแพ็กเกจเรียบร้อยแล้วค่ะ! 🎉', 'success');
        fetchSettings();
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleOAuthMessage = (event) => {
      if (event.data && event.data.type === 'oauth-success') {
        const { platform } = event.data;
        fetchIntegrations();
        setConnectingApp(null);
      }
    };

    window.addEventListener('message', handleOAuthMessage);
    return () => {
      window.removeEventListener('message', handleOAuthMessage);
    };
  }, []);

  useEffect(() => {
    setPipelineData(leadsData);
  }, [leadsData]);

  // Auth Guard
  if (!isAuthenticated) return <PlatformAuth onLogin={() => setIsAuthenticated(true)} />;

  const handleLogout = () => {
    localStorage.removeItem('aiva_access_token');
    localStorage.removeItem('aiva_user');
    setIsAuthenticated(false);
  };

  // Render Component for Locked Features
  const UpgradeOverlay = ({ requiredPlan, title, icon: Icon, description }) => (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto animate-in fade-in zoom-in-95 duration-300">
      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 relative">
        <Icon className="w-10 h-10 text-slate-400" />
        <div className="absolute -bottom-2 -right-2 bg-rose-100 text-rose-600 p-1.5 rounded-full border-2 border-white shadow-sm">
          <Lock className="w-4 h-4" />
        </div>
      </div>
      <h2 className={`text-2xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{title}</h2>
      <p className={`text-sm mb-8 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{description}</p>
      <div className={`border rounded-2xl p-6 w-full mb-6 ${isDarkMode ? 'bg-indigo-900/20 border-indigo-500/30' : 'bg-indigo-50 border-indigo-100'}`}>
        <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-800'}`}>อัปเกรดเพื่อปลดล็อก</p>
        <p className={`text-sm font-medium mb-4 ${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>แพ็กเกจ {requiredPlan} จะช่วยให้คุณเข้าถึงฟีเจอร์นี้และสิทธิประโยชน์อื่นๆ อีกมากมาย</p>
        <button onClick={() => setActiveTab('billing')} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl transition-colors shadow-sm">
          ดูรายละเอียดแพ็กเกจ
        </button>
      </div>
    </div>
  );

  return (
    <div className={`flex h-screen overflow-hidden font-sans transition-colors duration-300 ${isDarkMode ? 'dark bg-slate-900 text-slate-200' : 'bg-[#F8FAFC] text-slate-800'}`} style={{ fontFamily: "'Anuphan', sans-serif" }}>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Anuphan:wght@300;400;500;600;700&display=swap');
        .custom-scrollbar::-webkit-scrollbar { display: none; width: 0; height: 0; }
        .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .glass-card { background: ${isDarkMode ? 'rgba(30, 41, 59, 0.7)' : 'white'}; border: 1px solid ${isDarkMode ? '#334155' : '#F1F5F9'}; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05); }
      `}} />
      
      {/* Sidebar Area */}
      <div 
        className={`fixed inset-y-0 left-0 z-30 transition-all duration-300 ease-in-out ${isSidebarVisible ? 'w-[260px] translate-x-0' : 'w-[260px] -translate-x-[250px]'}`}
        onMouseEnter={() => !isSidebarPinned && setIsSidebarHovered(true)}
        onMouseLeave={() => !isSidebarPinned && setIsSidebarHovered(false)}
      >
        <aside className={`w-full h-full flex flex-col shrink-0 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border-r shadow-xl`}>
          <div className={`h-[72px] px-6 flex items-center gap-3 border-b shrink-0 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
            <div className="bg-white p-1.5 rounded-xl flex items-center justify-center border shadow-sm">
              <img src="https://i.postimg.cc/9fvVLjRT/AIVA-Trasparent.png" alt="AIVA Logo" className="h-8 w-8 object-contain" />
            </div>
            <div className="flex flex-col">
              <span className={`text-lg font-black tracking-tight leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>AIVA</span>
              <span className={`text-[9px] font-bold tracking-widest uppercase mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{t('poweredBy')}</span>
            </div>
          </div>

          <div className="px-3 py-6 flex-1 overflow-y-auto custom-scrollbar space-y-1">
            <div className={`text-[10px] font-bold uppercase tracking-widest mb-3 px-3 mt-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{t('workspace')}</div>
            <NavItem icon={LayoutDashboard} label={t('dashboard')} isActive={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} isDark={isDarkMode} />
            <NavItem icon={BookOpen} label={t('knowledge')} isActive={activeTab === 'knowledge'} onClick={() => setActiveTab('knowledge')} isDark={isDarkMode} />
            <NavItem icon={MessageSquare} label={t('inbox')} isActive={activeTab === 'inbox'} onClick={() => setActiveTab('inbox')} badge={(() => {
              const count = inboxList.reduce((sum, chat) => {
                const platformId = Object.keys(PLATFORM_MAP).find(k => PLATFORM_MAP[k] === chat.platform);
                if (!connectedApps.includes(platformId)) return sum;
                return sum + (chat.unreadCount || 0);
              }, 0);
              return count || null;
            })()} isDark={isDarkMode} />
            <NavItem icon={MessageCircle} label={t('replycomment')} isActive={activeTab === 'replycomment'} onClick={() => setActiveTab('replycomment')} isLocked={!isProOrAbove} isDark={isDarkMode} />
            <NavItem icon={Users} label={t('leads')} isActive={activeTab === 'leads'} onClick={() => setActiveTab('leads')} isDark={isDarkMode} />
            <NavItem icon={BarChart3} label={t('pipeline')} isActive={activeTab === 'pipeline'} onClick={() => setActiveTab('pipeline')} isLocked={!isProOrAbove} isDark={isDarkMode} />
            
            <div className={`text-[10px] font-bold uppercase tracking-widest mb-3 mt-8 px-3 flex items-center gap-1.5 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-500'}`}>
              <Zap className="w-3.5 h-3.5" /> {t('extensions')}
            </div>
            <NavItem icon={Clock} label={t('followup')} isActive={activeTab === 'followup'} onClick={() => setActiveTab('followup')} isLocked={!isProOrAbove} isDark={isDarkMode} />
            <NavItem icon={Flame} label={t('leadscore')} isActive={activeTab === 'leadscore'} onClick={() => setActiveTab('leadscore')} isLocked={!isProOrAbove} isDark={isDarkMode} />
            <NavItem icon={AlertOctagon} label={t('lostrevenue')} isActive={activeTab === 'lostrevenue'} onClick={() => setActiveTab('lostrevenue')} isLocked={!isAdvancedOnly} isDark={isDarkMode} />
            <NavItem icon={LineChart} label={t('ceoreport')} isActive={activeTab === 'ceoreport'} onClick={() => setActiveTab('ceoreport')} isLocked={!isAdvancedOnly} isDark={isDarkMode} />
            <NavItem icon={Sparkles} label={t('contentgen')} isActive={activeTab === 'contentgen'} onClick={() => setActiveTab('contentgen')} isLocked={!isProOrAbove} isDark={isDarkMode} />
            <NavItem icon={Share2} label={t('socialgrowth')} isActive={activeTab === 'socialgrowth'} onClick={() => setActiveTab('socialgrowth')} isLocked={!isAdvancedOnly} isDark={isDarkMode} />
            
            <div className={`text-[10px] font-bold uppercase tracking-widest mb-3 mt-8 px-3 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{t('management')}</div>
            <NavItem icon={Store} label={t('branch')} isActive={activeTab === 'branch'} onClick={() => setActiveTab('branch')} isLocked={!isAdvancedOnly} isDark={isDarkMode} />
            <NavItem icon={Plug} label={t('integrations')} isActive={activeTab === 'integrations'} onClick={() => setActiveTab('integrations')} isDark={isDarkMode} />
            <NavItem id="btn-nav-team" icon={Users} label={t('team')} isActive={activeTab === 'team'} onClick={() => setActiveTab('team')} isDark={isDarkMode} />
            <NavItem icon={CreditCard} label={t('billing')} isActive={activeTab === 'billing'} onClick={() => setActiveTab('billing')} isDark={isDarkMode} />
            <NavItem id="btn-nav-settings" icon={Settings} label={t('settings')} isActive={activeTab === 'settings'} onClick={() => setActiveTab('settings')} isDark={isDarkMode} />
          </div>

          <div className="p-4 mt-auto">
            <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex justify-between items-center mb-2">
                <span className={`text-xs font-bold flex items-center gap-1.5 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}><MessageSquare className="w-3.5 h-3.5"/> AI Tokens</span>
                <span className={`text-[10px] font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{tokenPercentage.toFixed(0)}%</span>
              </div>
              <div className={`h-1.5 w-full rounded-full overflow-hidden mb-2 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                <div className={`h-full ${tokenPercentage > 80 ? 'bg-rose-500' : 'bg-indigo-500'}`} style={{ width: `${tokenPercentage}%` }}></div>
              </div>
              <p className={`text-[10px] text-center font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {t('tokensUsed')} {stats.tokensUsed.toLocaleString()} / {stats.tokenLimit.toLocaleString()}
              </p>
            </div>
          </div>
        </aside>
        
        {/* Toggle Pin Button */}
        {!isSidebarPinned && !isSidebarHovered && (
          <div className="absolute top-1/2 -right-4 w-4 h-16 bg-indigo-500 rounded-r-lg flex items-center justify-center cursor-pointer shadow-lg z-50" onClick={() => setIsSidebarPinned(true)}>
            <ChevronRight className="w-3 h-3 text-white" />
          </div>
        )}
      </div>

      {isSidebarPinned && <div className="w-[260px] shrink-0 transition-all duration-300"></div>}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full w-full overflow-hidden min-w-0 relative">
        <header className={`h-[72px] backdrop-blur-md flex items-center justify-between px-6 lg:px-8 shrink-0 z-10 sticky top-0 transition-colors duration-300 border-b ${isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
          <div className="flex items-center gap-3">
             <button onClick={() => setIsSidebarPinned(!isSidebarPinned)} className={`lg:hidden p-2 rounded-lg transition-colors ${isDarkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-100'}`}>
                <Menu className="w-5 h-5"/>
             </button>
             <h1 className={`text-xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                {t(activeTab)}
             </h1>
             <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
               currentPlan === 'Advanced' ? 'bg-purple-100 text-purple-700 border-purple-200' :
               currentPlan === 'Pro' ? 'bg-blue-100 text-blue-700 border-blue-200' :
               'bg-slate-100 text-slate-700 border-slate-200'
             }`}>
                {currentPlan} PLAN
             </span>
          </div>
          
          <div className="flex items-center gap-4">
            <button onClick={cycleLanguage} className={`px-2 py-1 rounded text-lg transition-colors border shadow-sm ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700' : 'bg-white border-slate-200 hover:bg-slate-50'}`} title="Change Language">
              {FLAGS[currentLang]}
            </button>
            <button id="btn-toggle-dark" onClick={() => setIsDarkMode(!isDarkMode)} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'text-amber-400 hover:bg-slate-800' : 'text-slate-400 hover:bg-slate-100'}`}>
              {isDarkMode ? <Sun className="w-5 h-5"/> : <Moon className="w-5 h-5"/>}
            </button>
            <button onClick={() => setIsSidebarPinned(!isSidebarPinned)} className={`hidden lg:block p-2 rounded-full transition-colors ${isDarkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-400 hover:bg-slate-100'}`} title="Pin/Unpin Sidebar">
              {isSidebarPinned ? <PinOff className="w-5 h-5"/> : <Pin className="w-5 h-5"/>}
            </button>
            <button className={`relative p-2 rounded-full transition-colors ${isDarkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-400 hover:bg-slate-100'}`}>
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
            </button>
            <div className={`h-8 w-px ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className={`text-sm font-bold leading-none ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{editProfile.bossName}</p>
                <p className={`text-[10px] font-medium mt-1 uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>OWNER</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold uppercase">
                {editProfile.bossName.substring(0, 2)}
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6 lg:p-8 custom-scrollbar relative z-0">
          
          {/* TAB: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
              <div className={`border rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm ${isDarkMode ? 'bg-indigo-900/30 border-indigo-500/30' : 'bg-indigo-50 border-indigo-100'}`}>
                <div className="flex items-center gap-4">
                  <div className="bg-white p-2 rounded-xl flex items-center justify-center overflow-hidden border shadow-sm">
                    <img src="https://i.postimg.cc/9fvVLjRT/AIVA-Trasparent.png" alt="AIVA Logo" className="w-12 h-12 object-contain" />
                  </div>
                  <div>
                    <h3 className={`font-bold text-sm ${isDarkMode ? 'text-indigo-300' : 'text-indigo-900'}`}>{t('aiReady')}</h3>
                    <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-indigo-400/80' : 'text-indigo-600/80'}`}>{t('aiReadyDesc')}</p>
                  </div>
                </div>
                <button onClick={() => setActiveTab('integrations')} className={`w-full sm:w-auto px-4 py-2 rounded-lg text-xs font-bold border transition-colors ${isDarkMode ? 'bg-slate-800 text-indigo-400 border-indigo-500/50 hover:bg-indigo-600 hover:text-white' : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-600 hover:text-white'}`}>
                  {t('goToIntegrations')} <ChevronRight className="w-3.5 h-3.5 inline" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard title="แชททั้งหมด (เดือนนี้)" value={stats.totalChats.toLocaleString()} icon={MessageSquare} color="blue" isDark={isDarkMode} />
                <StatCard title="AI ตอบสำเร็จ (Resolution)" value={`${stats.resolvedByAI !== undefined ? stats.resolvedByAI : (stats.totalChats > 0 ? Math.round((stats.botHandled / stats.totalChats) * 100) : 0)}%`} icon={CheckCircle2} color="emerald" isDark={isDarkMode} />
                <StatCard title={t('tokensLimit')} value={(stats.tokenLimit - stats.tokensUsed).toLocaleString()} icon={Zap} color="amber" isDark={isDarkMode} />
                <StatCard title="ช่องทางที่เชื่อมต่อ" value={connectedApps.length} icon={Plug} color="indigo" isDark={isDarkMode} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className={`lg:col-span-2 rounded-2xl p-6 glass-card ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>ปริมาณการสนทนาย้อนหลัง 7 วัน</h2>
                    <select className={`text-xs rounded-lg px-3 py-1.5 outline-none border ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}><option>สัปดาห์นี้</option><option>เดือนนี้</option></select>
                  </div>
                  <div className="h-[250px] w-full flex items-end justify-between px-2 gap-2 relative">
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6">
                      {[200, 150, 100, 50, 0].map((v, i) => <div key={i} className={`w-full border-t border-dashed h-0 flex items-center ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}><span className={`absolute -left-1 pr-2 text-[10px] font-mono -translate-y-1/2 ${isDarkMode ? 'bg-slate-800 text-slate-500' : 'bg-white text-slate-400'}`}>{v}</span></div>)}
                    </div>
                    {Array.from({length: 7}).map((_, i) => {
                      const h = Math.floor(Math.random() * 60) + 20;
                      const days = ['จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.', 'อา.'];
                      return (
                        <div key={i} className="w-full flex flex-col justify-end items-center relative group h-full pb-6 z-10">
                          <div className={`w-[60%] rounded-t-md transition-colors relative ${isDarkMode ? 'bg-indigo-500/50 hover:bg-indigo-400' : 'bg-indigo-100 hover:bg-indigo-200'}`} style={{ height: `${h}%` }}>
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">{(h * 2).toFixed(0)}</div>
                          </div>
                          <span className={`absolute bottom-0 text-[10px] font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{days[i]}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className={`rounded-2xl p-0 flex flex-col overflow-hidden glass-card ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                  <div className={`p-5 border-b flex justify-between items-center ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                    <h2 className={`text-base font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}><AlertCircle className="w-4 h-4 text-rose-500"/> AI ตอบไม่ได้ (Missing Knowledge)</h2>
                  </div>
                  <div className="flex-1 overflow-auto p-2">
                    {[
                      { query: 'มีเก็บเงินปลายทางไหมคะ?', count: 124, status: 'รอการสอน' },
                      { query: 'ส่งของผ่านขนส่งอะไรคะ?', count: 85, status: 'รอการสอน' },
                      { query: 'ขอวิธีใช้สินค้าแบบวิดีโอ', count: 42, status: 'รอการสอน' },
                    ].map((item, i) => (
                      <div key={i} className={`p-3 rounded-xl cursor-pointer transition-colors border-b last:border-0 ${isDarkMode ? 'hover:bg-slate-700/50 border-slate-700/50' : 'hover:bg-slate-50 border-slate-50'}`}>
                        <div className="flex justify-between items-start mb-2">
                          <p className={`text-xs font-bold truncate ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>"{item.query}"</p>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${isDarkMode ? 'bg-rose-500/20 text-rose-400' : 'bg-rose-50 text-rose-600'}`}>ถาม {item.count} ครั้ง</span>
                           <button onClick={() => setActiveTab('knowledge')} className="text-[10px] font-bold text-indigo-500 hover:underline flex items-center gap-1"><Plus className="w-3 h-3"/> เพิ่มคำตอบให้ AI</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: KNOWLEDGE BASE */}
          {activeTab === 'knowledge' && (
            <div className="max-w-5xl mx-auto animate-in fade-in duration-300 flex flex-col h-full">
              <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
                <div>
                  <h2 className={`text-2xl font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}><BookOpen className="w-6 h-6 text-indigo-600" /> {t('knowledge')}</h2>
                  <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>สอน AI ให้รู้จักธุรกิจของคุณ โดยการอัปโหลดไฟล์ PDF, พิมพ์ข้อความ หรือใส่ลิงก์เว็บไซต์</p>
                </div>
                <div className={`px-4 py-2 rounded-xl text-center border ${isDarkMode ? 'bg-indigo-900/30 border-indigo-500/30' : 'bg-indigo-50 border-indigo-100'}`}>
                  <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider mb-0.5">ข้อมูลที่เทรนแล้ว</p>
                  <p className={`text-lg font-black ${isDarkMode ? 'text-indigo-300' : 'text-indigo-900'}`}>{knowledgeList.length} <span className={`text-sm font-medium ${isDarkMode ? 'text-indigo-400' : 'text-indigo-700'}`}>รายการ</span></p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 shrink-0">
                <button onClick={() => { setShowAddKnowledge(true); setNewKnowledge({ type: 'pdf', title: '', content: '', url: '' }); }} className={`hover:border-indigo-400 hover:shadow-lg transition-all p-6 rounded-2xl flex flex-col items-center justify-center text-center group cursor-pointer h-40 border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${isDarkMode ? 'bg-rose-500/20 text-rose-400' : 'bg-rose-50 text-rose-500'}`}><FileText className="w-6 h-6" /></div>
                  <h3 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>อัปโหลดไฟล์ PDF / Word</h3>
                  <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>คู่มือ, แคตตาล็อก, นโยบายบริษัท</p>
                </button>
                <button onClick={() => { setShowAddKnowledge(true); setNewKnowledge({ type: 'url', title: '', content: '', url: '' }); }} className={`hover:border-indigo-400 hover:shadow-lg transition-all p-6 rounded-2xl flex flex-col items-center justify-center text-center group cursor-pointer h-40 border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-500'}`}><LinkIcon className="w-6 h-6" /></div>
                  <h3 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>ดึงข้อมูลจากเว็บไซต์ (URL)</h3>
                  <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>หน้า FAQ, หน้าสินค้าบนเว็บ</p>
                </button>
                <button onClick={() => { setShowAddKnowledge(true); setNewKnowledge({ type: 'text', title: '', content: '', url: '' }); }} className={`hover:border-indigo-400 hover:shadow-lg transition-all p-6 rounded-2xl flex flex-col items-center justify-center text-center group cursor-pointer h-40 border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${isDarkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-50 text-amber-500'}`}><MessageSquare className="w-6 h-6" /></div>
                  <h3 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>พิมพ์ข้อความโดยตรง (Text)</h3>
                  <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>โปรโมชั่นด่วน, ถาม-ตอบสั้นๆ</p>
                </button>
              </div>

              <div className={`rounded-2xl flex flex-col flex-1 overflow-hidden border shadow-sm ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} min-h-0`}>
                <div className={`p-4 border-b flex justify-between items-center shrink-0 ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50/50 border-slate-100'}`}>
                  <h3 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>รายการข้อมูลในสมอง AI</h3>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" placeholder="ค้นหาชื่อไฟล์..." value={knowledgeSearch} onChange={(e) => setKnowledgeSearch(e.target.value)} className={`text-sm rounded-lg pl-9 pr-3 py-1.5 outline-none focus:border-indigo-500 w-64 border ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-800'}`} />
                  </div>
                </div>
                <div className="overflow-auto custom-scrollbar flex-1 p-0">
                  <table className="w-full text-left text-sm table-fixed min-w-[700px]">
                    <thead className={`text-[10px] uppercase tracking-widest font-bold border-b sticky top-0 z-10 ${isDarkMode ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-white text-slate-500 border-slate-100'}`}>
                      <tr>
                        <th className="px-4 py-3 w-[45%]">ชื่อข้อมูล / แหล่งที่มา</th>
                        <th className="px-4 py-3 w-[15%] text-center">ขนาด</th>
                        <th className="px-4 py-3 w-[15%] text-center">วันที่อัปเดต</th>
                        <th className="px-4 py-3 w-[10%] text-center">Tokens</th>
                        <th className="px-4 py-3 w-[15%] text-center">สถานะ AI</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isDarkMode ? 'divide-slate-700/50' : 'divide-slate-100'}`}>
                      {knowledgeList.filter(item => item.name.toLowerCase().includes(knowledgeSearch.toLowerCase())).map((item) => (
                        <tr key={item.id} className={`transition-colors ${isDarkMode ? 'hover:bg-slate-700/30' : 'hover:bg-slate-50'}`}>
                          <td className="px-4 py-3 overflow-hidden">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg shrink-0 ${
                                item.type === 'pdf' ? (isDarkMode ? 'bg-rose-500/20' : 'bg-rose-50') : 
                                item.type === 'url' ? (isDarkMode ? 'bg-blue-500/20' : 'bg-blue-50') : 
                                (isDarkMode ? 'bg-amber-500/20' : 'bg-amber-50')
                              }`}>
                                {item.type === 'pdf' && <FileText className={`w-4 h-4 ${isDarkMode ? 'text-rose-400' : 'text-rose-500'}`} />}
                                {item.type === 'url' && <LinkIcon className={`w-4 h-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />}
                                {item.type === 'text' && <MessageSquare className={`w-4 h-4 ${isDarkMode ? 'text-amber-400' : 'text-amber-500'}`} />}
                              </div>
                              <span className={`font-bold truncate w-full block ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{item.name}</span>
                            </div>
                          </td>
                          <td className={`px-4 py-3 text-center text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{item.size}</td>
                          <td className={`px-4 py-3 text-center text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{item.date}</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>{item.tokens}</span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            {item.status === 'Trained' ? (
                              <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full border ${isDarkMode ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'text-emerald-600 bg-emerald-50 border-emerald-200'}`}>
                                <CheckCircle2 className="w-3 h-3"/> เรียนรู้แล้ว
                              </span>
                            ) : (
                              <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full border ${isDarkMode ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'text-amber-600 bg-amber-50 border-amber-200'}`}>
                                <RefreshCw className="w-3 h-3 animate-spin"/> Training
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: INBOX */}
          {activeTab === 'inbox' && (() => {
            const visibleChats = inboxList.filter(chat => {
              const platformId = Object.keys(PLATFORM_MAP).find(k => PLATFORM_MAP[k] === chat.platform);
              const isConnected = connectedApps.includes(platformId);
              if (!isConnected) return false;
              if (inboxSearch.trim() !== '') {
                const searchLower = inboxSearch.toLowerCase();
                if (!chat.user?.toLowerCase().includes(searchLower) && !chat.query?.toLowerCase().includes(searchLower)) return false;
              }
              return inboxPlatformFilter === 'All' || chat.platform === inboxPlatformFilter;
            });
            const activeChat = visibleChats.find(c => c.id === selectedChat);

            return (
              <div className="max-w-6xl mx-auto h-full flex flex-col animate-in fade-in duration-300">
                
                <div className="mb-4 shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className={`text-2xl font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                      <MessageSquare className="w-6 h-6 text-indigo-600" /> {t('inbox')}
                    </h2>
                  </div>
                  <div className={`flex items-center gap-1.5 p-1.5 rounded-xl border shadow-sm shrink-0 overflow-x-auto custom-scrollbar ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                    {['All', ...connectedApps.filter(id => ['line', 'facebook', 'instagram', 'website'].includes(id)).map(id => PLATFORM_MAP[id])].map(platform => (
                      <div key={platform} className="group relative">
                        <button
                          onClick={() => setInboxPlatformFilter(platform)}
                          className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                            inboxPlatformFilter === platform
                              ? 'bg-indigo-600 text-white shadow-sm'
                              : (isDarkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50')
                          }`}
                        >
                          {platform === 'All' ? 'ทั้งหมด (All)' : platform}
                        </button>
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-md">
                          {platform === 'All' ? 'แสดงข้อความทุกช่องทาง' : `กรองแสดงช่องทาง ${platform}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`flex-1 flex rounded-2xl overflow-hidden border shadow-sm min-h-0 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                  
                  <div className={`w-80 flex flex-col border-r shrink-0 ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                    <div className={`p-4 border-b flex items-center gap-2 shrink-0 ${isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-100 bg-slate-50'}`}>
                      <Search className="w-4 h-4 text-slate-400" />
                      <input type="text" placeholder="ค้นหาชื่อลูกค้า..." value={inboxSearch} onChange={(e) => setInboxSearch(e.target.value)} className={`w-full bg-transparent border-none text-sm outline-none ${isDarkMode ? 'text-slate-200 placeholder:text-slate-500' : 'text-slate-800'}`} />
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                      {visibleChats.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400 py-10 opacity-70">
                          <MessageSquare className="w-8 h-8 mb-2" />
                          <p className="text-xs font-bold">ไม่มีข้อความในช่องทางนี้</p>
                        </div>
                      ) : (
                        visibleChats.map((chat) => (
                          <div 
                            key={chat.id} 
                            onClick={() => {
                              setSelectedChat(chat.id);
                              if(chat.status === 'Handover') setChatMode('human');
                              else setChatMode('ai');
                              // Clear unread count when chat is clicked
                              setInboxList(prev => prev.map(item => item.id === chat.id ? { ...item, unreadCount: 0 } : item));
                            }}
                            className={`p-3 rounded-xl cursor-pointer transition-colors border ${
                              selectedChat === chat.id 
                                ? (isDarkMode ? 'bg-indigo-500/20 border-indigo-500/30' : 'bg-indigo-50 border-indigo-100') 
                                : (isDarkMode ? 'border-transparent hover:bg-slate-700/50' : 'border-transparent hover:bg-slate-50')
                            }`}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <div className={`flex items-center gap-1.5 text-xs font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white ${
                                  chat.platform === 'Line OA' ? 'bg-[#00B900]' : 
                                  chat.platform === 'Facebook' ? 'bg-[#0084FF]' : 
                                  chat.platform === 'Instagram' ? 'bg-gradient-to-tr from-amber-500 to-purple-600' : 'bg-slate-800'
                                }`}>
                                  {chat.user.charAt(0)}
                                </div>
                                {chat.user}
                              </div>
                              <div className="flex flex-col items-end gap-1 shrink-0">
                                <span className="text-[10px] text-slate-400 font-medium">{chat.time}</span>
                                {chat.unreadCount > 0 && (
                                  <span className="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full min-w-[16px] h-4 flex items-center justify-center shadow-sm animate-pulse">
                                    {chat.unreadCount}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="pl-10">
                              <p className={`text-xs truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                {chat.status === 'AI Replied' ? <Bot className="w-3 h-3 inline mr-1 text-emerald-500"/> : <AlertCircle className="w-3 h-3 inline mr-1 text-rose-500"/>}
                                "{chat.query}"
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className={`flex-1 flex flex-col min-w-0 ${isDarkMode ? 'bg-slate-900/50' : 'bg-slate-50/50'}`}>
                    {!activeChat ? (
                      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto animate-in fade-in zoom-in-95 duration-500">
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 relative ${isDarkMode ? 'bg-slate-800' : 'bg-white'} shadow-md border ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                          <MessageSquare className="w-10 h-10 text-indigo-500 animate-pulse" />
                        </div>
                        <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                          {inboxPlatformFilter === 'All' ? 'ยินดีต้อนรับสู่ AIVA Inbox' : `ช่องทาง ${inboxPlatformFilter}`}
                        </h3>
                        <p className={`text-sm mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          {visibleChats.length === 0 
                            ? 'ยังไม่มีการสนทนาใหม่ในระบบ หรือการเชื่อมต่อยังไม่เริ่มต้น'
                            : 'กรุณาเลือกรายการห้องสนทนาทางด้านซ้ายมือเพื่อเริ่มต้นพูดคุยหรือจัดการ'}
                        </p>
                        {visibleChats.length === 0 && (
                          <button
                            onClick={() => setActiveTab('integrations')}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] text-xs flex items-center gap-2"
                          >
                            <Plug className="w-4 h-4" /> ไปหน้าตั้งค่าการเชื่อมต่อ
                          </button>
                        )}
                      </div>
                    ) : (
                      <>
                        <div className={`h-16 px-6 border-b flex items-center justify-between shrink-0 backdrop-blur-sm ${isDarkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white/80 border-slate-100'}`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-500'}`}>
                              {activeChat.user.charAt(0)}
                            </div>
                            <div>
                              <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{activeChat.user}</h3>
                              <p className="text-[10px] text-slate-400">ผ่านช่องทาง {activeChat.platform}</p>
                            </div>
                          </div>
                          
                          <div className={`flex items-center p-1 rounded-xl border ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
                            <div className="group relative">
                              <button 
                                onClick={() => setChatMode('ai')}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${chatMode === 'ai' ? (isDarkMode ? 'bg-slate-700 text-emerald-400 shadow-sm' : 'bg-white text-emerald-600 shadow-sm') : (isDarkMode ? 'text-slate-400 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600')}`}
                              >
                                <Bot className="w-3.5 h-3.5" /> AI กำลังดูแล
                              </button>
                              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-md">
                                สลับให้บอท AI ช่วยตอบอัตโนมัติ
                              </span>
                            </div>
                            <div className="group relative">
                              <button 
                                onClick={() => setChatMode('human')}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${chatMode === 'human' ? 'bg-rose-500 text-white shadow-sm' : (isDarkMode ? 'text-slate-400 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600')}`}
                              >
                                <Users className="w-3.5 h-3.5" /> แอดมินตอบเอง
                              </button>
                              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-md">
                                ปิดระบบบอทชั่วคราวและพิมพ์แชตเอง
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                          <div className="text-center mb-6">
                            <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-500'}`}>วันนี้ 10:00 AM</span>
                          </div>

                          {(chatMessages[selectedChat] || (USE_MOCK ? MOCK_CHATS[selectedChat] : []) || []).map((msg, idx) => (
                            <div key={idx} className={`flex items-start gap-3 max-w-[90%] ${msg.sender === 'user' ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}>
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-xs ${
                                msg.sender === 'user' 
                                  ? (isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-500') 
                                  : (isDarkMode ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-indigo-100 text-indigo-600 border border-indigo-200')
                              }`}>
                                {msg.sender === 'user' ? 'C' : <Bot className="w-4 h-4"/>}
                              </div>
                              <div className={`flex flex-col gap-2 ${msg.sender === 'user' ? 'items-start' : 'items-end'}`}>
                                {msg.text && (
                                  <div className={`px-4 py-3 rounded-2xl text-sm shadow-sm whitespace-pre-wrap leading-relaxed ${
                                    msg.sender === 'user' 
                                      ? (isDarkMode ? 'bg-slate-700 text-slate-100 rounded-tl-sm' : 'bg-white text-slate-700 border border-slate-100 rounded-tl-sm') 
                                      : (isDarkMode ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-indigo-600 text-white rounded-tr-sm')
                                  }`}>
                                    {msg.text}
                                  </div>
                                )}
                                {msg.image && (
                                  <div className={`rounded-2xl overflow-hidden shadow-sm max-w-[200px] border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'} ${msg.sender === 'user' ? 'rounded-tl-sm' : 'rounded-tr-sm'}`}>
                                    <img src={msg.image} alt="attachment" className="w-full h-auto object-cover" />
                                  </div>
                                )}
                                {msg.buttons && (
                                  <div className={`flex flex-wrap gap-2 ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}>
                                    {msg.buttons.map((btn, i) => (
                                      <button key={i} className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors shadow-sm ${isDarkMode ? 'bg-slate-800 border-indigo-500/40 text-indigo-400 hover:bg-slate-700' : 'bg-white border-indigo-200 text-indigo-600 hover:bg-indigo-50'}`}>
                                        {btn}
                                      </button>
                                    ))}
                                  </div>
                                )}
                                {msg.carousel && (
                                  <div className={`flex gap-3 overflow-x-auto custom-scrollbar pb-2 max-w-[320px] ${msg.sender === 'user' ? 'flex-row' : 'flex-row-reverse'}`}>
                                    {msg.carousel.map((item, i) => (
                                      <div key={i} className={`flex-shrink-0 w-36 rounded-2xl overflow-hidden border shadow-sm flex flex-col ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                                        <img src={item.image} alt={item.title} className="w-full h-36 object-cover" />
                                        <div className="p-3 flex flex-col flex-1">
                                          <p className={`text-xs font-bold truncate ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{item.title}</p>
                                          <p className="text-[11px] text-indigo-500 font-black mt-0.5 mb-2">{item.price}</p>
                                          <button className={`w-full py-1.5 mt-auto rounded-lg text-[10px] font-bold transition-colors ${isDarkMode ? 'bg-indigo-500 text-white hover:bg-indigo-400' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}>ดูรายละเอียด</button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                <span className="text-[9px] text-slate-400 px-1">{msg.sender === 'ai' && <Bot className="w-3 h-3 inline mr-0.5 opacity-50"/>}{msg.time}</span>
                              </div>
                            </div>
                          ))}
                          <div ref={chatEndRef} />
                        </div>

                        <div className={`p-4 border-t ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                          {chatMode === 'ai' ? (
                            <div className={`text-center p-3 rounded-xl border border-dashed ${isDarkMode ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-emerald-50 border-emerald-300'}`}>
                              <p className={`text-xs font-bold flex items-center justify-center gap-1.5 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}><Bot className="w-4 h-4"/> AI กำลังดูแลการสนทนานี้ แอดมินสามารถดูได้อย่างเดียว</p>
                              <p className={`text-[10px] mt-1 ${isDarkMode ? 'text-emerald-500/70' : 'text-emerald-600/70'}`}>สลับเป็นโหมด 'แอดมินตอบเอง' ด้านบน หากต้องการพิมพ์ข้อความ</p>
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <input 
                                type="text" 
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                                placeholder="พิมพ์ข้อความตอบกลับลูกค้า..." 
                                className={`flex-1 border rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 ${isDarkMode ? 'bg-slate-800 border-slate-600 text-slate-200 placeholder:text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-800'}`} 
                              />
                              <div className="group relative flex">
                                <button onClick={handleSendChatMessage} className={`px-5 py-3 rounded-xl shadow-sm transition-colors flex items-center justify-center ${isDarkMode ? 'bg-indigo-500 hover:bg-indigo-400 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}><Send className="w-4 h-4" /></button>
                                <span className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-md">
                                  ส่งข้อความ (Enter)
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
          {/* TAB: REPLY COMMENT */}
          {activeTab === 'replycomment' && (
            <div className="max-w-6xl mx-auto h-full flex flex-col animate-in fade-in duration-300">
              {isProOrAbove ? (
                <>
                  <div className="mb-6 shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h2 className={`text-2xl font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                        <MessageCircle className="w-6 h-6 text-indigo-600" /> {t('replycomment')}
                      </h2>
                      <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        ให้ AI ช่วยตอบคอมเมนต์หน้าเพจและตอบกลับรีวิวอัตโนมัติ เพื่อรักษา Engagement และคะแนนร้านค้า
                      </p>
                    </div>
                    <button onClick={() => setShowReplySettings(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm flex items-center gap-2 transition-colors">
                      <Settings className="w-4 h-4"/> ตั้งค่าการตอบกลับ
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0 mb-6">
                     <StatCard title="คอมเมนต์ที่ตอบแล้ว" value="3,420" icon={MessageSquare} color="blue" isDark={isDarkMode} />
                     <StatCard title="รีวิว 5 ดาวที่ตอบกลับ" value="845" icon={Star} color="amber" isDark={isDarkMode} />
                     <StatCard title="คำหยาบ/สแปม ที่ถูกซ่อน" value="12" icon={AlertOctagon} color="rose" isDark={isDarkMode} />
                  </div>

                  <div className={`rounded-2xl border shadow-sm flex flex-col flex-1 overflow-hidden min-h-0 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                    <div className={`p-4 border-b flex justify-between items-center shrink-0 ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50/50 border-slate-100'}`}>
                      <h3 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>ประวัติการตอบกลับล่าสุด (Recent Activity)</h3>
                      <div className="flex gap-2">
                         <select 
                           value={replyPlatformFilter}
                           onChange={(e) => setReplyPlatformFilter(e.target.value)}
                           className={`text-xs border rounded-lg px-3 py-1.5 outline-none font-bold shadow-sm ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-700'}`}
                         >
                           <option value="All">ทุกช่องทาง (All)</option>
                           {connectedApps.includes('facebook') && <option value=""></option>}
                           {connectedApps.includes('instagram') && <option value=""></option>}
                           {connectedApps.includes('lazada') && <option value="Lazada">Lazada</option>}
                           {connectedApps.includes('tiktok') && <option value="TikTok Shop">TikTok Shop</option>}
                           {connectedApps.includes('youtube') && <option value="YouTube Comments">YouTube</option>}
                         </select>
                      </div>
                    </div>
                    <div className="overflow-auto custom-scrollbar flex-1 p-0">
                      <table className="w-full text-left text-sm table-fixed min-w-[800px]">
                        <thead className={`text-[10px] uppercase tracking-widest font-bold border-b sticky top-0 z-10 ${isDarkMode ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-white text-slate-500 border-slate-100'}`}>
                          <tr>
                            <th className="px-4 py-3 w-[15%]">ช่องทาง</th>
                            <th className="px-4 py-3 w-[35%]">ลูกค้า (ข้อความต้นทาง)</th>
                            <th className="px-4 py-3 w-[35%]">AI ตอบกลับ</th>
                            <th className="px-4 py-3 w-[15%] text-center">เวลา</th>
                          </tr>
                        </thead>
                        <tbody className={`divide-y ${isDarkMode ? 'divide-slate-700/50' : 'divide-slate-100'}`}>
                          {[
                            { platform: 'Facebook', icon: Facebook, color: 'text-blue-500', user: 'Khun Praew', comment: 'ชุดนี้มีสีขาวไหมคะ?', aiReply: 'สวัสดีค่ะคุณ Khun Praew 🙏 ชุดนี้มีสีขาวพร้อมส่งไซส์ S และ M ค่ะ สนใจรับไซส์ไหนแจ้งใน Inbox ได้เลยนะคะ 💕', time: '5 นาทีที่แล้ว', isReview: false },
                            { platform: 'Lazada', icon: ShoppingCart, color: 'text-indigo-800', user: 'User998', comment: 'ส่งของไวมาก แพ็คเกจดีเยี่ยม', aiReply: 'ขอบคุณมากค่ะสำหรับรีวิว 5 ดาว ⭐️ โอกาสหน้าเชิญแวะมาช้อปปิ้งกับเราใหม่นะคะ!', time: '1 ชม. ที่แล้ว', isReview: true, rating: 5 },
                            { platform: 'Instagram', icon: Instagram, color: 'text-pink-500', user: 'MewMew', comment: 'ราคาเท่าไหร่คะ?', aiReply: 'สวัสดีค่ะ รุ่นนี้ราคา 1,290 บาท จัดส่งฟรีค่ะ แอดมินส่งรายละเอียดเพิ่มเติมให้ทาง DM แล้วนะคะ 🥰', time: '3 ชม. ที่แล้ว', isReview: false },
                            { platform: 'Facebook', icon: Facebook, color: 'text-blue-500', user: 'Spammer', comment: 'รับสมัครคนกดไลค์คลิป รายได้ดี แอดไลน์ @xyz', aiReply: '[ ซ่อนคอมเมนต์อัตโนมัติ ]', time: '5 ชม. ที่แล้ว', isReview: false, hidden: true }
                          ].filter(item => {
                            const platformId = Object.keys(PLATFORM_MAP).find(k => PLATFORM_MAP[k] === item.platform);
                            const isConnected = connectedApps.includes(platformId);
                            if (!isConnected) return false;
                            return replyPlatformFilter === 'All' || item.platform === replyPlatformFilter;
                          }).map((item, i) => (
                            <tr key={i} className={`transition-colors ${isDarkMode ? 'hover:bg-slate-700/30' : 'hover:bg-slate-50'}`}>
                              <td className="px-4 py-4">
                                <div className="flex items-center gap-2">
                                  <div className={`p-1.5 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'} ${item.color}`}>
                                    <item.icon className="w-4 h-4" />
                                  </div>
                                  <span className={`font-bold text-xs ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{item.platform}</span>
                                </div>
                              </td>
                              <td className="px-4 py-4 overflow-hidden">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`font-bold text-xs ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{item.user}</span>
                                  {item.isReview && <div className="flex text-amber-400"><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 fill-current"/></div>}
                                </div>
                                <p className={`text-xs truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>"{item.comment}"</p>
                              </td>
                              <td className="px-4 py-4 overflow-hidden">
                                <div className="flex items-start gap-2">
                                  <Bot className={`w-4 h-4 shrink-0 mt-0.5 ${item.hidden ? 'text-rose-500' : 'text-indigo-500'}`} />
                                  <p className={`text-xs leading-relaxed line-clamp-2 ${item.hidden ? 'text-rose-500 font-bold' : (isDarkMode ? 'text-indigo-300' : 'text-indigo-800')}`}>{item.aiReply}</p>
                                </div>
                              </td>
                              <td className="px-4 py-4 text-center text-xs font-medium text-slate-400">{item.time}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {showReplySettings && (
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                      <div className={`rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                        <div className={`p-5 border-b flex justify-between items-center ${isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-100 bg-slate-50'}`}>
                          <h3 className={`font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            <Settings className="w-5 h-5 text-indigo-500" /> ตั้งค่า AI Reply
                          </h3>
                          <button onClick={() => setShowReplySettings(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
                        </div>
                        <div className="p-6 space-y-6">
                          
                          <div className="space-y-4">
                            <div className={`p-4 rounded-xl border flex items-center justify-between ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                              <div>
                                <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>ตอบกลับคอมเมนต์ (Social Media)</p>
                                <p className={`text-[10px] mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>ตอบกลับโพสต์บน IG อัตโนมัติ</p>
                              </div>
                              <div onClick={() => setReplySettings({...replySettings, autoReplyComments: !replySettings.autoReplyComments})} className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${replySettings.autoReplyComments ? 'bg-emerald-500' : (isDarkMode ? 'bg-slate-600' : 'bg-slate-300')}`}>
                                <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${replySettings.autoReplyComments ? 'translate-x-5' : 'translate-x-1'}`}></div>
                              </div>
                            </div>

                            <div className={`p-4 rounded-xl border flex items-center justify-between ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                              <div>
                                <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>ตอบกลับรีวิวลูกค้า (Marketplace)</p>
                                <p className={`text-[10px] mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>ตอบขอบคุณรีวิวบน Shopee, Lazada แบบออโต้</p>
                              </div>
                              <div onClick={() => setReplySettings({...replySettings, autoReplyReviews: !replySettings.autoReplyReviews})} className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${replySettings.autoReplyReviews ? 'bg-emerald-500' : (isDarkMode ? 'bg-slate-600' : 'bg-slate-300')}`}>
                                <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${replySettings.autoReplyReviews ? 'translate-x-5' : 'translate-x-1'}`}></div>
                              </div>
                            </div>

                            <div className={`p-4 rounded-xl border flex items-center justify-between ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                              <div>
                                <p className={`text-sm font-bold flex items-center gap-1.5 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>ซ่อนคอมเมนต์สแปม/คำหยาบ <AlertOctagon className="w-3.5 h-3.5 text-rose-500"/></p>
                                <p className={`text-[10px] mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>ให้ AI กรองและซ่อนคอมเมนต์ที่ไม่เหมาะสมให้อัตโนมัติ</p>
                              </div>
                              <div onClick={() => setReplySettings({...replySettings, hideSpam: !replySettings.hideSpam})} className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${replySettings.hideSpam ? 'bg-indigo-500' : (isDarkMode ? 'bg-slate-600' : 'bg-slate-300')}`}>
                                <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${replySettings.hideSpam ? 'translate-x-5' : 'translate-x-1'}`}></div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className={`text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>คำสั่งเฉพาะให้ AI (System Prompt)</label>
                            <textarea 
                              rows="3" 
                              value={replySettings.aiTone}
                              onChange={(e) => setReplySettings({...replySettings, aiTone: e.target.value})}
                              placeholder="เช่น ให้ AI ลงท้ายด้วยคำว่า 'นะคะ' เสมอ..."
                              className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 resize-none ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-800'}`}
                            />
                            <p className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>AI จะพยายามใช้บริบทหรือลักษณะภาษาตามที่คุณพิมพ์ไว้ที่นี่เพื่อตอบกลับลูกค้า</p>
                          </div>

                          <button onClick={() => setShowReplySettings(false)} className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm">
                            บันทึกการตั้งค่า
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <UpgradeOverlay requiredPlan="Pro" title="AI Reply Comment" icon={MessageCircle} description="ให้ AI ช่วยตอบคอมเมนต์บนโพสต์และรีวิวอัตโนมัติ เพื่อรักษา Engagement" />
              )}
            </div>
          )}

          {/* TAB: LEADS */}
          {activeTab === 'leads' && (
            <div className="max-w-6xl mx-auto h-full flex flex-col animate-in fade-in duration-300">
              <div className="mb-6 shrink-0 flex justify-between items-end">
                <div>
                  <h2 className={`text-2xl font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}><Users className="w-6 h-6 text-indigo-600" /> ข้อมูลลูกค้า (Leads)</h2>
                  <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>ฐานข้อมูลลูกค้าที่ AI ช่วยรวบรวมเบอร์โทรศัพท์และสิ่งที่สนใจจากบทสนทนา</p>
                </div>
              </div>

              <div className={`rounded-2xl flex flex-col flex-1 overflow-hidden border shadow-sm ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} min-h-0`}>
                <div className={`p-4 border-b flex justify-between items-center shrink-0 ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50/50 border-slate-100'}`}>
                  <div className="relative w-64">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" placeholder="ค้นหาชื่อ, เบอร์โทร..." value={leadsSearch} onChange={(e) => setLeadsSearch(e.target.value)} className={`text-sm rounded-lg pl-9 pr-3 py-2 outline-none focus:border-indigo-500 w-full border ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-800'}`} />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setShowAddLead(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5"><Plus className="w-3.5 h-3.5"/> เพิ่มข้อมูลลูกค้า</button>
                    <button onClick={handleExportCSV} className={`px-4 py-2 rounded-lg text-xs font-bold border transition-colors ${isDarkMode ? 'bg-slate-800 text-slate-300 border-slate-600 hover:bg-slate-700' : 'bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-100'}`}>Export CSV</button>
                  </div>
                </div>
                
                <div className="overflow-auto custom-scrollbar flex-1 p-0">
                  <table className="w-full text-left text-sm table-fixed min-w-[700px]">
                    <thead className={`text-[10px] uppercase tracking-widest font-bold border-b sticky top-0 z-10 ${isDarkMode ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-white text-slate-500 border-slate-100'}`}>
                      <tr>
                        <th className="px-4 py-3 w-[15%]">วันที่เก็บข้อมูล</th>
                        <th className="px-4 py-3 w-[20%]">ชื่อลูกค้า</th>
                        <th className="px-4 py-3 w-[20%]">ช่องทางติดต่อ</th>
                        <th className="px-4 py-3 w-[30%] text-center">ความสนใจ (INTENT)</th>
                        <th className="px-4 py-3 w-[15%] text-center">สถานะ</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isDarkMode ? 'divide-slate-700/50' : 'divide-slate-100'}`}>
                      {leadsData.filter(lead => lead.name.toLowerCase().includes(leadsSearch.toLowerCase()) || lead.contact.toLowerCase().includes(leadsSearch.toLowerCase())).map((lead) => (
                        <tr key={lead.id} className={`transition-colors ${isDarkMode ? 'hover:bg-slate-700/30' : 'hover:bg-slate-50'}`}>
                          <td className={`px-4 py-3 text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{lead.date}</td>
                          <td className={`px-4 py-3 font-bold truncate ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{lead.name}</td>
                          <td className={`px-4 py-3 text-xs font-mono ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                            {lead.contact.includes('@') ? <Mail className="w-3.5 h-3.5 inline mr-1.5 text-slate-400"/> : <Phone className="w-3.5 h-3.5 inline mr-1.5 text-slate-400"/>}
                            {lead.contact}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-bold truncate w-full max-w-full ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>{lead.intent}</span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <select
                              value={lead.status}
                              onChange={(e) => {
                                const newStatus = e.target.value;
                                setLeadsData(prev => prev.map(l => l.id === lead.id ? { ...l, status: newStatus } : l));
                              }}
                              className={`text-[10px] font-bold px-2.5 py-1 rounded-full border outline-none focus:ring-1 focus:ring-indigo-500/30 cursor-pointer ${
                                lead.status === 'Converted' ? (isDarkMode ? 'bg-emerald-950 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border-emerald-100') :
                                lead.status === 'New' ? (isDarkMode ? 'bg-rose-950 text-rose-400 border-rose-500/20' : 'bg-rose-50 text-rose-600 border-rose-100') :
                                (isDarkMode ? 'bg-amber-950 text-amber-400 border-amber-500/20' : 'bg-amber-50 text-amber-600 border-amber-100')
                              }`}
                            >
                              <option value="New">New</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Converted">Converted</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Add Lead Modal */}
              {showAddLead && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className={`rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                    <div className={`p-5 border-b flex justify-between items-center ${isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-100 bg-slate-50'}`}>
                      <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>เพิ่มข้อมูลลูกค้าใหม่</h3>
                      <button onClick={() => setShowAddLead(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="space-y-1.5">
                        <label className={`text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>ชื่อลูกค้า</label>
                        <input type="text" value={newLead.name} onChange={(e)=>setNewLead({...newLead, name: e.target.value})} className={`w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500 ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-200 placeholder:text-slate-500' : 'bg-white border-slate-200 text-slate-800'}`} />
                      </div>
                      <div className="space-y-1.5">
                        <label className={`text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>เบอร์โทรศัพท์ / อีเมล</label>
                        <input type="text" value={newLead.contact} onChange={(e)=>setNewLead({...newLead, contact: e.target.value})} className={`w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500 ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-200 placeholder:text-slate-500' : 'bg-white border-slate-200 text-slate-800'}`} />
                      </div>
                      <div className="space-y-1.5">
                        <label className={`text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>ความสนใจ (Intent)</label>
                        <input type="text" value={newLead.intent} onChange={(e)=>setNewLead({...newLead, intent: e.target.value})} className={`w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500 ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-200 placeholder:text-slate-500' : 'bg-white border-slate-200 text-slate-800'}`} />
                      </div>
                      <button onClick={handleAddLead} className="w-full bg-indigo-600 text-white font-bold py-2.5 rounded-xl mt-4">บันทึกข้อมูล</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: CRM PIPELINE */}
          {activeTab === 'pipeline' && (
            <div className="max-w-6xl mx-auto h-full flex flex-col animate-in fade-in duration-300">
              {isProOrAbove ? (
                <>
                  <div className="mb-6 shrink-0 flex justify-between items-end">
                    <div>
                      <h2 className={`text-2xl font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}><BarChart3 className="w-6 h-6 text-indigo-600" /> CRM Pipeline</h2>
                      <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>ตารางติดตามสถานะลูกค้าและยอดขายที่คาดหวังในแต่ละขั้นตอน (List View)</p>
                    </div>
                    <div className="flex gap-2">
                       <select 
                         value={pipelineFilter}
                         onChange={(e) => setPipelineFilter(e.target.value)}
                         className={`text-sm border rounded-lg px-3 py-2 outline-none font-bold shadow-sm ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-700'}`}
                       >
                         <option value="All Stages">ทั้งหมด (All Stages)</option>
                         <option value="New Leads">New Leads</option>
                         <option value="Contacted">Contacted</option>
                         <option value="Pending Payment">Pending Payment</option>
                       </select>
                       <button onClick={() => setShowAddDeal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm flex items-center gap-1.5 transition-colors">
                         <Plus className="w-4 h-4" /> เพิ่มดีลใหม่
                       </button>
                    </div>
                  </div>

                  <div className={`rounded-2xl border shadow-sm flex flex-col flex-1 overflow-hidden ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} min-h-0`}>
                    <div className="overflow-auto custom-scrollbar flex-1 p-0">
                      <table className="w-full text-left text-sm table-fixed min-w-[700px]">
                        <thead className={`text-[10px] uppercase tracking-widest font-bold border-b sticky top-0 z-10 ${isDarkMode ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>
                          <tr>
                            <th className="px-4 py-4 w-[25%]">ลูกค้า / ระยะเวลา</th>
                            <th className="px-4 py-4 w-[25%] text-center">ความสนใจ (INTENT)</th>
                            <th className="px-4 py-4 w-[15%] text-center">ระดับความสนใจ</th>
                            <th className="px-4 py-4 w-[20%] text-center">สถานะการขาย (STAGE)</th>
                            <th className="px-4 py-4 w-[15%] text-right">คาดหวังยอดขาย</th>
                          </tr>
                        </thead>
                        <tbody className={`divide-y ${isDarkMode ? 'divide-slate-700/50' : 'divide-slate-100'}`}>
                          {pipelineData
                            .filter(deal => pipelineFilter === 'All Stages' || deal.stage === pipelineFilter)
                            .map((deal) => (
                            <tr key={deal.id} className={`transition-colors ${isDarkMode ? 'hover:bg-slate-700/30' : 'hover:bg-slate-50/50'}`}>
                              <td className="px-4 py-3 overflow-hidden">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs shrink-0">{deal.name.charAt(0)}</div>
                                  <div className="overflow-hidden w-full">
                                    <p className={`font-bold text-sm truncate ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{deal.name}</p>
                                    <p className={`text-[10px] flex items-center gap-1 mt-0.5 truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}><Clock className="w-3 h-3 shrink-0"/> {deal.time}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span className={`inline-block w-full px-3 py-1 rounded-md text-xs font-semibold truncate ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>{deal.intent}</span>
                              </td>
                              <td className="px-4 py-3 text-center">
                                 {deal.score === 'Hot' && <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-100 px-2 py-1 rounded"><Flame className="w-3 h-3 text-rose-500 fill-current"/> Hot</span>}
                                 {deal.score === 'Warm' && <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded"><Sun className="w-3 h-3 text-amber-500 fill-current"/> Warm</span>}
                                 {deal.score === 'Cold' && <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded"><Moon className="w-3 h-3 text-blue-500 fill-current"/> Cold</span>}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <select 
                                  value={deal.stage}
                                  onChange={(e) => {
                                    const newStage = e.target.value;
                                    handleUpdateDealStage(deal.id, newStage);
                                  }}
                                  className={`text-[10px] font-bold px-2 py-1 rounded-full border outline-none focus:ring-1 focus:ring-indigo-500/30 cursor-pointer ${
                                    deal.stage === 'Pending Payment' ? (isDarkMode ? 'bg-rose-950 text-rose-400 border-rose-500/20' : 'bg-rose-50 text-rose-600 border-rose-100') :
                                    deal.stage === 'Contacted' ? (isDarkMode ? 'bg-amber-950 text-amber-400 border-amber-500/20' : 'bg-amber-50 text-amber-600 border-amber-100') :
                                    (isDarkMode ? 'bg-slate-800 text-slate-300 border-slate-600' : 'bg-slate-50 text-slate-600 border-slate-200')
                                  }`}
                                >
                                  <option value="New Leads">New Leads</option>
                                  <option value="Contacted">Contacted</option>
                                  <option value="Pending Payment">Pending Payment</option>
                                </select>
                              </td>
                              <td className={`px-4 py-3 text-right font-bold text-base ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                                 ฿{deal.value.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Add Deal Modal */}
                  {showAddDeal && (
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                      <div className={`rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                        <div className={`p-5 border-b flex justify-between items-center ${isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-100 bg-slate-50'}`}>
                          <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>เพิ่มดีลใหม่</h3>
                          <button onClick={() => setShowAddDeal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
                        </div>
                        <div className="p-6 space-y-4">
                          <div className="space-y-1.5">
                            <label className={`text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>ชื่อลูกค้า</label>
                            <input type="text" value={newDeal.name} onChange={(e)=>setNewDeal({...newDeal, name: e.target.value})} className={`w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500 ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-200 placeholder:text-slate-500' : 'bg-white border-slate-200 text-slate-800'}`} />
                          </div>
                          <div className="space-y-1.5">
                            <label className={`text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>ความสนใจ (Intent)</label>
                            <input type="text" value={newDeal.intent} onChange={(e)=>setNewDeal({...newDeal, intent: e.target.value})} className={`w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500 ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-200 placeholder:text-slate-500' : 'bg-white border-slate-200 text-slate-800'}`} />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className={`text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>ระดับความสนใจ</label>
                              <select value={newDeal.score} onChange={(e)=>setNewDeal({...newDeal, score: e.target.value})} className={`w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500 ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-800'}`}>
                                <option value="Hot">Hot 🔥</option><option value="Warm">Warm ☀️</option><option value="Cold">Cold ❄️</option>
                              </select>
                            </div>
                            <div className="space-y-1.5">
                              <label className={`text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>สถานะ (Stage)</label>
                              <select value={newDeal.stage} onChange={(e)=>setNewDeal({...newDeal, stage: e.target.value})} className={`w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500 ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-800'}`}>
                                <option value="New Leads">New Leads</option><option value="Contacted">Contacted</option><option value="Pending Payment">Pending Payment</option>
                              </select>
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <label className={`text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>ยอดขายที่คาดหวัง (บาท)</label>
                            <input type="number" value={newDeal.value} onChange={(e)=>setNewDeal({...newDeal, value: e.target.value})} className={`w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500 ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-200 placeholder:text-slate-500' : 'bg-white border-slate-200 text-slate-800'}`} />
                          </div>
                          <button onClick={handleAddDeal} className="w-full bg-indigo-600 text-white font-bold py-2.5 rounded-xl mt-4">บันทึกข้อมูล</button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <UpgradeOverlay requiredPlan="Pro" title="CRM Pipeline" icon={BarChart3} description="จัดการลีดและติดตามยอดขายที่คาดหวังในแต่ละขั้นตอนแบบมืออาชีพ" />
              )}
            </div>
          )}

          {/* TAB: AIVA FOLLOW-UP */}
          {activeTab === 'followup' && (
            <div className="max-w-5xl mx-auto h-full flex flex-col animate-in fade-in duration-300">
              {isProOrAbove ? (
                <>
                  <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
                    <div>
                      <h2 className={`text-2xl font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}><Clock className="w-6 h-6 text-indigo-600" /> AIVA Follow-up</h2>
                      <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>ตั้งค่าให้ AI ช่วยทวงตะกร้า หรือติดตามลูกค้าที่เงียบหายไปอัตโนมัติ</p>
                    </div>
                    <button onClick={() => setShowCreateRule(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-colors flex items-center gap-2">
                      <Plus className="w-4 h-4"/> สร้างกฎการติดตามใหม่
                    </button>
                  </div>

                  {!showCreateRule ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 shrink-0">
                        <StatCard title="กฎที่เปิดใช้งาน" value={rulesList.filter(r => r.active).length.toString()} icon={CheckCircle2} color="emerald" isDark={isDarkMode} />
                        <StatCard title="ยอดขายที่กู้คืนสำเร็จ" value="฿45,600" icon={TrendingUp} color="blue" isDark={isDarkMode} />
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
                        {/* Rules List (Left 2 columns) */}
                        <div className={`lg:col-span-2 rounded-2xl flex flex-col overflow-hidden border shadow-sm ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} h-full min-h-[300px]`}>
                          <div className={`p-4 border-b flex justify-between items-center shrink-0 ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50/50 border-slate-100'}`}>
                            <h3 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>รายการกฎของคุณ (Active Rules)</h3>
                          </div>
                          <div className="overflow-auto custom-scrollbar flex-1 p-0">
                            <table className="w-full text-left text-sm table-fixed min-w-[500px]">
                              <thead className={`text-[10px] uppercase tracking-widest font-bold border-b sticky top-0 z-10 ${isDarkMode ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-white text-slate-500 border-slate-100'}`}>
                                <tr>
                                  <th className="px-4 py-3 w-[35%]">ชื่อกฎ</th>
                                  <th className="px-4 py-3 w-[15%] text-center">เวลาหน่วง</th>
                                  <th className="px-4 py-3 w-[25%] text-center">สถิติ (Conversion)</th>
                                  <th className="px-4 py-3 w-[15%] text-center">สถานะ</th>
                                </tr>
                              </thead>
                              <tbody className={`divide-y ${isDarkMode ? 'divide-slate-700/50' : 'divide-slate-100'}`}>
                                {rulesList.map((rule) => (
                                  <tr key={rule.id} className={`transition-colors ${isDarkMode ? 'hover:bg-slate-700/30' : 'hover:bg-slate-50'}`}>
                                    <td className="px-4 py-4">
                                      <p className={`font-bold truncate ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{rule.name}</p>
                                      <p className={`text-[10px] truncate mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{rule.message}</p>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded inline-flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> {rule.delay}
                                      </span>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                      {rule.active ? (
                                        <div className="flex flex-col items-center">
                                           <span className="font-bold text-emerald-600">12.5%</span>
                                           <span className={`text-[9px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>ส่ง 120 / ปิดได้ 15</span>
                                        </div>
                                      ) : (
                                        <span className={`font-bold ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`}>-</span>
                                      )}
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                      <div onClick={() => handleToggleRule(rule.id)} className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors mx-auto ${rule.active ? 'bg-emerald-500' : (isDarkMode ? 'bg-slate-600' : 'bg-slate-300')}`}>
                                        <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${rule.active ? 'translate-x-5' : 'translate-x-1'}`}></div>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Recent Activity Log (Right column) */}
                        <div className={`rounded-2xl flex flex-col overflow-hidden border shadow-sm ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} h-full min-h-[300px]`}>
                          <div className={`p-4 border-b flex justify-between items-center shrink-0 ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50/50 border-slate-100'}`}>
                            <h3 className={`font-bold text-sm flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                              <Activity className="w-4 h-4 text-indigo-500" /> ประวัติการติดตามล่าสุด
                            </h3>
                          </div>
                          <div className="flex-1 overflow-auto custom-scrollbar p-4 space-y-4">
                            <div className="flex gap-3">
                               <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 font-bold text-xs"><CheckCircle2 className="w-4 h-4"/></div>
                               <div>
                                 <p className={`text-xs font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>ทวงตะกร้า: คุณแพรว (VIP)</p>
                                 <p className={`text-[10px] mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>AI ตามสำเร็จ ลูกค้าโอนเงิน 1,290฿</p>
                                 <p className={`text-[9px] mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>วันนี้ 10:45 AM</p>
                               </div>
                            </div>
                            <div className="flex gap-3">
                               <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 font-bold text-xs"><Bot className="w-4 h-4"/></div>
                               <div>
                                 <p className={`text-xs font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>ขอรีวิว: MewMew</p>
                                 <p className={`text-[10px] mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>AI ส่งข้อความขอรีวิว รอเปิดอ่าน</p>
                                 <p className={`text-[9px] mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>วันนี้ 09:15 AM</p>
                               </div>
                            </div>
                            <div className="flex gap-3">
                               <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0 font-bold text-xs"><Clock className="w-4 h-4"/></div>
                               <div>
                                 <p className={`text-xs font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>คิวติดตาม: คุณก้อย</p>
                                 <p className={`text-[10px] mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>เลื่อนส่งเพราะลูกค้านอน (Smart Timing)</p>
                                 <p className={`text-[9px] mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>จะส่งพรุ่งนี้ 09:00 AM</p>
                               </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className={`rounded-2xl p-6 border shadow-sm flex flex-col flex-1 min-h-0 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                      <div className="flex justify-between items-center mb-6 border-b pb-4 shrink-0 dark:border-slate-700">
                        <h3 className={`text-lg font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                          <Sparkles className="w-5 h-5 text-indigo-500" /> สร้างกฎการติดตามใหม่
                        </h3>
                        <button onClick={() => setShowCreateRule(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"><X className="w-5 h-5"/></button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1 overflow-auto custom-scrollbar pr-2">
                        <div className="space-y-5">
                          <div className="space-y-1.5">
                            <label className={`block text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>ชื่อกฎ</label>
                            <input type="text" value={newRule.name} onChange={(e)=>setNewRule({...newRule, name: e.target.value})} placeholder="เช่น ทวงตะกร้าโปรวันแม่" className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-200 placeholder:text-slate-500' : 'bg-white border-slate-200'}`} />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className={`block text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>เงื่อนไข (Trigger)</label>
                              <select className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-200'}`}><option>ลูกค้าถามแล้วเงียบ</option><option>ส่งของสำเร็จแล้ว</option></select>
                            </div>
                            <div className="space-y-1.5">
                              <label className={`block text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>เวลาหน่วง (Delay)</label>
                              <select value={newRule.delay} onChange={(e)=>setNewRule({...newRule, delay: e.target.value})} className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-200'}`}><option value="2h">2 ชั่วโมง</option><option value="24h">24 ชั่วโมง</option><option value="7d">7 วัน</option></select>
                            </div>
                          </div>

                          <div className={`p-4 rounded-xl border flex items-center justify-between ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-indigo-50/50 border-indigo-100'}`}>
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}><Clock className="w-4 h-4"/></div>
                              <div>
                                <p className={`text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>AI Smart Timing</p>
                                <p className={`text-[10px] mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>ให้ AI วิเคราะห์เวลาที่ลูกค้ามักจะเปิดแชท เพื่อเพิ่มโอกาสเห็นข้อความ</p>
                              </div>
                            </div>
                            <div onClick={()=>setNewRule({...newRule, smartTiming: !newRule.smartTiming})} className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${newRule.smartTiming ? 'bg-indigo-500' : (isDarkMode ? 'bg-slate-600' : 'bg-slate-300')}`}>
                              <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${newRule.smartTiming ? 'translate-x-5' : 'translate-x-1'}`}></div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between items-center mb-1">
                              <label className={`block text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>ข้อความที่จะให้ AI ส่ง</label>
                              <button 
                                onClick={handleGenerateFollowUpMessage}
                                disabled={isGeneratingMessage}
                                className={`text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 transition-all ${isGeneratingMessage ? 'bg-slate-100 text-slate-400' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'}`}
                              >
                                {isGeneratingMessage ? <RefreshCw className="w-3 h-3 animate-spin"/> : <Sparkles className="w-3 h-3"/>}
                                AI ช่วยแต่งข้อความ
                              </button>
                            </div>
                            <textarea rows="4" value={newRule.message} onChange={(e)=>setNewRule({...newRule, message: e.target.value})} placeholder="พิมพ์ข้อความที่ต้องการส่งหาลูกค้า หรือกดปุ่ม AI ช่วยแต่งข้อความ..." className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-200 placeholder:text-slate-500' : 'bg-white border-slate-200'}`}></textarea>
                            <div className="flex gap-1.5 flex-wrap">
                               <p className={`text-[10px] w-full mb-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>คลิกเพื่อแทรกตัวแปร:</p>
                               <button onClick={() => setNewRule(prev => ({...prev, message: prev.message + '{ชื่อลูกค้า}'}))} className={`text-[10px] font-bold px-2 py-1 rounded border transition-colors ${isDarkMode ? 'bg-slate-800 text-indigo-400 border-slate-700 hover:bg-slate-700' : 'bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-100'}`}>+ {'{ชื่อลูกค้า}'}</button>
                               <button onClick={() => setNewRule(prev => ({...prev, message: prev.message + '{ชื่อสินค้า}'}))} className={`text-[10px] font-bold px-2 py-1 rounded border transition-colors ${isDarkMode ? 'bg-slate-800 text-indigo-400 border-slate-700 hover:bg-slate-700' : 'bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-100'}`}>+ {'{ชื่อสินค้า}'}</button>
                               <button onClick={() => setNewRule(prev => ({...prev, message: prev.message + '{ยอดชำระ}'}))} className={`text-[10px] font-bold px-2 py-1 rounded border transition-colors ${isDarkMode ? 'bg-slate-800 text-indigo-400 border-slate-700 hover:bg-slate-700' : 'bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-100'}`}>+ {'{ยอดชำระ}'}</button>
                            </div>
                          </div>

                          <div className={`p-4 rounded-xl border flex items-center justify-between ${isDarkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-rose-500/20 text-rose-400' : 'bg-rose-100 text-rose-600'}`}><Tag className="w-4 h-4"/></div>
                              <div>
                                <p className={`text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>แนบโค้ดส่วนลด (Discount Booster)</p>
                                <p className={`text-[10px] mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>ให้ AI เสนอส่วนลด Flash Sale 5% เพื่อกระตุ้นให้โอนเงิน</p>
                              </div>
                            </div>
                            <div onClick={()=>setNewRule({...newRule, includeCoupon: !newRule.includeCoupon})} className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${newRule.includeCoupon ? 'bg-indigo-500' : (isDarkMode ? 'bg-slate-600' : 'bg-slate-300')}`}>
                              <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${newRule.includeCoupon ? 'translate-x-5' : 'translate-x-1'}`}></div>
                            </div>
                          </div>

                          <button onClick={handleCreateRule} disabled={!newRule.name || !newRule.message} className={`w-full py-3 rounded-xl text-sm font-bold transition-all shadow-sm ${!newRule.name || !newRule.message ? (isDarkMode ? 'bg-slate-700 text-slate-500' : 'bg-slate-100 text-slate-400') : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}>บันทึกและเปิดใช้งาน</button>
                        </div>

                        <div className={`rounded-xl p-4 flex flex-col justify-end min-h-[300px] border ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
                           <p className={`text-center text-xs font-bold mb-4 flex items-center justify-center gap-1.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                             <Eye className="w-3.5 h-3.5" /> Preview (แสดงผลฝั่งลูกค้า)
                           </p>
                           <div className="flex items-start gap-2 max-w-[90%]">
                             <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${isDarkMode ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-indigo-600 text-white'}`}><Bot className="w-3.5 h-3.5"/></div>
                             <div className="flex flex-col gap-1.5 w-full">
                               {newRule.message && (
                                 <div className={`px-3 py-2.5 rounded-xl text-xs rounded-tl-sm shadow-sm whitespace-pre-wrap leading-relaxed ${isDarkMode ? 'bg-slate-700 text-slate-200' : 'bg-white text-slate-700'}`}>
                                   {newRule.message}
                                 </div>
                               )}
                               {newRule.includeCoupon && (
                                 <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-3.5 rounded-xl text-white shadow-sm mt-1">
                                   <p className="text-[10px] font-bold uppercase opacity-80 mb-0.5">Flash Sale Offer</p>
                                   <div className="flex justify-between items-end mb-1">
                                     <p className="text-xl font-black leading-none">ลด 5%</p>
                                     <button className="bg-white text-rose-500 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">ใช้งาน</button>
                                   </div>
                                   <p className="text-[9px] opacity-90 flex items-center gap-1"><Clock className="w-2.5 h-2.5"/> โค้ดจะหมดอายุใน 24 ชม.</p>
                                 </div>
                               )}
                             </div>
                           </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <UpgradeOverlay requiredPlan="Pro" title="AIVA Follow-up" icon={Clock} description="ให้ AI ช่วยทวงตะกร้า หรือติดตามลูกค้าที่เงียบหายไปอัตโนมัติ เพื่อกู้คืนยอดขาย" />
              )}
            </div>
          )}

          {/* TAB: AIVA LEAD SCORE */}
          {activeTab === 'leadscore' && (
            <div className="max-w-5xl mx-auto h-full flex flex-col animate-in fade-in duration-300">
              {isProOrAbove ? (
                <>
                  <div className="mb-6 shrink-0"><h2 className={`text-2xl font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}><Flame className="w-6 h-6 text-rose-500" /> AIVA Lead Score</h2></div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0 mb-6">
                     <StatCard title="HOT LEADS (พร้อมโอน)" value={USE_MOCK ? "12" : "0"} icon={Flame} color="rose" isDark={isDarkMode} />
                     <StatCard title="WARM LEADS (ลังเล)" value={USE_MOCK ? "45" : "0"} icon={Sun} color="amber" isDark={isDarkMode} />
                     <StatCard title="COLD LEADS (ถามเฉยๆ)" value={USE_MOCK ? "89" : "0"} icon={Moon} color="blue" isDark={isDarkMode} />
                  </div>

                  <div className={`rounded-2xl border shadow-sm flex flex-col flex-1 overflow-hidden ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} min-h-0`}>
                    <div className={`p-4 border-b flex justify-between items-center shrink-0 ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50/50 border-slate-100'}`}>
                      <h3 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>ชี้เป้าลูกค้าพร้อมโอน (Top Hot Leads)</h3>
                      <button className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors ${isDarkMode ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20' : 'bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-100'}`}>Export รายชื่อ</button>
                    </div>
                    <div className="overflow-auto custom-scrollbar flex-1 p-0">
                      <table className="w-full text-left text-sm table-fixed min-w-[700px]">
                        <thead className={`text-[10px] uppercase tracking-widest font-bold border-b sticky top-0 z-10 ${isDarkMode ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-white text-slate-500 border-slate-100'}`}>
                          <tr>
                            <th className="px-4 py-3 w-[25%]">ลูกค้า</th>
                            <th className="px-4 py-3 w-[15%] text-center">คะแนน</th>
                            <th className="px-4 py-3 w-[45%]">เหตุผลจาก AI (Intent Insight)</th>
                            <th className="px-4 py-3 w-[15%] text-center">จัดการ</th>
                          </tr>
                        </thead>
                        <tbody className={`divide-y ${isDarkMode ? 'divide-slate-700/50' : 'divide-slate-100'}`}>
                          {leadScores.length === 0 ? (
                            <tr>
                              <td colSpan="4" className="px-6 py-12 text-center text-slate-400 font-medium">
                                ไม่มีข้อมูลลูกค้าพร้อมโอน (Lead Score)
                              </td>
                            </tr>
                          ) : (
                            leadScores.map((lead) => (
                            <tr key={lead.id} className={`transition-colors ${isDarkMode ? 'hover:bg-slate-700/30' : 'hover:bg-slate-50'}`}>
                              <td className={`px-4 py-4 font-bold truncate ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{lead.name}</td>
                              <td className="px-4 py-4 text-center">
                                <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded border ${isDarkMode ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'text-rose-600 bg-rose-50 border-rose-100'}`}><Flame className="w-3 h-3 fill-current"/> {lead.score}</span>
                              </td>
                              <td className="px-4 py-4">
                                <div className="flex items-start gap-2">
                                  <BrainCircuit className={`w-4 h-4 shrink-0 mt-0.5 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-500'}`}/>
                                  <span className={`text-xs leading-relaxed block w-full whitespace-normal break-words ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{lead.reason}</span>
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <div className="flex flex-col items-center justify-center gap-2">
                                  <span className={`text-[10px] font-bold flex items-center gap-1 ${lead.aiEnabled ? (isDarkMode ? 'text-indigo-400' : 'text-indigo-600') : (isDarkMode ? 'text-slate-500' : 'text-slate-400')}`}>
                                    <Bot className="w-3 h-3"/> AI ทักแชท
                                  </span>
                                  <div onClick={() => toggleLeadAi(lead.id)} className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${lead.aiEnabled ? 'bg-indigo-500' : (isDarkMode ? 'bg-slate-600' : 'bg-slate-300')}`}>
                                    <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${lead.aiEnabled ? 'translate-x-5' : 'translate-x-1'}`}></div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : (
                <UpgradeOverlay requiredPlan="Pro" title="AIVA Lead Score" icon={Flame} description="ให้ AI วิเคราะห์และจัดลำดับความสนใจของลูกค้า (Hot/Warm/Cold) เพื่อให้เซลส์ปิดการขายได้แม่นยำขึ้น" />
              )}
            </div>
          )}

          {/* TAB: AIVA LOST REVENUE */}
          {activeTab === 'lostrevenue' && (
            <div className="max-w-6xl mx-auto h-full flex flex-col animate-in fade-in duration-300">
              {isAdvancedOnly ? (
                <>
                  <div className="mb-6 shrink-0"><h2 className={`text-2xl font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}><AlertOctagon className="w-6 h-6 text-rose-600" /> AIVA Lost Revenue Detector</h2></div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0 mb-6">
                     <StatCard title="💰 ยอดขายที่เสียไป" value={USE_MOCK ? "฿142,500" : "฿0"} icon={TrendingDown} color="rose" isDark={isDarkMode} />
                     <StatCard title="🎯 โอกาสที่กู้คืนได้" value={USE_MOCK ? "฿85,400" : "฿0"} icon={RefreshCcw} color="amber" isDark={isDarkMode} />
                     <StatCard title="✅ กู้คืนสำเร็จแล้ว" value={USE_MOCK ? "฿45,600" : "฿0"} icon={CheckCircle2} color="emerald" isDark={isDarkMode} />
                  </div>
                  <div className={`bg-white rounded-2xl shadow-sm border flex flex-col flex-1 overflow-hidden saas-card min-h-0 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'border-slate-200'}`}>
                    <div className={`p-5 border-b flex justify-between items-center shrink-0 ${isDarkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-100 bg-slate-50'}`}>
                      <h3 className={`font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}><TrendingDown className="w-4 h-4 text-rose-500" /> ชี้เป้าออเดอร์ที่หลุด (Lost Opportunities)</h3>
                    </div>
                    <div className="overflow-auto flex-1 custom-scrollbar p-0">
                      <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className={`text-[11px] uppercase tracking-widest font-bold border-b sticky top-0 z-10 shadow-sm ${isDarkMode ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-white text-slate-400 border-slate-100'}`}>
                          <tr>
                            <th className="px-6 py-4">ลูกค้า / สินค้า</th>
                            <th className="px-6 py-4 text-right">มูลค่าบิล</th>
                            <th className="px-6 py-4 min-w-[250px]">สาเหตุที่หลุด (DROP-OFF REASON)</th>
                            <th className="px-6 py-4 text-center">AI ACTION (AUTO)</th>
                            <th className="px-6 py-4 text-center">จัดการเอง (MANUAL)</th>
                          </tr>
                        </thead>
                        <tbody className={`divide-y ${isDarkMode ? 'divide-slate-700/50' : 'divide-slate-100'}`}>
                          {lostRevenues.length === 0 ? (
                            <tr>
                              <td colSpan="5" className="px-6 py-12 text-center text-slate-400 font-medium">
                                ไม่มีข้อมูลออเดอร์ที่หลุด (Lost Revenue)
                              </td>
                            </tr>
                          ) : (
                            lostRevenues.map((item) => (
                            <tr key={item.id} className={`transition-colors ${isDarkMode ? 'hover:bg-slate-700/30' : 'hover:bg-slate-50'}`}>
                              <td className="px-6 py-4">
                                <div className={`font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>{item.name}</div>
                                <div className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{item.product}</div>
                              </td>
                              <td className="px-6 py-4 text-right font-bold text-rose-500 text-base">฿{item.value.toLocaleString()}</td>
                              <td className="px-6 py-4">
                                <div className="flex items-start gap-2">
                                  <BrainCircuit className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                                  <span className={`text-xs whitespace-normal break-words line-clamp-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{item.reason}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <div onClick={() => toggleLostRevenueAuto(item.id)} className={`w-10 h-5 mx-auto rounded-full relative cursor-pointer transition-colors ${item.autoEnabled ? 'bg-indigo-500' : (isDarkMode ? 'bg-slate-600' : 'bg-slate-300')}`}>
                                  <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${item.autoEnabled ? 'translate-x-5' : 'translate-x-1'}`}></div>
                                </div>
                                <p className={`text-[9px] mt-1 font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{item.autoEnabled ? 'เปิดใช้งาน' : 'ปิด'}</p>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <button className={`${item.btnColor} text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm hover:opacity-90 transition-opacity w-full max-w-[120px]`}>
                                  {item.action}
                                </button>
                              </td>
                            </tr>
                          )))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : (
                <UpgradeOverlay requiredPlan="Advanced" title="AIVA Lost Revenue Detector" icon={AlertOctagon} description="ชี้เป้ายอดขายที่หลุดไป และให้ AI ช่วยติดตามกู้คืนรายได้กลับมาให้คุณอัตโนมัติ" />
              )}
            </div>
          )}

          {/* TAB: AIVA CEO REPORT */}
          {activeTab === 'ceoreport' && (
            <div className="max-w-6xl mx-auto h-full flex flex-col animate-in fade-in duration-300">
              {isAdvancedOnly ? (
                <>
                  <div className="mb-6 shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h2 className={`text-2xl font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}><LineChart className="w-6 h-6 text-indigo-600" /> AIVA CEO Daily Report</h2>
                      <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>รับรายงานสรุปยอดขายและภาพรวมธุรกิจจาก AI ส่งตรงถึงมือคุณทุกเช้า</p>
                    </div>
                    <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border shadow-sm ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                       <span className={`text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>ส่งสรุปผ่าน LINE (08:00 น.)</span>
                       <div onClick={() => setWorkspaceSettings({...workspaceSettings, notifyDailyReport: !workspaceSettings.notifyDailyReport})} className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors shrink-0 ${workspaceSettings.notifyDailyReport ? 'bg-emerald-500' : (isDarkMode ? 'bg-slate-600' : 'bg-slate-300')}`}>
                         <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${workspaceSettings.notifyDailyReport ? 'translate-x-5' : 'translate-x-1'}`}></div>
                       </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-0">
                     <div className={`md:col-span-2 rounded-2xl p-6 lg:p-8 flex flex-col border shadow-sm h-full overflow-y-auto custom-scrollbar ${isDarkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200'}`}>
                        <div className={`flex justify-between items-start mb-6 pb-4 border-b border-dashed shrink-0 ${isDarkMode ? 'border-slate-700' : 'border-slate-300'}`}>
                          <div>
                            <h3 className={`text-lg font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>รายงานภาพรวมธุรกิจประจำวัน</h3>
                            <p className={`text-xs mt-1 font-mono font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>DATE: 07/06/2026</p>
                          </div>
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isDarkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}><Bot className="w-5 h-5"/></div>
                        </div>
                        
                        <div className="space-y-4 flex-1">
                           <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                             สวัสดีค่ะบอส ☀️ นี่คือรายงานสรุปประจำวันจาก AIVA ค่ะ:<br/><br/>
                             เมื่อวานนี้ร้านของคุณมีลูกค้าทักเข้ามาทั้งหมด <strong className={isDarkMode ? 'text-indigo-400' : 'text-indigo-500'}>1,240 แชท</strong> โดย AIVA สามารถช่วยตอบและปิดการขายได้ด้วยตนเองถึง <strong className={isDarkMode ? 'text-indigo-400' : 'text-indigo-500'}>95%</strong> แบ่งเบาภาระทีมแอดมินไปได้กว่า 45 ชั่วโมงการทำงาน<br/><br/>
                             💰 <strong className={isDarkMode ? 'text-white' : 'text-black'}>ยอดขายรวม:</strong> ฿142,500 (เติบโตขึ้น 12% จากสัปดาห์ที่แล้ว)<br/>
                             🔥 <strong className={isDarkMode ? 'text-white' : 'text-black'}>สินค้าขายดีอันดับ 1:</strong> เดรสรุ่น Summer Size M (Sold Out ไป 2 สีแล้ว แนะนำให้เติมสต็อกนะคะ)<br/>
                             ⚠️ <strong className={isDarkMode ? 'text-white' : 'text-black'}>สิ่งที่ต้องระวัง:</strong> มีลูกค้า 15 รายสอบถามเรื่องระยะเวลาจัดส่งที่ล่าช้า (แชทที่มีคีย์เวิร์ด 'ตามของ') AIVA แนะนำให้ตรวจสอบกับขนส่งเจ้านี้เพิ่มเติมค่ะ
                           </p>
                        </div>
                        
                        <div className={`mt-8 p-4 rounded-xl border flex gap-3 items-start shrink-0 ${isDarkMode ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-indigo-50 border-indigo-100'}`}>
                          <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5"/>
                          <div>
                            <h4 className={`text-xs font-bold uppercase tracking-wider mb-1 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>AIVA's Suggestion</h4>
                            <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-indigo-200' : 'text-indigo-800'}`}>พรุ่งนี้เป็นวัน Payday แนะนำให้ตั้งกฎ Follow-up แจ้งโปรจัดส่งฟรีตอนเที่ยงตรง เพื่อกระตุ้นยอดขายจากกลุ่ม Warm Leads จำนวน 45 รายที่ยังลังเลอยู่ค่ะ</p>
                          </div>
                        </div>
                     </div>

                     <div className="space-y-4 shrink-0 overflow-y-auto custom-scrollbar pr-1">
                       <StatCard title="แชทที่จัดการแทนแอดมิน" value="1,240" icon={MessageSquare} color="blue" isDark={isDarkMode} />
                       <StatCard title="Win Rate (ปิดการขาย)" value="18.5%" icon={CheckCircle2} color="emerald" isDark={isDarkMode} />
                       <StatCard title="เวลาแอดมินที่ประหยัดได้" value="45 ชม." icon={Clock} color="indigo" isDark={isDarkMode} />
                     </div>
                  </div>
                </>
              ) : (
                <UpgradeOverlay requiredPlan="Advanced" title="AIVA CEO Daily Report" icon={LineChart} description="รับรายงานสรุปภาพรวมธุรกิจและสถิติยอดขายส่งตรงถึง LINE ของผู้บริหารทุกเช้า" />
              )}
            </div>
          )}

          {/* TAB: CONTENT GEN */}
          {activeTab === 'contentgen' && (
            <div className="max-w-6xl mx-auto h-full flex flex-col animate-in fade-in duration-300">
              {isProOrAbove ? (
                <>
                  <div className="mb-6 shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h2 className={`text-2xl font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                        <Sparkles className="w-6 h-6 text-indigo-600" /> AIVA Content Gen
                      </h2>
                      <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        ช่วยคุณสร้างแคปชันลงโซเชียล คิดโปรโมชัน หรือเขียนบรอดแคสต์แบบมือโปรภายในพริบตา
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
                    {/* Left: Inputs */}
                    <div className={`rounded-2xl border shadow-sm p-6 flex flex-col overflow-y-auto custom-scrollbar ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                      <h3 className={`text-lg font-bold mb-6 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}><PenTool className="w-5 h-5 text-indigo-500"/> ใส่ข้อมูลให้ AI</h3>
                      
                      <div className="space-y-5">
                        <div className="space-y-2">
                          <label className={`text-sm font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>ต้องการสร้างอะไร?</label>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { id: 'caption', label: 'แคปชันลงเพจ' },
                              { id: 'promo', label: 'โปรโมชันลดราคา' },
                              { id: 'broadcast', label: 'บรอดแคสต์ Line OA' }
                            ].map((type) => (
                              <button
                                key={type.id}
                                onClick={() => setContentType(type.id)}
                                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                                  contentType === type.id
                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                    : (isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100')
                                }`}
                              >
                                {type.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <label className={`text-sm font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>รายละเอียดสินค้า / จุดเด่น</label>
                            <span className={`text-[10px] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>ยิ่งใส่เยอะ AI ยิ่งแต่งได้ดี</span>
                          </div>
                          <textarea 
                            rows="5" 
                            value={contentInput}
                            onChange={(e) => setContentInput(e.target.value)}
                            placeholder="เช่น เดรสรุ่นซัมเมอร์ ผ้าใส่สบาย ไม่ร้อน มีไซส์ S, M, L จัดโปรลด 50% วันนี้วันเดียว..." 
                            className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 resize-none ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-200 placeholder:text-slate-600' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400'}`}
                          ></textarea>
                        </div>

                        <div className="space-y-2">
                          <label className={`text-sm font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Mood & Tone (อารมณ์ของข้อความ)</label>
                          <select 
                            value={contentTone}
                            onChange={(e) => setContentTone(e.target.value)}
                            className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
                          >
                            <option value="friendly">😊 สนุกสนาน เป็นกันเอง (เหมาะกับวัยรุ่น)</option>
                            <option value="formal">👔 ทางการ สุภาพ (เหมาะกับ B2B / ของราคาสูง)</option>
                            <option value="urgent">🔥 กระตุ้นความอยากซื้อ ด่วน! (เหมาะกับแฟลชเซลล์)</option>
                            <option value="storytelling">📖 เน้นเล่าเรื่อง สร้างความน่าเชื่อถือ</option>
                          </select>
                        </div>

                        <button 
                          onClick={handleGenerateContent} 
                          disabled={!contentInput || isGenerating}
                          className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-sm mt-4 ${
                            !contentInput 
                              ? (isDarkMode ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-slate-100 text-slate-400 cursor-not-allowed')
                              : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-indigo-500/25'
                          }`}
                        >
                          {isGenerating ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                          {isGenerating ? 'AI กำลังใช้ความคิิด...' : 'ให้ AIVA ช่วยคิดข้อความ'}
                        </button>
                      </div>
                    </div>

                    {/* Right: Output */}
                    <div className={`rounded-2xl border shadow-sm p-6 flex flex-col ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                      <div className="flex justify-between items-center mb-6">
                        <h3 className={`text-lg font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}><MessageSquare className="w-5 h-5 text-indigo-500"/> ข้อความที่ AI แต่งให้</h3>
                        {generatedContent && (
                          <button 
                            onClick={() => navigator.clipboard.writeText(generatedContent)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors border shadow-sm ${isDarkMode ? 'bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                            title="Copy to clipboard"
                          >
                            <Copy className="w-3.5 h-3.5" /> คัดลอก
                          </button>
                        )}
                      </div>

                      <div className={`flex-1 rounded-xl p-5 overflow-y-auto custom-scrollbar border relative ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                        {!generatedContent && !isGenerating && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 opacity-50">
                            <Sparkles className={`w-12 h-12 mb-3 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                            <p className={`text-sm font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>พร้อมเสกข้อความปังๆ ให้คุณแล้ว!</p>
                            <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>พิมพ์รายละเอียดด้านซ้ายแล้วกดปุ่มสร้างได้เลย</p>
                          </div>
                        )}
                        
                        {isGenerating && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-3"></div>
                            <p className={`text-xs font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>AIVA กำลังพิมพ์...</p>
                          </div>
                        )}

                        {generatedContent && !isGenerating && (
                          <div className={`text-sm whitespace-pre-wrap leading-relaxed font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                            {generatedContent}
                          </div>
                        )}
                      </div>

                      {generatedContent && !isGenerating && (
                        <div className="mt-4 flex gap-3">
                          <button onClick={handleGenerateContent} className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center gap-1.5 ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                            <RefreshCw className="w-3.5 h-3.5" /> ลองแต่งใหม่อีกรอบ
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <UpgradeOverlay requiredPlan="Pro" title="AIVA Content Gen" icon={Sparkles} description="ผู้ช่วยคิดแคปชัน โปรโมชัน และข้อความบรอดแคสต์ ปรับ Mood & Tone ได้ตามต้องการ" />
              )}
            </div>
          )}

          {/* TAB: SOCIAL GROWTH */}
          {activeTab === 'socialgrowth' && (
            <div className="max-w-6xl mx-auto h-full flex flex-col animate-in fade-in duration-300">
              {isAdvancedOnly ? (
                <>
                  <div className="mb-6 shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h2 className={`text-2xl font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                        <Share2 className="w-6 h-6 text-indigo-600" /> AIVA Social Growth™
                      </h2>
                      <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        วิเคราะห์เทรนด์ ดันยอดวิว และเพิ่มผู้ติดตาม (Engagement) บนโซเชียลมีเดียอัตโนมัติด้วย AI
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0 mb-6">
                     <StatCard title="ผู้ติดตามใหม่ (สัปดาห์นี้)" value="+1,250" icon={Users} color="emerald" isDark={isDarkMode} />
                     <StatCard title="Engagement Rate" value="4.8%" icon={TrendingUp} color="blue" isDark={isDarkMode} />
                     <StatCard title="ไวรัลโพสต์" value="2" icon={Flame} color="rose" isDark={isDarkMode} />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
                    {/* Left: Trend Analyzer */}
                    <div className={`rounded-2xl border shadow-sm flex flex-col overflow-hidden min-h-0 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                      <div className={`p-5 border-b flex justify-between items-center shrink-0 ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50/50 border-slate-100'}`}>
                        <h3 className={`font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}><TrendingUp className="w-5 h-5 text-rose-500"/> เทรนด์ฮิตประจำสัปดาห์ (Trending Now)</h3>
                      </div>
                      <div className="flex-1 overflow-auto custom-scrollbar p-5 space-y-6">
                        <div>
                          <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>🔥 Hashtag ที่กำลังมาแรง (TikTok/IG)</h4>
                          <div className="space-y-3">
                            {[
                              { tag: '#ชี้เป้าแฟชั่น', views: '24.5M Views', trend: '+15%' },
                              { tag: '#รีวิวคาเฟ่', views: '18.2M Views', trend: '+8%' },
                              { tag: '#OOTDวันนี้', views: '12.1M Views', trend: '+22%' }
                            ].map((t, i) => (
                              <div key={i} className={`flex items-center justify-between p-3 rounded-xl border ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                                <div>
                                  <p className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{t.tag}</p>
                                  <p className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{t.views}</p>
                                </div>
                                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">{t.trend}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>🎵 แผ่นเสียงไวรัล (Trending Audio)</h4>
                          <div className="space-y-3">
                            {[
                              { title: 'จังหวะตกหลุมรัก - Magic', uses: '540K uses' },
                              { title: 'Funny Background Music', uses: '1.2M uses' }
                            ].map((m, i) => (
                              <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isDarkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}><Music className="w-4 h-4"/></div>
                                <div>
                                  <p className={`font-bold text-sm truncate ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{m.title}</p>
                                  <p className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{m.uses}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: AI Actions */}
                    <div className={`rounded-2xl border shadow-sm flex flex-col overflow-hidden min-h-0 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                      <div className={`p-5 border-b flex justify-between items-center shrink-0 ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50/50 border-slate-100'}`}>
                        <h3 className={`font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}><Bot className="w-5 h-5 text-indigo-500"/> AI Growth Actions (ระบบช่วยดันช่อง)</h3>
                      </div>
                      <div className="flex-1 overflow-auto custom-scrollbar p-5 space-y-4">
                        
                        <div className={`p-4 rounded-xl border relative overflow-hidden ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0"><Heart className="w-5 h-5"/></div>
                            <div className="flex-1">
                              <h4 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Auto-Engagement</h4>
                              <p className={`text-xs mt-1 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>ให้ AI ช่วยไปกดหัวใจ หรือคอมเมนต์ในโพสต์ของกลุ่มเป้าหมาย เพื่อดึงดูดให้พวกเขาเข้ามากดติดตามเพจของคุณกลับ</p>
                              <div className="mt-3">
                                {growthActionSuccess ? (
                                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                                    <CheckCircle2 className="w-4 h-4"/> เริ่มทำงานเรียบร้อย
                                  </span>
                                ) : (
                                  <button onClick={handleGrowthAction} disabled={growthActionLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 w-max">
                                    {growthActionLoading ? <RefreshCw className="w-4 h-4 animate-spin"/> : <PlayCircle className="w-4 h-4"/>} 
                                    {growthActionLoading ? 'กำลังรันระบบ...' : 'เริ่มรันแคมเปญ'}
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className={`p-4 rounded-xl border relative overflow-hidden ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0"><Video className="w-5 h-5"/></div>
                            <div className="flex-1">
                              <h4 className={`text-sm font-bold flex justify-between items-center ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                                คำแนะนำจาก AI
                                <span className="text-[9px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded uppercase tracking-widest">Insight</span>
                              </h4>
                              <ul className={`text-xs mt-2 space-y-2 leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                <li className="flex gap-2 items-start"><Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0"/> โพสต์วิดีโอ (Reels/TikTok) ความยาวไม่เกิน 15 วินาที จะเพิ่มยอดวิวได้ 30%</li>
                                <li className="flex gap-2 items-start"><Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0"/> ช่วงเวลาทองในการโพสต์สัปดาห์นี้คือ 19:00 - 21:00 น.</li>
                                <li className="flex gap-2 items-start"><Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0"/> ควรใช้ Hashtag #OOTDวันนี้ ควบคู่กับการรีวิวสินค้า</li>
                              </ul>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>

                  </div>
                </>
              ) : (
                <UpgradeOverlay requiredPlan="Advanced" title="AIVA Social Growth™" icon={Share2} description="ผู้ช่วยจัดการโซเชียลมีเดียอัจฉริยะ วิเคราะห์เทรนด์และช่วยสร้าง Engagement ดึงดูดผู้ติดตามใหม่ๆ ให้คุณอัตโนมัติ" />
              )}
            </div>
          )}

          {/* TAB: BRANCH MANAGEMENT */}
          {activeTab === 'branch' && (
            <div className="max-w-6xl mx-auto h-full flex flex-col animate-in fade-in duration-300">
              {isAdvancedOnly ? (
                <>
                  <div className="mb-6 shrink-0 flex justify-between items-end">
                    <div>
                      <h2 className={`text-2xl font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                        <Store className="w-6 h-6 text-indigo-600" /> จัดการสาขา (Multi-Branch)
                      </h2>
                      <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        แยกการทำงานของ AI, ฐานความรู้ (Knowledge Base), และติดตามยอดขายแบบรายสาขา
                      </p>
                    </div>
                    <button onClick={() => setShowAddBranch(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-colors flex items-center gap-2">
                      <Plus className="w-4 h-4"/> เพิ่มสาขาใหม่
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0 mb-6">
                     <StatCard title="สาขาทั้งหมด" value={branchData.length} icon={MapPin} color="indigo" isDark={isDarkMode} />
                     <StatCard 
                        title="สาขาที่ทำยอดสูงสุด" 
                        value={branchData.length > 0 ? branchData.reduce((prev, current) => (prev.revenue > current.revenue) ? prev : current).name : '-'} 
                        icon={TrendingUp} color="emerald" isDark={isDarkMode} 
                     />
                     <StatCard 
                        title="ยอดขายรวมทุกสาขา" 
                        value={`฿${branchData.reduce((sum, b) => sum + b.revenue, 0).toLocaleString()}`} 
                        icon={CreditCard} color="blue" isDark={isDarkMode} 
                     />
                  </div>

                  <div className={`rounded-2xl border shadow-sm flex flex-col flex-1 overflow-hidden min-h-0 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                    <div className={`p-4 border-b flex justify-between items-center shrink-0 ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50/50 border-slate-100'}`}>
                      <h3 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>ข้อมูลการทำงานของแต่ละสาขา</h3>
                    </div>
                    <div className="overflow-auto custom-scrollbar flex-1 p-0">
                      <table className="w-full text-left text-sm table-fixed min-w-[700px]">
                        <thead className={`text-[10px] uppercase tracking-widest font-bold border-b sticky top-0 z-10 ${isDarkMode ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>
                          <tr>
                            <th className="px-4 py-4 w-[30%]">ชื่อสาขา</th>
                            <th className="px-4 py-4 w-[20%]">ผู้จัดการสาขา</th>
                            <th className="px-4 py-4 w-[15%] text-center">สถานะ AI</th>
                            <th className="px-4 py-4 w-[15%] text-center">ปริมาณแชท</th>
                            <th className="px-4 py-4 w-[20%] text-right">ยอดขาย (เดือนนี้)</th>
                          </tr>
                        </thead>
                        <tbody className={`divide-y ${isDarkMode ? 'divide-slate-700/50' : 'divide-slate-100'}`}>
                          {branchData.map((branch) => (
                            <tr key={branch.id} className={`transition-colors ${isDarkMode ? 'hover:bg-slate-700/30' : 'hover:bg-slate-50'}`}>
                              <td className="px-4 py-4">
                                <div className="flex items-center gap-3">
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isDarkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>
                                    <Store className="w-4 h-4" />
                                  </div>
                                  <span className={`font-bold text-sm truncate ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{branch.name}</span>
                                </div>
                              </td>
                              <td className={`px-4 py-4 font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                {branch.manager || '-'}
                              </td>
                              <td className="px-4 py-4 text-center">
                                {branch.status === 'Active' ? (
                                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full border ${isDarkMode ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'text-emerald-600 bg-emerald-50 border-emerald-200'}`}>
                                    <Bot className="w-3 h-3"/> Active
                                  </span>
                                ) : (
                                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full border ${isDarkMode ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'text-amber-600 bg-amber-50 border-amber-200'}`}>
                                    <Settings className="w-3 h-3"/> Maintenance
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-4 text-center">
                                <span className={`font-mono text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{branch.chats.toLocaleString()}</span>
                              </td>
                              <td className={`px-4 py-4 text-right font-bold text-base ${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>
                                ฿{branch.revenue.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Add Branch Modal */}
                  {showAddBranch && (
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                      <div className={`rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                        <div className={`p-5 border-b flex justify-between items-center ${isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-100 bg-slate-50'}`}>
                          <h3 className={`font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}><Store className="w-5 h-5 text-indigo-500"/> เพิ่มสาขาใหม่</h3>
                          <button onClick={() => setShowAddBranch(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
                        </div>
                        <div className="p-6 space-y-4">
                          <div className="space-y-1.5">
                            <label className={`text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>ชื่อสาขา</label>
                            <div className="relative">
                              <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                              <input type="text" value={newBranch.name} onChange={(e)=>setNewBranch({...newBranch, name: e.target.value})} placeholder="เช่น สาขาไอคอนสยาม" className={`w-full border rounded-xl pl-9 pr-3 py-2 text-sm outline-none focus:border-indigo-500 ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-200 placeholder:text-slate-500' : 'bg-white border-slate-200 text-slate-800'}`} />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <label className={`text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>ผู้จัดการสาขา (Branch Manager)</label>
                            <div className="relative">
                              <Users className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                              <input type="text" value={newBranch.manager} onChange={(e)=>setNewBranch({...newBranch, manager: e.target.value})} placeholder="ชื่อพนักงานที่ดูแลสาขานี้" className={`w-full border rounded-xl pl-9 pr-3 py-2 text-sm outline-none focus:border-indigo-500 ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-200 placeholder:text-slate-500' : 'bg-white border-slate-200 text-slate-800'}`} />
                            </div>
                          </div>
                          
                          {/* AI Permission Control */}
                          <div className={`p-4 rounded-xl border flex items-center justify-between ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${newBranch.customAi ? (isDarkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600') : (isDarkMode ? 'bg-slate-700 text-slate-400' : 'bg-slate-200 text-slate-500')}`}>
                                {newBranch.customAi ? <Unlock className="w-4 h-4"/> : <Lock className="w-4 h-4"/>}
                              </div>
                              <div>
                                <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>อนุญาตให้สาขาตั้งค่า AI เอง</p>
                                <p className={`text-[10px] mt-0.5 leading-tight ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>หากปิด สาขานี้จะถูกบังคับให้ใช้ความรู้และเงื่อนไขตาม HQ เท่านั้น</p>
                              </div>
                            </div>
                            <div onClick={()=>setNewBranch({...newBranch, customAi: !newBranch.customAi})} className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors shrink-0 ${newBranch.customAi ? 'bg-indigo-500' : (isDarkMode ? 'bg-slate-600' : 'bg-slate-300')}`}>
                              <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${newBranch.customAi ? 'translate-x-5' : 'translate-x-1'}`}></div>
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className={`text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>สถานะการทำงานของ AI</label>
                            <select value={newBranch.status} onChange={(e)=>setNewBranch({...newBranch, status: e.target.value})} className={`w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500 ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-800'}`}>
                              <option value="Active">เปิดใช้งาน (Active)</option>
                              <option value="Maintenance">ปิดปรับปรุงชั่วคราว (Maintenance)</option>
                            </select>
                          </div>
                          <button onClick={handleAddBranch} disabled={!newBranch.name} className={`w-full font-bold py-2.5 rounded-xl mt-4 transition-colors ${!newBranch.name ? (isDarkMode ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-slate-100 text-slate-400 cursor-not-allowed') : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}>
                            เพิ่มข้อมูลสาขา
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <UpgradeOverlay requiredPlan="Advanced" title="Multi-Branch Management" icon={Store} description="บริหารจัดการการทำงานของ AI และติดตามยอดขายแยกตามสาขา เหมาะสำหรับธุรกิจแฟรนไชส์หรือมีหน้าร้านหลายแห่ง" />
              )}
            </div>
          )}

          {/* TAB: FEEDBACK HUB */}
          {activeTab === 'feedback' && (
            <div className="max-w-6xl mx-auto h-full flex flex-col animate-in fade-in duration-300">
              <div className="mb-6 shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className={`text-2xl font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                    <MessageSquare className="w-6 h-6 text-indigo-600" /> Feedback Hub
                  </h2>
                  <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    เสนอแนะฟีเจอร์ใหม่ หรือแจ้งปัญหา ข้อมูลของคุณจะถูกส่งตรงถึงทีม AIVA Super Admin ทันที
                  </p>
                </div>
              </div>

              {showFeedbackSuccess && (
                <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-4 shrink-0 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400">
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm">ส่งข้อมูลสำเร็จ!</h4>
                    <p className="text-xs mt-1">ขอบคุณที่มีส่วนร่วมในการปรับปรุง AIVA เราจะนำ Feedback ของคุณ (Customer ID: C123456) ไปพิจารณาอย่างเร็วที่สุดค่ะ</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
                {/* Form */}
                <div className={`rounded-2xl border shadow-sm p-6 flex flex-col overflow-y-auto custom-scrollbar ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                  <div className="flex gap-2 mb-6">
                    <button onClick={()=>setFeedbackForm({...feedbackForm, type:'feature'})} className={`flex-1 py-3 rounded-xl border font-bold text-sm transition-all ${feedbackForm.type==='feature' ? (isDarkMode ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400' : 'bg-indigo-50 border-indigo-200 text-indigo-700') : (isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100')}`}>
                      <Lightbulb className="w-4 h-4 inline mr-1.5"/> เสนอไอเดีย
                    </button>
                    <button onClick={()=>setFeedbackForm({...feedbackForm, type:'bug'})} className={`flex-1 py-3 rounded-xl border font-bold text-sm transition-all ${feedbackForm.type==='bug' ? (isDarkMode ? 'bg-rose-500/20 border-rose-500/50 text-rose-400' : 'bg-rose-50 border-rose-200 text-rose-700') : (isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100')}`}>
                      <Bug className="w-4 h-4 inline mr-1.5"/> แจ้งปัญหา
                    </button>
                  </div>
                  
                  <div className="space-y-4 flex-1">
                    <div className="space-y-1.5">
                      <label className={`text-sm font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>หัวข้อเรื่อง</label>
                      <input type="text" placeholder="เช่น ขอให้ AI สรุปยอดอัตโนมัติ" value={feedbackForm.title} onChange={e=>setFeedbackForm({...feedbackForm, title: e.target.value})} className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-200 placeholder:text-slate-600' : 'bg-slate-50 border-slate-200 text-slate-800'}`} />
                    </div>
                    <div className="space-y-1.5">
                      <label className={`text-sm font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>รายละเอียด</label>
                      <textarea rows="5" placeholder="อธิบายรายละเอียดปัญหา หรือฟีเจอร์ที่คุณอยากให้เราพัฒนาเพิ่มเติม..." value={feedbackForm.description} onChange={e=>setFeedbackForm({...feedbackForm, description: e.target.value})} className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 resize-none transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-200 placeholder:text-slate-600' : 'bg-slate-50 border-slate-200 text-slate-800'}`} />
                    </div>
                  </div>

                  <button onClick={handleSubmitFeedback} disabled={!feedbackForm.title || !feedbackForm.description || isSubmittingFeedback} className={`w-full py-3.5 rounded-xl font-bold text-sm mt-6 flex justify-center items-center gap-2 transition-all shadow-sm ${(!feedbackForm.title || !feedbackForm.description) ? (isDarkMode ? 'bg-slate-700 text-slate-500' : 'bg-slate-100 text-slate-400') : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}>
                    {isSubmittingFeedback ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4" />} 
                    {isSubmittingFeedback ? 'กำลังส่งข้อมูล...' : 'ส่งข้อมูลให้ทีมงาน AIVA'}
                  </button>
                </div>

                {/* History */}
                <div className={`rounded-2xl border shadow-sm flex flex-col min-h-0 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                  <div className={`p-5 border-b shrink-0 ${isDarkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-100 bg-slate-50/50'}`}>
                     <h3 className={`font-bold flex items-center justify-between ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                       ประวัติการติดตาม (Ticket History)
                       <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${isDarkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-700'}`}>{feedbackList.length} รายการ</span>
                     </h3>
                  </div>
                  <div className="flex-1 overflow-auto custom-scrollbar p-5 space-y-4">
                    {feedbackList.map(item => (
                      <div key={item.id} className={`p-4 rounded-xl border transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-700 hover:border-slate-600' : 'bg-white border-slate-200 hover:border-indigo-100'}`}>
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-start gap-2">
                             {item.type === 'feature' ? <Lightbulb className={`w-4 h-4 mt-0.5 shrink-0 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-500'}`}/> : <Bug className={`w-4 h-4 mt-0.5 shrink-0 ${isDarkMode ? 'text-rose-400' : 'text-rose-500'}`}/>}
                             <h4 className={`text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{item.title}</h4>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ml-2 border ${
                            item.status === 'Resolved' ? (isDarkMode ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border-emerald-100') :
                            item.status === 'In Progress' ? (isDarkMode ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-indigo-50 text-indigo-600 border-indigo-100') :
                            (isDarkMode ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-amber-50 text-amber-600 border-amber-100')
                          }`}>{item.status}</span>
                        </div>
                        <p className={`text-xs pl-6 mb-3 line-clamp-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{item.description}</p>
                        <div className="flex justify-between items-center pl-6">
                           <span className={`text-[9px] font-mono ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>TICKET #{item.id.toString().slice(-6)}</span>
                           <span className={`text-[9px] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{item.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: INTEGRATIONS */}
          {activeTab === 'integrations' && (
            <div className="max-w-5xl mx-auto animate-in fade-in duration-300">
              <div className="mb-8 text-center">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner ${isDarkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>
                  <Plug className="w-8 h-8" />
                </div>
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{t('integrations')} (App Directory)</h2>
                <p className={`mt-2 max-w-xl mx-auto text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>เชื่อมต่อ AI เข้ากับแพลตฟอร์มโซเชียลมีเดียและอีคอมเมิร์ซ เพื่อให้ตอบลูกค้าและซิงค์สต็อกได้ทุกช่องทาง</p>
                <div className="mt-3 flex items-center justify-center gap-2 text-xs font-bold text-slate-500">
                  <span>โควต้าการเชื่อมต่อของคุณ:</span>
                  <span className={`px-2 py-0.5 rounded-full ${connectedApps.length >= maxChannels ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                    {connectedApps.length} / {maxChannels} ช่องทาง
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[
                  { id: 'line', name: 'LINE Official', desc: 'ตอบแชทลูกค้าอัตโนมัติ 24 ชม.', btn: 'bg-[#00B900]' },
                  { id: 'facebook', name: ' Messenger', desc: 'ตอบ Inbox แฟนเพจทันที', btn: 'bg-[#0084FF]' },
                  { id: 'instagram', name: ' Direct', desc: 'ตอบแชทและคอมเมนต์ IG', btn: 'bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F56040]' },
                  { id: 'tiktok', name: 'TikTok Shop', desc: 'ซิงค์ออเดอร์และตอบแชทลูกค้า', btn: isDarkMode ? 'bg-slate-700' : 'bg-slate-900' },
                  { id: 'youtube', name: 'YouTube Comments', desc: 'ให้ AI ช่วยตอบคอมเมนต์คลิป', btn: 'bg-[#FF0000]', disabled: true },
                  { id: 'lazada', name: 'Lazada', desc: 'ซิงค์สต็อกและสถานะออเดอร์', btn: 'bg-[#0F146D]', disabled: true },
                  { id: 'website', name: 'Website Chat Widget', desc: 'ติดกล่องแชท AI บนเว็บไซต์คุณ', btn: 'bg-indigo-600' },
                ].map((app) => (
                  <div key={app.id} className={`rounded-2xl p-5 border flex flex-col transition-all saas-card ${isDarkMode ? 'bg-slate-800 border-slate-700 hover:border-slate-500' : 'bg-white border-slate-200 hover:border-indigo-200'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <AppIcon appId={app.id} />
                      {app.disabled ? (
                         <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${isDarkMode ? 'bg-slate-800 text-slate-500 border-slate-700' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                           Coming Soon
                         </span>
                      ) : connectedApps.includes(app.id) ? (
                         <span className={`text-[10px] font-bold px-2 py-1 rounded-full border flex items-center gap-1 ${isDarkMode ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                           <CheckCircle2 className="w-3 h-3" /> Connected
                         </span>
                      ) : (
                         <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${isDarkMode ? 'bg-slate-700 text-slate-400 border-slate-600' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                           Not Connected
                         </span>
                      )}
                    </div>
                    <h3 className={`text-base font-bold mb-1 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{app.name}</h3>
                    <p className={`text-xs mb-5 flex-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{app.desc}</p>
                    
                    {app.disabled ? (
                       <button disabled className={`w-full py-2 rounded-xl text-sm font-bold transition-all cursor-not-allowed ${isDarkMode ? 'bg-slate-700 text-slate-500' : 'bg-slate-100 text-slate-400'}`}>
                         เร็วๆ นี้ (Coming Soon)
                       </button>
                    ) : connectedApps.includes(app.id) ? (
                       <button onClick={() => setManagingApp(app.id)} className={`w-full py-2 rounded-xl text-sm font-bold border transition-colors shadow-sm ${isDarkMode ? 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
                         Manage
                       </button>
                    ) : (
                       <button onClick={() => handleConnect(app.id)} className={`w-full py-2 text-white rounded-xl text-sm font-bold transition-all shadow-sm hover:opacity-90 ${app.btn}`}>
                         Connect
                       </button>
                    )}
                  </div>
                ))}
              </div>

              {/* OAuth Modal */}
              {connectingApp && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                  <div className={`rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                    <div className="p-6 text-center">
                      <div className="flex justify-center items-center gap-4 mb-6">
                        <div className={`w-20 h-20 border rounded-2xl shadow-sm flex items-center justify-center p-2 bg-white ${isDarkMode ? 'border-slate-600' : 'border-slate-200'}`}>
                           <img src="https://i.postimg.cc/9fvVLjRT/AIVA-Trasparent.png" alt="AIVA Logo" className="w-16 h-16 object-contain" />
                        </div>
                        <RefreshCw className="w-6 h-6 text-slate-300" />
                        <AppIcon appId={connectingApp} size="lg" />
                      </div>
                      
                      <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Authorize Access</h3>
                      <p className={`text-sm mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>AIVA requires permission to access your account to read and send messages.</p>
                      
                      {['facebook', 'instagram', 'tiktok'].includes(connectingApp) && (
                        <div className="mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
                          <button
                            type="button"
                            onClick={() => handleOAuthPopup(connectingApp)}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-xs"
                          >
                            <Plug className="w-4 h-4" /> เชื่อมต่ออัตโนมัติด้วย OAuth (แนะนำ)
                          </button>
                          <div className="flex items-center gap-3 my-4">
                            <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1"></div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">หรือกรอกค่าด้วยตนเอง</span>
                            <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1"></div>
                          </div>
                        </div>
                      )}
                      
                      {connectingApp === 'line' && (
                        <div className="space-y-3 mb-6 text-left">
                          <div>
                            <label className={`text-xs font-bold block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>LINE Channel Access Token</label>
                            <input type="text" value={lineConfig.channelAccessToken} onChange={e => setLineConfig({ ...lineConfig, channelAccessToken: e.target.value })} placeholder="ey..." className={`w-full text-xs px-3 py-2.5 border rounded-xl outline-none focus:border-indigo-500 ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-800'}`} />
                          </div>
                          <div>
                            <label className={`text-xs font-bold block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>LINE Channel Secret</label>
                            <input type="password" value={lineConfig.channelSecret} onChange={e => setLineConfig({ ...lineConfig, channelSecret: e.target.value })} placeholder="xxxx" className={`w-full text-xs px-3 py-2.5 border rounded-xl outline-none focus:border-indigo-500 ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-800'}`} />
                          </div>
                        </div>
                      )}

                      {connectingApp === 'facebook' && (
                        <div className="space-y-3 mb-6 text-left">
                          <div>
                            <label className={`text-xs font-bold block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Facebook Page Access Token</label>
                            <input type="text" value={fbConfig.pageAccessToken} onChange={e => setFbConfig({ ...fbConfig, pageAccessToken: e.target.value })} placeholder="EAAB..." className={`w-full text-xs px-3 py-2.5 border rounded-xl outline-none focus:border-indigo-500 ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-800'}`} />
                          </div>
                          <div>
                            <label className={`text-xs font-bold block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Facebook Page ID</label>
                            <input type="text" value={fbConfig.pageId} onChange={e => setFbConfig({ ...fbConfig, pageId: e.target.value })} placeholder="123456789" className={`w-full text-xs px-3 py-2.5 border rounded-xl outline-none focus:border-indigo-500 ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-800'}`} />
                          </div>
                        </div>
                      )}

                      {connectingApp === 'instagram' && (
                        <div className="space-y-3 mb-6 text-left">
                          <div>
                            <label className={`text-xs font-bold block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Instagram Access Token</label>
                            <input type="text" value={igConfig.pageAccessToken} onChange={e => setIgConfig({ ...igConfig, pageAccessToken: e.target.value })} placeholder="IG..." className={`w-full text-xs px-3 py-2.5 border rounded-xl outline-none focus:border-indigo-500 ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-800'}`} />
                          </div>
                          <div>
                            <label className={`text-xs font-bold block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Instagram Business Page ID</label>
                            <input type="text" value={igConfig.pageId} onChange={e => setIgConfig({ ...igConfig, pageId: e.target.value })} placeholder="123456789" className={`w-full text-xs px-3 py-2.5 border rounded-xl outline-none focus:border-indigo-500 ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-800'}`} />
                          </div>
                        </div>
                      )}

                      {connectingApp === 'website' && (
                        <div className="space-y-3 mb-6 text-left">
                          <div>
                            <label className={`text-xs font-bold block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Widget Theme Color</label>
                            <input type="color" value={webConfig.themeColor} onChange={e => setWebConfig({ ...webConfig, themeColor: e.target.value })} className={`w-full h-8 cursor-pointer rounded-xl border ${isDarkMode ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'}`} />
                          </div>
                          <div>
                            <label className={`text-xs font-bold block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Greeting Message</label>
                            <input type="text" value={webConfig.greeting} onChange={e => setWebConfig({ ...webConfig, greeting: e.target.value })} className={`w-full text-xs px-3 py-2 border rounded-xl outline-none focus:border-indigo-500 ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-800'}`} />
                          </div>
                        </div>
                      )}

                      {!['line', 'facebook', 'instagram', 'website'].includes(connectingApp) && (
                        <div className={`space-y-3 mb-8 text-left p-4 rounded-xl border ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                          <div className={`flex items-start gap-2 text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}><Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> <span>Read incoming messages</span></div>
                          <div className={`flex items-start gap-2 text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}><Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> <span>Send messages as your page</span></div>
                        </div>
                      )}

                      <div className="flex gap-3">
                        <button onClick={() => setConnectingApp(null)} disabled={isAuthorizing} className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-colors ${isDarkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Cancel</button>
                        <button 
                          onClick={handleAuthorize} 
                          disabled={isAuthorizeDisabled()} 
                          className={`flex-1 py-2.5 rounded-xl font-bold text-sm text-white transition-colors shadow-sm flex items-center justify-center gap-2 ${
                            isAuthorizeDisabled() 
                              ? 'bg-indigo-600/50 cursor-not-allowed opacity-60' 
                              : 'bg-indigo-600 hover:bg-indigo-700'
                          }`}
                        >
                          {isAuthorizing ? <RefreshCw className="w-5 h-5 animate-spin" /> : 'Authorize'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Manage Connection Modal */}
              {managingApp && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                  <div className={`rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                    <div className={`p-5 border-b flex justify-between items-center ${isDarkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-100 bg-slate-50/50'}`}>
                      <div className="flex items-center gap-3">
                        <AppIcon appId={managingApp} size="sm" />
                        <div>
                          <h3 className={`font-bold capitalize ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{managingApp} Configuration</h3>
                          <p className="text-[10px] font-bold text-emerald-500 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active</p>
                        </div>
                      </div>
                      <button onClick={() => setManagingApp(null)} className={`p-2 rounded-lg border shadow-sm transition-colors ${isDarkMode ? 'text-slate-400 border-slate-600 hover:bg-slate-700' : 'text-slate-400 border-slate-200 bg-white hover:bg-slate-50'}`}><X className="w-4 h-4"/></button>
                    </div>
                    
                    <div className="p-6 space-y-5">
                      <div className="space-y-2">
                        <label className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>Webhook URL</label>
                        <div className="flex gap-2">
                          <input type="text" readOnly value={`${window.location.origin}/api/webhooks/${managingApp}/${clientId}`} className={`flex-1 border rounded-xl text-xs px-3 py-2.5 font-mono outline-none ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`} />
                          <button onClick={() => {
                            navigator.clipboard.writeText(`${window.location.origin}/api/webhooks/${managingApp}/${clientId}`);
                            showToast('คัดลอก Webhook URL แล้วค่ะ!', 'success');
                          }} className={`px-3 rounded-xl text-xs font-bold transition-colors border shadow-sm flex items-center justify-center ${isDarkMode ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/30' : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-100'}`} title="Copy"><Copy className="w-4 h-4"/></button>
                        </div>
                      </div>

                      <div className={`pt-4 border-t flex justify-between items-center ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                        <button onClick={() => handleDisconnect(managingApp)} className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${isDarkMode ? 'text-rose-400 hover:text-rose-300 hover:bg-rose-500/10' : 'text-rose-500 hover:text-rose-600 hover:bg-rose-50/10'}`}><Trash2 className="w-4 h-4" /> Disconnect</button>
                        <button onClick={() => setManagingApp(null)} className={`px-5 py-2 rounded-xl text-sm font-bold shadow-sm transition-colors ${isDarkMode ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>Done</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: TEAM */}
          {activeTab === 'team' && (
            <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
               <div className="flex justify-between items-end">
                  <div>
                    <h1 className={`text-2xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t('team')}</h1>
                    <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>เพิ่มบัญชีให้พนักงานหรือแอดมินเข้ามาช่วยดูแลแชท</p>
                  </div>
               </div>
               <div className={`rounded-2xl border shadow-sm ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                  <div className={`p-4 flex justify-between items-center border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                     <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                       รายชื่อทีม ({teamMembers.length}/{maxUsers} Users)
                     </h3>
                     {teamMembers.length >= maxUsers ? (
                       <button onClick={() => setActiveTab('billing')} className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5">
                         อัปเกรดแพ็กเกจ
                       </button>
                     ) : (
                       <button onClick={() => setShowAddMember(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5">
                         <Plus className="w-3.5 h-3.5"/> เพิ่มสมาชิก
                       </button>
                     )}
                  </div>
                  <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left text-sm whitespace-nowrap min-w-[700px]">
                       <thead className={`text-[10px] uppercase tracking-widest font-bold border-b ${isDarkMode ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>
                          <tr><th className="px-5 py-3">ชื่อพนักงาน</th><th className="px-5 py-3">สาขาที่ดูแล</th><th className="px-5 py-3">บทบาท</th><th className="px-5 py-3">สถานะ</th><th className="px-5 py-3 text-right">จัดการ</th></tr>
                       </thead>
                       <tbody className={`divide-y ${isDarkMode ? 'divide-slate-700/50' : 'divide-slate-100'}`}>
                          {teamMembers.map(member => (
                            <tr key={member.id} className={isDarkMode ? 'hover:bg-slate-700/30' : 'hover:bg-slate-50'}>
                               <td className="px-5 py-4 flex items-center gap-3">
                                  <div className={`w-8 h-8 rounded-full font-bold flex items-center justify-center text-xs uppercase ${isDarkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-700'}`}>
                                    {member.name.substring(0, 2)}
                                  </div>
                                  <div>
                                    <p className={`font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{member.name}</p>
                                    <p className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{member.email}</p>
                                  </div>
                               </td>
                               <td className="px-5 py-4">
                                 <span className={`text-[10px] font-bold flex items-center gap-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                   <Store className="w-3.5 h-3.5 text-indigo-500" /> {member.branch || 'HQ'}
                                 </span>
                               </td>
                               <td className="px-5 py-4">
                                 <span className={`text-[10px] font-bold px-2 py-1 rounded ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>{member.role}</span>
                               </td>
                               <td className="px-5 py-4">
                                 <span className={`text-[10px] font-bold px-2 py-1 rounded border ${member.status === 'Active' ? (isDarkMode ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-emerald-600 bg-emerald-50 border-emerald-100') : (isDarkMode ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : 'text-amber-600 bg-amber-50 border-amber-100')}`}>
                                   {member.status}
                                 </span>
                               </td>
                               <td className="px-5 py-4 text-right">
                                 {member.role !== 'OWNER' && member.email !== currentUserObj?.email ? (
                                   <button onClick={() => handleRemoveMember(member.id)} className={`text-rose-400 hover:text-rose-600 transition-colors p-1.5 rounded-lg ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`} title="ลบสมาชิก">
                                     <Trash2 className="w-4 h-4 inline"/>
                                   </button>
                                 ) : (
                                   <button 
                                     onClick={() => {
                                       if (member.email === currentUserObj?.email) {
                                         setActiveTab('settings');
                                       } else {
                                         showToast('คุณสามารถแก้ไขโปรไฟล์เฉพาะของตัวคุณเองเท่านั้นค่ะ', 'info');
                                       }
                                     }}
                                     className={`text-slate-400 hover:text-indigo-600 transition-colors p-1.5 rounded-lg ${isDarkMode ? 'hover:text-indigo-400 hover:bg-slate-700' : 'hover:bg-slate-100'}`} 
                                     title="ตั้งค่า"
                                   >
                                     <Settings className="w-4 h-4 inline"/>
                                   </button>
                                 )}
                               </td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                  </div>
               </div>

               {/* Add Member Modal */}
               {showAddMember && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className={`rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                    <div className={`p-5 border-b flex justify-between items-center ${isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-100 bg-slate-50'}`}>
                      <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>เพิ่มสมาชิกในทีม</h3>
                      <button onClick={() => setShowAddMember(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="space-y-1.5">
                        <label className={`text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>ชื่อพนักงาน</label>
                        <input type="text" maxLength={150} value={newMember.name} onChange={(e)=>setNewMember({...newMember, name: e.target.value})} placeholder="เช่น น้องพลอย แอดมิน" className={`w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500 ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-200 placeholder:text-slate-500' : 'bg-white border-slate-200 text-slate-800'}`} />
                      </div>
                      <div className="space-y-1.5">
                        <label className={`text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>อีเมล</label>
                        <input type="email" value={newMember.email} onChange={(e)=>setNewMember({...newMember, email: e.target.value})} placeholder="ploy@example.com" className={`w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500 ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-200 placeholder:text-slate-500' : 'bg-white border-slate-200 text-slate-800'}`} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className={`text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>สาขา (Branch)</label>
                          <select value={newMember.branch} onChange={(e)=>setNewMember({...newMember, branch: e.target.value})} className={`w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500 ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-800'}`}>
                            <option value="HQ">สำนักงานใหญ่ (HQ)</option>
                            {branchData.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className={`text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>บทบาท (Role)</label>
                          <select value={newMember.role} onChange={(e)=>setNewMember({...newMember, role: e.target.value})} className={`w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500 ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-800'}`}>
                            <option value="ADMIN">ADMIN (แอดมิน)</option>
                            <option value="MANAGER">MANAGER (ผู้จัดการ)</option>
                          </select>
                        </div>
                      </div>
                      <button onClick={handleAddMember} disabled={!newMember.name || !newMember.email} className={`w-full font-bold py-2.5 rounded-xl mt-4 transition-colors ${!newMember.name || !newMember.email ? (isDarkMode ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-slate-100 text-slate-400 cursor-not-allowed') : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}>
                        ส่งคำเชิญ
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: BILLING */}
          {activeTab === 'billing' && (
            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300 pb-10">
               <div className="text-center max-w-2xl mx-auto mb-8">
                  <h1 className={`text-3xl font-bold tracking-tight mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>จัดการแพ็กเกจ (Billing & Plans)</h1>
                  <p className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>อัปเกรดแพ็กเกจให้ตรงกับขนาดธุรกิจของคุณ เพื่อปลดล็อกฟีเจอร์ระดับ Superpowers</p>
                  
                  {/* Billing Toggle (Sync with Landing Page) */}
                  <div className={`mt-8 inline-flex items-center p-1 rounded-full relative overflow-x-auto max-w-full ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                    <div className={`absolute top-1 bottom-1 left-1 w-[calc(33.333%-2.66px)] rounded-full shadow-sm transition-transform duration-300 ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`} style={{ transform: billingCycle === 'monthly' ? 'translateX(0)' : billingCycle === 'halfYear' ? 'translateX(100%)' : 'translateX(200%)' }}></div>
                    
                    <button onClick={() => setBillingCycle('monthly')} className={`relative z-10 px-3 sm:px-4 py-2.5 text-sm font-bold transition-colors rounded-full w-[110px] sm:w-[150px] flex items-center justify-center whitespace-nowrap ${billingCycle === 'monthly' ? (isDarkMode ? 'text-white' : 'text-slate-900') : 'text-slate-500 hover:text-slate-700'}`}>
                        รายเดือน
                    </button>
                    <button onClick={() => setBillingCycle('halfYear')} className={`relative z-10 px-3 sm:px-4 py-2.5 text-sm font-bold transition-colors rounded-full w-[110px] sm:w-[150px] flex items-center justify-center gap-1 sm:gap-1.5 whitespace-nowrap ${billingCycle === 'halfYear' ? (isDarkMode ? 'text-white' : 'text-slate-900') : 'text-slate-500 hover:text-slate-700'}`}>
                        ราย 6 เดือน <span className="bg-indigo-100 text-indigo-700 text-[9px] px-1.5 py-0.5 rounded-full shrink-0">ลด 3%</span>
                    </button>
                    <button onClick={() => setBillingCycle('yearly')} className={`relative z-10 px-3 sm:px-4 py-2.5 text-sm font-bold transition-colors rounded-full w-[110px] sm:w-[150px] flex items-center justify-center gap-1 sm:gap-1.5 whitespace-nowrap ${billingCycle === 'yearly' ? (isDarkMode ? 'text-white' : 'text-slate-900') : 'text-slate-500 hover:text-slate-700'}`}>
                        รายปี <span className="bg-emerald-100 text-emerald-700 text-[9px] px-1.5 py-0.5 rounded-full shrink-0">ลด 15%</span>
                    </button>
                  </div>
               </div>
               
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Basic */}
                  <div className={`rounded-3xl p-8 border flex flex-col transition-all duration-300 ${currentPlan==='Basic' ? (isDarkMode ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-xl bg-slate-800' : 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-xl bg-white') : (isDarkMode ? 'border-slate-700 shadow-sm bg-slate-800/50 hover:border-slate-600' : 'border-slate-200 shadow-sm bg-white hover:border-slate-300')}`}>
                     <h3 className={`text-xl font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}><span className="w-3 h-3 rounded-full bg-emerald-500"></span> AIVA Basic</h3>
                     <p className={`text-sm mt-1 mb-4 font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>AIVA Receptionist</p>
                     <div className="mb-6 flex items-end gap-1">
                       <span className={`text-4xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                         ฿{billingCycle === 'monthly' ? '990' : billingCycle === 'halfYear' ? '5,761' : '10,098'}
                       </span>
                       <span className={`font-medium mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>/{billingCycle === 'monthly' ? 'เดือน' : billingCycle === 'halfYear' ? '6 เดือน' : 'ปี'}</span>
                     </div>
                     <button onClick={()=>handleUpgradePlan('Basic')} disabled={currentPlan==='Basic'} className={`w-full py-3 rounded-xl font-bold text-sm mb-8 transition-colors ${currentPlan==='Basic' ? (isDarkMode ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default' : 'bg-emerald-100 text-emerald-700 border border-emerald-200 cursor-default') : (isDarkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-slate-100 text-slate-800 hover:bg-slate-200')}`}>{currentPlan==='Basic' ? 'แพ็กเกจปัจจุบัน' : 'ดาวน์เกรด'}</button>
                     <div className="space-y-3 flex-1">
                        <p className={`text-xs font-bold mb-4 ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>สิ่งที่ได้รับ:</p>
                        <PricingFeature text="เลือกเชื่อมต่อ 1 ช่องทาง" included isDark={isDarkMode} />
                        <PricingFeature text="AIVA ตอบคำถามลูกค้าอัตโนมัติ 24 ชม." included isDark={isDarkMode} />
                        <PricingFeature text="อัปโหลดข้อมูล (Knowledge Base)" included isDark={isDarkMode} />
                        <PricingFeature text="เก็บข้อมูลลูกค้า (Lead Capture)" included isDark={isDarkMode} />
                        <PricingFeature text="ส่งต่อให้แอดมินตอบได้ (Human Handoff)" included isDark={isDarkMode} />
                        <PricingFeature text="Dashboard ดูประวัติแชท (90 วัน)" included isDark={isDarkMode} />
                        <PricingFeature text="ผู้ใช้งาน 1 Admin User" included isDark={isDarkMode} />
                     </div>
                  </div>
                  {/* Pro */}
                  <div className={`rounded-3xl p-8 border flex flex-col relative transition-all duration-300 ${currentPlan==='Pro' ? (isDarkMode ? 'border-indigo-500 ring-4 ring-indigo-500/20 shadow-2xl bg-slate-800 scale-105 z-10' : 'border-indigo-500 ring-4 ring-indigo-500/20 shadow-2xl bg-slate-900 scale-105 z-10') : (isDarkMode ? 'border-slate-700 shadow-sm bg-slate-800/80 hover:border-indigo-500/50' : 'border-slate-800 shadow-xl bg-slate-900 hover:border-indigo-500/50')}`}>
                     <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-indigo-500 text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">ยอดนิยม (Most Popular)</div>
                     <h3 className="text-xl font-bold flex items-center gap-2 text-white"><span className="w-3 h-3 rounded-full bg-blue-500"></span> AIVA Pro</h3>
                     <p className="text-sm mt-1 mb-4 font-bold text-blue-400">AIVA Sales Assistant</p>
                     <div className="mb-6 flex items-end gap-1">
                       <span className="text-4xl font-black text-white">
                         ฿{billingCycle === 'monthly' ? '4,900' : billingCycle === 'halfYear' ? '28,518' : '49,980'}
                       </span>
                       <span className="font-medium mb-1 text-slate-400">/{billingCycle === 'monthly' ? 'เดือน' : billingCycle === 'halfYear' ? '6 เดือน' : 'ปี'}</span>
                     </div>
                     <button onClick={()=>handleUpgradePlan('Pro')} disabled={currentPlan==='Pro'} className={`w-full py-3 rounded-xl font-bold text-sm mb-8 transition-colors ${currentPlan==='Pro' ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/50 cursor-default' : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/25'}`}>{currentPlan==='Pro' ? 'แพ็กเกจปัจจุบัน' : 'อัปเกรดเป็น Pro'}</button>
                     <div className="space-y-3 flex-1">
                        <p className="text-xs font-bold mb-4 text-white">ทุกอย่างใน Basic และเพิ่ม:</p>
                        <PricingFeature text="เลือกเชื่อมต่อ 2 ช่องทาง" included forceDark={true} />
                        <PricingFeature text="CRM Pipeline ติดตามสถานะลูกค้า" included forceDark={true} />
                        <PricingFeature text="AIVA Lead Score™ วิเคราะห์ความสนใจ" included forceDark={true} />
                        <PricingFeature text="AIVA Smart Follow-Up™ ทวงตะกร้า" included forceDark={true} />
                        <PricingFeature text="AIVA Content Generator" included forceDark={true} />
                        <PricingFeature text="AIVA Persona™ สไตล์ตอบแชท" included forceDark={true} />
                        <PricingFeature text="ผู้ใช้งาน 5 Admin Users" included forceDark={true} />
                     </div>
                  </div>
                  {/* Advanced */}
                  <div className={`rounded-3xl p-8 border flex flex-col transition-all duration-300 ${currentPlan==='Advanced' ? (isDarkMode ? 'border-purple-500 ring-2 ring-purple-500/20 shadow-xl bg-slate-800' : 'border-purple-500 ring-2 ring-purple-500/20 shadow-xl bg-white') : (isDarkMode ? 'border-slate-700 shadow-sm bg-slate-800/50 hover:border-slate-600' : 'border-slate-200 shadow-sm bg-white hover:border-slate-300')}`}>
                     <h3 className={`text-xl font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}><span className="w-3 h-3 rounded-full bg-purple-500"></span> AIVA Advanced</h3>
                     <p className={`text-sm mt-1 mb-4 font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>AIVA Business Growth Platform</p>
                     <div className="mb-6 flex items-end gap-1">
                       <span className={`text-4xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                         ฿{billingCycle === 'monthly' ? '11,900' : billingCycle === 'halfYear' ? '69,258' : '121,380'}
                       </span>
                       <span className={`font-medium mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>/{billingCycle === 'monthly' ? 'เดือน' : billingCycle === 'halfYear' ? '6 เดือน' : 'ปี'}</span>
                     </div>
                     <button onClick={()=>handleUpgradePlan('Advanced')} disabled={currentPlan==='Advanced'} className={`w-full py-3 rounded-xl font-bold text-sm mb-8 transition-colors ${currentPlan==='Advanced' ? (isDarkMode ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30 cursor-default' : 'bg-purple-100 text-purple-700 border border-purple-200 cursor-default') : (isDarkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-white border border-slate-300 text-slate-800 hover:bg-slate-50')}`}>{currentPlan==='Advanced' ? 'แพ็กเกจปัจจุบัน' : 'อัปเกรดเป็น Advanced'}</button>
                     <div className="space-y-3 flex-1">
                        <p className={`text-xs font-bold mb-4 ${isDarkMode ? 'text-purple-300' : 'text-purple-700'}`}>ทุกอย่างใน Pro และเพิ่ม:</p>
                        <PricingFeature text="เลือกเชื่อมต่อ 6 ช่องทาง" included isDark={isDarkMode} />
                        <PricingFeature text="Multi Branch Management" included isDark={isDarkMode} />
                        <PricingFeature text="AIVA Social Growth™" included isDark={isDarkMode} />
                        <PricingFeature text="AIVA Lost Revenue Detector™" included isDark={isDarkMode} />
                        <PricingFeature text="AIVA CEO Daily Report™" included isDark={isDarkMode} />
                        <PricingFeature text="API & Webhook Integration" included isDark={isDarkMode} />
                        <PricingFeature text="ผู้ใช้งาน 20 Admin Users" included isDark={isDarkMode} />
                     </div>
                  </div>
               </div>
            </div>
          )}

          {/* TAB: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300 pb-10">
               <div className="mb-6 flex justify-between items-end">
                  <div>
                    <h1 className={`text-2xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t('settings')}</h1>
                    <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>จัดการข้อมูลธุรกิจ โปรไฟล์ของคุณ และปรับแต่งบุคลิกภาพหลักของ AI</p>
                  </div>
                  <button onClick={handleSaveSettings} className={`px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-colors flex items-center gap-2 ${settingsSaved ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}>
                    <CheckCircle2 className="w-4 h-4"/> {settingsSaved ? t('saved') : t('saveSettings')}
                  </button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Profile Info */}
                 <div className={`rounded-2xl border p-6 shadow-sm ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                    <h2 className={`font-bold mb-5 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}><Users className="w-5 h-5 text-indigo-500" /> ข้อมูลส่วนตัว (Profile)</h2>
                    <div className="space-y-4">
                       <div>
                          <label className={`text-xs font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>ชื่อผู้ใช้งาน (Boss Name)</label>
                          <input type="text" maxLength={150} value={editProfile.bossName} onChange={(e) => setEditProfile({...editProfile, bossName: e.target.value})} className={`w-full border rounded-xl px-4 py-2.5 text-sm mt-1.5 outline-none focus:border-indigo-500 ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200'}`} />
                       </div>
                       <div>
                          <label className={`text-xs font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>อีเมล (Email)</label>
                          <input type="email" value={editProfile.bossEmail || ''} onChange={(e) => setEditProfile({...editProfile, bossEmail: e.target.value})} className={`w-full border rounded-xl px-4 py-2.5 text-sm mt-1.5 outline-none focus:border-indigo-500 ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200'}`} />
                       </div>
                    </div>
                 </div>

                 {/* Business Info */}
                 <div className={`rounded-2xl border p-6 shadow-sm ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                    <h2 className={`font-bold mb-5 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}><Store className="w-5 h-5 text-indigo-500" /> ข้อมูลธุรกิจ (Business Info)</h2>
                    <div className="space-y-4">
                       <div className="flex gap-4">
                         <div className="flex-1">
                            <label className={`text-xs font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Customer ID</label>
                            <input type="text" readOnly value="C123456" className={`w-full border rounded-xl px-4 py-2.5 text-sm mt-1.5 font-mono outline-none cursor-not-allowed ${isDarkMode ? 'bg-slate-900/50 border-slate-700 text-slate-500' : 'bg-slate-100 border-slate-200 text-slate-500'}`} />
                         </div>
                         <div className="flex-1">
                            <label className={`text-xs font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>หมวดหมู่ธุรกิจ</label>
                            <select value={editProfile.businessType} onChange={(e) => setEditProfile({...editProfile, businessType: e.target.value})} className={`w-full border rounded-xl px-4 py-2.5 text-sm mt-1.5 outline-none focus:border-indigo-500 ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200'}`}>
                              <option value="ecommerce">สินค้าออนไลน์ / E-commerce</option>
                              <option value="service">บริการ / คลินิก / ร้านอาหาร</option>
                              <option value="b2b">ธุรกิจ B2B / ตัวแทนจำหน่าย</option>
                            </select>
                         </div>
                       </div>
                       <div>
                          <label className={`text-xs font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>ชื่อธุรกิจ (Display Name)</label>
                          <input type="text" value={editProfile.brandName} onChange={(e) => setEditProfile({...editProfile, brandName: e.target.value})} className={`w-full border rounded-xl px-4 py-2.5 text-sm mt-1.5 outline-none focus:border-indigo-500 ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-200'}`} />
                       </div>
                    </div>
                 </div>

                 {/* AI Persona Settings */}
                 <div className={`rounded-2xl border p-6 shadow-sm ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                    <h2 className={`font-bold mb-5 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}><Bot className="w-5 h-5 text-indigo-500" /> บุคลิกภาพหลักของ AI (AI Persona)</h2>
                    <div className="space-y-4">
                       <div>
                          <label className={`text-xs font-bold flex justify-between ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            <span>ชื่อของ AI (เวลาแนะนำตัวกับลูกค้า)</span>
                            <span className="text-[10px] font-normal">เช่น น้องแอดมิน, AIVA</span>
                          </label>
                          <input type="text" value={workspaceSettings.aiName} onChange={(e) => setWorkspaceSettings({...workspaceSettings, aiName: e.target.value})} className={`w-full border rounded-xl px-4 py-2.5 text-sm mt-1.5 outline-none focus:border-indigo-500 ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200'}`} />
                       </div>
                       <div>
                          <label className={`text-xs font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>สไตล์การตอบคำถาม (Tone of Voice)</label>
                          <select value={workspaceSettings.aiPersona} onChange={(e) => setWorkspaceSettings({...workspaceSettings, aiPersona: e.target.value})} className={`w-full border rounded-xl px-4 py-2.5 text-sm mt-1.5 outline-none focus:border-indigo-500 ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200'}`}>
                            <option value="friendly">น่ารัก เป็นกันเอง มีอิโมจิ (แนะนำ)</option>
                            <option value="professional">สุภาพ เป็นทางการ น่าเชื่อถือ</option>
                            <option value="sale">เน้นปิดการขาย เชียร์เก่ง</option>
                          </select>
                       </div>
                       <div className="pt-2">
                          <label className={`text-xs font-bold flex justify-between items-center ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            <span>Custom Prompt (ปรับแต่งคำสั่ง AI เชิงลึก)</span>
                            {currentPlan === 'Basic' && <span className="text-[9px] bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded flex items-center gap-1 border border-amber-500/20"><Lock className="w-3 h-3"/> เฉพาะแพ็กเกจ Pro ขึ้นไป</span>}
                          </label>
                          <textarea 
                            rows="3" 
                            disabled={currentPlan === 'Basic'}
                            value={workspaceSettings.customPrompt || ''}
                            onChange={(e) => setWorkspaceSettings({...workspaceSettings, customPrompt: e.target.value})}
                            placeholder={currentPlan === 'Basic' ? 'อัปเกรดเป็นแพ็กเกจ Pro ขึ้นไป เพื่อพิมพ์คำสั่งควบคุม AI แบบอิสระด้วยตัวเอง' : 'เช่น ให้ลงท้ายด้วยคำว่า "เจ้าคะ" เสมอ, ห้ามตอบคำถามคู่แข่ง...'}
                            className={`w-full border rounded-xl px-4 py-2.5 text-sm mt-1.5 outline-none resize-none transition-colors ${
                              currentPlan === 'Basic' 
                                ? (isDarkMode ? 'bg-slate-900/50 border-slate-700 text-slate-500 cursor-not-allowed' : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed placeholder:text-slate-400/50')
                                : (isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-200 focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-500')
                            }`} 
                          />
                       </div>
                    </div>
                 </div>

                 {/* Notifications */}
                 <div className={`rounded-2xl border p-6 shadow-sm ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                    <h2 className={`font-bold mb-5 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}><Bell className="w-5 h-5 text-indigo-500" /> การแจ้งเตือน (Notifications)</h2>
                    <div className="space-y-4">
                       <div className={`p-4 rounded-xl border flex items-center justify-between ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                          <div>
                            <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>แจ้งเตือนเมื่อพบลูกค้าระดับ Hot Lead</p>
                            <p className={`text-[10px] mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>ส่งแจ้งเตือนเข้า LINE ทันทีเมื่อ AI ประเมินว่าลูกค้าพร้อมโอน</p>
                          </div>
                          <div onClick={() => setWorkspaceSettings({...workspaceSettings, notifyHotLead: !workspaceSettings.notifyHotLead})} className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors shrink-0 ${workspaceSettings.notifyHotLead ? 'bg-emerald-500' : (isDarkMode ? 'bg-slate-600' : 'bg-slate-300')}`}>
                            <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${workspaceSettings.notifyHotLead ? 'translate-x-5' : 'translate-x-1'}`}></div>
                          </div>
                       </div>
                       
                       <div className={`p-4 rounded-xl border flex items-center justify-between ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                          <div>
                            <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>สรุปยอดขายรายวัน (Daily Report)</p>
                            <p className={`text-[10px] mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>ส่งสรุปผลการทำงานของ AI ทุกเช้าเวลา 08:00 น.</p>
                          </div>
                          <div onClick={() => setWorkspaceSettings({...workspaceSettings, notifyDailyReport: !workspaceSettings.notifyDailyReport})} className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors shrink-0 ${workspaceSettings.notifyDailyReport ? 'bg-emerald-500' : (isDarkMode ? 'bg-slate-600' : 'bg-slate-300')}`}>
                            <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${workspaceSettings.notifyDailyReport ? 'translate-x-5' : 'translate-x-1'}`}></div>
                          </div>
                       </div>
                    </div>
                 </div>
               </div>
               
               <div className={`mt-6 pt-6 flex justify-end gap-3 border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                 <button onClick={handleSaveSettings} className={`px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-colors ${settingsSaved ? 'bg-emerald-500 text-white' : (isDarkMode ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-slate-900 hover:bg-indigo-600 text-white')}`}>
                   {settingsSaved ? t('saved') : t('saveSettings')}
                 </button>
               </div>
               
               <div className="pt-4 flex justify-center">
                 <button id="btn-logout-platform" onClick={handleLogout} className="text-rose-500 hover:text-rose-600 hover:bg-rose-50/10 dark:hover:bg-rose-500/10 px-6 py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center gap-2">
                   <LogOut className="w-4 h-4"/> {t('logout')}
                 </button>
               </div>
            </div>
          )}

        </div>
        
        {/* Support Chat Widget */}
        <div className="fixed bottom-6 right-6 z-50">
          {isChatWidgetOpen ? (
            <div className={`w-80 rounded-2xl shadow-2xl border overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-5 duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="p-4 bg-indigo-600 text-white flex justify-between items-center shadow-md z-10 relative">
                 <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-indigo-500 to-violet-600 opacity-50 pointer-events-none"></div>
                 <div className="flex items-center gap-3 relative z-10">
                   <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm overflow-hidden p-1.5">
                     <img src="https://i.postimg.cc/9fvVLjRT/AIVA-Trasparent.png" alt="AIVA Logo" className="w-full h-full object-contain" />
                   </div>
                   <span className="font-bold text-sm">AIVA Support</span>
                 </div>
                 <button onClick={() => setIsChatWidgetOpen(false)} className="hover:bg-white/20 p-1.5 rounded-lg transition-colors relative z-10"><X className="w-5 h-5"/></button>
              </div>
              <div className={`p-4 h-72 overflow-y-auto flex flex-col gap-3 custom-scrollbar ${isDarkMode ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
                 {supportChatHistory.map((msg, idx) => (
                   <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                     <div className={`text-xs p-3.5 rounded-2xl shadow-sm leading-relaxed max-w-[85%] ${
                       msg.sender === 'user'
                         ? 'bg-indigo-600 text-white rounded-tr-sm shadow-sm'
                         : (isDarkMode ? 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-sm' : 'bg-white text-slate-700 border border-slate-100 rounded-tl-sm')
                     }`}>
                       {msg.text}
                     </div>
                     <span className="text-[9px] text-slate-400 dark:text-slate-500 mt-1 px-1">{msg.time}</span>
                   </div>
                 ))}
                 <div ref={supportChatEndRef} />
              </div>
              <div className={`p-3 border-t flex gap-2 ${isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-100 bg-white'}`}>
                 <input
                   type="text"
                   placeholder="พิมพ์ข้อความ..."
                   value={supportChatMessage}
                   onChange={(e) => setSupportChatMessage(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && handleSendSupportChat()}
                   className={`flex-1 px-4 py-2 text-xs rounded-xl border outline-none focus:border-indigo-500 ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
                 />
                 <button
                   onClick={handleSendSupportChat}
                   className="bg-indigo-600 hover:bg-indigo-700 transition-colors text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm"
                 >
                   ส่ง
                 </button>
              </div>
            </div>
          ) : (
            <button onClick={() => setIsChatWidgetOpen(true)} className="w-14 h-14 bg-indigo-600 text-white rounded-full shadow-xl shadow-indigo-500/30 flex items-center justify-center hover:bg-indigo-700 hover:scale-105 transition-all">
              <MessageCircle className="w-6 h-6" />
            </button>
          )}
        </div>

      {/* Add Knowledge Modal */}
      {showAddKnowledge && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className={`rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
            <div className={`p-5 border-b flex justify-between items-center ${isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-100 bg-slate-50'}`}>
              <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                สอน AI ({newKnowledge.type === 'pdf' ? 'อัปโหลดไฟล์ PDF/Word' : newKnowledge.type === 'url' ? 'ดึงข้อมูลจากเว็บไซต์' : 'พิมพ์ข้อความโดยตรง'})
              </h3>
              <button onClick={() => setShowAddKnowledge(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-6 space-y-4">
              {newKnowledge.type === 'url' && (
                <div className="space-y-1.5">
                  <label className={`text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>ที่อยู่ URL</label>
                  <input type="text" value={newKnowledge.url} onChange={(e)=>setNewKnowledge({...newKnowledge, url: e.target.value})} placeholder="https://example.com/faq" className={`w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500 ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-200 placeholder:text-slate-500' : 'bg-white border-slate-200 text-slate-800'}`} />
                </div>
              )}
              
              {newKnowledge.type === 'pdf' && (
                <div className="space-y-1.5">
                  <label className={`text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>เลือกไฟล์เอกสาร (PDF, Word, TXT)</label>
                  <div className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                    isDarkMode ? 'border-slate-700 hover:border-indigo-500 bg-slate-900/30' : 'border-slate-200 hover:border-indigo-500 bg-slate-50'
                  }`}>
                    <input 
                      type="file" 
                      accept=".pdf,.docx,.doc,.txt" 
                      id="file-upload-input"
                      onChange={handleFileChange}
                      className="hidden" 
                    />
                    <label htmlFor="file-upload-input" className="cursor-pointer flex flex-col items-center gap-2 text-center w-full">
                      <UploadCloud className="w-10 h-10 text-indigo-500 animate-bounce" />
                      <span className={`text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'} break-all px-2`}>
                        {selectedFile ? selectedFile.name : 'คลิกเพื่อเลือกไฟล์ หรือลากไฟล์มาวางที่นี่'}
                      </span>
                      <span className="text-[10px] text-slate-400">PDF, DOCX, DOC, TXT (สูงสุด 10MB)</span>
                    </label>
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className={`text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  {newKnowledge.type === 'pdf' ? 'ชื่อเอกสาร / ไฟล์' : newKnowledge.type === 'url' ? 'ชื่อหน้าเว็บ / หัวข้อ' : 'หัวข้อ / คำถาม'}
                </label>
                <input type="text" value={newKnowledge.title} onChange={(e)=>setNewKnowledge({...newKnowledge, title: e.target.value})} placeholder="เช่น คู่มือสินค้าสีใหม่" className={`w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500 ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-200 placeholder:text-slate-500' : 'bg-white border-slate-200 text-slate-800'}`} />
              </div>
              <div className="space-y-1.5">
                <label className={`text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>เนื้อหาข้อมูลรายละเอียด</label>
                <textarea rows="5" value={newKnowledge.content} onChange={(e)=>setNewKnowledge({...newKnowledge, content: e.target.value})} placeholder="พิมพ์คำอธิบายรายละเอียดที่ต้องการให้บอทจำ..." className={`w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500 resize-none ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-200 placeholder:text-slate-500' : 'bg-white border-slate-200 text-slate-800'}`}></textarea>
              </div>
              <button onClick={handleAddKnowledge} disabled={isSubmittingKnowledge} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl mt-4 flex items-center justify-center gap-2">
                {isSubmittingKnowledge ? <RefreshCw className="w-4 h-4 animate-spin"/> : <Send className="w-4 h-4"/>}
                {isSubmittingKnowledge ? 'กำลังบันทึก...' : 'สอนข้อมูล AIVA'}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[10000] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className={`px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border text-sm font-bold ${
            toast.type === 'success' 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
              : toast.type === 'danger'
              ? 'bg-rose-50 border-rose-200 text-rose-800' 
              : 'bg-indigo-50 border-indigo-200 text-indigo-800'
          }`}>
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
            {toast.type === 'danger' && <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0" />}
            {toast.type === 'info' && <AlertCircle className="w-5 h-5 text-indigo-600 shrink-0" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      </main>
    </div>
  );
}

// Helpers
function NavItem({ icon: Icon, label, isActive, onClick, badge, isLocked, isDark, id }) {
  return (
    <button id={id} onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 text-left shrink-0 ${
      isActive 
        ? (isDark ? 'bg-indigo-500/20 text-indigo-400 font-bold' : 'bg-indigo-50 text-indigo-700 font-bold') 
        : (isDark ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 font-semibold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-semibold')
    }`}>
      <Icon className={`w-5 h-5 shrink-0 ${isActive ? (isDark ? 'text-indigo-400' : 'text-indigo-600') : 'text-slate-400'}`} />
      <span className="flex-1 truncate">{label}</span>
      {isLocked && <Lock className="w-3.5 h-3.5 ml-auto text-slate-400 shrink-0" />}
      {badge && <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold shadow-sm shrink-0 ${badge === 'Pro' ? 'bg-indigo-500 text-white' : 'bg-rose-500 text-white'}`}>{badge}</span>}
    </button>
  );
}

function StatCard({ title, value, icon: Icon, color, isDark }) {
  const colors = { 
    emerald: isDark ? 'text-emerald-400 bg-emerald-500/20' : 'text-emerald-600 bg-emerald-50', 
    amber: isDark ? 'text-amber-400 bg-amber-500/20' : 'text-amber-600 bg-amber-50', 
    indigo: isDark ? 'text-indigo-400 bg-indigo-500/20' : 'text-indigo-600 bg-indigo-50', 
    blue: isDark ? 'text-blue-400 bg-blue-500/20' : 'text-blue-600 bg-blue-50',
    rose: isDark ? 'text-rose-400 bg-rose-500/20' : 'text-rose-600 bg-rose-50'
  };
  return (
    <div className={`rounded-2xl p-5 flex flex-col justify-center border shadow-sm glass-card ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
      <div className="flex justify-between items-start mb-2">
        <div className={`p-2 rounded-lg ${colors[color]}`}><Icon className="w-5 h-5" /></div>
      </div>
      <div>
        <h3 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>{value}</h3>
        <p className={`text-[11px] font-bold uppercase tracking-wider mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{title}</p>
      </div>
    </div>
  );
}

function PricingFeature({ text, included, isDark, forceDark, highlight }) {
  const effectivelyDark = forceDark || isDark;
  return (
    <div className={`flex items-center gap-3 text-sm ${!included ? 'opacity-40' : ''}`}>
      {included ? (
         <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${effectivelyDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'}`}>
           <Check className="w-3 h-3" />
         </div>
      ) : (
         <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${effectivelyDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-400'}`}>
           <X className="w-3 h-3" />
         </div>
      )}
      <span className={`${effectivelyDark ? 'text-slate-300' : 'text-slate-700'} ${highlight ? (effectivelyDark ? 'font-bold text-indigo-400' : 'font-bold text-indigo-600') : ''}`}>{text}</span>
    </div>
  )
}