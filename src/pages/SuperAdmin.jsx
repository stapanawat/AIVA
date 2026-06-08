import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, CreditCard, FolderUp, LifeBuoy, ShieldAlert, LogOut,
  TrendingUp, AlertCircle, CheckCircle2, DollarSign, FileText, Lock, RefreshCw,
  Search, Menu, X, ChevronDown, Download, Trash2, UploadCloud, PieChart, 
  Activity, Sparkles, Lightbulb, Eye, EyeOff, Bot, Briefcase, ChevronRight, 
  XCircle, Bell, Wallet, Clock, Settings, Mail, Network, Megaphone, Send, Target,
  BrainCircuit, BarChart2, MessageSquare
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
// AUTH SCREEN (SUPER ADMIN)
// ==========================================
function AdminAuth({ onLogin }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const email = e.target.querySelector('input[type="text"]').value;
      const password = e.target.querySelector('input[type="password"]').value;
      
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'เข้าสู่ระบบล้มเหลว');
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
    <div className="min-h-screen bg-[#0B1120] flex flex-col justify-center items-center p-4 relative overflow-hidden" style={{ fontFamily: "'Anuphan', sans-serif" }}>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Anuphan:wght@300;400;500;600;700&display=swap');
      `}} />
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] bg-rose-600/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="mb-8 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500 z-10">
        <div className="bg-white p-3.5 rounded-2xl shadow-xl shadow-rose-500/10 mb-4 flex justify-center items-center">
          <img src="https://i.postimg.cc/mhfQRbmz/Chat-GPT-Image-Jun-3-2026-04-47-53-PM.png" alt="AIVA Logo" className="h-16 w-auto object-contain" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white">AIVA<span className="text-rose-500">SuperAdmin</span></h1>
        <div className="mt-3 bg-rose-500/10 text-rose-400 border border-rose-500/20 px-4 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-sm">
          Restricted Access
        </div>
      </div>

      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-500 p-8 z-10">
        <h2 className="text-xl font-bold text-white mb-6 text-center">เข้าสู่ระบบการจัดการ</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-400">Admin ID</label>
            <div className="relative">
              <ShieldAlert className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type="text" placeholder="AD-xxx หรือ ROOT-01" defaultValue="ROOT-01" className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all outline-none" required />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-400">รหัสผ่าน</label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type="password" placeholder="••••••••" defaultValue="password" className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all outline-none" required />
            </div>
          </div>
          <button type="submit" disabled={isLoading} className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-rose-500/30 flex justify-center items-center gap-2 mt-6">
            {isLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : 'Authorize Access'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// MAIN SUPER ADMIN APP
// ==========================================
export default function SuperAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('aiva_access_token'));
  const [activeTab, setActiveTab] = useState('partners');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // States for search/filters
  const [partnerSearch, setPartnerSearch] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerFilter, setCustomerFilter] = useState({ source: 'All', plan: 'All' });
  
  const [payoutMonth, setPayoutMonth] = useState('2026-06');
  const [payoutSearch, setPayoutSearch] = useState('');
  
  // Modal State for Sub-Partners
  const [selectedPartner, setSelectedPartner] = useState(null);

  // --- MOCK DATA ---
  const MOCK_PARTNERS = [
    { 
      id: 'P88942', name: 'สมชาย ใจดี', email: 'somchai@globaltech.com', type: 'บุคคลธรรมดา', tier: 'Gold (25%)', rev: 125400, clients: 48, kyc: 'Approved',
      subPartners: [
        { id: 'SP88942-1', name: 'วิไลวรรณ ใจดี', rev: 45000, clients: 12 },
        { id: 'SP88942-2', name: 'นพดล มั่งคั่ง', rev: 12000, clients: 3 }
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
        { id: 'SP44556-1', name: 'สมบูรณ์ ทรัพย์มาก', rev: 28000, clients: 8 }
      ]
    },
  ];

  const MOCK_CUSTOMERS = [
    { id: 'A849201', name: 'คุณสมชาย ใจดี', business: 'บริษัท โกลบอลเทค จำกัด', partner: 'P88942', plan: 'Advanced', mrr: 11900, usage: 85, status: 'Active' },
    { id: 'A592014', name: 'พญ. วลัยลักษณ์', business: 'สมชาย คลินิก เวชกรรม', partner: 'P88942', plan: 'Pro', mrr: 4900, usage: 42, status: 'Active' },
    { id: 'A110293', name: 'คุณกิตติ สุขใจ', business: 'ร้านกาแฟ สุขใจ', partner: 'P11223', plan: 'Basic', mrr: 990, usage: 5, status: 'Pending' },
    { id: 'A992834', name: 'อ. วิทยา พัฒนา', business: 'โรงเรียนพัฒนาศึกษา', partner: 'DIRECT', plan: 'Pro', mrr: 4900, usage: 92, status: 'Active' },
    { id: 'A772183', name: 'บจก. อสังหาทูเดย์', business: 'อสังหาทูเดย์ พร็อพเพอร์ตี้', partner: 'DIRECT', plan: 'Advanced', mrr: 11900, usage: 60, status: 'Active' },
  ];

  const PAYOUT_DATA = {
    '2026-06': { netTotal: 124500, whtTotal: 3850, count: 45, hold: 2, list: [
      { partnerId: 'P88942', name: 'สมชาย ใจดี', type: 'บุคคล', tier: 'Gold(25%)', kyc: 'Approved', sales: 215000, comm: 53750, wht: 1612.5, net: 52137.5, status: 'Ready' },
      { partnerId: 'P11223', name: 'บริษัท มาร์เก็ตติ้ง จำกัด', type: 'นิติบุคคล', tier: 'Bronze(15%)', kyc: 'Pending', sales: 12000, comm: 1800, wht: 54, net: 1746, status: 'Hold' },
      { partnerId: 'P44556', name: 'ธนาพล ยอดเยี่ยม', type: 'บุคคล', tier: 'Silver(18%)', kyc: 'Approved', sales: 85000, comm: 15300, wht: 459, net: 14841, status: 'Paid' },
    ]},
    '2026-05': { netTotal: 78327, whtTotal: 2476, count: 38, hold: 7, list: [
      { partnerId: 'P88942', name: 'สมชาย ใจดี', type: 'บุคคล', tier: 'Gold(25%)', kkcy: 'Approved', sales: 160000, comm: 40000, wht: 1200, net: 38800, status: 'Paid' },
      { partnerId: 'P11223', name: 'บริษัท มาร์เก็ตติ้ง จำกัด', type: 'นิติบุคคล', tier: 'Bronze(15%)', kyc: 'Pending', sales: 5000, comm: 750, wht: 22.5, net: 727.5, status: 'Hold' },
    ]}
  };

  const MOCK_TICKETS = [
    { id: 'TK-1002', sender: 'CUSTOMER', name: 'โรงเรียนพัฒนาศึกษา', issue: 'AI ตอบข้อมูลโปรโมชั่นผิด', type: 'Bug', status: 'In Progress', time: '2 ชม. ที่แล้ว' },
    { id: 'TK-1003', sender: 'PARTNER', name: 'สมชาย ใจดี (P88942)', issue: 'สอบถามเรื่องเอกสาร 50 ทวิ ของเดือนที่แล้ว', type: 'Billing', status: 'Pending', time: '5 ชม. ที่แล้ว' },
    { id: 'TK-1004', sender: 'CUSTOMER', name: 'ร้านกาแฟ สุขใจ', issue: 'อยากให้ AI ส่งรูปเมนูให้ลูกค้าได้ด้วย', type: 'Feature', status: 'Resolved', time: '1 วันที่แล้ว' },
  ];

  const MOCK_ANNOUNCEMENTS = [
    { id: 'ANC-001', title: 'แคมเปญพิเศษ Q3: ทำยอดทะลุ 5 แสนรับโบนัส 5%', type: 'Campaign', target: 'All Partners', date: '05/06/2026', views: 84, status: 'Active' },
    { id: 'ANC-002', title: 'อัปเดตฟีเจอร์ Multi-PDF Upload พร้อมใช้งานแล้ว', type: 'Product Update', target: 'All Partners', date: '01/06/2026', views: 120, status: 'Active' },
    { id: 'ANC-003', title: 'เชิญร่วมสัมมนา AIVA Partner Summit 2026', type: 'Event', target: 'Gold & Silver', date: '25/05/2026', views: 45, status: 'Ended' },
  ];

  // --- API STATE BINDINGS ---
  const [partners, setPartners] = useState(MOCK_PARTNERS);
  const [customers, setCustomers] = useState(MOCK_CUSTOMERS);
  const [payoutsData, setPayoutsData] = useState(PAYOUT_DATA);

  const fetchPartners = async () => {
    try {
      const token = localStorage.getItem('aiva_access_token');
      if (!token) return;
      const res = await fetch('/api/admin/partners', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const merged = [...MOCK_PARTNERS];
        data.forEach(dbPartner => {
          const idx = merged.findIndex(p => p.id === dbPartner.id);
          if (idx > -1) {
            merged[idx] = { ...merged[idx], ...dbPartner };
          } else {
            merged.push(dbPartner);
          }
        });
        setPartners(merged);
      }
    } catch (err) {
      console.warn('Failed to fetch partners from server:', err);
    }
  };

  const fetchPayouts = async () => {
    try {
      const token = localStorage.getItem('aiva_access_token');
      if (!token) return;
      const res = await fetch('/api/admin/payouts', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const list = [...PAYOUT_DATA['2026-06'].list];
        data.forEach(p => {
          const formatted = {
            id: p.id,
            partnerId: p.partner.id,
            name: p.partner.name,
            type: 'บุคคล',
            tier: p.partner.id === 'P88942' ? 'Gold(25%)' : 'Bronze(15%)',
            kyc: 'Approved',
            sales: p.amount / 0.25,
            comm: p.amount,
            wht: p.amount * 0.03,
            net: p.amount * 0.97,
            status: p.status === 'APPROVED' ? 'Paid' : p.status === 'REJECTED' ? 'Hold' : 'Ready'
          };
          const idx = list.findIndex(item => item.partnerId === formatted.partnerId);
          if (idx > -1) {
            list[idx] = { ...list[idx], ...formatted };
          } else {
            list.push(formatted);
          }
        });
        const netTotal = list.reduce((sum, item) => sum + item.net, 0);
        const whtTotal = list.reduce((sum, item) => sum + item.wht, 0);
        const count = list.length;
        const hold = list.filter(item => item.status === 'Hold').length;

        setPayoutsData(prev => ({
          ...prev,
          '2026-06': { netTotal, whtTotal, count, hold, list }
        }));
      }
    } catch (err) {
      console.warn('Failed to fetch payouts from server:', err);
    }
  };

  const handleUpdateKyc = async (partnerId, status) => {
    try {
      const token = localStorage.getItem('aiva_access_token');
      const res = await fetch(`/api/admin/partners/${partnerId}/kyc`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchPartners();
      } else {
        const errData = await res.json();
        alert(errData.error || 'Failed to update KYC status');
      }
    } catch (err) {
      console.warn('Backend offline, fallback KYC update locally:', err);
      setPartners(prev => prev.map(p => p.id === partnerId ? { ...p, kyc: status } : p));
    }
  };

  const handleApprovePayout = async (payoutId) => {
    try {
      const token = localStorage.getItem('aiva_access_token');
      const res = await fetch(`/api/admin/payouts/${payoutId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action: 'approve' })
      });
      if (res.ok) {
        fetchPayouts();
      } else {
        const errData = await res.json();
        alert(errData.error || 'Failed to approve payout');
      }
    } catch (err) {
      console.error('Error approving payout:', err);
    }
  };

  React.useEffect(() => {
    if (isAuthenticated) {
      fetchPartners();
      fetchPayouts();
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem('aiva_access_token');
    localStorage.removeItem('aiva_user');
    setIsAuthenticated(false);
  };

  // --- CALCULATIONS FOR PARTNER TAB ---
  const mainPartnerCount = partners.length;
  const mainPartnerRev = partners.reduce((sum, p) => sum + (p.rev || 0), 0);

  const subPartnerCount = partners.reduce((sum, p) => sum + (p.subPartners?.length || 0), 0);
  const subPartnerRev = partners.reduce((sum, p) => sum + (p.subPartners || []).reduce((spSum, sp) => spSum + (sp.rev || 0), 0), 0);

  const totalPartnerCount = mainPartnerCount + subPartnerCount;
  const totalPartnerRev = mainPartnerRev + subPartnerRev;

  if (!isAuthenticated) return <AdminAuth onLogin={() => setIsAuthenticated(true)} />;

  const currentPayouts = payoutsData[payoutMonth] || payoutsData['2026-06'] || { netTotal: 0, whtTotal: 0, count: 0, hold: 0, list: [] };

  return (
    <div className="flex h-screen bg-[#0F172A] text-slate-300 font-sans overflow-hidden" style={{ fontFamily: "'Anuphan', sans-serif" }}>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Anuphan:wght@300;400;500;600;700;800;900&display=swap');
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
        .admin-card { background: #1E293B; border-color: #334155; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2); }
      `}} />

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-[260px] bg-[#0B1120] border-r border-slate-800 flex flex-col transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-[72px] flex items-center gap-3 px-6 border-b border-slate-800 shrink-0">
          <div className="bg-white p-1 rounded-lg flex items-center justify-center shadow-lg"><img src="https://i.postimg.cc/mhfQRbmz/Chat-GPT-Image-Jun-3-2026-04-47-53-PM.png" alt="AIVA" className="w-7 h-7 object-contain" /></div>
          <span className="text-lg font-bold tracking-tight text-white">AIVA<span className="text-rose-500">SuperAdmin</span></span>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-3 custom-scrollbar space-y-6">
          <div>
            <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Overview</p>
            <div className="space-y-1">
              <NavItem icon={LayoutDashboard} label="Global Dashboard" isActive={activeTab === 'dashboard'} onClick={() => {setActiveTab('dashboard'); setIsSidebarOpen(false);}} />
              <NavItem icon={BrainCircuit} label="วิเคราะห์ตลาด & พฤติกรรม" isActive={activeTab === 'insights'} onClick={() => {setActiveTab('insights'); setIsSidebarOpen(false);}} />
            </div>
          </div>
          <div>
            <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Management</p>
            <div className="space-y-1">
              <NavItem icon={Users} label="พาร์ทเนอร์ (Partners)" isActive={activeTab === 'partners'} onClick={() => {setActiveTab('partners'); setIsSidebarOpen(false);}} />
              <NavItem icon={Briefcase} label="ลูกค้า (Customers)" isActive={activeTab === 'customers'} onClick={() => {setActiveTab('customers'); setIsSidebarOpen(false);}} />
              <NavItem icon={CreditCard} label="การจ่ายเงิน (Payouts)" isActive={activeTab === 'payouts'} onClick={() => {setActiveTab('payouts'); setIsSidebarOpen(false);}} />
            </div>
          </div>
          <div>
            <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">System & Content</p>
            <div className="space-y-1">
              <NavItem icon={FolderUp} label="คลังสื่อการตลาด" isActive={activeTab === 'assets'} onClick={() => {setActiveTab('assets'); setIsSidebarOpen(false);}} />
              <NavItem icon={Megaphone} label="ประกาศ & แคมเปญ" isActive={activeTab === 'announcements'} onClick={() => {setActiveTab('announcements'); setIsSidebarOpen(false);}} />
              <NavItem icon={LifeBuoy} label="Helpdesk Tickets" isActive={activeTab === 'tickets'} onClick={() => {setActiveTab('tickets'); setIsSidebarOpen(false);}} />
            </div>
          </div>
          <div>
            <p className="px-3 text-[10px] font-bold text-rose-500 uppercase tracking-widest mb-2 flex items-center gap-1.5"><ShieldAlert className="w-3 h-3"/> Root Access Only</p>
            <div className="space-y-1">
              <NavItem icon={Lock} label="จัดการสิทธิ์ทีมงาน" isActive={activeTab === 'team'} onClick={() => {setActiveTab('team'); setIsSidebarOpen(false);}} />
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 bg-[#0B1120]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-500 font-bold">R</div>
              <div>
                <p className="text-sm font-bold text-white">Founder <CheckCircle2 className="w-3.5 h-3.5 inline text-emerald-500"/></p>
                <p className="text-[10px] text-slate-500 flex items-center gap-1 cursor-pointer hover:text-white" onClick={handleLogout}><LogOut className="w-3 h-3"/> System Logout</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        <header className="h-[72px] border-b border-slate-800 bg-[#0F172A] flex items-center justify-between px-6 shrink-0 z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-slate-400 hover:text-white"><Menu className="w-5 h-5"/></button>
            <h1 className="text-xl font-bold text-white tracking-tight hidden sm:block">
              {activeTab === 'dashboard' && 'Global Dashboard'}
              {activeTab === 'insights' && 'AI Market Insights & Roadmap'}
              {activeTab === 'partners' && 'Partner Management'}
              {activeTab === 'customers' && 'Global Customers Database'}
              {activeTab === 'payouts' && 'การจ่ายเงิน & 50 ทวิ (Payouts)'}
              {activeTab === 'assets' && 'คลังสื่อการตลาด (Marketing Assets)'}
              {activeTab === 'announcements' && 'ระบบบรอดแคสต์ (Partner Broadcast)'}
              {activeTab === 'tickets' && 'ระบบสนับสนุน (Helpdesk & Tickets)'}
              {activeTab === 'team' && 'Team & Roles (Root)'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center bg-slate-800 rounded-full px-3 py-1.5 border border-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
              <span className="text-[11px] font-bold text-slate-300">AIVA Core: Online</span>
            </div>
            <button className="relative p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#0F172A]"></span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 lg:p-8 custom-scrollbar relative">
          
          {/* TAB: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="admin-card rounded-2xl p-5 border flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2"><div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400"><DollarSign className="w-5 h-5" /></div></div>
                  <div><h3 className="text-3xl font-black text-white">฿845,200</h3><p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">รายได้รวมบริษัท (MRR)</p><p className="text-xs text-emerald-400 mt-1">+18.5% จากเดือนก่อน</p></div>
                </div>
                <div className="admin-card rounded-2xl p-5 border flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2"><div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400"><Users className="w-5 h-5" /></div></div>
                  <div><h3 className="text-3xl font-black text-white">128</h3><p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">พาร์ทเนอร์ทั้งหมด</p><p className="text-xs text-slate-500 mt-1">Active 95 ราย</p></div>
                </div>
                <div className="admin-card rounded-2xl p-5 border flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2"><div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400"><Briefcase className="w-5 h-5" /></div></div>
                  <div><h3 className="text-3xl font-black text-white">1,450</h3><p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">ลูกค้า GLOBAL</p><p className="text-xs text-blue-400 mt-1">+120 New Users</p></div>
                </div>
                <div className="admin-card rounded-2xl p-5 border flex flex-col justify-between relative overflow-hidden group hover:border-rose-500/50 transition-colors cursor-pointer">
                  <div className="absolute top-3 right-3 w-3 h-3 bg-rose-500 rounded-full animate-pulse"></div>
                  <div className="flex justify-between items-start mb-2"><div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400"><ShieldAlert className="w-5 h-5" /></div></div>
                  <div><h3 className="text-3xl font-black text-white">12</h3><p className="text-[11px] font-bold text-rose-400 uppercase tracking-wider mt-1">Action Required</p><p className="text-xs text-slate-400 mt-1">KYC รออนุมัติ</p></div>
                </div>
              </div>

              {/* Financial Split & SaaS Metrics */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 admin-card rounded-2xl p-6 border flex flex-col">
                  <h3 className="text-lg font-bold text-white mb-6">สรุปการเงิน (Financial Overview) - มิ.ย. 2026</h3>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div><p className="text-xs font-bold text-slate-400 mb-1">ยอดขายผ่าน Partner</p><p className="text-2xl font-black text-white">฿320,000</p></div>
                    <div><p className="text-xs font-bold text-slate-400 mb-1">ยอดขาย AIVA (Direct)</p><p className="text-2xl font-black text-white">฿525,200</p></div>
                    <div><p className="text-xs font-bold text-slate-400 mb-1">คอมมิชชันค้างจ่าย</p><p className="text-2xl font-black text-rose-500">฿58,400</p></div>
                  </div>
                  <div className="h-4 bg-slate-800 rounded-full overflow-hidden flex mt-auto border border-slate-700">
                    <div className="bg-indigo-500 h-full" style={{width: '38%'}} title="Partner 38%"></div>
                    <div className="bg-emerald-500 h-full" style={{width: '62%'}} title="Direct 62%"></div>
                  </div>
                  <div className="flex justify-between mt-3 text-xs font-bold">
                     <span className="text-indigo-400 flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-indigo-500"></span> Partner (38%)</span>
                     <span className="text-emerald-400 flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span> Direct (62%)</span>
                  </div>
                </div>

                <div className="admin-card rounded-2xl p-6 border flex flex-col justify-between space-y-4">
                   <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2"><Activity className="w-4 h-4 text-emerald-500"/> SaaS Health Metrics</h3>
                   <div className="flex justify-between items-end border-b border-slate-700/50 pb-3">
                     <div><p className="text-[10px] font-bold text-slate-400 uppercase">ARPU (รายได้เฉลี่ย/หัว)</p><h4 className="text-lg font-bold text-white mt-0.5">฿3,450</h4></div>
                     <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-bold">+5%</span>
                   </div>
                   <div className="flex justify-between items-end border-b border-slate-700/50 pb-3">
                     <div><p className="text-[10px] font-bold text-slate-400 uppercase">Churn Rate (ยกเลิก)</p><h4 className="text-lg font-bold text-white mt-0.5">2.4%</h4></div>
                     <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-bold">Healthy</span>
                   </div>
                   <div className="flex justify-between items-end pt-1">
                     <div><p className="text-[10px] font-bold text-slate-400 uppercase">API Costs (ต้นทุน AI)</p><h4 className="text-lg font-bold text-rose-400 mt-0.5">฿45,200</h4></div>
                     <span className="text-[10px] text-slate-500 font-bold">5.3% of MRR</span>
                   </div>
                </div>
              </div>

              {/* MRR Growth Trend & Top Partners */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 admin-card rounded-2xl p-6 border flex flex-col">
                  <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-indigo-400"/> MRR Growth Trend (6 Months)</h3>
                  <div className="relative flex-1 min-h-[200px] mt-2">
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none border-l border-slate-700">
                      {[1000, 750, 500, 250, 0].map((v, i) => <div key={i} className="w-full border-t border-slate-700/50 border-dashed relative"><span className="absolute -left-10 -top-2.5 text-[10px] text-slate-500 font-mono w-8 text-right">{v}k</span></div>)}
                    </div>
                    <div className="absolute inset-y-0 left-0 right-0 flex items-end justify-around px-4">
                      {[
                        { direct: 20, partner: 10, label: 'Jan' }, { direct: 35, partner: 15, label: 'Feb' },
                        { direct: 45, partner: 25, label: 'Mar' }, { direct: 55, partner: 30, label: 'Apr' },
                        { direct: 60, partner: 45, label: 'May' }, { direct: 62, partner: 38, label: 'Jun' }
                      ].map((m, i) => (
                        <div key={i} className="w-1/12 h-[90%] flex flex-col justify-end group relative z-10 cursor-pointer">
                          <div className="w-full bg-emerald-500 rounded-t-sm transition-all group-hover:opacity-80" style={{height: `${m.direct}%`}}></div>
                          <div className="w-full bg-indigo-500 rounded-b-sm transition-all group-hover:opacity-80" style={{height: `${m.partner}%`}}></div>
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-slate-900 text-[10px] px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none font-bold z-20">
                            ฿{((m.direct + m.partner) * 10000).toLocaleString()}<br/>
                            <span className="text-emerald-600 font-normal">Dir: {m.direct*10}k</span> | <span className="text-indigo-600 font-normal">Ptn: {m.partner*10}k</span>
                          </div>
                          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-500">{m.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="admin-card rounded-2xl p-0 border flex flex-col overflow-hidden">
                  <div className="p-4 border-b border-slate-700 bg-slate-800/50 flex justify-between items-center shrink-0">
                    <h3 className="font-bold text-white text-sm flex items-center gap-2"><Sparkles className="w-4 h-4 text-amber-400"/> Top Partners (Jun)</h3>
                  </div>
                  <div className="flex-1 overflow-auto custom-scrollbar p-2">
                    {[
                      { name: 'สมชาย ใจดี', id: 'P88942', rev: 125400, medal: 'bg-amber-400' },
                      { name: 'บจก. อัลฟ่ากรุ๊ป', id: 'P55102', rev: 98500, medal: 'bg-slate-300' },
                      { name: 'ธนาพล ยอดเยี่ยม', id: 'P44556', rev: 85000, medal: 'bg-amber-600' },
                      { name: 'ร้าน สุขใจดี', id: 'P11928', rev: 42000, medal: 'bg-slate-700' },
                      { name: 'บริษัท มาร์เก็ตติ้ง จำกัด', id: 'P11223', rev: 12000, medal: 'bg-slate-700' }
                    ].map((p, i) => (
                      <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-800/50 rounded-xl transition-colors">
                        <div className="flex items-center gap-3">
                           <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-slate-900 ${p.medal}`}>{i+1}</div>
                           <div>
                             <p className="text-sm font-bold text-slate-200">{p.name}</p>
                             <p className="text-[10px] font-mono text-slate-500">{p.id}</p>
                           </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-black text-emerald-400">฿{p.rev.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: MARKET INSIGHTS & ROADMAP (NEW) */}
          {activeTab === 'insights' && (
            <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
              <div className="shrink-0 mb-6 flex justify-between items-end">
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2"><BrainCircuit className="w-6 h-6 text-indigo-400"/> AI Market Insights & Roadmap</h1>
                  <p className="text-sm text-slate-500 mt-1">วิเคราะห์พฤติกรรมการใช้งานและ Feedback เพื่อกำหนดทิศทางการพัฒนาผลิตภัณฑ์</p>
                </div>
                <div className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div> AI Analysis Active
                </div>
              </div>

              {/* Top Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="admin-card rounded-2xl p-5 border flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2"><div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400"><MessageSquare className="w-5 h-5" /></div></div>
                  <div><h3 className="text-3xl font-black text-white">14,520</h3><p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">Data Points Analyzed</p><p className="text-xs text-slate-500 mt-1">จาก Tickets และพฤติกรรม</p></div>
                </div>
                <div className="admin-card rounded-2xl p-5 border flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2"><div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400"><TrendingUp className="w-5 h-5" /></div></div>
                  <div><h3 className="text-3xl font-black text-white">4.8<span className="text-lg text-slate-500 font-normal">/5</span></h3><p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">Overall Sentiment</p><p className="text-xs text-emerald-400 mt-1">+0.2 จากไตรมาสก่อน</p></div>
                </div>
                <div className="admin-card rounded-2xl p-5 border flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2"><div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400"><Activity className="w-5 h-5" /></div></div>
                  <div><h3 className="text-2xl font-black text-white leading-tight">Multi-PDF Sync</h3><p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">Most Used Feature</p><p className="text-xs text-slate-500 mt-1">ถูกใช้งาน 85% ของลูกค้าทั้งหมด</p></div>
                </div>
                <div className="admin-card rounded-2xl p-5 border flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2"><div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400"><AlertCircle className="w-5 h-5" /></div></div>
                  <div><h3 className="text-3xl font-black text-white">2.4%</h3><p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">Avg. Churn Risk Score</p><p className="text-xs text-emerald-400 mt-1">อยู่ในเกณฑ์ปลอดภัย (Healthy)</p></div>
                </div>
              </div>

              {/* Split Content: Usage Behavior vs AI Suggestions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Left: Usage Behavior */}
                <div className="flex flex-col gap-6">
                  <div className="admin-card rounded-2xl p-6 border">
                    <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2"><BarChart2 className="w-5 h-5 text-indigo-400"/> Feature Adoption Behavior</h3>
                    <div className="space-y-5">
                      {[
                        { name: 'Multi-PDF Training (สอน AI ด้วย PDF)', usage: 85, color: 'bg-indigo-500' },
                        { name: 'Auto-Reply Chatbot (ตอบแชทอัตโนมัติ)', usage: 72, color: 'bg-blue-500' },
                        { name: 'Rich Menu Integration (เมนู LINE)', usage: 45, color: 'bg-emerald-500' },
                        { name: 'Analytics Dashboard (ดูสถิติฝั่งลูกค้า)', usage: 30, color: 'bg-amber-500' }
                      ].map((feature, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-xs font-bold mb-1.5"><span className="text-slate-300">{feature.name}</span><span className="text-slate-400">{feature.usage}%</span></div>
                          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden"><div className={`h-full ${feature.color} rounded-full`} style={{width: `${feature.usage}%`}}></div></div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="admin-card rounded-2xl p-6 border flex-1">
                    <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2"><PieChart className="w-5 h-5 text-emerald-400"/> Customer Health Segments</h3>
                    <p className="text-xs text-slate-400 mb-6">AI จัดกลุ่มลูกค้า 1,450 รายจากความถี่ในการเข้าใช้งาน (Session Time) และปริมาณ Token ที่ใช้</p>
                    <div className="flex items-end gap-4 h-32 mb-4">
                      <div className="w-1/3 bg-emerald-500/20 border border-emerald-500/30 rounded-t-xl h-full flex flex-col justify-end items-center pb-2 relative group cursor-pointer hover:bg-emerald-500/30 transition-all">
                        <span className="text-lg font-black text-emerald-400">65%</span>
                        <span className="text-[10px] font-bold text-slate-300 uppercase mt-1">Super Active</span>
                      </div>
                      <div className="w-1/3 bg-amber-500/20 border border-amber-500/30 rounded-t-xl h-[50%] flex flex-col justify-end items-center pb-2 relative group cursor-pointer hover:bg-amber-500/30 transition-all">
                        <span className="text-lg font-black text-amber-400">25%</span>
                        <span className="text-[10px] font-bold text-slate-300 uppercase mt-1">Occasional</span>
                      </div>
                      <div className="w-1/3 bg-rose-500/20 border border-rose-500/30 rounded-t-xl h-[20%] flex flex-col justify-end items-center pb-2 relative group cursor-pointer hover:bg-rose-500/30 transition-all">
                        <span className="text-lg font-black text-rose-400">10%</span>
                        <span className="text-[10px] font-bold text-slate-300 uppercase mt-1">Slipping Away</span>
                      </div>
                    </div>
                    <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                      <p className="text-xs text-slate-300"><span className="text-rose-400 font-bold">Insight:</span> ลูกค้า 10% ที่มีแนวโน้มเลิกใช้ มักจะเป็นกลุ่มที่ต่ออายุมาจากช่วงโปรโมชั่น แนะนำให้ทีม CS โทรติดต่อเพื่อเสนอส่วนลดพิเศษรักษาฐานลูกค้า</p>
                    </div>
                  </div>
                </div>

                {/* Right: AI Roadmap Suggestions */}
                <div className="admin-card rounded-2xl border p-0 flex flex-col h-full bg-gradient-to-br from-[#1E293B] to-[#0F172A] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[80px] rounded-full pointer-events-none"></div>
                  
                  <div className="p-6 border-b border-slate-700/50 relative z-10 shrink-0">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2"><Bot className="w-6 h-6 text-indigo-400" /> AI-Generated Roadmap</h3>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">สรุปแนวทางการพัฒนาผลิตภัณฑ์ (Product Roadmap) จากการวิเคราะห์ Feedback ของลูกค้าและเสียงเรียกร้องจาก Partner</p>
                  </div>

                  <div className="flex-1 p-6 space-y-4 overflow-auto custom-scrollbar relative z-10">
                    
                    <div className="bg-slate-900/60 border border-indigo-500/30 p-4 rounded-xl relative overflow-hidden group">
                      <div className="absolute left-0 top-0 w-1 h-full bg-indigo-500"></div>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">1. ระบบตอบคอมเมนต์  อัตโนมัติ</h4>
                        <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[9px] font-black px-2 py-1 rounded uppercase tracking-wider">High Priority</span>
                      </div>
                      <p className="text-xs text-slate-400 mb-3">พบคำขอนี้ซ้ำกันถึง <strong className="text-slate-200">342 ครั้ง</strong> ในเดือนที่ผ่านมา ลูกค้ากลุ่ม SME ต้องการให้ AIVA ดึงคอมเมนต์จากหน้าเพจมาตอบใน Inbox โดยอัตโนมัติ</p>
                      <div className="flex gap-2">
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-800 px-2 py-0.5 rounded">Target: Q3/2026</span>
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-800 px-2 py-0.5 rounded">Impact: Revenue +15%</span>
                      </div>
                    </div>

                    <div className="bg-slate-900/60 border border-slate-700/50 p-4 rounded-xl relative overflow-hidden group">
                      <div className="absolute left-0 top-0 w-1 h-full bg-emerald-500"></div>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">2. AI วิเคราะห์อารมณ์ลูกค้า (Sentiment Analysis)</h4>
                        <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] font-black px-2 py-1 rounded uppercase tracking-wider">Medium Priority</span>
                      </div>
                      <p className="text-xs text-slate-400 mb-3">Partner รายใหญ่เสนอแนะ <strong className="text-slate-200">120 ครั้ง</strong> ว่าอยากให้มีระบบแจ้งเตือน (Alert) เมื่อ AI ตรวจพบลูกค้าที่พิมพ์ด้วยความหงุดหงิด เพื่อให้แอดมินคนจริงเข้าแทรกแซงทันที</p>
                      <div className="flex gap-2">
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-800 px-2 py-0.5 rounded">Target: Q4/2026</span>
                        <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Planning Phase</span>
                      </div>
                    </div>

                    <div className="bg-slate-900/60 border border-slate-700/50 p-4 rounded-xl relative overflow-hidden group opacity-80">
                      <div className="absolute left-0 top-0 w-1 h-full bg-slate-500"></div>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-sm font-bold text-white group-hover:text-slate-300 transition-colors">3. เชื่อมต่อระบบสต็อกสินค้า (POS Integration)</h4>
                        <span className="bg-slate-700 text-slate-400 border border-slate-600 text-[9px] font-black px-2 py-1 rounded uppercase tracking-wider">Backlog</span>
                      </div>
                      <p className="text-xs text-slate-400">มีการสอบถาม <strong className="text-slate-200">85 ครั้ง</strong> เกี่ยวกับการให้ AI ตัดสต็อกสินค้าได้โดยตรงขณะคุยแชท ต้องรอการทำ API กับ Third-party</p>
                    </div>

                  </div>
                  <div className="p-4 border-t border-slate-700/50 bg-slate-800/30 text-center shrink-0">
                     <button className="text-xs font-bold text-indigo-400 hover:text-white transition-colors flex items-center justify-center gap-1.5 mx-auto"><FolderUp className="w-4 h-4"/> Export Full Report to Dev Team</button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB: PARTNER MANAGEMENT */}
          {activeTab === 'partners' && (
            <div className="h-full flex flex-col max-w-7xl mx-auto animate-in fade-in duration-300 relative z-0">
              <div className="shrink-0 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">Partner Management</h1>
                  <p className="text-slate-500 text-sm mt-1">Approve KYC, view partner performance, and adjust commission tiers.</p>
                </div>
                <div className="flex gap-4">
                  <div className="admin-card rounded-xl px-4 py-2 border flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-400 uppercase">รออนุมัติ KYC</span>
                    <span className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs">1</span>
                  </div>
                  <button className="bg-slate-800 border border-slate-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 hover:bg-slate-700">
                     <Download className="w-4 h-4" /> Export
                  </button>
                </div>
              </div>

              {/* PARTNER STATS CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 shrink-0">
                <div className="admin-card p-5 rounded-2xl border flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2"><div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400"><Users className="w-5 h-5"/></div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-800 px-2 py-1 rounded">Total Partners</p></div>
                  <div><h3 className="text-3xl font-black text-white">{totalPartnerCount} <span className="text-sm font-normal text-slate-500">บัญชี</span></h3><div className="flex justify-between items-end mt-2"><p className="text-[10px] text-slate-400">ยอดขายรวมสุทธิ</p><p className="text-sm font-bold text-emerald-400">฿{totalPartnerRev.toLocaleString()}</p></div></div>
                </div>
                <div className="admin-card p-5 rounded-2xl border flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2"><div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400"><Briefcase className="w-5 h-5"/></div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-800 px-2 py-1 rounded">Main Partner</p></div>
                  <div><h3 className="text-3xl font-black text-white">{mainPartnerCount} <span className="text-sm font-normal text-slate-500">บัญชี</span></h3><div className="flex justify-between items-end mt-2"><p className="text-[10px] text-slate-400">ยอดขายรวม (Pxxxxx)</p><p className="text-sm font-bold text-emerald-400">฿{mainPartnerRev.toLocaleString()}</p></div></div>
                </div>
                <div className="admin-card p-5 rounded-2xl border flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2"><div className="p-2 rounded-lg bg-amber-500/10 text-amber-400"><Network className="w-5 h-5"/></div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-800 px-2 py-1 rounded">Sub-Partner</p></div>
                  <div><h3 className="text-3xl font-black text-white">{subPartnerCount} <span className="text-sm font-normal text-slate-500">บัญชี</span></h3><div className="flex justify-between items-end mt-2"><p className="text-[10px] text-slate-400">ยอดขายรวม (SPxxxxx)</p><p className="text-sm font-bold text-emerald-400">฿{subPartnerRev.toLocaleString()}</p></div></div>
                </div>
              </div>

              <div className="admin-card rounded-2xl border flex flex-col flex-1 min-h-0 overflow-hidden">
                <div className="p-4 border-b border-slate-700 bg-slate-800/50 flex flex-col sm:flex-row gap-4 justify-between items-center shrink-0">
                  <div className="relative w-full sm:w-96">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
                    <input type="text" value={partnerSearch} onChange={e=>setPartnerSearch(e.target.value)} placeholder="Search Partner ID, Name, Email..." className="w-full pl-9 pr-4 py-2 text-sm bg-slate-900 border border-slate-700 text-white rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                  </div>
                  <button className="bg-slate-800 border border-slate-700 text-slate-300 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-700 transition-colors"><Menu className="w-4 h-4"/> Filter</button>
                </div>
                <div className="overflow-auto custom-scrollbar flex-1 p-0">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-slate-900 text-slate-400 text-[10px] uppercase tracking-widest font-bold border-b border-slate-700 sticky top-0 z-10">
                      <tr>
                        <th className="px-3 py-3 w-28 text-center">Partner ID</th>
                        <th className="px-3 py-3">Partner Details</th>
                        <th className="px-3 py-3 text-center">Commission Tier</th>
                        <th className="px-3 py-3 text-right">Revenue (Mo)</th>
                        <th className="px-3 py-3 text-center">Sub-Partners</th>
                        <th className="px-3 py-3 text-center w-28">KYC Status</th>
                        <th className="px-3 py-3 text-center w-24">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {partners.filter(p => p.name.includes(partnerSearch) || p.id.includes(partnerSearch.toUpperCase())).map((partner, i) => (
                        <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                          <td className="px-3 py-3 text-center">
                             <span className="text-[10px] font-mono font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-1.5 rounded">{partner.id}</span>
                          </td>
                          <td className="px-3 py-3 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white text-xs shrink-0">{partner.name.charAt(0)}</div>
                            <div className="overflow-hidden">
                              <div className="font-bold text-slate-200 truncate">{partner.name}</div>
                              <div className="text-[10px] text-slate-500 truncate flex items-center gap-1.5"><Mail className="w-3 h-3"/> {partner.email}</div>
                            </div>
                          </td>
                          <td className="px-3 py-3 text-center">
                            <span className={`inline-flex px-3 py-1 rounded text-[11px] font-bold border ${
                              partner.tier.includes('Gold') ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 
                              partner.tier.includes('Silver') ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                            }`}>{partner.tier}</span>
                          </td>
                          <td className="px-3 py-3 text-right font-black text-white text-base">฿{partner.rev.toLocaleString()}</td>
                          <td className="px-3 py-3 text-center">
                            <div className="flex flex-col items-center">
                              <span className="text-xs font-bold text-slate-300">{partner.subPartners?.length || 0} / 20</span>
                              <div className="w-16 h-1 bg-slate-700 rounded-full mt-1 overflow-hidden">
                                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${((partner.subPartners?.length || 0) / 20) * 100}%` }}></div>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-3 text-center">
                             {partner.kyc === 'Approved' && <span className="text-[10px] font-bold text-emerald-400 flex items-center justify-center gap-1"><CheckCircle2 className="w-4 h-4"/> Approved</span>}
                             {partner.kyc === 'Pending' && <span className="text-[10px] font-bold text-amber-400 flex items-center justify-center gap-1"><Clock className="w-4 h-4"/> Pending</span>}
                             {partner.kyc === 'Rejected' && <span className="text-[10px] font-bold text-rose-400 flex items-center justify-center gap-1"><XCircle className="w-4 h-4"/> Rejected</span>}
                          </td>
                          <td className="px-3 py-3 text-center">
                            <div className="flex justify-center gap-1.5">
                              {partner.kyc === 'Pending' ? (
                                <>
                                  <button onClick={() => handleUpdateKyc(partner.id, 'Approved')} className="p-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded border border-emerald-500/20 transition-colors" title="Approve KYC"><CheckCircle2 className="w-4 h-4"/></button>
                                  <button onClick={() => handleUpdateKyc(partner.id, 'Rejected')} className="p-1.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white rounded border border-rose-500/20 transition-colors" title="Reject KYC"><XCircle className="w-4 h-4"/></button>
                                </>
                              ) : (
                                <>
                                  <button onClick={() => setSelectedPartner(partner)} className="p-1.5 bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-white rounded border border-amber-500/20 transition-colors" title="View Sub-Partners"><Network className="w-4 h-4"/></button>
                                  <button className="p-1.5 bg-slate-800 text-slate-400 hover:text-indigo-400 rounded border border-slate-700 transition-colors" title="View Details"><FileText className="w-4 h-4"/></button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* SUB-PARTNER MODAL OVERLAY */}
              {selectedPartner && (
                <div className="fixed inset-0 bg-[#0B1120]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                  <div className="bg-[#0F172A] border border-slate-700 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                    <div className="p-5 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
                      <div>
                        <h2 className="text-lg font-bold text-white flex items-center gap-2"><Network className="w-5 h-5 text-amber-400"/> Sub-Partner Network</h2>
                        <p className="text-xs text-slate-400 mt-1">เครือข่ายของ <span className="font-bold text-indigo-400">{selectedPartner.name} ({selectedPartner.id})</span></p>
                      </div>
                      <button onClick={() => setSelectedPartner(null)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"><X className="w-5 h-5"/></button>
                    </div>
                    <div className="p-5 border-b border-slate-800 bg-[#0B1120] flex justify-between items-center">
                      <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase">โควต้า Sub-Partner</p>
                        <p className="text-lg font-black text-white">{selectedPartner.subPartners?.length || 0} <span className="text-sm font-normal text-slate-400">/ 20</span></p>
                      </div>
                      <div className="w-1/2">
                        <div className="flex justify-between text-[10px] font-bold mb-1"><span className="text-slate-400">Usage</span><span className="text-amber-400">{Math.round(((selectedPartner.subPartners?.length || 0) / 20) * 100)}%</span></div>
                        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${((selectedPartner.subPartners?.length || 0) / 20) * 100}%` }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 overflow-auto custom-scrollbar p-0">
                      {(selectedPartner.subPartners?.length || 0) > 0 ? (
                        <table className="w-full text-left text-sm whitespace-nowrap">
                          <thead className="bg-slate-900/80 text-slate-400 text-[10px] uppercase tracking-widest font-bold border-b border-slate-800 sticky top-0">
                            <tr><th className="px-5 py-3">Sub-Partner ID</th><th className="px-5 py-3">ชื่อ</th><th className="px-5 py-3 text-center">ลูกค้าที่ดูแล</th><th className="px-5 py-3 text-right">ยอดขายสุทธิ</th></tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800">
                            {selectedPartner.subPartners.map((sp, i) => (
                              <tr key={i} className="hover:bg-slate-800/30">
                                <td className="px-5 py-3 font-mono text-[10px] font-bold text-slate-400">{sp.id}</td>
                                <td className="px-5 py-3 font-bold text-slate-200">{sp.name}</td>
                                <td className="px-5 py-3 text-center font-bold text-slate-300">{sp.clients} ราย</td>
                                <td className="px-5 py-3 text-right font-black text-emerald-400">฿{sp.rev.toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div className="p-10 text-center flex flex-col items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-500 mb-4"><Network className="w-8 h-8"/></div>
                          <p className="text-slate-400 font-bold">ยังไม่มี Sub-Partner ในเครือข่ายนี้</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: GLOBAL CUSTOMERS */}
          {activeTab === 'customers' && (
            <div className="h-full flex flex-col max-w-7xl mx-auto animate-in fade-in duration-300">
              <div className="shrink-0 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">Global Customers Database</h1>
                </div>
                <div className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></div> Super Admin Mode
                </div>
              </div>

              <div className="admin-card rounded-2xl border flex flex-col flex-1 min-h-0 overflow-hidden">
                <div className="p-4 border-b border-slate-700 bg-slate-800/50 flex flex-col sm:flex-row gap-4 justify-between items-center shrink-0">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
                    <input type="text" value={customerSearch} onChange={e=>setCustomerSearch(e.target.value)} placeholder="Search Customer Name or ID..." className="w-full pl-9 pr-4 py-2 text-sm bg-slate-900 border border-slate-700 text-white rounded-xl outline-none focus:border-indigo-500" />
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <select value={customerFilter.source} onChange={e=>setCustomerFilter({...customerFilter, source: e.target.value})} className="text-sm bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none">
                      <option value="All">ทุกช่องทาง (All Sources)</option><option value="Partner">ผ่าน Partner</option><option value="Direct">Direct Sales</option>
                    </select>
                    <select value={customerFilter.plan} onChange={e=>setCustomerFilter({...customerFilter, plan: e.target.value})} className="text-sm bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none">
                      <option value="All">ทุกแพ็กเกจ (All Plans)</option><option value="Basic">Basic</option><option value="Pro">Pro</option><option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>
                
                <div className="overflow-auto custom-scrollbar flex-1 p-0">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-slate-900 text-slate-400 text-[10px] uppercase tracking-widest font-bold border-b border-slate-700 sticky top-0 z-10">
                      <tr>
                        <th className="px-4 py-3 w-20">Cust ID</th>
                        <th className="px-4 py-3">Customer</th>
                        <th className="px-4 py-3">Belongs to Partner</th>
                        <th className="px-4 py-3 w-32">Plan & MRR</th>
                        <th className="px-4 py-3 w-[120px]">AI Usage</th>
                        <th className="px-4 py-3 text-center w-24">Status</th>
                        <th className="px-4 py-3 text-center w-20">Manage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {customers.filter(c => c.name.includes(customerSearch) || c.id.includes(customerSearch.toUpperCase())).map((cust, i) => (
                        <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                          <td className="px-4 py-3"><span className="text-[10px] font-mono text-slate-400 bg-slate-800 border border-slate-700 px-2 py-1 rounded">{cust.id.replace('A', '')}</span></td>
                          <td className="px-4 py-3">
                            <div className="font-bold text-slate-200">{cust.name}</div>
                            <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1.5"><Briefcase className="w-3 h-3" /> {cust.business}</div>
                          </td>
                          <td className="px-4 py-3">
                            {cust.partner === 'DIRECT' ? (
                              <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-md flex items-center gap-1 w-fit"><Sparkles className="w-3 h-3"/> DIRECT (AIVA)</span>
                            ) : (
                              <span className="text-[10px] font-mono font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-1 rounded">{cust.partner}</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                             <div className="font-bold text-white">{cust.plan}</div>
                             <div className="text-[10px] font-mono text-emerald-400">฿{cust.mrr.toLocaleString()}/mo</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex justify-between text-[9px] font-bold mb-1">
                              <span className="text-slate-500">Tokens</span>
                              <span className={cust.usage > 80 ? 'text-rose-400' : 'text-indigo-400'}>{cust.usage}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${cust.usage > 80 ? 'bg-rose-500' : cust.usage > 50 ? 'bg-amber-500' : 'bg-indigo-500'}`} style={{ width: `${cust.usage}%` }}></div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${cust.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                              {cust.status === 'Active' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />} {cust.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button className="text-xs font-bold text-slate-400 hover:text-indigo-400 hover:underline">View</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PAYOUTS (FINANCE) */}
          {activeTab === 'payouts' && (
            <div className="h-full flex flex-col max-w-7xl mx-auto animate-in fade-in duration-300">
               <div className="shrink-0 mb-6 flex justify-between items-end">
                  <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">การจ่ายเงิน & 50 ทวิ (Payouts)</h1>
                  </div>
                  <div className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div> ROOT ADMIN
                  </div>
               </div>

               <div className="admin-card rounded-2xl p-6 border mb-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center shrink-0 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-indigo-500/5 to-transparent pointer-events-none"></div>
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2"><Wallet className="w-6 h-6 text-emerald-500" /> รอบบิลการจ่ายเงิน (Payout Cycle)</h2>
                    <p className="text-sm text-slate-400 mt-1">ตรวจสอบยอดคอมมิชชัน ภาษีหัก ณ ที่จ่าย และจัดการเอกสาร</p>
                  </div>
                  <select value={payoutMonth} onChange={e=>setPayoutMonth(e.target.value)} className="bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 font-bold outline-none cursor-pointer shadow-sm relative z-10">
                    <option value="2026-06">มิถุนายน 2026</option><option value="2026-05">พฤษภาคม 2026</option>
                  </select>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 shrink-0">
                  <div className="admin-card p-5 rounded-2xl border">
                    <div className="flex items-center gap-2 mb-3"><div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400"><DollarSign className="w-4 h-4"/></div><p className="text-xs font-bold text-slate-400">ยอดโอนสุทธิรวม</p></div>
                    <h3 className="text-3xl font-black text-white">฿{currentPayouts.netTotal.toLocaleString()}</h3>
                    <p className="text-[10px] text-slate-500 mt-1">เงินสดที่ต้องเตรียมโอน</p>
                  </div>
                  <div className="admin-card p-5 rounded-2xl border">
                    <div className="flex items-center gap-2 mb-3"><div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400"><FileText className="w-4 h-4"/></div><p className="text-xs font-bold text-slate-400">ภาษีที่ต้องนำส่ง 3%</p></div>
                    <h3 className="text-3xl font-black text-white">฿{currentPayouts.whtTotal.toLocaleString()}</h3>
                    <p className="text-[10px] text-slate-500 mt-1">ภ.ง.ด.3 / ภ.ง.ด.53</p>
                  </div>
                  <div className="admin-card p-5 rounded-2xl border">
                    <div className="flex items-center gap-2 mb-3"><div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400"><CheckCircle2 className="w-4 h-4"/></div><p className="text-xs font-bold text-slate-400">พร้อมจ่าย</p></div>
                    <h3 className="text-3xl font-black text-white">{currentPayouts.count - currentPayouts.hold} ราย</h3>
                    <p className="text-[10px] text-slate-500 mt-1">จาก {currentPayouts.count} ราย</p>
                  </div>
                  <div className="admin-card p-5 rounded-2xl border relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-rose-500/5 pointer-events-none"></div>
                    <div className="flex items-center gap-2 mb-3 relative z-10"><div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400"><AlertCircle className="w-4 h-4"/></div><p className="text-xs font-bold text-slate-400">ระงับ (KYC)</p></div>
                    <h3 className="text-3xl font-black text-white relative z-10">{currentPayouts.hold} ราย</h3>
                    <p className="text-[10px] font-bold text-rose-400 mt-1 relative z-10">รอตรวจเอกสาร</p>
                  </div>
               </div>

              <div className="admin-card rounded-2xl border flex flex-col flex-1 min-h-0 overflow-hidden">
                <div className="p-4 border-b border-slate-700 bg-slate-800/50 flex flex-col sm:flex-row gap-4 justify-between items-center shrink-0">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
                    <input type="text" value={payoutSearch} onChange={e=>setPayoutSearch(e.target.value)} placeholder="ค้นหา Partner..." className="w-full pl-9 pr-4 py-2 text-sm bg-slate-900 border border-slate-700 text-white rounded-xl focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button className="bg-slate-800 border border-slate-700 text-slate-300 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-700 transition-colors"><FileText className="w-4 h-4"/> ZIP 50ทวิ</button>
                    <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-sm"><Download className="w-4 h-4"/> CSV แบงก์</button>
                  </div>
                </div>
                <div className="overflow-auto custom-scrollbar flex-1 p-0">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-slate-900 text-slate-400 text-[10px] uppercase tracking-widest font-bold border-b border-slate-700 sticky top-0 z-10">
                      <tr>
                        <th className="px-4 py-3">Partner</th>
                        <th className="px-4 py-3 text-center">KYC/Tier</th>
                        <th className="px-4 py-3 text-right">ยอดขาย</th>
                        <th className="px-4 py-3 text-right">Gross</th>
                        <th className="px-4 py-3 text-right text-rose-500">WHT(3%)</th>
                        <th className="px-4 py-3 text-right text-emerald-500">Net</th>
                        <th className="px-4 py-3 text-center">สถานะ</th>
                        <th className="px-4 py-3 text-center">จัดการ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {currentPayouts.list.filter(p => p.name.includes(payoutSearch) || p.partnerId.includes(payoutSearch.toUpperCase())).map((payout, i) => (
                        <tr key={i} className={`hover:bg-slate-800/30 transition-colors ${payout.status === 'Hold' ? 'opacity-50' : ''}`}>
                          <td className="px-4 py-3"><div className="font-bold text-slate-200"><span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-1 py-0.5 rounded mr-1.5">{payout.partnerId}</span>{payout.name}</div></td>
                          <td className="px-4 py-3 text-center">
                            <div className="text-[10px] font-bold text-slate-400">{payout.tier}</div>
                            <div className={`text-[9px] mt-0.5 font-bold flex justify-center items-center gap-1 ${payout.kyc === 'Approved' ? 'text-emerald-400' : 'text-amber-400'}`}>
                              {payout.kyc === 'Approved' ? <CheckCircle2 className="w-3 h-3"/> : <AlertCircle className="w-3 h-3"/>} {payout.kyc === 'Approved' ? 'ผ่าน' : 'รอ'}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right font-mono text-slate-400">{payout.sales.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right font-mono font-bold text-white">{payout.comm.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right font-mono font-medium text-rose-400">-{payout.wht.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right font-mono font-bold text-emerald-400">{payout.net.toLocaleString()}</td>
                          <td className="px-4 py-3 text-center">
                            {payout.status === 'Ready' && <span className="px-2.5 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold">พร้อม</span>}
                            {payout.status === 'Hold' && <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-400 border border-slate-700 text-[10px] font-bold flex items-center gap-1 justify-center w-fit mx-auto"><Lock className="w-3 h-3"/> ระงับ</span>}
                            {payout.status === 'Paid' && <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">โอนแล้ว</span>}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex justify-center gap-1.5">
                              <button onClick={() => handleApprovePayout(payout.id || payout.partnerId)} disabled={payout.status !== 'Ready'} className={`p-1.5 rounded border transition-colors ${payout.status === 'Ready' ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-600 hover:text-white' : 'bg-slate-800 text-slate-600 border-slate-700'}`} title="Mark as Paid"><DollarSign className="w-4 h-4" /></button>
                              <button disabled={payout.status === 'Hold'} className={`p-1.5 rounded border transition-colors ${payout.status !== 'Hold' ? 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white' : 'bg-slate-900 text-slate-700 border-slate-800'}`} title="Download 50 Tawi"><FileText className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: MARKETING ASSETS */}
          {activeTab === 'assets' && (
            <div className="h-full flex flex-col max-w-6xl mx-auto animate-in fade-in duration-300">
               <div className="shrink-0 mb-6">
                  <h1 className="text-2xl font-bold text-white tracking-tight">คลังสื่อการตลาด (Marketing Assets)</h1>
                  <p className="text-sm text-slate-500 mt-1">อัปโหลดสื่อและเอกสารเพื่อซิงค์ไปให้ Partner ทั้งระบบดาวน์โหลด</p>
               </div>

               <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
                 {/* Upload Form */}
                 <div className="lg:w-1/3 flex flex-col gap-6 shrink-0">
                   <div className="admin-card rounded-2xl p-6 border flex flex-col items-center justify-center text-center h-48 border-dashed border-slate-600 bg-slate-800/30 hover:bg-slate-800/50 transition-colors cursor-pointer group">
                     <div className="w-12 h-12 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"><UploadCloud className="w-6 h-6"/></div>
                     <p className="text-sm font-bold text-slate-200">คลิกเพื่ออัปโหลดไฟล์</p>
                     <p className="text-[10px] text-slate-500 mt-1">รองรับ PDF, PNG, JPG, ZIP (Max 50MB)</p>
                   </div>
                   
                   <div className="admin-card rounded-2xl p-6 border space-y-4">
                     <div className="space-y-1.5">
                       <label className="text-xs font-bold text-slate-400 uppercase">ชื่อไฟล์แสดงผล</label>
                       <input type="text" placeholder="เช่น Pitch Deck Q3" className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" />
                     </div>
                     <div className="space-y-1.5">
                       <label className="text-xs font-bold text-slate-400 uppercase">หมวดหมู่</label>
                       <select className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 appearance-none">
                         <option>Presentations</option><option>Brand Assets</option><option>Marketing</option>
                       </select>
                     </div>
                     <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl transition-colors shadow-sm mt-2 flex items-center justify-center gap-2">
                       <UploadCloud className="w-4 h-4"/> เริ่มอัปโหลดและซิงค์
                     </button>
                   </div>
                 </div>

                 {/* Asset List (Fit View) */}
                 <div className="lg:w-2/3 admin-card rounded-2xl border flex flex-col flex-1 overflow-hidden min-h-0">
                   <div className="p-4 border-b border-slate-700 bg-slate-800/50 flex justify-between items-center shrink-0">
                     <h3 className="font-bold text-white text-sm">ไฟล์สื่อที่พร้อมใช้งาน</h3>
                     <span className="text-xs font-bold bg-slate-900 text-slate-400 px-2.5 py-1 rounded border border-slate-700">3 ไฟล์</span>
                   </div>
                   <div className="overflow-auto custom-scrollbar flex-1 p-0">
                     <table className="w-full text-left text-sm whitespace-nowrap">
                       <thead className="bg-slate-900 text-slate-400 text-[10px] uppercase tracking-widest font-bold border-b border-slate-700 sticky top-0 z-10">
                         <tr><th className="px-4 py-2.5">ชื่อไฟล์</th><th className="px-4 py-2.5">หมวดหมู่</th><th className="px-4 py-2.5 text-center w-24">ดาวน์โหลด</th><th className="px-4 py-2.5 text-center w-28">สถานะการซิงค์</th><th className="px-4 py-2.5 text-center w-16">จัดการ</th></tr>
                       </thead>
                       <tbody className="divide-y divide-slate-800/50">
                         {[
                           { name: 'AIVA Logo Pack (PNG/SVG)', cat: 'Brand Assets', dl: 142, size: '12.5 MB', date: '05/06/2026' },
                           { name: 'Pitch Deck Q3 2026', cat: 'Presentations', dl: 85, size: '24.1 MB', date: '01/06/2026' },
                           { name: ' Ads Banner (Set A)', cat: 'Marketing', dl: 256, size: '8.2 MB', date: '28/05/2026' }
                         ].map((f,i) => (
                           <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                             <td className="px-4 py-3"><div className="font-bold text-slate-200">{f.name}</div><div className="text-[10px] text-slate-500 mt-0.5">{f.size} • อัปโหลด: {f.date}</div></td>
                             <td className="px-4 py-3"><span className="text-[10px] font-bold bg-slate-800 border border-slate-700 px-2 py-1 rounded text-slate-300">{f.cat}</span></td>
                             <td className="px-4 py-3 text-center font-mono text-slate-400">{f.dl}</td>
                             <td className="px-4 py-3 text-center"><span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20"><Sparkles className="w-3 h-3"/> Synced</span></td>
                             <td className="px-4 py-3 text-center"><button className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors"><Trash2 className="w-4 h-4 mx-auto"/></button></td>
                           </tr>
                         ))}
                       </tbody>
                     </table>
                   </div>
                 </div>
               </div>
            </div>
          )}

          {/* TAB: HELPDESK TICKETS */}
          {activeTab === 'tickets' && (
            <div className="h-full flex flex-col max-w-7xl mx-auto animate-in fade-in duration-300">
               <div className="shrink-0 mb-6 flex justify-between items-end">
                  <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">ข้อเสนอแนะและแจ้งปัญหา</h1>
                    <p className="text-sm text-slate-500 mt-1">รับเรื่องร้องเรียนจากทั้ง Partner และ Customer</p>
                  </div>
               </div>

               <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
                 {/* Left: Table List */}
                 <div className="lg:w-2/3 flex flex-col gap-4 min-h-0">
                   <div className="grid grid-cols-2 gap-4 shrink-0">
                     <div className="admin-card rounded-2xl p-4 border cursor-pointer hover:border-amber-500/50 transition-colors">
                       <p className="text-[10px] font-bold text-amber-500 uppercase mb-1">รอการตอบกลับ</p>
                       <h3 className="text-3xl font-black text-white">4</h3>
                     </div>
                     <div className="admin-card rounded-2xl p-4 border cursor-pointer hover:border-indigo-500/50 transition-colors">
                       <p className="text-[10px] font-bold text-indigo-400 uppercase mb-1">กำลังดำเนินงาน</p>
                       <h3 className="text-3xl font-black text-white">12</h3>
                     </div>
                   </div>
                   <div className="admin-card rounded-2xl border flex flex-col flex-1 overflow-hidden min-h-0">
                     <div className="overflow-auto custom-scrollbar flex-1 p-0">
                       <table className="w-full text-left text-sm whitespace-nowrap">
                         <thead className="bg-slate-900 text-slate-400 text-[10px] uppercase tracking-widest font-bold border-b border-slate-700 sticky top-0 z-10">
                           <tr><th className="px-4 py-3 w-16">ID</th><th className="px-4 py-3">ผู้แจ้ง / ปัญหา</th><th className="px-4 py-3 text-center w-24">ประเภท</th><th className="px-4 py-3 text-center w-32">จัดการสถานะ</th></tr>
                         </thead>
                         <tbody className="divide-y divide-slate-800/50">
                           {MOCK_TICKETS.map((t,i) => (
                             <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                               <td className="px-4 py-3 text-[10px] font-mono text-slate-500">{t.id}</td>
                               <td className="px-4 py-3">
                                 <div className="flex items-center gap-1.5 mb-1">
                                   {t.sender === 'CUSTOMER' ? <span className="bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded text-[8px] font-bold border border-indigo-500/20"><Briefcase className="w-2.5 h-2.5 inline pb-0.5"/> CUST</span> : <span className="bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded text-[8px] font-bold border border-emerald-500/20"><Users className="w-2.5 h-2.5 inline pb-0.5"/> PTN</span>}
                                   <span className="text-[10px] text-slate-400">{t.name}</span>
                                 </div>
                                 <div className="font-bold text-slate-200 truncate max-w-xs" title={t.issue}>{t.issue}</div>
                                 <div className="text-[9px] text-slate-500 mt-0.5">{t.time}</div>
                               </td>
                               <td className="px-4 py-3 text-center">
                                 {t.type === 'Feature' && <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded"><Lightbulb className="w-3 h-3 inline pb-0.5"/> เสนอแนะ</span>}
                                 {t.type === 'Bug' && <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-1 rounded"><AlertCircle className="w-3 h-3 inline pb-0.5"/> บั๊ก</span>}
                                 {t.type === 'Billing' && <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded"><DollarSign className="w-3 h-3 inline pb-0.5"/> การเงิน</span>}
                               </td>
                               <td className="px-4 py-3 text-center">
                                 <select className={`text-[10px] font-bold rounded-lg px-2 py-1.5 outline-none appearance-none cursor-pointer border ${t.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : t.status === 'In Progress' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                                   <option>{t.status}</option>
                                   {t.status !== 'Pending' && <option>Pending</option>}
                                   {t.status !== 'In Progress' && <option>In Progress</option>}
                                   {t.status !== 'Resolved' && <option>Resolved</option>}
                                 </select>
                               </td>
                             </tr>
                           ))}
                         </tbody>
                       </table>
                     </div>
                   </div>
                 </div>

                 {/* Right: AI Insights (New) */}
                 <div className="lg:w-1/3 flex flex-col min-h-0">
                   <div className="admin-card rounded-2xl border p-5 flex flex-col h-full bg-gradient-to-b from-[#1E293B] to-[#0F172A] relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[50px] rounded-full pointer-events-none"></div>
                     <div className="flex items-center gap-2 mb-4 shrink-0 relative z-10">
                       <Bot className="w-5 h-5 text-indigo-400" />
                       <h3 className="font-bold text-white text-sm">AI Ticket Insights</h3>
                     </div>
                     <p className="text-xs text-slate-400 leading-relaxed mb-4 relative z-10 shrink-0">AI สรุปแนวโน้มปัญหาจาก Ticket ทั้งหมดในสัปดาห์นี้ เพื่อเสนอทิศทางการพัฒนา (Roadmap) ให้ทีมงาน</p>
                     
                     <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-4 relative z-10">
                       <div className="bg-slate-900/50 border border-slate-700/50 p-4 rounded-xl">
                         <h4 className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-2">🔥 Top Trend (เจอบ่อยสุด)</h4>
                         <p className="text-sm font-bold text-slate-200 mb-1">ปัญหาอ่าน PDF หลายไฟล์</p>
                         <p className="text-xs text-slate-400 leading-relaxed">ลูกค้า 15 รายเสนอให้ระบบสามารถอัปโหลด PDF เพื่อสอน AI ได้มากกว่า 1 ไฟล์ต่อ 1 โควต้า</p>
                       </div>
                       <div className="bg-slate-900/50 border border-slate-700/50 p-4 rounded-xl">
                         <h4 className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5"/> Actionable Tasks</h4>
                         <ul className="text-xs text-slate-300 space-y-2">
                           <li className="flex gap-2 items-start"><CheckCircle2 className="w-3.5 h-3.5 text-slate-600 shrink-0 mt-0.5"/> แจ้งทีม Dev เพิ่มฟีเจอร์ "Multi-PDF Upload" ในแพ็กเกจ Pro</li>
                           <li className="flex gap-2 items-start"><CheckCircle2 className="w-3.5 h-3.5 text-slate-600 shrink-0 mt-0.5"/> ทำคู่มืออธิบายการตั้งค่า Webhook ของ LINE OA ให้ Partner เข้าใจง่ายขึ้น</li>
                         </ul>
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
            </div>
          )}

          {/* TAB: ANNOUNCEMENTS & BROADCAST */}
          {activeTab === 'announcements' && (
            <div className="h-full flex flex-col max-w-6xl mx-auto animate-in fade-in duration-300">
               <div className="shrink-0 mb-6">
                  <h1 className="text-2xl font-bold text-white tracking-tight">ระบบประกาศและแคมเปญ (Broadcast)</h1>
                  <p className="text-sm text-slate-500 mt-1">ส่งข้อความแจ้งเตือน แคมเปญส่งเสริมการขาย และอัปเดตไปยัง Partner Dashboard โดยตรง</p>
               </div>

               <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
                 {/* Create Announcement Form */}
                 <div className="lg:w-1/3 flex flex-col gap-6 shrink-0">
                   <div className="admin-card rounded-2xl p-6 border space-y-4">
                     <h2 className="font-bold text-white text-base border-b border-slate-700 pb-3 flex items-center gap-2"><Megaphone className="w-5 h-5 text-amber-400"/> สร้างประกาศใหม่</h2>
                     <div className="space-y-1.5">
                       <label className="text-xs font-bold text-slate-400 uppercase">หัวข้อประกาศ (Title)</label>
                       <input type="text" placeholder="เช่น แคมเปญ Q3..." className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" />
                     </div>
                     <div className="space-y-1.5">
                       <label className="text-xs font-bold text-slate-400 uppercase">รายละเอียด (Message)</label>
                       <textarea rows="4" placeholder="พิมพ์ข้อความที่ต้องการแจ้งให้ Partner ทราบ..." className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 resize-none custom-scrollbar"></textarea>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-1.5">
                         <label className="text-xs font-bold text-slate-400 uppercase">ประเภท</label>
                         <select className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 appearance-none">
                           <option>Campaign</option><option>Product Update</option><option>Event</option><option>Alert</option>
                         </select>
                       </div>
                       <div className="space-y-1.5">
                         <label className="text-xs font-bold text-slate-400 uppercase">ส่งถึงใคร?</label>
                         <select className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 appearance-none">
                           <option>All Partners</option><option>Gold Tier Only</option><option>Silver & Up</option><option>เฉพาะรายบุคคล</option>
                         </select>
                       </div>
                     </div>
                     <button className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-2.5 rounded-xl transition-colors shadow-sm mt-4 flex items-center justify-center gap-2">
                       <Send className="w-4 h-4"/> Publish Broadcast
                     </button>
                   </div>
                 </div>

                 {/* Announcement History List */}
                 <div className="lg:w-2/3 admin-card rounded-2xl border flex flex-col flex-1 overflow-hidden min-h-0">
                   <div className="p-4 border-b border-slate-700 bg-slate-800/50 flex justify-between items-center shrink-0">
                     <h3 className="font-bold text-white text-sm">ประวัติการประกาศ (Broadcast History)</h3>
                   </div>
                   <div className="overflow-auto custom-scrollbar flex-1 p-0">
                     <table className="w-full text-left text-sm whitespace-nowrap">
                       <thead className="bg-slate-900 text-slate-400 text-[10px] uppercase tracking-widest font-bold border-b border-slate-700 sticky top-0 z-10">
                         <tr><th className="px-4 py-3">หัวข้อประกาศ</th><th className="px-4 py-3 text-center">ประเภท</th><th className="px-4 py-3 text-center">กลุ่มเป้าหมาย</th><th className="px-4 py-3 text-center w-20"><Eye className="w-4 h-4 mx-auto"/></th><th className="px-4 py-3 text-center w-24">สถานะ</th><th className="px-4 py-3 text-center w-16">จัดการ</th></tr>
                       </thead>
                       <tbody className="divide-y divide-slate-800/50">
                         {MOCK_ANNOUNCEMENTS.map((a,i) => (
                           <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                             <td className="px-4 py-3">
                               <div className="font-bold text-slate-200">{a.title}</div>
                               <div className="text-[10px] text-slate-500 mt-0.5">วันที่ส่ง: {a.date} • {a.id}</div>
                             </td>
                             <td className="px-4 py-3 text-center">
                               {a.type === 'Campaign' && <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded">{a.type}</span>}
                               {a.type === 'Product Update' && <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-1 rounded">{a.type}</span>}
                               {a.type === 'Event' && <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded">{a.type}</span>}
                             </td>
                             <td className="px-4 py-3 text-center"><span className="text-[10px] text-slate-300 font-bold flex items-center justify-center gap-1"><Target className="w-3 h-3"/> {a.target}</span></td>
                             <td className="px-4 py-3 text-center font-mono text-emerald-400 font-bold">{a.views}</td>
                             <td className="px-4 py-3 text-center">
                               {a.status === 'Active' ? (
                                 <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> Live</span>
                               ) : (
                                 <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500">Ended</span>
                               )}
                             </td>
                             <td className="px-4 py-3 text-center">
                               <button className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors" title="Delete"><Trash2 className="w-4 h-4 mx-auto"/></button>
                             </td>
                           </tr>
                         ))}
                       </tbody>
                     </table>
                   </div>
                 </div>
               </div>
            </div>
          )}

          {/* TAB: TEAM (ROOT) */}
          {activeTab === 'team' && (
            <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2 tracking-tight"><Lock className="w-6 h-6 text-rose-500" /> จัดการสิทธิ์ทีมงาน (Team & Roles)</h1>
                <p className="text-slate-500 text-sm mt-1">หน้าต่างเฉพาะ Root Admin เพื่อจัดการรหัสพนักงานในระบบ (AD-xxx)</p>
              </div>
              <div className="admin-card rounded-2xl border overflow-hidden">
                <div className="p-4 border-b border-slate-700 bg-slate-800/50 flex justify-between items-center">
                  <h2 className="font-bold text-white text-sm">รายชื่อพนักงานระบบ</h2>
                  <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-sm">+ เพิ่มพนักงาน</button>
                </div>
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-900 text-slate-400 text-[10px] uppercase tracking-widest font-bold border-b border-slate-700">
                    <tr><th className="px-6 py-3">Admin ID</th><th className="px-6 py-3">ชื่อพนักงาน</th><th className="px-6 py-3 text-center">แผนก</th><th className="px-6 py-3 text-center">สถานะ</th><th className="px-6 py-3 text-center">จัดการ</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    <tr className="hover:bg-slate-800/30">
                      <td className="px-6 py-4 font-mono font-bold text-rose-400">ROOT-01</td>
                      <td className="px-6 py-4 font-bold text-white">คุณสมชาย (Founder)</td>
                      <td className="px-6 py-4 text-center"><span className="text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-1 rounded">ALL ACCESS</span></td>
                      <td className="px-6 py-4 text-center"><span className="text-[10px] font-bold text-emerald-400">Active</span></td>
                      <td className="px-6 py-4 text-center">-</td>
                    </tr>
                    <tr className="hover:bg-slate-800/30">
                      <td className="px-6 py-4 font-mono font-bold text-indigo-400">AD-001</td>
                      <td className="px-6 py-4 font-bold text-slate-200">น้องเอ ฝ่ายซัพพอร์ต</td>
                      <td className="px-6 py-4 text-center"><span className="text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700 px-2 py-1 rounded">HELPDESK</span></td>
                      <td className="px-6 py-4 text-center"><span className="text-[10px] font-bold text-emerald-400">Active</span></td>
                      <td className="px-6 py-4 text-center"><button className="text-slate-500 hover:text-white transition-colors"><Settings className="w-4 h-4 mx-auto"/></button></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

// Helpers
function NavItem({ icon: Icon, label, isActive, onClick }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}>
      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500'}`} />{label}
    </button>
  );
}