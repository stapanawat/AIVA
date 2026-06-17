import React, { useState, useEffect } from 'react';
import { USE_MOCK } from '../config';
import InvoiceDocument from '../components/InvoiceDocument';
import { 
  MOCK_PARTNERS, MOCK_CUSTOMERS, MOCK_PAYOUT_DATA, MOCK_TICKETS, MOCK_ANNOUNCEMENTS
} from '../data/mockData';
import { 
  LayoutDashboard, Users, CreditCard, Calculator, FolderUp, LifeBuoy, ShieldAlert, LogOut,
  TrendingUp, AlertCircle, CheckCircle2, DollarSign, FileText, Lock, RefreshCw,
  Search, Menu, X, ChevronDown, Download, Trash2, UploadCloud, PieChart, 
  Activity, Sparkles, Lightbulb, Eye, EyeOff, Bot, Briefcase, ChevronRight, 
  XCircle, Bell, Wallet, Clock, Settings, Mail, Network, Megaphone, Send, Target,
  BrainCircuit, BarChart2, MessageSquare, Radar, Zap, ListChecks
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
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

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
        showToast(data.error || 'เข้าสู่ระบบล้มเหลว', 'danger');
        setIsLoading(false);
        return;
      }
      
      localStorage.setItem('aiva_access_token', data.accessToken);
      localStorage.setItem('aiva_user', JSON.stringify(data.user));
      setIsLoading(false);
      onLogin();
    } catch (err) {
      if (USE_MOCK) {
        console.warn('Backend not running, falling back to mock authentication:', err);
        setTimeout(() => { setIsLoading(false); onLogin(); }, 1200);
      } else {
        showToast('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง', 'danger');
        setIsLoading(false);
      }
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
// MAIN SUPER ADMIN APP
// ==========================================
export default function SuperAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('aiva_access_token'));
  const PAYOUT_DATA = MOCK_PAYOUT_DATA;

  // --- API STATE BINDINGS ---
  const [partners, setPartners] = useState(USE_MOCK ? MOCK_PARTNERS : []);
  const [customers, setCustomers] = useState(USE_MOCK ? MOCK_CUSTOMERS : []);
  const [payoutsData, setPayoutsData] = useState(USE_MOCK ? MOCK_PAYOUT_DATA : {});
  const [announcements, setAnnouncements] = useState(USE_MOCK ? MOCK_ANNOUNCEMENTS : []);
  const [tickets, setTickets] = useState(USE_MOCK ? MOCK_TICKETS : []);
  const [insightsData, setInsightsData] = useState(null);
  const [isFetchingInsights, setIsFetchingInsights] = useState(false);
  const [broadcastForm, setBroadcastForm] = useState({ title: '', type: 'Campaign', target: 'ALL', content: '' });
  const [activeTab, setActiveTab] = useState('partners');
  const [assets, setAssets] = useState([]);
  const [assetForm, setAssetForm] = useState({ name: '', category: 'Presentations', size: '', url: '' });
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [smtpForm, setSmtpForm] = useState({
    host: '',
    port: 587,
    secure: false,
    user: '',
    pass: '',
    from: '',
    hasPassword: false
  });
  const [testEmail, setTestEmail] = useState('');
  const [isTestingSmtp, setIsTestingSmtp] = useState(false);
  const [isSavingSmtp, setIsSavingSmtp] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // States for search/filters
  const [partnerSearch, setPartnerSearch] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerFilter, setCustomerFilter] = useState({ source: 'All', plan: 'All' });
  
  const [payoutMonth, setPayoutMonth] = useState('2026-06');
  const [payoutSearch, setPayoutSearch] = useState('');
  const [broadcastType, setBroadcastType] = useState('partner');
  
  // Modal State for Sub-Partners
  const [selectedPartner, setSelectedPartner] = useState(null);

  // States for Goal Planner
  const [goalTarget, setGoalTarget] = useState(100000000); // Default 100M
  const [goalMonths, setGoalMonths] = useState(12);
  const [isCalculatingGoal, setIsCalculatingGoal] = useState(false);
  const [goalResult, setGoalResult] = useState(null);

  // --- MOCK DATA ---
    const fetchPartners = async () => {
    try {
      const token = localStorage.getItem('aiva_access_token');
      if (!token) return;
      const res = await fetch('/api/admin/partners', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const merged = USE_MOCK ? [...MOCK_PARTNERS] : [];
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
        const list = USE_MOCK ? [...MOCK_PAYOUT_DATA['2026-06'].list] : [];
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
        showToast('อัปเดตสถานะ KYC เรียบร้อยแล้วค่ะ!', 'success');
      } else {
        const errData = await res.json();
        showToast(errData.error || 'ไม่สามารถอัปเดตสถานะ KYC ได้', 'danger');
      }
    } catch (err) {
      console.warn('Backend offline, fallback KYC update locally:', err);
      setPartners(prev => prev.map(p => p.id === partnerId ? { ...p, kyc: status } : p));
      showToast('บันทึกสถานะ KYC ในโหมดออฟไลน์แล้ว', 'info');
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
        showToast('อนุมัติคำขอถอนเงินเรียบร้อยแล้วค่ะ!', 'success');
      } else {
        const errData = await res.json();
        showToast(errData.error || 'ไม่สามารถอนุมัติคำขอถอนเงินได้', 'danger');
      }
    } catch (err) {
      console.warn('Backend offline, approving payout locally:', err);
      try {
        setPayoutsData(prev => {
          const currentMonthData = prev[payoutMonth] || { list: [] };
          const updatedList = currentMonthData.list.map(p =>
            p.id === payoutId ? { ...p, status: 'Paid' } : p
          );
          return {
            ...prev,
            [payoutMonth]: {
              ...currentMonthData,
              list: updatedList
            }
          };
        });
        showToast('บันทึกการอนุมัติจ่ายเงินในโหมดออฟไลน์แล้วค่ะ!', 'info');
      } catch (e) {
        showToast('เกิดข้อผิดพลาดในการอนุมัติเงินถอน', 'danger');
      }
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const token = localStorage.getItem('aiva_access_token');
      if (!token) return;
      const res = await fetch('/api/admin/announcements', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const merged = USE_MOCK ? [...MOCK_ANNOUNCEMENTS] : [];
        data.forEach(dbAnc => {
          const idx = merged.findIndex(a => a.id === dbAnc.id);
          if (idx > -1) {
            merged[idx] = { ...merged[idx], ...dbAnc };
          } else {
            merged.unshift(dbAnc);
          }
        });
        setAnnouncements(merged);
      }
    } catch (err) {
      console.warn('Failed to fetch announcements:', err);
    }
  };

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem('aiva_access_token');
      if (!token) return;
      const res = await fetch('/api/admin/tickets', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const merged = USE_MOCK ? [...MOCK_TICKETS] : [];
        data.forEach(dbTkt => {
          const idx = merged.findIndex(t => t.id === dbTkt.id);
          if (idx > -1) {
            merged[idx] = { ...merged[idx], ...dbTkt };
          } else {
            merged.unshift(dbTkt);
          }
        });
        setTickets(merged);
      }
    } catch (err) {
      console.warn('Failed to fetch tickets:', err);
    }
  };

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem('aiva_access_token');
      if (!token) return;
      const res = await fetch('/api/admin/customers', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const merged = USE_MOCK ? [...MOCK_CUSTOMERS] : [];
        data.forEach(dbCust => {
          const idx = merged.findIndex(c => c.id === dbCust.id);
          if (idx > -1) {
            merged[idx] = { ...merged[idx], ...dbCust };
          } else {
            merged.push(dbCust);
          }
        });
        setCustomers(merged);
      }
    } catch (err) {
      console.warn('Failed to fetch customers:', err);
    }
  };

  const formatBytes = (bytes, decimals = 1) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const fetchMarketInsights = async () => {
    setIsFetchingInsights(true);
    try {
      const token = localStorage.getItem('aiva_access_token');
      const res = await fetch('/api/admin/insights', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      if (res.ok) {
        const data = await res.json();
        setInsightsData(data);
      }
    } catch (err) {
      console.warn('Failed to fetch insights:', err);
    } finally {
      setIsFetchingInsights(false);
    }
  };

  const handleCalculateGoal = async () => {
    const targetVal = Number(goalTarget);
    const monthsVal = Number(goalMonths);
    if (isNaN(targetVal) || targetVal <= 0) {
      showToast('กรุณาระบุเป้าหมายยอดขายที่ถูกต้อง (ต้องมากกว่า 0)', 'danger');
      return;
    }
    if (isNaN(monthsVal) || monthsVal <= 0) {
      showToast('กรุณาระบุระยะเวลาที่ถูกต้อง (ต้องมากกว่า 0)', 'danger');
      return;
    }

    setIsCalculatingGoal(true);
    try {
      const token = localStorage.getItem('aiva_access_token');
      const res = await fetch('/api/admin/goal-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          target: Number(goalTarget),
          months: Number(goalMonths)
        })
      });

      if (res.ok) {
        const data = await res.json();
        
        // Map types to Lucide React icons
        const typeToIcon = {
          partner: Users,
          campaign: Target,
          marketing: Megaphone,
          product: Lightbulb,
          retention: BrainCircuit
        };

        const mappedActions = (data.actions || []).map(act => ({
          ...act,
          icon: typeToIcon[act.type] || Lightbulb
        }));

        setGoalResult({
          monthlyTarget: data.monthlyTarget,
          costs: data.costs,
          profit: data.profit,
          actions: mappedActions
        });
        showToast('AI วางแผนกลยุทธ์เป้าหมายสำเร็จแล้วค่ะ! 🎯', 'success');
      } else {
        const errData = await res.json();
        showToast(errData.error || 'ไม่สามารถวิเคราะห์กลยุทธ์ได้', 'danger');
      }
    } catch (err) {
      console.warn('Failed to calculate goal strategy:', err);
      // Fallback local calculation
      const costAPI = goalTarget * 0.06;
      const costComm = goalTarget * 0.22;
      const costMkt = goalTarget * 0.15;
      const costServer = goalTarget * 0.04;
      const costOp = goalTarget * 0.10;
      const totalCost = costAPI + costComm + costMkt + costServer + costOp;
      const profit = goalTarget - totalCost;
      const newPartnersNeeded = Math.ceil((goalTarget * 0.4) / 100000);
      setGoalResult({
        monthlyTarget: goalTarget / goalMonths,
        costs: { api: costAPI, comm: costComm, mkt: costMkt, server: costServer, op: costOp, total: totalCost },
        profit: profit,
        actions: [
          { icon: Users, text: `รับสมัคร Partner ระดับ Gold/Silver เพิ่มอีก ${newPartnersNeeded} รายภายใน ${Math.max(1, Math.floor(goalMonths/3))} เดือนแรก`, type: 'partner' },
          { icon: Target, text: 'จัดแคมเปญอัดฉีด: แจกโบนัสคอมมิชชันเพิ่ม 3% สำหรับ Partner ที่ทำยอดเกิน 1 ล้านบาท/เดือน', type: 'campaign' },
          { icon: Megaphone, text: `เพิ่มงบยิงแอด Facebook/TikTok เป็น ฿${Math.floor(costMkt / goalMonths).toLocaleString()} ต่อเดือน เน้นกลุ่มเจ้าของธุรกิจ SME`, type: 'marketing' },
          { icon: Lightbulb, text: 'เปิดตัวฟีเจอร์ "เชื่อมต่อ POS" ในแพ็กเกจ Advanced (11,900.-) เพื่ออัปเซลล์ลูกค้ากลุ่ม Pro เดิมให้ขยับแพ็กเกจ', type: 'product' },
          { icon: BrainCircuit, text: 'ทำระบบ Webinar อบรมการใช้งาน AI ฟรีทุกสัปดาห์ เพื่อลดอัตราการยกเลิก (Churn Rate) ลง 1.5%', type: 'retention' }
        ]
      });
    } finally {
      setIsCalculatingGoal(false);
    }
  };

  const fetchAssets = async () => {
    try {
      const token = localStorage.getItem('aiva_access_token');
      if (!token) return;
      const res = await fetch('/api/admin/assets', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      if (res.ok) {
        const data = await res.json();
        setAssets(data);
      }
    } catch (err) {
      console.warn('Failed to fetch assets:', err);
    }
  };

  const handleCreateAsset = async (e) => {
    if (e) e.preventDefault();
    if (!assetForm.name.trim() || !assetForm.category) {
      showToast('กรุณากรอกชื่อไฟล์และเลือกหมวดหมู่', 'danger');
      return;
    }
    try {
      const token = localStorage.getItem('aiva_access_token');
      const res = await fetch('/api/admin/assets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          name: assetForm.name,
          category: assetForm.category,
          size: assetForm.size || '1.0 MB',
          url: assetForm.url || 'https://aiva.sparexth.com/assets/mock_download.zip'
        })
      });
      if (res.ok) {
        showToast('อัปโหลดไฟล์สื่อสำเร็จแล้วค่ะ!', 'success');
        fetchAssets();
        setAssetForm({ name: '', category: 'Presentations', size: '', url: '' });
      } else {
        const errData = await res.json();
        showToast(errData.error || 'สร้างไฟล์สื่อล้มเหลว', 'danger');
      }
    } catch (err) {
      console.error('Error creating asset:', err);
    }
  };

  const handleDeleteAsset = async (assetId) => {
    if (!window.confirm('คุณต้องการลบไฟล์สื่อการตลาดนี้ใช่หรือไม่?')) return;
    try {
      const token = localStorage.getItem('aiva_access_token');
      const res = await fetch('/api/admin/assets/' + assetId, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + token }
      });
      if (res.ok) {
        fetchAssets();
        showToast('ลบไฟล์สื่อการตลาดสำเร็จแล้วค่ะ!', 'success');
      } else {
        const errData = await res.json();
        showToast(errData.error || 'ลบไฟล์สื่อล้มเหลว', 'danger');
      }
    } catch (err) {
      console.error('Error deleting asset:', err);
      showToast('เกิดข้อผิดพลาดในการลบไฟล์สื่อ', 'danger');
    }
  };

  const handleUpdateTicketStatus = async (ticketId, status) => {
    try {
      const token = localStorage.getItem('aiva_access_token');
      const res = await fetch('/api/admin/tickets/' + ticketId + '/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchTickets();
        showToast('อัปเดตสถานะตั๋วคำขอช่วยเหลือสำเร็จแล้วค่ะ!', 'success');
      } else {
        const errData = await res.json();
        showToast(errData.error || 'อัปเดตสถานะตั๋วช่วยเหลือล้มเหลว', 'danger');
      }
    } catch (err) {
      console.error('Error updating ticket status:', err);
      showToast('เกิดข้อผิดพลาดในการอัปเดตสถานะตั๋ว', 'danger');
    }
  };

  const handleCreateAnnouncement = async () => {
    if (!broadcastForm.title.trim() || !broadcastForm.content.trim()) {
      showToast('กรุณากรอกหัวข้อและรายละเอียดให้ครบถ้วน', 'danger');
      return;
    }
    try {
      const token = localStorage.getItem('aiva_access_token');
      const res = await fetch('/api/admin/broadcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: broadcastForm.title,
          content: broadcastForm.content,
          targetTier: broadcastForm.target,
          type: broadcastForm.type,
          audience: broadcastType.toUpperCase()
        })
      });
      if (res.ok) {
        showToast('ส่งประกาศบรอดแคสต์สำเร็จแล้วค่ะ!', 'success');
        fetchAnnouncements();
        setBroadcastForm({ title: '', type: 'Campaign', target: 'ALL', content: '' });
      } else {
        const errData = await res.json();
        showToast(errData.error || 'ส่งประกาศบรอดแคสต์ล้มเหลว', 'danger');
      }
    } catch (err) {
      console.warn('Backend offline, adding announcement locally:', err);
      const newAnc = {
        id: 'A-' + Date.now(),
        title: broadcastForm.title,
        content: broadcastForm.content,
        type: broadcastForm.type,
        target: broadcastForm.target,
        views: 0,
        status: 'Active',
        date: new Date().toLocaleDateString('th-TH')
      };
      setAnnouncements(prev => [newAnc, ...prev]);
      setBroadcastForm({ title: '', type: 'Campaign', target: 'ALL', content: '' });
    }
  };

  const fetchSmtpSettings = async () => {
    try {
      const token = localStorage.getItem('aiva_access_token');
      if (!token) return;
      const res = await fetch('/api/admin/smtp', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSmtpForm({
          host: data.host || '',
          port: data.port || 587,
          secure: data.secure || false,
          user: data.user || '',
          pass: data.hasPassword ? '__UNCHANGED__' : '',
          from: data.from || '',
          hasPassword: data.hasPassword
        });
      }
    } catch (err) {
      console.error('Error fetching SMTP settings:', err);
    }
  };

  const handleSaveSmtpSettings = async (e) => {
    if (e) e.preventDefault();
    
    if (!smtpForm.host || !smtpForm.host.trim()) {
      showToast('กรุณากรอก SMTP Host ด้วยค่ะ', 'danger');
      return;
    }
    const portNum = parseInt(smtpForm.port);
    if (isNaN(portNum) || portNum <= 0) {
      showToast('กรุณากรอก SMTP Port ที่ถูกต้องด้วยค่ะ', 'danger');
      return;
    }
    if (!smtpForm.user || !smtpForm.user.trim()) {
      showToast('กรุณากรอก SMTP Username ด้วยค่ะ', 'danger');
      return;
    }
    if (!smtpForm.from || !smtpForm.from.trim()) {
      showToast('กรุณากรอกอีเมลผู้ส่งด้วยค่ะ', 'danger');
      return;
    }
    const emailRegex = /^([^\s@]+@[^\s@]+\.[^\s@]+|[^<>]+<[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+>)$/;
    if (!emailRegex.test(smtpForm.from.trim())) {
      showToast('กรุณากรอกอีเมลผู้ส่งให้ถูกต้องตามรูปแบบมาตรฐาน', 'danger');
      return;
    }

    setIsSavingSmtp(true);
    try {
      const token = localStorage.getItem('aiva_access_token');
      const res = await fetch('/api/admin/smtp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          host: smtpForm.host,
          port: parseInt(smtpForm.port),
          secure: smtpForm.secure,
          user: smtpForm.user,
          pass: smtpForm.pass === '' ? undefined : smtpForm.pass,
          from: smtpForm.from
        })
      });
      if (res.ok) {
        const data = await res.json();
        showToast('บันทึกการตั้งค่า SMTP สำเร็จแล้วค่ะ!', 'success');
        setSmtpForm(prev => ({
          ...prev,
          pass: data.config.hasPassword ? '__UNCHANGED__' : '',
          hasPassword: data.config.hasPassword
        }));
      } else {
        const errData = await res.json();
        showToast(errData.error || 'บันทึกการตั้งค่า SMTP ล้มเหลว', 'danger');
      }
    } catch (err) {
      console.error('Error saving SMTP settings:', err);
      showToast('เกิดข้อผิดพลาดในการบันทึกการตั้งค่า SMTP', 'danger');
    } finally {
      setIsSavingSmtp(false);
    }
  };

  const handleTestSmtpConnection = async (e) => {
    if (e) e.preventDefault();
    if (!testEmail.trim()) {
      showToast('กรุณากรอกอีเมลสำหรับรับข้อความทดสอบ', 'danger');
      return;
    }
    setIsTestingSmtp(true);
    try {
      const token = localStorage.getItem('aiva_access_token');
      const res = await fetch('/api/admin/smtp/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ toEmail: testEmail })
      });
      const data = await res.json();
      if (res.ok) {
        let msg = `ส่งอีเมลทดสอบไปยัง ${testEmail} สำเร็จแล้วค่ะ!`;
        if (data.mock) {
          msg += ' (ใช้ระบบจำลอง Mock Logger)';
        }
        showToast(msg, 'success');
      } else {
        showToast(data.error || 'การทดสอบการเชื่อมต่อ SMTP ล้มเหลว', 'danger');
      }
    } catch (err) {
      console.error('Error testing SMTP connection:', err);
      showToast('เกิดข้อผิดพลาดในการทดสอบการเชื่อมต่อ SMTP', 'danger');
    } finally {
      setIsTestingSmtp(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchPartners();
      fetchPayouts();
      fetchAnnouncements();
      fetchTickets();
      fetchCustomers();
      fetchAssets();
      fetchMarketInsights();
      fetchSmtpSettings();
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem('aiva_access_token');
    localStorage.removeItem('aiva_user');
    setIsAuthenticated(false);
  };

  const handleDownloadZip50Tawi = () => {
    const dummyZipContent = new Uint8Array([
      0x50, 0x4b, 0x03, 0x04, 0x0a, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x0c, 0x00, 0x00, 0x00, 0x6d, 0x6f,
      0x63, 0x6b, 0x5f, 0x35, 0x30, 0x5f, 0x74, 0x61, 0x77, 0x69, 0x2e, 0x74, 0x78, 0x74, 0x50, 0x4b,
      0x01, 0x02, 0x1e, 0x03, 0x0a, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x0c, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x6d, 0x6f, 0x63, 0x6b,
      0x5f, 0x35, 0x30, 0x5f, 0x74, 0x61, 0x77, 0x69, 0x2e, 0x74, 0x78, 0x74, 0x50, 0x4b, 0x05, 0x06,
      0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x3a, 0x00, 0x00, 0x00, 0x2c, 0x00, 0x00, 0x00,
      0x00, 0x00
    ]);
    
    const blob = new Blob([dummyZipContent], { type: 'application/zip' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `50_tawi_documents_${payoutMonth}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('ดาวน์โหลดเอกสาร 50 ทวิสำเร็จแล้วค่ะ!', 'success');
  };

  const handleDownloadBankCSV = () => {
    if (!currentPayouts.list || currentPayouts.list.length === 0) {
      showToast('ไม่มีข้อมูลการจ่ายเงินสำหรับรอบบิลนี้', 'danger');
      return;
    }
    
    const headers = ['Partner ID', 'Partner Name', 'Bank Name', 'Bank Account', 'Gross Commission (THB)', 'WHT (3%)', 'Net Amount (THB)', 'Status'];
    const rows = currentPayouts.list.map(p => {
      let bankName = 'ธนาคารกสิกรไทย (KBANK)';
      let bankAccount = '012-3-45678-9';
      if (p.partnerId === 'P11223') {
        bankName = 'ธนาคารไทยพาณิชย์ (SCB)';
        bankAccount = '111-2-23344-5';
      } else if (p.partnerId === 'P99887') {
        bankName = 'ธนาคารกรุงเทพ (BBL)';
        bankAccount = '998-8-77665-5';
      } else if (p.partnerId === 'P44556') {
        bankName = 'ธนาคารกรุงไทย (KTB)';
        bankAccount = '445-5-66778-8';
      }
      
      return [
        p.partnerId,
        p.name,
        bankName,
        bankAccount,
        p.comm,
        p.wht,
        p.net,
        p.status
      ];
    });
    
    const csvContent = "\uFEFF" 
      + [headers.join(','), ...rows.map(r => r.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))].join('\n');
      
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bank_payout_transfer_${payoutMonth}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('ดาวน์โหลดรายงาน CSV แบงก์เรียบร้อยแล้วค่ะ!', 'success');
  };

  const handleExportPartners = () => {
    const filteredPartners = partners.filter(p => p.name.includes(partnerSearch) || p.id.includes(partnerSearch.toUpperCase()));
    if (filteredPartners.length === 0) {
      showToast('ไม่มีข้อมูลพาร์ทเนอร์สำหรับส่งออก', 'danger');
      return;
    }
    showToast('ส่งออกข้อมูลพาร์ทเนอร์เรียบร้อยแล้วค่ะ!', 'success');
    const headers = ['Partner ID', 'Name', 'Email', 'Commission Tier', 'Sub-Partners Count', 'Revenue (Mo)', 'KYC Status'];
    const rows = filteredPartners.map(p => [
      p.id,
      p.name,
      p.email,
      p.tier,
      p.subPartners?.length || 0,
      p.rev,
      p.kyc
    ]);

    const csvContent = "\uFEFF"
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val.toString().replace(/"/g, '""')}"`).join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `aiva_partners_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // --- CALCULATIONS FOR PARTNER TAB ---
  const mainPartnerCount = (partners || []).length;
  const mainPartnerRev = (partners || []).reduce((sum, p) => sum + (p.rev || 0), 0);
  const subPartnerCount = (partners || []).reduce((sum, p) => sum + (p.subPartners?.length || 0), 0);
  const subPartnerRev = (partners || []).reduce((sum, p) => sum + (p.subPartners || []).reduce((spSum, sp) => spSum + (sp.rev || 0), 0), 0);
  const totalPartnerCount = mainPartnerCount + subPartnerCount;
  const totalPartnerRev = mainPartnerRev + subPartnerRev;

  // --- HANDLER FOR GOAL PLANNER ---
  

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
              <NavItem icon={Calculator} label="เป้าหมายยอดขาย (AI Goal)" isActive={activeTab === 'goal-planner'} onClick={() => {setActiveTab('goal-planner'); setIsSidebarOpen(false);}} />
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
              <NavItem icon={Megaphone} label="ประกาศ & แคมเปญ" isActive={activeTab === 'announcements'} onClick={() => {setActiveTab('announcements'); setIsSidebarOpen(false);}} />
              <NavItem icon={FolderUp} label="คลังสื่อการตลาด" isActive={activeTab === 'assets'} onClick={() => {setActiveTab('assets'); setIsSidebarOpen(false);}} />
              <NavItem icon={LifeBuoy} label="Helpdesk Tickets" isActive={activeTab === 'tickets'} onClick={() => {setActiveTab('tickets'); setIsSidebarOpen(false);}} />
              <NavItem id="btn-nav-smtp" icon={Mail} label="ตั้งค่าระบบ SMTP" isActive={activeTab === 'smtp'} onClick={() => {setActiveTab('smtp'); setIsSidebarOpen(false);}} />
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
                <p className="text-[10px] text-slate-500 flex items-center gap-1 cursor-pointer hover:text-white" onClick={() => setIsAuthenticated(false)}><LogOut className="w-3 h-3"/> System Logout</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-[72px] border-b border-slate-800 bg-[#0F172A] flex items-center justify-between px-6 shrink-0 z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-slate-400 hover:text-white"><Menu className="w-5 h-5"/></button>
            <h1 className="text-xl font-bold text-white tracking-tight hidden sm:block">
              {activeTab === 'dashboard' && 'Global Dashboard'}
              {activeTab === 'insights' && 'AI Market Insights & Roadmap'}
              {activeTab === 'goal-planner' && 'ตั้งเป้าหมาย & วางแผนกลยุทธ์'}
              {activeTab === 'partners' && 'Partner Management'}
              {activeTab === 'customers' && 'Global Customers Database'}
              {activeTab === 'payouts' && 'การจ่ายเงิน & 50 ทวิ (Payouts)'}
              {activeTab === 'announcements' && 'ประกาศและแคมเปญ (Broadcast)'}
              {activeTab === 'assets' && 'คลังสื่อการตลาด (Marketing Assets)'}
              {activeTab === 'tickets' && 'ระบบสนับสนุน (Helpdesk & Tickets)'}
              {activeTab === 'team' && 'Team & Roles (Root)'}
              {activeTab === 'smtp' && 'ตั้งค่าระบบส่งอีเมล (SMTP Settings)'}
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

        <div className="flex-1 overflow-auto p-4 lg:p-8 custom-scrollbar">
          
          {/* Sub-Partner Modal Overlay */}
          {selectedPartner && (
            <div className="fixed inset-0 bg-[#0B1120]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
              <div className="bg-[#1E293B] border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-5 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2"><Network className="w-5 h-5 text-indigo-400"/> Sub-Partner Network</h2>
                    <p className="text-sm text-slate-400 mt-1">เครือข่ายของ {selectedPartner.name} ({selectedPartner.id})</p>
                  </div>
                  <button onClick={() => setSelectedPartner(null)} className="text-slate-400 hover:text-white bg-slate-800 p-2 rounded-full"><X className="w-5 h-5"/></button>
                </div>
                
                <div className="p-6">
                  <div className="mb-6 bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
                    <div className="flex justify-between items-end mb-2">
                      <p className="text-sm font-bold text-slate-300">โควต้า Sub-Partner (Max 20)</p>
                      <p className="text-lg font-black text-white">{selectedPartner.subPartners?.length || 0} <span className="text-sm font-normal text-slate-500">/ 20</span></p>
                    </div>
                    <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${((selectedPartner.subPartners?.length || 0) / 20) * 100}%` }}></div>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-3">รายชื่อ Sub-Partner</h3>
                  {(selectedPartner.subPartners && selectedPartner.subPartners.length > 0) ? (
                    <div className="border border-slate-700 rounded-xl overflow-hidden">
                      <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-800 text-slate-400 text-[10px] uppercase tracking-widest font-bold border-b border-slate-700">
                          <tr><th className="px-4 py-2.5">Sub ID</th><th className="px-4 py-2.5">Name</th><th className="px-4 py-2.5 text-center">Clients</th><th className="px-4 py-2.5 text-right">Revenue</th></tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                          {selectedPartner.subPartners.map((sp, idx) => (
                            <tr key={idx} className="hover:bg-slate-800/30">
                              <td className="px-4 py-3"><span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-1 rounded">{sp.id}</span></td>
                              <td className="px-4 py-3 font-bold text-slate-200">{sp.name}</td>
                              <td className="px-4 py-3 text-center text-slate-300">{sp.clients}</td>
                              <td className="px-4 py-3 text-right font-black text-emerald-400">฿{sp.rev.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-500 bg-slate-900/30 rounded-xl border border-slate-700/50 border-dashed">
                      <Network className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                      <p className="text-sm font-bold">ยังไม่มี Sub-Partner ในเครือข่าย</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

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

          {/* TAB: INSIGHTS & ROADMAP */}
          {activeTab === 'insights' && (
            <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
              <div className="shrink-0 mb-6">
                <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2"><BrainCircuit className="w-6 h-6 text-indigo-400"/> AI Market Insights & Roadmap</h1>
                <p className="text-sm text-slate-500 mt-1">วิเคราะห์พฤติกรรมการใช้งานและ Feedback จากลูกค้าทั้งหมด เพื่อกำหนดทิศทางการพัฒนาผลิตภัณฑ์</p>
              </div>

              {/* Top Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="admin-card rounded-2xl p-5 border flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2"><div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400"><TrendingUp className="w-5 h-5" /></div></div>
                  <div><h3 className="text-3xl font-black text-white">{(insightsData?.sentiment || 4.8).toFixed(1)}<span className="text-lg text-slate-500 font-normal">/5</span></h3><p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">Overall Sentiment</p><p className="text-xs text-emerald-400 mt-1">+0.2 จากไตรมาสก่อน</p></div>
                </div>
                <div className="admin-card rounded-2xl p-5 border flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2"><div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400"><Activity className="w-5 h-5" /></div></div>
                  <div><h3 className="text-2xl font-black text-white leading-tight">{insightsData?.mostUsedFeature || "Multi-PDF Sync"}</h3><p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">Most Used Feature</p><p className="text-xs text-slate-500 mt-1">วิเคราะห์จากสถิติโมเดลความรู้</p></div>
                </div>
                <div className="admin-card rounded-2xl p-5 border flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2"><div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400"><MessageSquare className="w-5 h-5" /></div></div>
                  <div><h3 className="text-3xl font-black text-white">{insightsData?.topFeedbacks ? 'Live' : '1,204'}</h3><p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">Feedback Processed</p><p className="text-xs text-indigo-400 mt-1">วิเคราะห์โดย AI</p></div>
                </div>
              </div>

              {/* Main Content: 2 Columns */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* AI Feature Requests & Pain Points */}
                <div className="admin-card rounded-2xl p-6 border flex flex-col">
                  <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2"><BarChart2 className="w-5 h-5 text-rose-400"/> TOP 3 Feedback & Pain Points</h3>
                  <div className="space-y-4 flex-1">
                    {(insightsData?.topFeedbacks || [
                      {
                        rank: 1,
                        title: "การเชื่อมต่อ POS ล่มบ่อย",
                        priority: "High Priority",
                        desc: "พบการแจ้งปัญหา 45 ครั้งในสัปดาห์นี้ ส่วนใหญ่เกิดกับลูกค้าร้านอาหาร",
                        pkg: "Advanced Plan",
                        barColor: "bg-rose-500"
                      },
                      {
                        rank: 2,
                        title: "ต้องการ AI ช่วยตอบคอมเมนต์ Facebook",
                        priority: "Feature Request",
                        desc: "ลูกค้าร้องขอฟีเจอร์นี้เพื่อลดเวลาแอดมินเพจในการตอบคำถามซ้ำๆ",
                        pkg: "Pro Plan",
                        barColor: "bg-amber-500"
                      },
                      {
                        rank: 3,
                        title: "ระบบสรุปยอดขายรายวันผ่าน LINE",
                        priority: "Feature Request",
                        desc: "เจ้าของกิจการต้องการรับบรีฟสั้นๆ ทุก 4 ทุ่ม โดยไม่ต้องล็อกอินเข้าหน้าเว็บ",
                        pkg: "Basic & Pro Plan",
                        barColor: "bg-emerald-500"
                      }
                    ]).map((item) => {
                      const isHigh = item.priority === 'High Priority';
                      const priorityColor = isHigh ? "text-rose-400 bg-rose-500/10 border-rose-500/20" : "text-amber-400 bg-amber-500/10 border-amber-500/20";
                      const isAdv = item.pkg && item.pkg.includes('Advanced');
                      const pkgColor = isAdv ? "text-purple-400 bg-purple-500/10 border-purple-500/20" : "text-blue-400 bg-blue-500/10 border-blue-500/20";
                      const bar = item.barColor || item.bar || (isHigh ? "bg-rose-500" : "bg-amber-500");

                      return (
                        <div key={item.rank} className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 relative overflow-hidden flex flex-col gap-2 hover:border-slate-600 transition-colors">
                          <div className={`absolute top-0 left-0 w-1 h-full ${bar}`}></div>
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 pl-2">
                            <div className="flex items-start gap-2">
                              <span className="text-lg font-black text-slate-600 leading-none">#{item.rank}</span>
                              <h4 className="font-bold text-slate-200 text-sm leading-tight">{item.title}</h4>
                            </div>
                            <div className="flex flex-wrap gap-1.5 shrink-0 pl-6 sm:pl-0">
                               <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${pkgColor}`}>{item.pkg}</span>
                               <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${priorityColor}`}>{item.priority}</span>
                            </div>
                          </div>
                          <p className="text-xs text-slate-400 pl-6 leading-relaxed">{item.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* AI Suggested Roadmap */}
                <div className="admin-card rounded-2xl p-6 border flex flex-col bg-gradient-to-br from-[#1E293B] to-[#0F172A] relative overflow-hidden">
                  <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none"></div>
                  <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2 relative z-10"><Lightbulb className="w-5 h-5 text-amber-400"/> AI Suggested Roadmap (Q3-Q4)</h3>
                  
                  <div className="relative z-10 space-y-6">
                    {(() => {
                      const roadmap = insightsData?.roadmap || {
                        q3_phase1: { title: "Q3/Phase 1: Stability First", desc: "มุ่งเน้นแก้ Pain point ที่มีผลกระทบต่อ Churn Rate ทันที", bullets: ["Rewrite ระบบเชื่อม API ของ POS ใหม่ทั้งหมด", "ขยาย Limit ของ Multi-PDF เป็น 50MB/ไฟล์"] },
                        q3_phase2: { title: "Q3/Phase 2: Social Commerce", desc: "ตอบโจทย์ Feature Request ที่ถูกขอมากที่สุดเพื่อ Upsell", bullets: ["เปิดตัวฟีเจอร์ AI Auto-Comment Reply", "เพิ่ม Channel Instagram DM Integration"] },
                        q4: { title: "Q4: Exec & Analytics", desc: "ดึงดูดลูกค้าระดับ Enterprise และผู้บริหาร", bullets: ["Line Broadcast สรุปยอดขายรายวันด้วย AI Voice", "Predictive Analytics (พยากรณ์ยอดขายเดือนหน้า)"] }
                      };
                      return (
                        <>
                          <div className="relative pl-6 border-l border-slate-700">
                            <span className="absolute -left-1.5 top-1 w-3 h-3 rounded-full bg-rose-500 border-2 border-[#1E293B]"></span>
                            <h4 className="text-sm font-bold text-white">{roadmap.q3_phase1.title}</h4>
                            <p className="text-xs text-slate-400 mt-1 mb-2">{roadmap.q3_phase1.desc}</p>
                            <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                              {(roadmap.q3_phase1.bullets || []).map((b, i) => <li key={i}>{b}</li>)}
                            </ul>
                          </div>

                          <div className="relative pl-6 border-l border-slate-700">
                            <span className="absolute -left-1.5 top-1 w-3 h-3 rounded-full bg-indigo-500 border-2 border-[#1E293B]"></span>
                            <h4 className="text-sm font-bold text-white">{roadmap.q3_phase2.title}</h4>
                            <p className="text-xs text-slate-400 mt-1 mb-2">{roadmap.q3_phase2.desc}</p>
                            <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                              {(roadmap.q3_phase2.bullets || []).map((b, i) => <li key={i}>{b}</li>)}
                            </ul>
                          </div>

                          <div className="relative pl-6 border-l border-slate-700/0">
                            <span className="absolute -left-1.5 top-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#1E293B]"></span>
                            <h4 className="text-sm font-bold text-white">{roadmap.q4.title}</h4>
                            <p className="text-xs text-slate-400 mt-1 mb-2">{roadmap.q4.desc}</p>
                            <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                              {(roadmap.q4.bullets || []).map((b, i) => <li key={i}>{b}</li>)}
                            </ul>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                  
                  <button className="w-full mt-auto bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold py-3 rounded-xl transition-colors shadow-sm relative z-10">
                    เพิ่มลง Development Sprint
                  </button>
                </div>

              </div>

              {/* NEW SECTION: AI Business Growth Signals */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
                
                {/* Predictive Revenue & Risk */}
                <div className="admin-card rounded-2xl p-6 border flex flex-col">
                  <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2"><Radar className="w-5 h-5 text-emerald-400"/> AI Predictive Revenue</h3>
                  <p className="text-xs text-slate-400 mb-6">คาดการณ์โอกาสเพิ่มยอดขาย (Upsell) และความเสี่ยงสูญเสียรายได้ (Churn)</p>
                  
                  <div className="space-y-4">
                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-3 opacity-20"><TrendingUp className="w-12 h-12 text-emerald-500"/></div>
                      <div className="relative z-10">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded uppercase tracking-wider mb-2">
                          <Zap className="w-3 h-3"/> Upsell Opportunity
                        </span>
                        <h4 className="font-bold text-white text-sm mb-1">กลุ่มลูกค้า Pro เตรียมขยับแพ็กเกจ</h4>
                        <p className="text-xs text-slate-300 leading-relaxed">ลูกค้า 12 ราย ใช้งาน Tokens เกิน 90% ติดต่อกัน 2 สัปดาห์ AI แนะนำให้เซลส์โทรเสนอโปรโมชั่นอัปเกรดเป็น Advanced</p>
                        <div className="mt-3 flex items-center gap-2 text-sm font-black text-emerald-400">
                          <span className="text-xs font-normal text-slate-400">คาดการณ์ MRR เพิ่ม:</span> +฿84,000 / เดือน
                        </div>
                      </div>
                    </div>

                    <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-3 opacity-20"><AlertCircle className="w-12 h-12 text-rose-500"/></div>
                      <div className="relative z-10">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded uppercase tracking-wider mb-2">
                          <Activity className="w-3 h-3"/> High Churn Risk
                        </span>
                        <h4 className="font-bold text-white text-sm mb-1">กลุ่มลูกค้าที่อาจไม่ต่ออายุ</h4>
                        <p className="text-xs text-slate-300 leading-relaxed">พบลูกค้า 8 ราย (ส่วนใหญ่เป็นคลินิก) ไม่มีการล็อกอินเข้ามาตั้งค่า AI เกิน 14 วัน แนะนำให้ส่ง Customer Success เข้าช่วยเหลือด่วน</p>
                        <div className="mt-3 flex items-center gap-2 text-sm font-black text-rose-400">
                          <span className="text-xs font-normal text-slate-400">ความเสี่ยง MRR สูญหาย:</span> -฿23,200 / เดือน
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Emerging Market Verticals */}
                <div className="admin-card rounded-2xl p-6 border flex flex-col">
                  <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2"><Target className="w-5 h-5 text-indigo-400"/> Emerging Market Trends</h3>
                  <p className="text-xs text-slate-400 mb-6">AI ตรวจจับกลุ่มธุรกิจที่เข้ามาสมัครใช้งานใหม่เติบโตสูงสุดในเดือนนี้</p>

                  <div className="space-y-4 flex-1">
                    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold">🏥</div>
                          <div>
                            <h4 className="font-bold text-slate-200 text-sm">คลินิกเวชกรรม / ความงาม</h4>
                            <p className="text-[10px] text-slate-500">ฟีเจอร์ที่ดึงดูด: AI รับนัดหมาย & แจ้งเตือนคิว</p>
                          </div>
                        </div>
                        <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">+45%</span>
                      </div>
                      <div className="mt-2 pt-2 border-t border-slate-700/50">
                        <p className="text-xs text-slate-400"><span className="text-indigo-400 font-bold">💡 Action:</span> สั่งทีม Marketing ผลิต Landing Page และ Case Study เจาะกลุ่มคลินิกโดยเฉพาะเพื่อเร่งปิดการขาย</p>
                      </div>
                    </div>

                    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">🏫</div>
                          <div>
                            <h4 className="font-bold text-slate-200 text-sm">สถาบันกวดวิชา / โรงเรียน</h4>
                            <p className="text-[10px] text-slate-500">ฟีเจอร์ที่ดึงดูด: Multi-PDF ถามตอบหลักสูตร</p>
                          </div>
                        </div>
                        <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">+30%</span>
                      </div>
                      <div className="mt-2 pt-2 border-t border-slate-700/50">
                        <p className="text-xs text-slate-400"><span className="text-indigo-400 font-bold">💡 Action:</span> ขยายฟังก์ชันระบบ Knowledge Base ให้รองรับการเชื่อมโยงหลายๆ ไฟล์คู่มือพร้อมกัน</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}{/* TAB: GOAL PLANNER (NEW) */}
          {activeTab === 'goal-planner' && (
            <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
              <div className="shrink-0 mb-6">
                <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2"><Calculator className="w-6 h-6 text-emerald-400"/> AI Sales Goal & Cost Forecaster</h1>
                <p className="text-sm text-slate-500 mt-1">กำหนดเป้าหมายยอดขายที่ต้องการ แล้วให้ AI ช่วยคำนวณต้นทุนที่เกี่ยวข้อง (Cost Breakdown) และแนะนำสิ่งที่ต้องทำ</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Input Form */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                  <div className="admin-card rounded-2xl p-6 border relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
                    <h3 className="font-bold text-white mb-5 flex items-center gap-2 relative z-10"><Target className="w-5 h-5 text-amber-400"/> ตั้งเป้าหมายธุรกิจ</h3>
                    
                    <div className="space-y-5 relative z-10">
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">เป้าหมายยอดขาย (บาท)</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">฿</span>
                          <input 
                            type="number" 
                            value={goalTarget} 
                            onChange={(e) => setGoalTarget(Number(e.target.value))}
                            className="w-full bg-slate-900 border border-slate-700 text-white text-lg font-black rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                          />
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1.5 text-right">({(goalTarget).toLocaleString()} บาท)</p>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">ระยะเวลา (เดือน)</label>
                        <select 
                          value={goalMonths} 
                          onChange={(e) => setGoalMonths(Number(e.target.value))}
                          className="w-full bg-slate-900 border border-slate-700 text-white font-bold rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 appearance-none"
                        >
                          <option value={3}>3 เดือน (1 ไตรมาส)</option>
                          <option value={6}>6 เดือน (ครึ่งปี)</option>
                          <option value={12}>12 เดือน (1 ปี)</option>
                          <option value={24}>24 เดือน (2 ปี)</option>
                        </select>
                      </div>

                      <button 
                        onClick={handleCalculateGoal} 
                        disabled={isCalculatingGoal}
                        className={`w-full font-bold py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 ${isCalculatingGoal ? 'bg-slate-800 text-slate-400 border border-slate-700' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20'}`}
                      >
                        {isCalculatingGoal ? (
                          <><RefreshCw className="w-5 h-5 animate-spin"/> AI กำลังคำนวณและวางแผน...</>
                        ) : (
                          <><Sparkles className="w-5 h-5"/> สร้างแผนและวิเคราะห์ต้นทุน</>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right: Results */}
                <div className="lg:col-span-2 flex flex-col min-h-[400px]">
                  {goalResult ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
                      
                      {/* Cost Breakdown & Summary */}
                      <div className="admin-card rounded-2xl p-6 border shrink-0">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 pb-6 border-b border-slate-700/50">
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">เป้าหมายเฉลี่ยรายเดือน</p>
                            <h3 className="text-3xl font-black text-white">฿{goalResult.monthlyTarget.toLocaleString(undefined, {maximumFractionDigits: 0})} <span className="text-sm text-slate-500 font-normal">/ เดือน</span></h3>
                          </div>
                          <div className="mt-4 sm:mt-0 text-right">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">กำไรสุทธิคาดการณ์ (Net Profit)</p>
                            <h3 className="text-2xl font-black text-emerald-400">฿{goalResult.profit.toLocaleString()} <span className="text-xs text-emerald-500/50 font-normal">({((goalResult.profit/goalTarget)*100).toFixed(1)}%)</span></h3>
                          </div>
                        </div>

                        <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><PieChart className="w-4 h-4 text-indigo-400"/> AI Cost Breakdown (ประมาณการต้นทุนรวม)</h4>
                        
                        {/* Progress Bar Chart */}
                        <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden flex mb-3">
                           <div className="h-full bg-indigo-500" style={{ width: `${(goalResult.costs.api / goalTarget) * 100}%` }} title="API Cost"></div>
                           <div className="h-full bg-amber-500" style={{ width: `${(goalResult.costs.comm / goalTarget) * 100}%` }} title="Commission"></div>
                           <div className="h-full bg-rose-500" style={{ width: `${(goalResult.costs.mkt / goalTarget) * 100}%` }} title="Marketing"></div>
                           <div className="h-full bg-blue-500" style={{ width: `${(goalResult.costs.op / goalTarget) * 100}%` }} title="Operation"></div>
                           <div className="h-full bg-slate-500" style={{ width: `${(goalResult.costs.server / goalTarget) * 100}%` }} title="Server"></div>
                           <div className="h-full bg-emerald-500" style={{ width: `${(goalResult.profit / goalTarget) * 100}%` }} title="Profit"></div>
                        </div>

                        {/* Breakdown List */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-2">
                          <div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-0.5"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Partner Comm. (22%)</div>
                            <div className="font-mono text-sm font-bold text-white">฿{goalResult.costs.comm.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-0.5"><span className="w-2 h-2 rounded-full bg-rose-500"></span> Marketing (15%)</div>
                            <div className="font-mono text-sm font-bold text-white">฿{goalResult.costs.mkt.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-0.5"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Team/Op (10%)</div>
                            <div className="font-mono text-sm font-bold text-white">฿{goalResult.costs.op.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-0.5"><span className="w-2 h-2 rounded-full bg-indigo-500"></span> AI API Costs (6%)</div>
                            <div className="font-mono text-sm font-bold text-white">฿{goalResult.costs.api.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-0.5"><span className="w-2 h-2 rounded-full bg-slate-500"></span> Server/Infra (4%)</div>
                            <div className="font-mono text-sm font-bold text-white">฿{goalResult.costs.server.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 text-xs text-emerald-400 mb-0.5 font-bold"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Net Profit ({((goalResult.profit/goalTarget)*100).toFixed(0)}%)</div>
                            <div className="font-mono text-sm font-black text-emerald-400">฿{goalResult.profit.toLocaleString()}</div>
                          </div>
                        </div>
                      </div>

                      {/* AI Action Plan */}
                      <div className="admin-card rounded-2xl p-6 border flex-1 bg-gradient-to-br from-[#1E293B] to-[#0F172A] relative overflow-hidden">
                        <div className="absolute right-0 bottom-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-[60px] pointer-events-none"></div>
                        <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2 relative z-10"><ListChecks className="w-4 h-4 text-emerald-400"/> AI Recommended Action Plan</h4>
                        
                        <div className="space-y-3 relative z-10">
                          {goalResult.actions.map((act, i) => (
                            <div key={i} className="bg-slate-900/50 border border-slate-700/50 p-3.5 rounded-xl flex items-start gap-3 hover:border-indigo-500/30 transition-colors">
                              <div className={`p-2 rounded-lg shrink-0 ${act.type === 'partner' ? 'bg-amber-500/10 text-amber-400' : act.type === 'marketing' ? 'bg-rose-500/10 text-rose-400' : act.type === 'product' ? 'bg-indigo-500/10 text-indigo-400' : act.type === 'campaign' ? 'bg-blue-500/10 text-blue-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                                <act.icon className="w-4 h-4"/>
                              </div>
                              <p className="text-sm text-slate-300 leading-relaxed pt-1.5">{act.text}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  ) : (
                    <div className="admin-card rounded-2xl border flex flex-col items-center justify-center h-full text-center p-10 border-dashed border-slate-700 bg-slate-800/20">
                      <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                        <Bot className="w-8 h-8 text-slate-500" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-300 mb-2">รอการคำนวณจาก AI</h3>
                      <p className="text-sm text-slate-500 max-w-md">กรอกเป้าหมายยอดขายและระยะเวลาด้านซ้ายมือ จากนั้นกดปุ่มคำนวณ เพื่อให้ AI ประเมินต้นทุนและเสนอแผนกลยุทธ์ให้คุณ</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB: PARTNER MANAGEMENT */}
          {activeTab === 'partners' && (
            <div className="h-full flex flex-col max-w-7xl mx-auto animate-in fade-in duration-300">
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
                  <button onClick={handleExportPartners} className="bg-slate-800 border border-slate-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 hover:bg-slate-700">
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
                        <th className="px-3 py-3 text-center">Sub-Partners</th>
                        <th className="px-3 py-3 text-right">Revenue (Mo)</th>
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
                          <td className="px-3 py-3 text-center">
                            <div className="flex flex-col items-center">
                              <span className="text-xs font-bold text-slate-300">{partner.subPartners?.length || 0} <span className="text-[10px] text-slate-500 font-normal">/ 20</span></span>
                              <div className="w-16 h-1 mt-1 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${((partner.subPartners?.length || 0)/20)*100}%` }}></div>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-3 text-right font-black text-white text-base">฿{partner.rev.toLocaleString()}</td>
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
                                  <button onClick={() => setSelectedPartner(partner)} className="p-1.5 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white rounded border border-indigo-500/20 transition-colors" title="View Network"><Network className="w-4 h-4"/></button>
                                  <button className="p-1.5 bg-slate-800 text-slate-400 hover:text-white rounded border border-slate-700 transition-colors" title="View Details"><FileText className="w-4 h-4"/></button>
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
                      {customers
                        .filter(c => c.name.includes(customerSearch) || c.id.includes(customerSearch.toUpperCase()))
                        .filter(c => {
                          if (customerFilter.source === 'All') return true;
                          if (customerFilter.source === 'Partner') return c.partner !== 'DIRECT';
                          if (customerFilter.source === 'Direct') return c.partner === 'DIRECT';
                          return true;
                        })
                        .filter(c => {
                          if (customerFilter.plan === 'All') return true;
                          return c.plan === customerFilter.plan;
                        })
                        .map((cust, i) => (
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
                            <button 
                                onClick={() => {
                                  setSelectedInvoice({
                                    invoiceNo: `SPX-2026-${cust.id.replace('A', '')}`,
                                    date: new Date().toLocaleDateString('th-TH'),
                                    customerInfo: {
                                      invoiceNo: `SPX-2026-${cust.id.replace('A', '')}`,
                                      date: new Date().toLocaleDateString('th-TH'),
                                      customerName: cust.business || cust.name,
                                      billToAddress: "เลขที่บัญชีและสถานที่ติดต่อของบริษัทลูกค้า",
                                      customerTaxId: "0105560000000",
                                      shipToAddress: "เลขที่บัญชีและสถานที่ติดต่อของบริษัทลูกค้า",
                                    },
                                    items: [
                                      { no: 1, description: `AIVA ${cust.plan} Subscription Fee`, qty: 1, unitPrice: cust.mrr, amount: cust.mrr }
                                    ]
                                  });
                                }}
                                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 hover:underline flex items-center justify-center gap-1 mx-auto cursor-pointer"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                Invoice
                              </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: ANNOUNCEMENTS */}
          {activeTab === 'announcements' && (
            <div className="h-full flex flex-col max-w-6xl mx-auto animate-in fade-in duration-300">
               <div className="shrink-0 mb-6">
                  <h1 className="text-2xl font-bold text-white tracking-tight">ประกาศ & แคมเปญ (Broadcast)</h1>
                  <p className="text-sm text-slate-500 mt-1">ส่งข่าวสาร โปรโมชั่น หรืออัปเดตระบบ ให้แสดงผลอัตโนมัติบนหน้า Portal ของ Partner หรือ Customer</p>
               </div>

               <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
                 {/* Create Form */}
                 <div className="lg:w-1/3 flex flex-col gap-6 shrink-0">
                   <div className="admin-card rounded-2xl p-6 border space-y-4">
                     <h3 className="font-bold text-white mb-3 flex items-center gap-2"><Megaphone className="w-5 h-5 text-indigo-400"/> สร้างประกาศใหม่</h3>
                     
                     {/* Target Audience Switch */}
                     <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700 mb-2">
                       <button onClick={() => setBroadcastType('partner')} className={`flex-1 text-xs font-bold py-2 rounded-md transition-all ${broadcastType === 'partner' ? 'bg-indigo-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}>สำหรับ Partner</button>
                       <button onClick={() => setBroadcastType('customer')} className={`flex-1 text-xs font-bold py-2 rounded-md transition-all ${broadcastType === 'customer' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}>สำหรับ Customer</button>
                     </div>

                     <div className="space-y-1.5">
                       <label className="text-xs font-bold text-slate-400 uppercase">หัวข้อประกาศ (Title)</label>
                       <input type="text" value={broadcastForm.title} onChange={e => setBroadcastForm({...broadcastForm, title: e.target.value})} placeholder="เช่น แคมเปญโบนัส Q4..." className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" />
                     </div>
                     <div className="space-y-1.5">
                       <label className="text-xs font-bold text-slate-400 uppercase">ประเภท (Type)</label>
                       <select value={broadcastForm.type} onChange={e => setBroadcastForm({...broadcastForm, type: e.target.value})} className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 appearance-none">
                         {broadcastType === 'partner' ? (
                           <><option value="Campaign">Campaign (อัดฉีดโปรโมชั่น)</option><option value="Product Update">Product Update (อัปเดตฟีเจอร์)</option><option value="Event">Event (กิจกรรม/สัมมนา)</option><option value="Important">Important (ประกาศสำคัญ)</option></>
                         ) : (
                           <><option value="Discount/Promo">Discount/Promo (โปรโมชั่นส่วนลด)</option><option value="Product Update">Product Update (อัปเดตฟีเจอร์)</option><option value="Tips & Tricks">Tips & Tricks (แนะนำการใช้งาน)</option><option value="Important">Important (ประกาศสำคัญ)</option></>
                         )}
                       </select>
                     </div>
                     <div className="space-y-1.5">
                       <label className="text-xs font-bold text-slate-400 uppercase">กลุ่มเป้าหมาย (Target)</label>
                       <select value={broadcastForm.target} onChange={e => setBroadcastForm({...broadcastForm, target: e.target.value})} className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 appearance-none">
                         {broadcastType === 'partner' ? (
                           <><option value="ALL">All Partners (ทุกคน)</option><option value="GOLD_ONLY">Gold Tier เท่านั้น</option><option value="SILVER_AND_UP">Silver & Up เท่านั้น</option></>
                         ) : (
                           <><option value="ALL">All Customers (ทุกคน)</option><option value="BASIC_PRO">Basic & Pro (เพื่อกระตุ้น Upsell)</option><option value="ADVANCED_ONLY">Advanced Plan เท่านั้น</option></>
                         )}
                       </select>
                     </div>
                     <div className="space-y-1.5">
                       <label className="text-xs font-bold text-slate-400 uppercase">รายละเอียด / โค้ดส่วนลด</label>
                       <textarea value={broadcastForm.content} onChange={e => setBroadcastForm({...broadcastForm, content: e.target.value})} rows="3" placeholder="พิมพ์รายละเอียด หรือใส่รหัส Promo Code..." className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"></textarea>
                     </div>
                     <button onClick={handleCreateAnnouncement} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl transition-colors shadow-sm mt-2 flex items-center justify-center gap-2">
                       <Send className="w-4 h-4"/> กดส่ง (Broadcast)
                     </button>
                   </div>
                 </div>

                 {/* History List */}
                 <div className="lg:w-2/3 admin-card rounded-2xl border flex flex-col flex-1 overflow-hidden min-h-0">
                   <div className="p-4 border-b border-slate-700 bg-slate-800/50 flex justify-between items-center shrink-0">
                     <h3 className="font-bold text-white text-sm">ประวัติการประกาศ</h3>
                   </div>
                   <div className="overflow-auto custom-scrollbar flex-1 p-0">
                     <table className="w-full text-left text-sm whitespace-nowrap">
                       <thead className="bg-slate-900 text-slate-400 text-[10px] uppercase tracking-widest font-bold border-b border-slate-700 sticky top-0 z-10">
                         <tr><th className="px-4 py-2.5">หัวข้อ / วันที่</th><th className="px-4 py-2.5">ประเภท</th><th className="px-4 py-2.5">กลุ่มเป้าหมาย</th><th className="px-4 py-2.5 text-center">ยอดการมองเห็น</th><th className="px-4 py-2.5 text-center">สถานะ</th></tr>
                       </thead>
                       <tbody className="divide-y divide-slate-800/50">
                         {announcements.map((anc,i) => (
                           <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                             <td className="px-4 py-3">
                               <div className="flex items-center gap-1.5 mb-1">
                                 {anc.audience === 'PARTNER' && <span className="bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded text-[8px] font-bold border border-indigo-500/20"><Users className="w-2.5 h-2.5 inline pb-0.5"/> PARTNER</span>}
                                 {anc.audience === 'CUSTOMER' && <span className="bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded text-[8px] font-bold border border-emerald-500/20"><Briefcase className="w-2.5 h-2.5 inline pb-0.5"/> CUSTOMER</span>}
                                 {anc.audience === 'BOTH' && <span className="bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded text-[8px] font-bold border border-blue-500/20"><Sparkles className="w-2.5 h-2.5 inline pb-0.5"/> ALL USERS</span>}
                                 <span className="text-[10px] text-slate-500">{anc.date}</span>
                               </div>
                               <div className="font-bold text-slate-200">{anc.title}</div>
                             </td>
                             <td className="px-4 py-3"><span className="text-[10px] font-bold bg-slate-800 border border-slate-700 px-2 py-1 rounded text-slate-300">{anc.type}</span></td>
                             <td className="px-4 py-3 text-xs text-slate-400">{anc.target}</td>
                             <td className="px-4 py-3 text-center font-mono font-bold text-white">{anc.views.toLocaleString()}</td>
                             <td className="px-4 py-3 text-center">
                               {anc.status === 'Active' ? <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> Active</span> : <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-1 rounded border border-slate-700">Ended</span>}
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
                    <button onClick={handleDownloadZip50Tawi} className="bg-slate-800 border border-slate-700 text-slate-300 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-700 transition-colors"><FileText className="w-4 h-4"/> ZIP 50ทวิ</button>
                    <button onClick={handleDownloadBankCSV} className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-sm"><Download className="w-4 h-4"/> CSV แบงก์</button>
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
                              <button onClick={() => handleApprovePayout(payout.id)} disabled={payout.status !== 'Ready'} className={`p-1.5 rounded border transition-colors ${payout.status === 'Ready' ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-600 hover:text-white' : 'bg-slate-800 text-slate-600 border-slate-700'}`} title="Mark as Paid"><DollarSign className="w-4 h-4" /></button>
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
                 <form onSubmit={handleCreateAsset} className="lg:w-1/3 flex flex-col gap-6 shrink-0">
                   <label className="admin-card rounded-2xl p-6 border flex flex-col items-center justify-center text-center h-48 border-dashed border-slate-600 bg-slate-800/30 hover:bg-slate-800/50 transition-colors cursor-pointer group">
                     <input 
                       type="file" 
                       className="hidden" 
                       onChange={(e) => {
                         if (e.target.files && e.target.files[0]) {
                           const file = e.target.files[0];
                           setAssetForm(prev => ({
                             ...prev,
                             name: file.name,
                             size: formatBytes(file.size),
                             url: '/uploads/' + file.name
                           }));
                         }
                       }} 
                     />
                     <div className="w-12 h-12 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"><UploadCloud className="w-6 h-6"/></div>
                     <p className="text-sm font-bold text-slate-200">
                       {assetForm.name ? 'เลือกไฟล์: ' + assetForm.name : 'คลิกเพื่ออัปโหลดไฟล์'}
                     </p>
                     <p className="text-[10px] text-slate-500 mt-1">
                       {assetForm.size ? 'ขนาด: ' + assetForm.size : 'รองรับ PDF, PNG, JPG, ZIP (Max 50MB)'}
                     </p>
                   </label>
                   
                   <div className="admin-card rounded-2xl p-6 border space-y-4">
                     <div className="space-y-1.5">
                       <label className="text-xs font-bold text-slate-400 uppercase">ชื่อไฟล์แสดงผล</label>
                       <input 
                         type="text" 
                         value={assetForm.name}
                         onChange={(e) => {
                           const val = e.target.value;
                           setAssetForm(prev => ({ ...prev, name: val }));
                         }}
                         placeholder="เช่น Pitch Deck Q3" 
                         className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" 
                       />
                     </div>
                     <div className="space-y-1.5">
                       <label className="text-xs font-bold text-slate-400 uppercase">หมวดหมู่</label>
                       <select 
                         value={assetForm.category}
                         onChange={(e) => {
                           const val = e.target.value;
                           setAssetForm(prev => ({ ...prev, category: val }));
                         }}
                         className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 appearance-none"
                       >
                         <option value="Presentations">Presentations</option>
                         <option value="Brand Assets">Brand Assets</option>
                         <option value="Marketing">Marketing</option>
                       </select>
                     </div>
                     <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl transition-colors shadow-sm mt-2 flex items-center justify-center gap-2">
                       <UploadCloud className="w-4 h-4"/> เริ่มอัปโหลดและซิงค์
                     </button>
                   </div>
                 </form>

                 {/* Asset List (Fit View) */}
                 <div className="lg:w-2/3 admin-card rounded-2xl border flex flex-col flex-1 overflow-hidden min-h-0">
                   <div className="p-4 border-b border-slate-700 bg-slate-800/50 flex justify-between items-center shrink-0">
                     <h3 className="font-bold text-white text-sm">ไฟล์สื่อที่พร้อมใช้งาน</h3>
                     <span className="text-xs font-bold bg-slate-900 text-slate-400 px-2.5 py-1 rounded border border-slate-700">{assets.length} ไฟล์</span>
                   </div>
                   <div className="overflow-auto custom-scrollbar flex-1 p-0">
                     <table className="w-full text-left text-sm whitespace-nowrap">
                       <thead className="bg-slate-900 text-slate-400 text-[10px] uppercase tracking-widest font-bold border-b border-slate-700 sticky top-0 z-10">
                         <tr><th className="px-4 py-2.5">ชื่อไฟล์</th><th className="px-4 py-2.5">หมวดหมู่</th><th className="px-4 py-2.5 text-center w-24">ดาวน์โหลด</th><th className="px-4 py-2.5 text-center w-28">สถานะการซิงค์</th><th className="px-4 py-2.5 text-center w-16">จัดการ</th></tr>
                       </thead>
                       <tbody className="divide-y divide-slate-800/50">
                         {assets.length === 0 ? (
                           <tr>
                             <td colSpan="5" className="px-4 py-8 text-center text-slate-500">
                               ยังไม่มีไฟล์สื่อการตลาดพร้อมใช้งาน
                             </td>
                           </tr>
                         ) : (
                           assets.map((f, i) => (
                             <tr key={f.id} className="hover:bg-slate-800/30 transition-colors">
                               <td className="px-4 py-3">
                                 <div className="font-bold text-slate-200">{f.filename}</div>
                                 <div className="text-[10px] text-slate-500 mt-0.5">{f.size} • อัปโหลด: {new Date(f.createdAt).toLocaleDateString('th-TH')}</div>
                               </td>
                               <td className="px-4 py-3">
                                 <span className="text-[10px] font-bold bg-slate-800 border border-slate-700 px-2 py-1 rounded text-slate-300">{f.category}</span>
                               </td>
                               <td className="px-4 py-3 text-center font-mono text-slate-400">{f.downloads || 0}</td>
                               <td className="px-4 py-3 text-center">
                                 <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                                   <Sparkles className="w-3 h-3"/> Synced
                                 </span>
                               </td>
                               <td className="px-4 py-3 text-center">
                                 <button 
                                   onClick={() => handleDeleteAsset(f.id)}
                                   className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors"
                                 >
                                   <Trash2 className="w-4 h-4 mx-auto"/>
                                 </button>
                               </td>
                             </tr>
                           ))
                         )}
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
                           {tickets.map((t,i) => (
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
                                 <select value={t.status} onChange={(e) => handleUpdateTicketStatus(t.id, e.target.value)} className={`text-[10px] font-bold rounded-lg px-2 py-1.5 outline-none appearance-none cursor-pointer border ${t.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : t.status === 'In Progress' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
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

          {/* TAB: SMTP SETTINGS */}
          {activeTab === 'smtp' && (
            <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2 tracking-tight">
                  <Mail className="w-6 h-6 text-indigo-500" /> ตั้งค่าระบบส่งอีเมล (SMTP Settings)
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                  กำหนดค่า SMTP สำหรับส่งอีเมลคำเชิญทีมงาน พาร์ทเนอร์ และแจ้งเตือนของระบบ
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* SMTP Form */}
                <div className="md:col-span-2 admin-card rounded-2xl border border-slate-700 bg-slate-800/30 p-6 space-y-4">
                  <h2 className="font-bold text-white text-base border-b border-slate-700 pb-3 mb-4">
                    SMTP Server Configuration
                  </h2>
                  <form onSubmit={handleSaveSmtpSettings} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase">SMTP Host</label>
                        <input
                          id="smtp-host"
                          type="text"
                          required
                          value={smtpForm.host}
                          onChange={(e) => setSmtpForm({ ...smtpForm, host: e.target.value })}
                          placeholder="e.g. smtp.example.com"
                          className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase">SMTP Port</label>
                        <input
                          id="smtp-port"
                          type="number"
                          required
                          value={smtpForm.port}
                          onChange={(e) => setSmtpForm({ ...smtpForm, port: parseInt(e.target.value) || 587 })}
                          placeholder="e.g. 587"
                          className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 py-1">
                      <input
                        type="checkbox"
                        id="smtp-secure"
                        checked={smtpForm.secure}
                        onChange={(e) => setSmtpForm({ ...smtpForm, secure: e.target.checked })}
                        className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700 focus:ring-indigo-500"
                      />
                      <label htmlFor="smtp-secure" className="text-xs font-bold text-slate-300 select-none">
                        Secure Connection (SSL/TLS - Port 465)
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase">Username / User</label>
                        <input
                          id="smtp-user"
                          type="text"
                          required
                          value={smtpForm.user}
                          onChange={(e) => setSmtpForm({ ...smtpForm, user: e.target.value })}
                          placeholder="e.g. user@example.com"
                          className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase">Password</label>
                        <input
                          id="smtp-pass"
                          type="password"
                          value={smtpForm.pass}
                          onChange={(e) => setSmtpForm({ ...smtpForm, pass: e.target.value })}
                          placeholder={smtpForm.hasPassword ? "•••••••• (Keep empty to stay unchanged)" : "Password"}
                          className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase">Sender Address (From)</label>
                      <input
                        id="smtp-from"
                        type="text"
                        required
                        value={smtpForm.from}
                        onChange={(e) => setSmtpForm({ ...smtpForm, from: e.target.value })}
                        placeholder='e.g. "AIVA Support" <noreply@aiva.sparexth.com>'
                        className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        id="btn-save-smtp"
                        type="submit"
                        disabled={isSavingSmtp}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                      >
                        {isSavingSmtp ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" /> กำลังบันทึก...
                          </>
                        ) : (
                          "บันทึกการตั้งค่า SMTP"
                        )}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Connection Test Card */}
                <div className="admin-card rounded-2xl border border-slate-700 bg-slate-800/30 p-6 flex flex-col justify-between">
                  <div>
                    <h2 className="font-bold text-white text-base border-b border-slate-700 pb-3 mb-4">
                      Test Connection
                    </h2>
                    <p className="text-slate-400 text-xs leading-relaxed mb-4">
                      ทดสอบการเชื่อมต่อเซิร์ฟเวอร์ SMTP ของคุณด้วยการส่งอีเมลทดสอบไปยังกล่องจดหมายจริง
                    </p>
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase">Recipient Email</label>
                        <input
                          id="smtp-test-email"
                          type="email"
                          value={testEmail}
                          onChange={(e) => setTestEmail(e.target.value)}
                          placeholder="e.g. test@yourdomain.com"
                          className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <button
                      id="btn-test-smtp"
                      onClick={handleTestSmtpConnection}
                      disabled={isTestingSmtp || !testEmail}
                      className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold py-2.5 rounded-xl transition-all text-sm disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isTestingSmtp ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" /> กำลังทดสอบ...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" /> ส่งอีเมลทดสอบ
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* OVERLAY MODAL: Invoice / Tax Invoice / Receipt */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-[10000] overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex justify-center items-start pt-10 pb-10 px-4">
          <div className="relative w-full max-w-4xl animate-in zoom-in duration-200 text-left">
            <InvoiceDocument 
              invoiceData={selectedInvoice} 
              onClose={() => setSelectedInvoice(null)} 
            />
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[10000] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className={`px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border text-sm font-bold ${
            toast.type === 'success' 
              ? 'bg-slate-800 border-emerald-500/30 text-emerald-400' 
              : toast.type === 'danger'
              ? 'bg-slate-800 border-rose-500/30 text-rose-400' 
              : 'bg-slate-800 border-slate-700 text-slate-300'
          } backdrop-blur-md`}>
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
            {toast.type === 'danger' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Helpers
function NavItem({ id, icon: Icon, label, isActive, onClick }) {
  return (
    <button id={id} onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}>
      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500'}`} />{label}
    </button>
  );
}