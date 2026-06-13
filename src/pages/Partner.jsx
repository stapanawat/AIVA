import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, Users, Settings, Search, Bot, TrendingUp, Activity, CreditCard,
  X, Wallet, Tag, Copy, Hash, Sparkles, CheckCircle2, Clock, AlertCircle, AlertOctagon, Bell,
  LogOut, ChevronLeft, ChevronDown, ShieldCheck, Mail, Lock, Phone, UserSquare, Building2,
  ArrowRight, Camera, FileImage, Trash2, MessageSquare, Send, Link as LinkIcon, 
  Image as ImageIcon, Share2, Download, RefreshCw, Sun, Moon
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

function AuthScreen({ onLogin }) {
  const [view, setView] = useState('login'); 
  const [isLoading, setIsLoading] = useState(false);
  const [idImage, setIdImage] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Registration states
  const [firstName, setFirstName] = useState('สมชาย');
  const [lastName, setLastName] = useState('ใจดี');
  const [email, setEmail] = useState('partner@example.com');
  const [password, setPassword] = useState('password');
  const [confirmPassword, setConfirmPassword] = useState('password');
  const [phone, setPhone] = useState('089-876-5432');
  const [citizenId, setCitizenId] = useState('1-2345-67890-12-3');
  
  const [bankName, setBankName] = useState('kbank');
  const [bankAccount, setBankAccount] = useState('0123456789');
  const [bankAccountName, setBankAccountName] = useState('สมชาย ใจดี');

  const [generatedPartnerId, setGeneratedPartnerId] = useState('SP99201');

  const handleNextStep = (nextView) => {
    setIsLoading(true);
    setTimeout(() => { setIsLoading(false); setView(nextView); }, 600);
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      showToast('รหัสผ่านไม่ตรงกัน', 'danger');
      return;
    }
    setIsLoading(true);
    
    // Generate a random Sub-Partner ID
    const newId = 'SP' + Math.floor(10000 + Math.random() * 90000);
    setGeneratedPartnerId(newId);
    
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newId,
          password: password,
          name: `${firstName} ${lastName}`,
          role: 'PARTNER_SUB',
          phone: phone,
          referralCode: 'P88942', // default parent referral code
          bankName: bankName,
          bankAccount: bankAccount,
          bankAccountName: bankAccountName
        })
      });
      
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'การสมัครสมาชิกพาร์ทเนอร์ล้มเหลว', 'danger');
        setIsLoading(false);
        return;
      }
      
      setIsLoading(false);
      setView('signup_success');
    } catch (err) {
      console.warn('Registration offline fallback:', err);
      setTimeout(() => {
        setIsLoading(false);
        setView('signup_success');
      }, 800);
    }
  };

  const handleFinish = async () => {
    setIsLoading(true);
    try {
      const emailInput = document.querySelector('input[placeholder="Pxxxxx หรือ SPxxxxx"]');
      const passwordInput = document.querySelector('input[type="password"]');
      const emailVal = emailInput ? emailInput.value : generatedPartnerId;
      const passwordVal = passwordInput ? passwordInput.value : password;

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailVal, password: passwordVal })
      });
      
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'เข้าสู่ระบบพาร์ทเนอร์ล้มเหลว', 'danger');
        setIsLoading(false);
        return;
      }

      localStorage.setItem('aiva_access_token', data.accessToken);
      localStorage.setItem('aiva_user', JSON.stringify(data.user));
      setIsLoading(false);
      onLogin();
    } catch (err) {
      console.warn('Backend not running, falling back to mock authentication:', err);
      setTimeout(() => { setIsLoading(false); onLogin(); }, 800);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 relative overflow-hidden" style={{ fontFamily: "'Anuphan', sans-serif" }}>
      <style dangerouslySetInnerHTML={{__html: `@import url('https://fonts.googleapis.com/css2?family=Anuphan:wght@300;400;500;600;700&display=swap');`}} />
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] bg-indigo-600/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[10%] -left-[10%] w-[50%] h-[50%] bg-purple-600/5 blur-[100px] rounded-full"></div>
      </div>

      <div className="mb-8 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500 z-10">
        <div className="bg-white p-3.5 rounded-[2rem] shadow-xl shadow-indigo-500/10 mb-4 flex justify-center items-center border border-slate-100">
           <img src="https://i.postimg.cc/9fvVLjRT/AIVA-Trasparent.png" alt="AIVA Logo" className="h-20 w-auto object-contain" onError={(e) => { e.target.style.display='none'; }}/>
        </div>
      </div>

      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-white overflow-hidden animate-in fade-in zoom-in-95 duration-500 z-10">
        {view === 'login' && (
          <div className="p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">เข้าสู่ระบบพาร์ทเนอร์</h2>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-600">Partner ID</label>
                <div className="relative">
                  <Hash className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder="Pxxxxx หรือ SPxxxxx" defaultValue="P88942" className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none uppercase" />
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-semibold text-slate-600">รหัสผ่าน</label>
                  <a href="#" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">ลืมรหัสผ่าน?</a>
                </div>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="password" placeholder="••••••••" defaultValue="password" className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none" />
                </div>
              </div>
              
              <button onClick={handleFinish} disabled={isLoading} className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold py-3 rounded-xl transition-all shadow-sm flex justify-center items-center gap-2 mt-4">
                {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'ลงชื่อเข้าใช้'}
              </button>
            </div>
            
            <div className="mt-8 text-center text-sm font-medium text-slate-500">
              ยังไม่มีบัญชีใช่หรือไม่? <button onClick={() => setView('signup_step1')} className="text-indigo-600 font-bold hover:underline">สมัครเป็นพาร์ทเนอร์</button>
            </div>
          </div>
        )}

        {/* ================= SIGNUP STEP 1: PERSONAL INFO ================= */}
        {view === 'signup_step1' && (
          <div className="p-8 animate-in slide-in-from-right-8 duration-300">
            <div className="flex items-center mb-6">
              <button onClick={() => setView('login')} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors mr-2">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-xl font-bold text-slate-900">ข้อมูลส่วนตัว</h2>
                <p className="text-xs text-slate-500">ขั้นตอน 1 จาก 3</p>
              </div>
            </div>

            <div className="max-h-[55vh] overflow-y-auto custom-scrollbar pr-2 -mr-2 space-y-4 pb-2">
              
              {/* แถบแสดงรหัสผู้แนะนำ */}
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-500" />
                  <span className="text-xs font-semibold text-indigo-900">สมัครภายใต้รหัสผู้แนะนำ</span>
                </div>
                <span className="text-xs font-bold text-indigo-600 bg-white px-2 py-1 rounded-md shadow-sm border border-indigo-100">
                  P88942
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[13px] font-semibold text-slate-700">ชื่อจริง</label>
                  <input type="text" maxLength={150} placeholder="สมชาย" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[13px] font-semibold text-slate-700">นามสกุล</label>
                  <input type="text" maxLength={150} placeholder="ใจดี" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[13px] font-semibold text-slate-700">อีเมล</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="email" placeholder="partner@example.com" value={email} onChange={(e) => setEmail(e.target.value.replace(/[^a-zA-Z0-9@._+-]/g, ''))} className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[13px] font-semibold text-slate-700">รหัสผ่าน</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="password" placeholder="ตั้งรหัสผ่านอย่างน้อย 8 ตัวอักษร" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[13px] font-semibold text-slate-700">ยืนยันรหัสผ่าน</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="password" placeholder="กรอกรหัสผ่านอีกครั้ง" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[13px] font-semibold text-slate-700">เบอร์โทรศัพท์</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="tel" placeholder="08x-xxx-xxxx" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').substring(0, 10))} className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[13px] font-semibold text-slate-700">เลขประจำตัวประชาชน</label>
                <div className="relative">
                  <UserSquare className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder="1-xxxx-xxxxx-xx-x" value={citizenId} onChange={(e) => setCitizenId(e.target.value.replace(/\D/g, '').substring(0, 13))} className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" />
                </div>
              </div>

              <div className="space-y-2 mt-2">
                <label className="block text-[13px] font-semibold text-slate-700">ภาพถ่ายหน้าบัตรประชาชน <span className="text-rose-500">*</span></label>
                {idImage ? (
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 h-32 flex items-center justify-center">
                    <img src={idImage} alt="ID Card Preview" className="h-full object-contain" />
                    <button onClick={() => setIdImage(null)} className="absolute top-2 right-2 p-1.5 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition shadow-sm">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Camera className="w-6 h-6 text-indigo-400 mb-2" />
                      <p className="text-sm text-slate-600 font-medium">คลิกเพื่อถ่ายรูป หรือ อัปโหลด</p>
                      <p className="text-[10px] text-slate-400 mt-1">ใช้สำหรับการหักภาษี ณ ที่จ่าย 3% ตามกฎหมาย</p>
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*" 
                      capture="environment"
                      onChange={(e) => {
                        if(e.target.files && e.target.files[0]) {
                          setIdImage(URL.createObjectURL(e.target.files[0]));
                        }
                      }} 
                    />
                  </label>
                )}
              </div>
            </div>

            <button 
              onClick={() => handleNextStep('signup_step2')}
              disabled={isLoading}
              className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold py-3 rounded-xl transition-all shadow-sm flex justify-center items-center gap-2 mt-4"
            >
              {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : (
                <>ถัดไป <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </div>
        )}

        {/* ================= SIGNUP STEP 2: BANK INFO ================= */}
        {view === 'signup_step2' && (
          <div className="p-8 animate-in slide-in-from-right-8 duration-300">
            <div className="flex items-center mb-6">
              <button onClick={() => setView('signup_step1')} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors mr-2">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-xl font-bold text-slate-900">บัญชีรับเงิน (Payout)</h2>
                <p className="text-xs text-slate-500">ขั้นตอน 2 จาก 3</p>
              </div>
            </div>

            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
              <p className="text-xs text-indigo-800 leading-relaxed font-medium">
                ข้อมูลส่วนนี้ใช้สำหรับการโอนเงินค่าคอมมิชชันให้คุณในทุกวันที่ 5 ของเดือน ชื่อบัญชีต้องตรงกับชื่อพาร์ทเนอร์
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[13px] font-semibold text-slate-700">ธนาคาร</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <select value={bankName} onChange={(e) => setBankName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none appearance-none cursor-pointer">
                    <option value="">เลือกธนาคาร...</option>
                    <option value="kbank">ธนาคารกสิกรไทย (KBANK)</option>
                    <option value="scb">ธนาคารไทยพาณิชย์ (SCB)</option>
                    <option value="bbl">ธนาคารกรุงเทพ (BBL)</option>
                    <option value="ktb">ธนาคารกรุงไทย (KTB)</option>
                    <option value="bay">ธนาคารกรุงศรีอยุธยา (BAY)</option>
                    <option value="ttb">ธนาคารทหารไทยธนชาต (TTB)</option>
                    <option value="gsb">ธนาคารออมสิน (GSB)</option>
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[13px] font-semibold text-slate-700">เลขที่บัญชี</label>
                <input type="text" placeholder="ระบุเลขบัญชี 10 หลัก" value={bankAccount} onChange={(e) => setBankAccount(e.target.value.replace(/\D/g, '').substring(0, 10))} className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-mono transition-all" />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[13px] font-semibold text-slate-700">ชื่อบัญชี</label>
                <input type="text" placeholder="เช่น นาย สมชาย ใจดี" value={bankAccountName} onChange={(e) => setBankAccountName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" />
              </div>

              <button 
                onClick={() => handleNextStep('signup_step3')}
                disabled={isLoading}
                className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold py-3 rounded-xl transition-all shadow-sm flex justify-center items-center gap-2 mt-6"
              >
                {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : (
                  <>ถัดไป <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ================= SIGNUP STEP 3: OTP VERIFICATION ================= */}
        {view === 'signup_step3' && (
          <div className="p-8 text-center animate-in slide-in-from-right-8 duration-300">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-indigo-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">ยืนยันอีเมลของคุณ</h2>
            <p className="text-sm text-slate-500 mb-8">เราได้ส่งรหัสยืนยัน 6 หลักไปที่<br/><strong className="text-slate-800">{email}</strong></p>

            <div className="flex justify-center gap-2 mb-8">
              {[1,2,3,4,5,6].map((idx) => (
                <input 
                  key={idx}
                  type="text" 
                  maxLength={1}
                  className="w-10 h-12 text-center text-lg font-bold bg-slate-50 border border-slate-200 text-slate-900 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm"
                  placeholder="-"
                />
              ))}
            </div>

            <button 
              onClick={handleRegister}
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all shadow-sm flex justify-center items-center gap-2"
            >
              {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : (
                <><CheckCircle2 className="w-5 h-5" /> ยืนยันข้อมูล</>
              )}
            </button>

            <div className="mt-6 flex flex-col items-center gap-2">
              <p className="text-xs text-slate-500">ไม่ได้รับอีเมลใช่ไหม?</p>
              <button className="text-sm font-bold text-indigo-600 hover:underline">ส่งรหัสใหม่อีกครั้ง</button>
              <button onClick={() => setView('signup_step2')} className="text-xs font-semibold text-slate-400 hover:text-slate-600 mt-2">กลับไปแก้ไขข้อมูล</button>
            </div>
          </div>
        )}
        
        {/* ================= SIGNUP SUCCESS ================= */}
        {view === 'signup_success' && (
          <div className="p-8 text-center animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">สมัครสำเร็จ!</h2>
            <p className="text-sm text-slate-500 mb-8">ยินดีต้อนรับสู่ครอบครัว AIVA Partner นี่คือรหัสประจำตัวของคุณสำหรับใช้ล็อกอิน</p>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-8">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Sub-Partner ID</p>
              <h3 className="text-3xl font-black text-indigo-600 tracking-wider">{generatedPartnerId}</h3>
            </div>

            <button 
              onClick={handleFinish}
              disabled={isLoading}
              className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold py-3 rounded-xl transition-all shadow-sm flex justify-center items-center gap-2"
            >
              {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : (
                <>เข้าสู่ระบบ AIVA Partner <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </div>
        )}
      </div>
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
    </div>
  );
}

export default function Partner() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('aiva_access_token');
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedMonth, setSelectedMonth] = useState('2026-06');
  const [role, setRole] = useState(() => {
    const userStr = localStorage.getItem('aiva_user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        return u.role === 'PARTNER_MAIN' ? 'main' : 'sub';
      } catch (e) {}
    }
    return 'main';
  });
  
  // โหมดแสดงผล (เริ่มที่ Dark Mode)
  const [isDarkMode, setIsDarkMode] = useState(true);

  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Settings States
  const [profileSettings, setProfileSettings] = useState({
    name: '',
    phone: '',
    bankName: '',
    bankAccount: '',
    bankAccountName: ''
  });
  const [promotionsList, setPromotionsList] = useState([]);
  const [marketingAssets, setMarketingAssets] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  // States for Modules
  const [newPromo, setNewPromo] = useState({ code: '', discount: 5, limit: 10 });
  const [feedbackForm, setFeedbackForm] = useState({ title: '', desc: '' });
  const [copiedLink, setCopiedLink] = useState(null);
  
  // States for Tracking Module
  const [trackingLinks, setTrackingLinks] = useState([]);
  const [newTracking, setNewTracking] = useState({ name: '', source: '' });
  
  // States for Sub-Partner Invite Modal
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [isLinkCopied, setIsLinkCopied] = useState(false);

  // States for Chat Widget
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'admin', text: 'สวัสดีค่ะ! ทีมงาน AIVA Support ยินดีให้บริการ มีอะไรให้ช่วยเหลือแจ้งได้เลยนะคะ 😊', time: '10:00' }
  ]);
  const chatEndRef = useRef(null);

  // States for Payout Form and Database Data
  const [payoutInput, setPayoutInput] = useState('');
  const [isSubmittingPayout, setIsSubmittingPayout] = useState(false);
  const [subPartners, setSubPartners] = useState([]);
  const [clientsList, setClientsList] = useState([]);
  const [payoutsList, setPayoutsList] = useState([]);
  const [stats, setStats] = useState({
    personalSales: 0,
    currentRate: 0,
    personalCommission: 0,
    teamOverrideCommission: 0,
    netIncome: 0,
    totalClicks: 0,
    totalSignups: 0,
    paidAmount: 0,
    pendingAmount: 0,
    targetVolume: 50000,
    nextRate: 18
  });

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/partner/stats', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('aiva_access_token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Error fetching partner stats:', err);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch('/api/partner/announcements', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('aiva_access_token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAnnouncements(data);
      }
    } catch (err) {
      console.error('Error fetching announcements:', err);
    }
  };

  const fetchReferrals = async () => {
    try {
      const res = await fetch('/api/partner/referrals', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('aiva_access_token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTrackingLinks(data);
      }
    } catch (err) {
      console.error('Error fetching referrals:', err);
    }
  };

  const fetchNetwork = async () => {
    try {
      const res = await fetch('/api/partner/network', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('aiva_access_token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSubPartners(data);
      }
    } catch (err) {
      console.error('Error fetching network:', err);
    }
  };

  const fetchClients = async () => {
    try {
      const res = await fetch('/api/partner/clients', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('aiva_access_token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setClientsList(data);
      }
    } catch (err) {
      console.error('Error fetching clients:', err);
    }
  };

  const fetchPayouts = async () => {
    try {
      const res = await fetch('/api/partner/payouts', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('aiva_access_token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPayoutsList(data);
      }
    } catch (err) {
      console.error('Error fetching payouts:', err);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/partner/profile', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('aiva_access_token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProfileSettings({
          name: data.name || '',
          phone: data.phone || '',
          bankName: data.bankName || '',
          bankAccount: data.bankAccount || '',
          bankAccountName: data.bankAccountName || ''
        });
      }
    } catch (err) {
      console.error('Error fetching partner profile:', err);
    }
  };

  const fetchPromotions = async () => {
    try {
      const res = await fetch('/api/partner/promotions', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('aiva_access_token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPromotionsList(data);
      }
    } catch (err) {
      console.error('Error fetching partner promotions:', err);
    }
  };

  const fetchAssets = async () => {
    try {
      const res = await fetch('/api/partner/assets', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('aiva_access_token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMarketingAssets(data);
      }
    } catch (err) {
      console.error('Error fetching partner marketing assets:', err);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/partner/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('aiva_access_token')}`
        },
        body: JSON.stringify(profileSettings)
      });
      const data = await res.json();
      if (res.ok) {
        showToast('บันทึกข้อมูลการตั้งค่าสำเร็จแล้ว!', 'success');
        // Update user in localstorage
        const user = JSON.parse(localStorage.getItem('aiva_user') || '{}');
        user.name = profileSettings.name;
        localStorage.setItem('aiva_user', JSON.stringify(user));
      } else {
        showToast(data.error || 'บันทึกข้อมูลล้มเหลว', 'danger');
      }
    } catch (err) {
      console.error(err);
      showToast('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์', 'danger');
    }
  };

  const handleCreatePromotion = async (e) => {
    e.preventDefault();
    if (!newPromo.code || !newPromo.discount || !newPromo.limit) {
      showToast('กรุณากรอกข้อมูลให้ครบถ้วน', 'danger');
      return;
    }
    const discountVal = parseFloat(newPromo.discount);
    if (discountVal > stats.currentRate) {
      showToast(`ส่วนลดต้องไม่เกินเรทคอมมิชชันของคุณ (${stats.currentRate}%)`, 'danger');
      return;
    }
    try {
      const res = await fetch('/api/partner/promotions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('aiva_access_token')}`
        },
        body: JSON.stringify({
          code: newPromo.code.toUpperCase(),
          discount: discountVal,
          limit: parseInt(newPromo.limit)
        })
      });
      const data = await res.json();
      if (res.ok) {
        showToast('สร้างโค้ดส่วนลดสำเร็จแล้ว!', 'success');
        setNewPromo({ code: '', discount: 5, limit: 10 });
        fetchPromotions();
      } else {
        showToast(data.error || 'สร้างโค้ดส่วนลดล้มเหลว', 'danger');
      }
    } catch (err) {
      console.error(err);
      showToast('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์', 'danger');
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!feedbackForm.title || !feedbackForm.desc) {
      showToast('กรุณากรอกข้อมูลให้ครบถ้วน', 'danger');
      return;
    }
    try {
      const res = await fetch('/api/partner/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('aiva_access_token')}`
        },
        body: JSON.stringify({
          title: feedbackForm.title,
          description: feedbackForm.desc,
          type: 'Feedback'
        })
      });
      const data = await res.json();
      if (res.ok) {
        showToast('ส่งข้อเสนอแนะสำเร็จแล้ว! ทีมงานจะรีบตรวจสอบข้อร้องเรียนโดยเร็วที่สุด', 'success');
        setFeedbackForm({ title: '', desc: '' });
      } else {
        showToast(data.error || 'ส่งข้อมูลล้มเหลว', 'danger');
      }
    } catch (err) {
      console.error(err);
      showToast('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์', 'danger');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
      fetchReferrals();
      fetchNetwork();
      fetchClients();
      fetchPayouts();
      fetchProfile();
      fetchPromotions();
      fetchAssets();
      fetchAnnouncements();
    }
  }, [isAuthenticated, role]);

  const handleLogout = () => {
    localStorage.removeItem('aiva_access_token');
    localStorage.removeItem('aiva_user');
    setIsAuthenticated(false);
  };

  const handleCreateReferral = async (e) => {
    e.preventDefault();
    if (!newTracking.name || !newTracking.source) {
      showToast('กรุณากรอกข้อมูลให้ครบถ้วน', 'danger');
      return;
    }
    try {
      const res = await fetch('/api/partner/referrals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('aiva_access_token')}`
        },
        body: JSON.stringify({
          name: newTracking.name,
          code: newTracking.source.replace(/[^a-zA-Z0-9_-]/g, '').toUpperCase()
        })
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'สร้างลิงก์ล้มเหลว', 'danger');
      } else {
        showToast('สร้างลิงก์สำเร็จแล้ว!', 'success');
        setNewTracking({ name: '', source: '' });
        fetchReferrals();
        fetchStats();
      }
    } catch (err) {
      console.error(err);
      showToast('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์', 'danger');
    }
  };

  const handleRequestPayout = async (e) => {
    e.preventDefault();
    const amount = parseFloat(payoutInput);
    if (isNaN(amount) || amount <= 0) {
      showToast('กรุณาระบุจำนวนเงินที่ถูกต้อง', 'danger');
      return;
    }
    const withdrawableAmount = Math.max(0, totalIncome - stats.paidAmount - stats.pendingAmount);
    if (amount > withdrawableAmount) {
      showToast('ยอดเงินไม่เพียงพอสำหรับการถอน', 'danger');
      return;
    }

    setIsSubmittingPayout(true);
    try {
      const res = await fetch('/api/partner/payouts/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('aiva_access_token')}`
        },
        body: JSON.stringify({ amount })
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'การส่งคำขอถอนเงินล้มเหลว', 'danger');
      } else {
        showToast('ส่งคำขอถอนเงินสำเร็จแล้ว!', 'success');
        setPayoutInput('');
        fetchStats();
        fetchPayouts();
      }
    } catch (err) {
      console.error(err);
      showToast('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์', 'danger');
    } finally {
      setIsSubmittingPayout(false);
    }
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isChatOpen]);

  const handleSendChat = async () => {
    if (!chatMessage.trim()) return;
    
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const userMsg = chatMessage;
    
    // Add user message to state
    setChatHistory(prev => [...prev, { sender: 'partner', text: userMsg, time: timeStr }]);
    setChatMessage('');
    
    // Add temporary loading indicator
    setChatHistory(prev => [...prev, { sender: 'admin', text: 'กำลังคิดหาคำตอบ... 💬', time: timeStr }]);
    
    try {
      const res = await fetch('/api/partner/support/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('aiva_access_token')}`
        },
        body: JSON.stringify({ message: userMsg, chatHistory })
      });
      const data = await res.json();
      if (res.ok) {
        setChatHistory(prev => {
          const filtered = prev.filter(msg => msg.text !== 'กำลังคิดหาคำตอบ... 💬');
          return [...filtered, { sender: 'admin', text: data.reply, time: timeStr }];
        });
      } else {
        setChatHistory(prev => {
          const filtered = prev.filter(msg => msg.text !== 'กำลังคิดหาคำตอบ... 💬');
          return [...filtered, { sender: 'admin', text: data.error || 'ขออภัยด้วยค่ะ ไม่สามารถประมวลผลคำตอบได้ในขณะนี้', time: timeStr }];
        });
      }
    } catch (err) {
      console.error(err);
      setChatHistory(prev => {
        const filtered = prev.filter(msg => msg.text !== 'กำลังคิดหาคำตอบ... 💬');
        return [...filtered, { sender: 'admin', text: 'ขออภัยด้วยนะคะ ระบบเชื่อมต่อขัดข้องชั่วคราว', time: timeStr }];
      });
    }
  };

  if (!isAuthenticated) return <AuthScreen onLogin={() => setIsAuthenticated(true)} />;

  const user = JSON.parse(localStorage.getItem('aiva_user') || '{}');
  const isMain = role === 'main';
  const partnerId = user.email || (isMain ? 'P88942' : 'SP99201');
  
  const currentSales = stats.personalSales;
  const currentCommissionRate = stats.currentRate;
  const estimatedCommission = stats.personalCommission;
  const networkOverride = stats.teamOverrideCommission;

  const nextTier = stats.nextRate ? stats.targetVolume : null;
  const nextRate = stats.nextRate;
  const salesNeeded = nextTier ? nextTier - currentSales : 0;
  const progressPercent = nextTier ? Math.min((currentSales / nextTier) * 100, 100) : 100;

  let networkSales = 0;
  if (isMain) {
    subPartners.forEach(sp => {
      networkSales += sp.sales;
    });
  }

  const totalIncome = estimatedCommission + networkOverride;

  const renderDashboard = () => (
    <div className="space-y-6 w-full animate-in fade-in duration-300 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">ข้อมูลสรุปประจำเดือน</p>
          <div className="relative">
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="text-sm font-bold border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white pl-3 pr-8 py-1.5 focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer">
              <option value="2026-06">มิถุนายน 2026</option><option value="2026-05">พฤษภาคม 2026</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="saas-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4"><div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-100 dark:border-white/5"><CreditCard className="w-5 h-5" /></div></div>
          <div><p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">ยอดขายส่วนตัว (Personal Sales)</p><h3 className="text-2xl font-bold text-slate-900 dark:text-white">฿{currentSales.toLocaleString()}</h3></div>
        </div>
        <div className="saas-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] flex flex-col justify-between relative overflow-hidden">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20"><Wallet className="w-5 h-5" /></div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-sm">
              <div className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-500"></span>
              </div>
              <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 tracking-wide uppercase">เรท {currentCommissionRate}%</span>
            </div>
          </div>
          <div className="relative z-10"><p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">คอมมิชชันส่วนตัว</p><h3 className="text-2xl font-bold text-slate-900 dark:text-white">฿{estimatedCommission.toLocaleString()}</h3></div>
        </div>
        {isMain ? (
          <div className="saas-card rounded-2xl p-5 border border-purple-200 dark:border-purple-500/30 bg-gradient-to-br from-white to-purple-50 dark:from-[#111827] dark:to-purple-900/20 flex flex-col justify-between relative overflow-hidden">
             <div className="flex justify-between items-start mb-4 relative z-10">
               <div className="p-3 rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 border border-purple-200 dark:border-purple-500/30"><Share2 className="w-5 h-5" /></div>
               <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 shadow-sm">
                 <Users className="w-3 h-3 text-purple-500 dark:text-purple-400" />
                 <span className="text-[10px] font-semibold text-purple-700 dark:text-purple-300 tracking-wide">จากเครือข่าย</span>
               </div>
             </div>
             <div className="relative z-10"><p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">ค่าคอมมิชชันทีม (Override)</p><h3 className="text-2xl font-bold text-purple-700 dark:text-purple-300">+฿{networkOverride.toLocaleString()}</h3></div>
          </div>
        ) : (
          <div className="saas-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4"><div className="p-3 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-100 dark:border-white/5"><TrendingUp className="w-5 h-5" /></div></div>
            <div><p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">อัตราการเติบโต</p><h3 className="text-2xl font-bold text-slate-900 dark:text-white">+18.5%</h3></div>
          </div>
        )}
        <div className="saas-card rounded-2xl p-5 border border-emerald-200 dark:border-emerald-500/30 bg-gradient-to-br from-white to-emerald-50 dark:from-[#111827] dark:to-emerald-900/20 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-3 rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30"><Activity className="w-5 h-5" /></div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 shadow-sm">
              <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 tracking-wide">รายได้สุทธิ</span>
            </div>
          </div>
          <div><p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-1">รวมรายได้เดือนนี้</p><h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">฿{totalIncome.toLocaleString()}</h3></div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10 mix-blend-overlay"></div>
        <div className="p-6 md:p-8 flex flex-col h-full relative z-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white"><Sparkles className="w-5 h-5 text-indigo-500 dark:text-indigo-400" /> ระดับคอมมิชชันปัจจุบัน ({isMain ? 'Main Partner' : 'Sub-Partner'})</h2>
              <p className="text-indigo-600/60 dark:text-indigo-200/60 text-sm mt-1">คำนวณจากยอดขายในเดือน {selectedMonth}</p>
            </div>
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-center"><span className="text-2xl font-bold text-slate-900 dark:text-white block leading-none">{currentCommissionRate}%</span><span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">Current Rate</span></div>
          </div>
          <div className="mt-auto">
            <div className="flex justify-between text-sm mb-2 font-medium"><span className="text-slate-600 dark:text-slate-300">ยอด: ฿{currentSales.toLocaleString()}</span>{nextTier && <span className="text-indigo-600 dark:text-indigo-400">เป้าหมาย: ฿{nextTier.toLocaleString()} ({nextRate}%)</span>}</div>
            <div className="h-3 bg-slate-100 dark:bg-slate-800/80 rounded-full border border-slate-200 dark:border-slate-700 overflow-hidden"><div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 relative" style={{ width: `${progressPercent}%` }}><div className="absolute top-0 right-0 bottom-0 w-4 bg-white/30 animate-[pulse_1.5s_ease-in-out_infinite]"></div></div></div>
            {nextTier && <div className="mt-4 text-sm text-indigo-700 dark:text-indigo-200 bg-indigo-50 dark:bg-indigo-500/10 p-4 rounded-xl border border-indigo-100 dark:border-indigo-500/20">ทำยอดขายเพิ่มอีก <strong className="text-slate-900 dark:text-white">฿{salesNeeded.toLocaleString()}</strong> เพื่อปลดล็อก <strong className="bg-indigo-600 px-1.5 py-0.5 rounded text-white text-xs ml-1">{nextRate}%</strong></div>}
          </div>
        </div>
      </div>

      {/* ส่วนรับข่าวสารและแคมเปญ */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden mt-2">
        <div className="p-4 md:p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg text-blue-500 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">ประกาศและแคมเปญ</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">อัปเดตข่าวสารจาก Super Admin</p>
            </div>
          </div>
          <button className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1.5 rounded-lg transition-colors">ดูทั้งหมด</button>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
          {announcements.length === 0 ? (
            <div className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">ยังไม่มีข่าวประกาศในขณะนี้</div>
          ) : (
            announcements.map((anc, idx) => (
              <div key={anc.id} className="p-4 md:p-6 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors flex gap-4 items-start group cursor-pointer">
                <div className="shrink-0 mt-1">
                  <span className={`flex w-2.5 h-2.5 rounded-full ${idx === 0 ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)] animate-pulse' : 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]'}`}></span>
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-1.5">
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">{anc.title}</h3>
                    <span className="text-[10px] text-slate-500 font-mono whitespace-nowrap bg-slate-100 dark:bg-slate-800/50 px-2 py-1 rounded">
                      {new Date(anc.createdAt).toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">{anc.content}</p>
                  <div className="mt-3 flex gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 font-bold uppercase tracking-wider">Announcement</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  const renderNetwork = () => (
    <div className="space-y-6 w-full animate-in fade-in duration-300 h-full flex flex-col relative z-0">
      <div className="shrink-0 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">เครือข่ายตัวแทน (Network)</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">บริหารจัดการ Sub-Partner ของคุณ (รองรับสูงสุด 20 คน)</p>
        </div>
        <button 
          onClick={() => setShowInviteModal(true)}
          disabled={subPartners.length >= 20} 
          className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center gap-2 ${subPartners.length >= 20 ? 'bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}
        >
          <LinkIcon className="w-4 h-4"/> สร้างลิงก์เชิญ
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
        <div className="saas-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]">
          <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">จำนวน Sub-Partner</p>
          <div className="flex items-end gap-2"><h3 className="text-3xl font-black text-slate-900 dark:text-white">{subPartners.length}</h3><span className="text-sm text-slate-500 mb-1">/ 20 บัญชี</span></div>
        </div>
        <div className="saas-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]">
          <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">ยอดขายรวมของทีม</p>
          <h3 className="text-3xl font-black text-emerald-600 dark:text-emerald-400">฿{networkSales.toLocaleString()}</h3>
        </div>
        <div className="saas-card p-5 rounded-2xl border border-purple-200 dark:border-purple-500/30 bg-purple-50 dark:bg-purple-900/10">
          <p className="text-[11px] font-bold text-purple-600/70 dark:text-purple-300/70 uppercase mb-1">ค่าคอม Override รวม</p>
          <h3 className="text-3xl font-black text-purple-600 dark:text-purple-400">฿{networkOverride.toLocaleString()}</h3>
        </div>
      </div>

      <div className="saas-card rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col flex-1 min-h-0 bg-white dark:bg-[#111827]">
        <div className="overflow-auto custom-scrollbar flex-1 p-0">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-[#0B1120] text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-widest font-bold border-b border-slate-200 dark:border-slate-800 sticky top-0">
              <tr><th className="px-5 py-4">ชื่อพาร์ทเนอร์</th><th className="px-5 py-4 text-center">ลูกค้า</th><th className="px-5 py-4 text-right">ยอดขาย</th><th className="px-5 py-4 text-center">อัตรา Override</th><th className="px-5 py-4 text-right">ส่วนแบ่ง</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {subPartners.map((sp, i) => {
                let orRate = 0; let orAmt = 0;
                if(sp.sales >= 150000) { orRate = 10; orAmt = sp.sales * 0.10; }
                else if(sp.sales >= 50000) { orRate = 5; orAmt = sp.sales * 0.05; }
                return (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                    <td className="px-5 py-3.5"><div className="font-bold text-slate-900 dark:text-white">{sp.name}</div><div className="text-[10px] font-mono text-slate-500">{sp.id}</div></td>
                    <td className="px-5 py-3.5 text-center font-bold text-slate-600 dark:text-slate-300">{sp.clients}</td>
                    <td className="px-5 py-3.5 text-right font-bold text-slate-900 dark:text-white">฿{sp.sales.toLocaleString()}</td>
                    <td className="px-5 py-3.5 text-center">{orRate > 0 ? <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20">ได้สิทธิ์ {orRate}%</span> : <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">0%</span>}</td>
                    <td className="px-5 py-3.5 text-right font-bold text-emerald-600 dark:text-emerald-400">{orAmt > 0 ? `+ ฿${orAmt.toLocaleString()}` : '-'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-[#0B1120]">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                สร้างลิงก์สมัคร Sub-Partner
              </h2>
              <button onClick={() => setShowInviteModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8" />
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm">คัดลอกลิงก์ด้านล่างเพื่อส่งให้ผู้ที่สนใจสมัครเป็น Sub-Partner ภายใต้เครือข่ายของคุณ</p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex flex-col gap-3">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Invite Link</p>
                <div className="flex items-center gap-2 bg-white dark:bg-slate-900/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="text-sm text-indigo-600 dark:text-indigo-300 font-mono truncate flex-1 select-all">
                    https://aiva.sparexth.com/apply?ref={partnerId}
                  </span>
                </div>
                <button 
                  onClick={() => {
                    const textArea = document.createElement("textarea");
                    textArea.value = `https://aiva.sparexth.com/apply?ref=${partnerId}`;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand("copy");
                    document.body.removeChild(textArea);
                    
                    setIsLinkCopied(true);
                    setTimeout(() => setIsLinkCopied(false), 2000);
                  }}
                  className={`w-full font-bold py-3 rounded-xl transition-all shadow-sm flex justify-center items-center gap-2 ${
                    isLinkCopied ? 'bg-emerald-600 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  }`}
                >
                  {isLinkCopied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  {isLinkCopied ? 'คัดลอกลิงก์แล้ว!' : 'คัดลอกลิงก์'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderClients = () => {
    const visibleClients = clientsList.filter(c => isMain || c.source === 'Direct');
    
    const activeClientsCount = visibleClients.filter(c => c.status === 'Active').length;
    const totalLTV = visibleClients.reduce((acc, curr) => acc + curr.ltv, 0);
    const expiringCount = visibleClients.filter(c => c.status === 'Active' && c.expiresIn !== null && c.expiresIn <= 15).length;

    return (
      <div className="h-full flex flex-col w-full animate-in fade-in duration-300">
        <div className="shrink-0 mb-6 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">ฐานข้อมูลลูกค้า (Clients)</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{isMain ? 'ลูกค้าทั้งหมดของคุณและจากเครือข่าย Sub-Partner' : 'ลูกค้าทั้งหมดภายใต้ลิงก์ของคุณ'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0 mb-6">
          <div className="saas-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"><Users className="w-4 h-4"/></div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">ลูกค้าที่ใช้งานอยู่</p>
            </div>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{activeClientsCount} <span className="text-sm font-medium text-slate-500">ราย</span></h3>
          </div>
          
          <div className="saas-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"><CreditCard className="w-4 h-4"/></div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">ยอดซื้อสะสมรวม (LTV)</p>
            </div>
            <h3 className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">฿{totalLTV.toLocaleString()}</h3>
          </div>
          
          <div className="saas-card p-5 rounded-2xl border border-rose-200 dark:border-rose-500/20 bg-rose-50 dark:bg-rose-500/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-100 dark:bg-rose-500/10 blur-2xl rounded-full -mr-10 -mt-10 pointer-events-none"></div>
            <div className="flex items-center gap-3 mb-2 relative z-10">
              <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400"><AlertCircle className="w-4 h-4"/></div>
              <p className="text-xs font-bold text-rose-600/80 dark:text-rose-400/80 uppercase tracking-wider">ต้องติดตาม (หมดอายุ {'<= 15'} วัน)</p>
            </div>
            <h3 className="text-3xl font-black text-rose-600 dark:text-rose-400 mt-1 relative z-10">{expiringCount} <span className="text-sm font-medium text-rose-500/70">ราย</span></h3>
          </div>
        </div>
        
        <div className="bg-white dark:bg-[#111827] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col flex-1 overflow-hidden saas-card min-h-0">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex gap-4 justify-between items-center shrink-0">
            <div className="relative w-64"><Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="text" placeholder="ค้นหาชื่อลูกค้า..." className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl outline-none focus:border-indigo-500" /></div>
          </div>
          <div className="overflow-auto custom-scrollbar flex-1 p-0">
            <table className="w-full text-left text-sm border-collapse whitespace-nowrap">
              <thead className="bg-slate-50 dark:bg-[#0B1120] text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-widest font-bold border-b border-slate-200 dark:border-slate-800 sticky top-0">
                <tr>
                  <th className="px-5 py-4 w-16">CUST ID</th>
                  <th className="px-5 py-4">ชื่อลูกค้า</th>
                  <th className="px-5 py-4">แพ็กเกจ</th>
                  <th className="px-5 py-4">ยอดซื้อสะสม</th>
                  <th className="px-5 py-4 text-center">วันหมดอายุ</th>
                  {isMain && <th className="px-5 py-4">ที่มา (SOURCE)</th>}
                  <th className="px-5 py-4 text-center">สถานะ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {visibleClients.map((c, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                    <td className="px-5 py-3.5"><span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded">{c.id}</span></td>
                    <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white">{c.name}</td>
                    <td className="px-5 py-3.5"><span className="text-[10px] bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 px-2 py-1 rounded">{c.plan}</span></td>
                    <td className="px-5 py-3.5 font-mono text-emerald-600 dark:text-emerald-400 font-bold">฿{c.ltv.toLocaleString()}</td>
                    <td className="px-5 py-3.5 text-center">
                      {c.status === 'Active' && c.expiresIn !== null ? (
                        <div className={`flex items-center justify-center gap-1.5 text-[11px] font-bold ${c.expiresIn <= 15 ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 px-2 py-1 rounded-md border border-rose-200 dark:border-rose-500/20 inline-flex' : 'text-slate-500 dark:text-slate-400'}`}>
                          <Clock className="w-3.5 h-3.5" />
                          อีก {c.expiresIn} วัน
                        </div>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-600">-</span>
                      )}
                    </td>
                    {isMain && (
                      <td className="px-5 py-3.5">
                        {c.source === 'Direct' ? <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">หาเอง (Direct)</span> : <span className="text-[10px] font-mono font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 px-2 py-0.5 rounded">{c.source}</span>}
                      </td>
                    )}
                    <td className="px-5 py-3.5 text-center"><span className={`inline-flex px-2 py-1 rounded-full text-[10px] font-bold border ${c.status === 'Active' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'}`}>{c.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderPromotions = () => (
    <div className="space-y-6 w-full animate-in fade-in duration-300 h-full flex flex-col">
      <div className="shrink-0"><h1 className="text-2xl font-bold text-slate-900 dark:text-white">ระบบจัดการส่วนลด (Promotions)</h1><p className="text-slate-500 dark:text-slate-400 text-sm mt-1">สร้างโค้ดส่วนลดให้ลูกค้า (สูงสุดไม่เกินเรทคอมมิชชันของคุณ: {currentCommissionRate}%)</p></div>
      <form onSubmit={handleCreatePromotion} className="bg-white dark:bg-[#111827] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 shrink-0">
        <div className="flex items-center gap-2 mb-4"><Tag className="w-5 h-5 text-indigo-500 dark:text-indigo-400" /><h2 className="font-bold text-slate-900 dark:text-white">สร้างโค้ดใหม่</h2></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5"><label className="block text-xs font-bold text-slate-500 dark:text-slate-400">CODE</label><input type="text" value={newPromo.code} onChange={e=>setNewPromo({...newPromo, code: e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-3 py-2 text-sm uppercase outline-none focus:border-indigo-500" placeholder="เช่น NEWYEAR" /></div>
          <div className="space-y-1.5"><label className="block text-xs font-bold text-slate-500 dark:text-slate-400">% ลด (Max {currentCommissionRate}%)</label><input type="number" value={newPromo.discount} onChange={e=>setNewPromo({...newPromo, discount: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500" /></div>
          <div className="space-y-1.5"><label className="block text-xs font-bold text-slate-500 dark:text-slate-400">จำนวนสิทธิ์</label><input type="number" value={newPromo.limit} onChange={e=>setNewPromo({...newPromo, limit: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500" /></div>
        </div>
        <div className="mt-4 text-right"><button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-sm">บันทึกโค้ด</button></div>
      </form>
      <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 flex-1 overflow-hidden flex flex-col min-h-0">
        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 font-bold text-slate-900 dark:text-white shrink-0">โค้ดที่ใช้งานอยู่</div>
        <div className="overflow-auto flex-1 p-0 custom-scrollbar">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-[#0B1120] text-slate-500 dark:text-slate-400 text-xs border-b border-slate-200 dark:border-slate-800 sticky top-0"><tr><th className="px-6 py-3">Code</th><th className="px-6 py-3">% ส่วนลด</th><th className="px-6 py-3">สิทธิ์ใช้งาน</th></tr></thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {promotionsList.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-slate-400 dark:text-slate-600">ยังไม่มีโค้ดส่วนลดที่สร้างไว้</td>
                </tr>
              ) : (
                promotionsList.map((promo, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{promo.code}</td>
                    <td className="px-6 py-4 text-indigo-600 dark:text-indigo-400 font-bold">{promo.discount}%</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{promo.used}/{promo.limit}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAssets = () => (
    <div className="space-y-6 w-full animate-in fade-in duration-300 h-full flex flex-col">
      <div className="shrink-0"><h1 className="text-2xl font-bold text-slate-900 dark:text-white">คลังสื่อการตลาด (Marketing Assets)</h1><p className="text-slate-500 dark:text-slate-400 text-sm mt-1">ดาวน์โหลดสไลด์และสื่อโฆษณาเพื่อนำไปใช้ปิดการขาย</p></div>
      <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 flex-1 overflow-hidden flex flex-col min-h-0">
        <div className="overflow-auto flex-1 p-0 custom-scrollbar">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-[#0B1120] text-slate-500 dark:text-slate-400 text-xs border-b border-slate-200 dark:border-slate-800 sticky top-0"><tr><th className="px-6 py-3">ชื่อไฟล์</th><th className="px-6 py-3">หมวดหมู่</th><th className="px-6 py-3 text-center">ดาวน์โหลด</th></tr></thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {marketingAssets.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-slate-400 dark:text-slate-600">ยังไม่มีไฟล์สื่อการตลาดพร้อมใช้งาน</td>
                </tr>
              ) : (
                marketingAssets.map((asset, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        {asset.category === 'Presentations' ? <FileImage className="w-4 h-4 text-rose-500 dark:text-rose-400"/> : <ImageIcon className="w-4 h-4 text-indigo-500 dark:text-indigo-400"/>}
                        {asset.filename}
                      </div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">{asset.size}</div>
                    </td>
                    <td className="px-6 py-4"><span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded">{asset.category}</span></td>
                    <td className="px-6 py-4 text-center">
                      <a href={asset.url} target="_blank" rel="noopener noreferrer" className="inline-block p-2 bg-indigo-50 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-600 hover:text-white transition-colors font-sans leading-none">
                        <Download className="w-4 h-4 mx-auto"/>
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderTracking = () => {
    const visibleTrackingLinks = trackingLinks.map((link) => {
      const matchingClients = clientsList.filter(c => c.referralCode === link.code);
      const paid = matchingClients.filter(c => c.status === 'Active').length;
      const sales = matchingClients.reduce((sum, c) => sum + c.ltv, 0);
      const earnings = Math.floor(sales * (stats.currentRate / 100));
      return {
        ...link,
        paid,
        earnings
      };
    });

    return (
      <div className="space-y-6 w-full animate-in fade-in duration-300 h-full flex flex-col">
        <div className="shrink-0">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">ระบบติดตามลิงก์ (Affiliate Tracking)</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">สร้างลิงก์แยกตามช่องทางเพื่อวัดผล (Tracking) และดูสถิติ Conversion อย่างละเอียด</p>
        </div>

        <div className="bg-white dark:bg-[#111827] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 shrink-0">
          <div className="flex items-center gap-2 mb-4"><LinkIcon className="w-5 h-5 text-indigo-500 dark:text-indigo-400" /><h2 className="font-bold text-slate-900 dark:text-white">สร้างลิงก์สำหรับแคมเปญใหม่</h2></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5"><label className="block text-xs font-bold text-slate-500 dark:text-slate-400">ชื่อแคมเปญ / จุดประสงค์</label><input type="text" value={newTracking.name} onChange={e=>setNewTracking({...newTracking, name: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500" placeholder="เช่น ยิงแอด FB, แปะหน้าเว็บ" /></div>
            <div className="space-y-1.5"><label className="block text-xs font-bold text-slate-500 dark:text-slate-400">แหล่งที่มา (Source / Sub-ID)</label><input type="text" value={newTracking.source} onChange={e=>setNewTracking({...newTracking, source: e.target.value.replace(/[^a-zA-Z0-9_-]/g, '').toUpperCase()})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-3 py-2 text-sm uppercase outline-none focus:border-indigo-500" placeholder="เช่น FB_ADS, TIKTOK" /></div>
            <div className="flex items-end">
              <button onClick={handleCreateReferral} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-sm h-[38px] transition-colors flex items-center justify-center gap-2">
                สร้างลิงก์
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 flex-1 overflow-hidden flex flex-col min-h-0">
          <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 font-bold text-slate-900 dark:text-white shrink-0 flex justify-between items-center">
            <span>สถิติแยกลิงก์</span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 font-mono bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">Total Clicks: {trackingLinks.reduce((acc, curr) => acc + curr.clicks, 0).toLocaleString()}</span>
          </div>
          <div className="overflow-auto flex-1 p-0 custom-scrollbar">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 dark:bg-[#0B1120] text-slate-500 dark:text-slate-400 text-[11px] uppercase border-b border-slate-200 dark:border-slate-800 sticky top-0">
                <tr>
                  <th className="px-5 py-3">แคมเปญ / ลิงก์</th>
                  <th className="px-5 py-3 text-center">คลิก (Clicks)</th>
                  <th className="px-5 py-3 text-center">ลูกค้าสมัคร (Signups)</th>
                  <th className="px-5 py-3 text-center">ซื้อแพ็กเกจ (Paid)</th>
                  <th className="px-5 py-3 text-center">อัตราการซื้อ (CR%)</th>
                  <th className="px-5 py-3 text-right">รายได้ (Earnings)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {visibleTrackingLinks.map((link) => {
                  const conversionRate = link.clicks > 0 ? ((link.paid / link.clicks) * 100).toFixed(2) : "0.00";
                  
                  return (
                    <tr key={link.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          {link.name} 
                          <span className="text-[9px] bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 px-1.5 py-0.5 rounded text-slate-500 dark:text-slate-300 uppercase tracking-wider">{link.code}</span>
                        </div>
                        <div className="text-xs text-indigo-600 dark:text-indigo-400 font-mono mt-1 flex items-center gap-1.5 cursor-pointer hover:text-indigo-500 dark:hover:text-indigo-300" onClick={() => {setCopiedLink(link.id); setTimeout(()=>setCopiedLink(null), 2000)}}>
                          {copiedLink === link.id ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400"/> : <Copy className="w-3.5 h-3.5"/>}
                          aiva.sparexth.com/?ref={link.code}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-center font-bold text-slate-600 dark:text-slate-300">{link.clicks.toLocaleString()}</td>
                      <td className="px-5 py-3.5 text-center font-bold text-amber-600 dark:text-amber-400">{link.signups.toLocaleString()}</td>
                      <td className="px-5 py-3.5 text-center font-bold text-emerald-600 dark:text-emerald-400">{link.paid.toLocaleString()}</td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold border ${conversionRate >= 1 ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'}`}>
                          {conversionRate}%
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right font-bold text-indigo-600 dark:text-indigo-300">฿{link.earnings.toLocaleString()}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    );
  };

  const renderPayouts = () => {
    const withdrawableAmount = Math.max(0, totalIncome - stats.paidAmount - stats.pendingAmount);

    return (
      <div className="space-y-6 w-full animate-in fade-in duration-300 h-full flex flex-col">
        <div className="shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">ประวัติการรับเงิน (Payouts)</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">ประวัติการโอนเงินคอมมิชชันและส่งคำขอถอนเงิน</p>
          </div>
        </div>

        {/* Withdrawal Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 shrink-0">
          <div className="saas-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]">
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">คอมมิชชันสะสมทั้งหมด</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">฿{totalIncome.toLocaleString()}</h3>
          </div>
          <div className="saas-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]">
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">ถอนออกไปแล้ว (Paid)</p>
            <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400">฿{stats.paidAmount.toLocaleString()}</h3>
          </div>
          <div className="saas-card p-5 rounded-2xl border border-indigo-200 dark:border-indigo-500/20 bg-indigo-50/50 dark:bg-indigo-950/20">
            <p className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase mb-1">ยอดที่ถอนได้ (Withdrawable)</p>
            <div className="flex justify-between items-end mt-1">
              <h3 className="text-2xl font-black text-indigo-600 dark:text-indigo-400">฿{withdrawableAmount.toLocaleString()}</h3>
              {stats.pendingAmount > 0 && (
                <span className="text-xs text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-500/20">
                  รอโอน: ฿{stats.pendingAmount.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Request Withdrawal Form */}
        {withdrawableAmount > 0 && (
          <div className="bg-white dark:bg-[#111827] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 shrink-0">
            <div className="flex items-center gap-2 mb-4">
              <Wallet className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
              <h2 className="font-bold text-slate-900 dark:text-white">ส่งคำขอถอนเงิน (Request Payout)</h2>
            </div>
            <form onSubmit={handleRequestPayout} className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">จำนวนเงินที่ต้องการถอน (บาท)</label>
                <input 
                  type="number" 
                  max={withdrawableAmount}
                  value={payoutInput} 
                  onChange={e => setPayoutInput(e.target.value)} 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500" 
                  placeholder={`ถอนได้สูงสุด ฿${withdrawableAmount}`} 
                />
              </div>
              <button 
                type="submit" 
                disabled={isSubmittingPayout}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm h-[38px] transition-colors flex items-center justify-center gap-2 font-sans"
              >
                {isSubmittingPayout ? 'กำลังถอน...' : 'ถอนเงิน'}
              </button>
            </form>
          </div>
        )}

        <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 flex-1 overflow-hidden flex flex-col min-h-0">
          <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 font-bold text-slate-900 dark:text-white shrink-0">ประวัติการทำรายการ</div>
          <div className="overflow-auto flex-1 p-0 custom-scrollbar">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 dark:bg-[#0B1120] text-slate-500 dark:text-slate-400 text-[11px] uppercase border-b border-slate-200 dark:border-slate-800 sticky top-0">
                <tr><th className="px-5 py-3">รอบบิล / วันที่ยื่นคำขอ</th><th className="px-5 py-3 text-right">ยอดขาย (ฐาน)</th><th className="px-5 py-3 text-right">คอมมิชชัน</th><th className="px-5 py-3 text-right">หัก 3%</th><th className="px-5 py-3 text-right">ยอดรับสุทธิ</th><th className="px-5 py-3 text-center">สถานะ</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {payoutsList.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-5 py-8 text-center text-slate-400 dark:text-slate-600">ยังไม่มีประวัติการทำรายการ</td>
                  </tr>
                ) : (
                  payoutsList.map((p, i) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                      <td className="px-5 py-3.5 text-slate-900 dark:text-white font-medium">{p.period}</td>
                      <td className="px-5 py-3.5 text-right font-mono text-slate-500 dark:text-slate-400">฿{p.sales.toLocaleString()}</td>
                      <td className="px-5 py-3.5 text-right font-mono font-bold text-indigo-600 dark:text-indigo-400">฿{p.commission.toLocaleString()}</td>
                      <td className="px-5 py-3.5 text-right font-mono text-rose-500 dark:text-rose-400">-฿{p.tax.toLocaleString()}</td>
                      <td className="px-5 py-3.5 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">฿{p.net.toLocaleString()}</td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded border ${
                          p.status === 'Paid'
                            ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'
                            : p.status === 'Pending'
                            ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'
                            : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/20'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderHelpdesk = () => (
    <div className="space-y-6 w-full animate-in fade-in duration-300">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">เสนอแนะ / แจ้งปัญหา</h1>
      <form onSubmit={handleSubmitFeedback} className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
        <input type="text" placeholder="หัวข้อ..." value={feedbackForm.title} onChange={e=>setFeedbackForm({...feedbackForm, title: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-sm mb-3 outline-none focus:border-indigo-500" />
        <textarea rows="4" placeholder="อธิบายรายละเอียด..." value={feedbackForm.desc} onChange={e=>setFeedbackForm({...feedbackForm, desc: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-sm mb-4 outline-none focus:border-indigo-500" />
        <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-500 transition-colors">ส่งข้อมูลให้ทีมงาน</button>
      </form>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6 w-full animate-in fade-in duration-300 pb-10">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">การตั้งค่าบัญชี</h1>
      <form onSubmit={handleSaveProfile} className="space-y-6">
        <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
          <h2 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-indigo-500 dark:text-indigo-400"/> ข้อมูลส่วนตัว</h2>
          <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-4 rounded-xl mb-4">
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Partner ID</p>
            <p className="text-lg font-mono font-bold text-slate-900 dark:text-white">{partnerId}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs font-bold text-slate-500 dark:text-slate-400">ชื่อ - นามสกุล</label><input type="text" maxLength={150} value={profileSettings.name} onChange={e=>setProfileSettings({...profileSettings, name: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-2 text-sm mt-1" /></div>
            <div><label className="text-xs font-bold text-slate-500 dark:text-slate-400">เบอร์โทรศัพท์</label><input type="text" value={profileSettings.phone} onChange={e=>setProfileSettings({...profileSettings, phone: e.target.value.replace(/\D/g, '').substring(0, 10)})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-2 text-sm mt-1" /></div>
          </div>
        </div>
        <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
          <h2 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><CreditCard className="w-5 h-5 text-emerald-500 dark:text-emerald-400"/> บัญชีรับเงิน (Payout)</h2>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs font-bold text-slate-500 dark:text-slate-400">ธนาคาร</label><input type="text" value={profileSettings.bankName} onChange={e=>setProfileSettings({...profileSettings, bankName: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-2 text-sm mt-1" /></div>
            <div><label className="text-xs font-bold text-slate-500 dark:text-slate-400">เลขบัญชี</label><input type="text" value={profileSettings.bankAccount} onChange={e=>setProfileSettings({...profileSettings, bankAccount: e.target.value.replace(/\D/g, '').substring(0, 10)})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-2 text-sm mt-1" /></div>
            <div className="col-span-2"><label className="text-xs font-bold text-slate-500 dark:text-slate-400">ชื่อบัญชี</label><input type="text" value={profileSettings.bankAccountName} onChange={e=>setProfileSettings({...profileSettings, bankAccountName: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-2 text-sm mt-1" /></div>
          </div>
        </div>
        <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-500 transition-colors">บันทึกการตั้งค่า</button>
      </form>
    </div>
  );

  return (
    <div className={`${isDarkMode ? 'dark' : ''}`}>
      <div className="flex h-screen bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-slate-200 overflow-hidden font-sans transition-colors duration-300" style={{ fontFamily: "'Anuphan', sans-serif" }}>
        <style dangerouslySetInnerHTML={{__html: `
          @import url('https://fonts.googleapis.com/css2?family=Anuphan:wght@300;400;500;600;700&display=swap');
          .custom-scrollbar::-webkit-scrollbar { display: none; }
          .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          .saas-card { background: #ffffff; border-color: #e2e8f0; box-shadow: 0 4px 20px -4px rgba(0, 0, 0, 0.05); }
          .dark .saas-card { background: #111827; border-color: #1E293B; box-shadow: 0 4px 20px -4px rgba(0, 0, 0, 0.5); }
        `}} />
        
        <aside className="w-[260px] bg-white dark:bg-[#0B1120] border-r border-slate-200 dark:border-slate-800/50 flex flex-col shrink-0 z-20 transition-colors duration-300">
          <div className="h-[72px] px-6 flex items-center gap-3 shrink-0 border-b border-slate-200 dark:border-slate-800/50 transition-colors duration-300">
            <div className="bg-slate-100 dark:bg-white p-1 rounded-xl shadow-sm dark:shadow-lg flex items-center justify-center">
              <img src="https://i.postimg.cc/mhfQRbmz/Chat-GPT-Image-Jun-3-2026-04-47-53-PM.png" alt="AIVA Logo" className="w-8 h-8 object-contain" onError={(e) => { e.target.style.display='none'; }}/>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">AIVA<span className="text-indigo-600 dark:text-indigo-400">Partner</span></span>
          </div>

          <div className="px-4 py-4 flex-1 overflow-y-auto custom-scrollbar">
            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 px-2">Main Menu</div>
            <nav className="space-y-1 mb-6">
              <SidebarItem icon={LayoutDashboard} label="แดชบอร์ด" isActive={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
              <SidebarItem icon={Users} label="จัดการลูกค้า" isActive={activeTab === 'clients'} onClick={() => setActiveTab('clients')} />
              {isMain && <SidebarItem icon={Share2} label="เครือข่ายตัวแทน" isActive={activeTab === 'network'} onClick={() => setActiveTab('network')} />}
              <SidebarItem icon={Tag} label="ระบบส่วนลด" isActive={activeTab === 'promotions'} onClick={() => setActiveTab('promotions')} />
            </nav>
            
            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 px-2">Marketing & Sales</div>
            <nav className="space-y-1 mb-6">
              <SidebarItem icon={Download} label="คลังสื่อการตลาด" isActive={activeTab === 'assets'} onClick={() => setActiveTab('assets')} />
              <SidebarItem icon={LinkIcon} label="ระบบติดตามลิงก์" isActive={activeTab === 'tracking'} onClick={() => setActiveTab('tracking')} />
              <SidebarItem icon={Wallet} label="ประวัติการรับเงิน" isActive={activeTab === 'payouts'} onClick={() => setActiveTab('payouts')} />
            </nav>

            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 px-2">Preferences</div>
            <nav className="space-y-1">
              <SidebarItem icon={Settings} label="การตั้งค่าบัญชี" isActive={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
              <SidebarItem icon={MessageSquare} label="เสนอแนะ/แจ้งปัญหา" isActive={activeTab === 'helpdesk'} onClick={() => setActiveTab('helpdesk')} />
            </nav>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-[#111827] border-t border-slate-200 dark:border-slate-800 flex flex-col gap-3 transition-colors duration-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-white font-bold border border-slate-300 dark:border-slate-700 shrink-0">{isMain ? 'P' : 'SP'}</div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user.name || 'คุณสมชาย ใจดี'}</p>
                <div className="flex items-center gap-1 mt-0.5"><Hash className="w-3 h-3 text-indigo-500 dark:text-indigo-400" /><p className="text-[11px] text-indigo-600 dark:text-indigo-300 font-medium truncate">{partnerId}</p></div>
              </div>
            </div>
            
            <div className="mt-2 p-2 bg-white dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm dark:shadow-none">
              <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Simulate Role</p>
              <div className="flex gap-1">
                  <button onClick={() => {setRole('main'); setActiveTab('dashboard');}} className={`flex-1 text-[10px] py-1 rounded font-bold transition-colors ${isMain ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'}`}>MAIN</button>
                  <button onClick={() => {setRole('sub'); setActiveTab('dashboard');}} className={`flex-1 text-[10px] py-1 rounded font-bold transition-colors ${!isMain ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'}`}>SUB</button>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 flex flex-col h-full w-full overflow-hidden min-w-0 relative z-0">
          <header className="h-[72px] bg-white dark:bg-[#0B1120] border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-end px-8 shrink-0 z-10 sticky top-0 transition-colors duration-300">
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center bg-slate-50 dark:bg-slate-800/50 rounded-full px-3 py-1.5 border border-slate-200 dark:border-slate-700/50">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">AIVA Core: Online</span>
              </div>
              
              <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>
              
              {/* Dark/Light Mode Toggle */}
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)} 
                className="text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-colors p-1"
                title={isDarkMode ? "เปลี่ยนเป็นโหมดสว่าง" : "เปลี่ยนเป็นโหมดมืด"}
              >
                {isDarkMode ? <Sun className="w-5 h-5"/> : <Moon className="w-5 h-5"/>}
              </button>
              
              <button onClick={handleLogout} className="text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors p-1" title="Logout"><LogOut className="w-5 h-5"/></button>
            </div>
          </header>

          <div className="flex-1 overflow-auto p-4 custom-scrollbar">
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'network' && isMain && renderNetwork()}
            {activeTab === 'clients' && renderClients()}
            {activeTab === 'promotions' && renderPromotions()}
            {activeTab === 'assets' && renderAssets()}
            {activeTab === 'tracking' && renderTracking()}
            {activeTab === 'payouts' && renderPayouts()}
            {activeTab === 'helpdesk' && renderHelpdesk()}
            {activeTab === 'settings' && renderSettings()}
          </div>
        </main>

        {/* CHAT WIDGET */}
        <div className="fixed bottom-6 right-6 z-50">
          {isChatOpen ? (
            <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl w-80 h-[400px] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
              <div className="bg-indigo-600 p-4 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white leading-none">AIVA Support</h3>
                    <p className="text-[10px] text-indigo-100 mt-1 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span> แอดมินพร้อมให้บริการ
                    </p>
                  </div>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="text-indigo-200 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-[#0B1120] custom-scrollbar">
                <div className="text-center mb-2">
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-200 dark:bg-slate-800/50 px-2 py-1 rounded-full border border-slate-300 dark:border-slate-700">
                    กำลังสนทนาด้วยรหัส: {partnerId}
                  </span>
                </div>
                
                {chatHistory.map((msg, i) => (
                  <div key={i} className={`flex flex-col ${msg.sender === 'partner' ? 'items-end' : 'items-start'}`}>
                    <div className={`px-3 py-2 text-sm rounded-2xl max-w-[85%] ${
                      msg.sender === 'partner' 
                        ? 'bg-indigo-600 text-white rounded-tr-sm shadow-sm' 
                        : 'bg-white text-slate-700 border border-slate-200 shadow-sm dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 rounded-tl-sm'
                    }`}>
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 mt-1 px-1">{msg.time}</span>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              
              <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shrink-0">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                    placeholder="พิมพ์ข้อความ..." 
                    className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-xl px-3 py-2 outline-none focus:border-indigo-500"
                  />
                  <button 
                    onClick={handleSendChat}
                    disabled={!chatMessage.trim()}
                    className={`p-2 rounded-xl flex items-center justify-center transition-colors ${
                      !chatMessage.trim() ? 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm'
                    }`}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setIsChatOpen(true)}
              className="w-14 h-14 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-lg shadow-indigo-500/20 flex items-center justify-center transition-transform hover:scale-105 relative"
            >
              <MessageSquare className="w-6 h-6" />
              <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-rose-500 border-2 border-white dark:border-[#0B1120] rounded-full"></span>
            </button>
          )}
        </div>

      </div>
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[10000] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className={`px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border text-sm font-bold ${
            toast.type === 'success' 
              ? 'bg-emerald-50/90 border-emerald-200/50 text-emerald-800 backdrop-blur-md' 
              : toast.type === 'danger'
              ? 'bg-rose-50/90 border-rose-200/50 text-rose-800 backdrop-blur-md' 
              : 'bg-indigo-50/90 border-indigo-200/50 text-indigo-800 backdrop-blur-md'
          }`}>
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
            {toast.type === 'danger' && <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0" />}
            {toast.type === 'info' && <AlertCircle className="w-5 h-5 text-indigo-600 shrink-0" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function SidebarItem({ icon: Icon, label, isActive, onClick }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500 dark:text-white shadow-sm dark:shadow-md dark:shadow-indigo-500/20' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'}`}>
      <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`} />{label}
    </button>
  );
}