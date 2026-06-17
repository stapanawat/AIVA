import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, RefreshCw, MessageSquare, AlertCircle } from 'lucide-react';

export default function PublicChat() {
  const [clientId, setClientId] = useState(null);
  const [chatId, setChatId] = useState(null);
  const [config, setConfig] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const messagesEndRef = useRef(null);

  // 1. Get Client ID from path or query parameters
  useEffect(() => {
    const pathParts = window.location.pathname.split('/');
    // Support either: /chat/c-123456 or /chat?clientId=c-123456
    const idFromPath = pathParts[2] || pathParts[1] !== 'chat' ? pathParts[1] : null; 
    const params = new URLSearchParams(window.location.search);
    const idFromQuery = params.get('clientId');
    
    // Extract actual clientId (usually starts with c-)
    let activeClientId = idFromQuery || idFromPath;
    
    // If the path is /chat/c-123456, pathParts will be ['', 'chat', 'c-123456']
    if (pathParts[1] === 'chat' && pathParts[2]) {
      activeClientId = pathParts[2];
    }

    if (!activeClientId) {
      setError('ไม่พบ Client ID สำหรับการเชื่อมต่อแชท');
      setInitLoading(false);
      return;
    }

    setClientId(activeClientId);

    // Initialize chat session ID
    let storedChatId = localStorage.getItem(`aiva_public_chat_session_${activeClientId}`);
    if (!storedChatId) {
      storedChatId = `web-${Math.random().toString(36).substring(2, 11)}-${Date.now()}`;
      localStorage.setItem(`aiva_public_chat_session_${activeClientId}`, storedChatId);
    }
    setChatId(storedChatId);
  }, []);

  // 2. Fetch Widget Configuration
  useEffect(() => {
    if (!clientId) return;

    const fetchConfig = async () => {
      try {
        const res = await fetch(`/api/widget/config?clientId=${clientId}`);
        if (!res.ok) {
          throw new Error('ไม่สามารถโหลดข้อมูลการตั้งค่าแชทของร้านค้านี้ได้');
        }
        const data = await res.json();
        setConfig(data);
        
        // Load messages history from localStorage if any, otherwise initialize with greeting
        const savedMessages = localStorage.getItem(`aiva_public_chat_history_${clientId}`);
        if (savedMessages) {
          try {
            setMessages(JSON.parse(savedMessages));
          } catch (e) {
            setMessages([{ sender: 'BOT', content: data.greeting || 'สวัสดีค่ะ มีอะไรให้ช่วยไหมคะ', createdAt: new Date().toISOString() }]);
          }
        } else {
          setMessages([{ sender: 'BOT', content: data.greeting || 'สวัสดีค่ะ มีอะไรให้ช่วยไหมคะ', createdAt: new Date().toISOString() }]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setInitLoading(false);
      }
    };

    fetchConfig();
  }, [clientId]);

  // 3. Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Save history to localStorage
  const saveHistory = (updatedMessages) => {
    if (!clientId) return;
    localStorage.setItem(`aiva_public_chat_history_${clientId}`, JSON.stringify(updatedMessages));
  };

  // 4. Send Message
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    const text = inputText.trim();
    if (!text || loading || !clientId || !chatId) return;

    const userMessage = {
      sender: 'CUSTOMER',
      content: text,
      createdAt: new Date().toISOString()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    saveHistory(newMessages);
    setInputText('');
    setLoading(true);

    try {
      const res = await fetch('/api/widget/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId,
          chatId,
          message: text
        })
      });

      if (!res.ok) {
        throw new Error('ไม่สามารถส่งข้อความได้');
      }

      const data = await res.json();
      
      const botMessage = {
        sender: 'BOT',
        content: data.content,
        createdAt: data.createdAt || new Date().toISOString()
      };

      const updatedWithBot = [...newMessages, botMessage];
      setMessages(updatedWithBot);
      saveHistory(updatedWithBot);
    } catch (err) {
      const errorMessage = {
        sender: 'BOT',
        content: 'ขออภัยค่ะ เกิดข้อผิดพลาดในการรับส่งสัญญาณข้อความ กรุณาลองใหม่อีกครั้งนะคะ',
        createdAt: new Date().toISOString(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm('คุณต้องการล้างประวัติการสนทนานี้ใช่หรือไม่?')) {
      const freshMessage = [{ sender: 'BOT', content: config?.greeting || 'สวัสดีค่ะ มีอะไรให้ช่วยไหมคะ', createdAt: new Date().toISOString() }];
      setMessages(freshMessage);
      saveHistory(freshMessage);
    }
  };

  if (initLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-bold text-sm">กำลังโหลดห้องแชทอัจฉริยะ AIVA...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">ไม่สามารถเชื่อมต่อแชทได้</h2>
          <p className="text-sm text-slate-500 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-md hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> โหลดอีกครั้ง
          </button>
        </div>
      </div>
    );
  }

  const primaryColor = config?.themeColor || '#4f46e5';

  return (
    <div className="min-h-screen h-screen max-h-screen bg-slate-100 flex items-center justify-center p-0 sm:p-4 md:p-6">
      <div className="w-full h-full sm:max-w-2xl bg-white sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-200/80">
        
        {/* Chat Header */}
        <div 
          className="px-6 py-4 text-white flex justify-between items-center shadow-md select-none shrink-0"
          style={{ backgroundColor: primaryColor }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white border border-white/10 font-bold shadow-inner">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-base tracking-wide leading-tight">
                {config?.brandName || 'ร้านค้า AIVA'}
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[11px] text-white/90 font-medium">{config?.aiName || 'AI ผู้ช่วยอัจฉริยะ'} (Online)</span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleClearChat} 
            title="ล้างแชท" 
            className="text-[11px] font-bold bg-white/10 hover:bg-white/20 transition-colors px-3 py-1.5 rounded-lg border border-white/10"
          >
            ล้างประวัติแชท
          </button>
        </div>

        {/* Message Window */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50 space-y-4">
          {messages.map((msg, i) => {
            const isBot = msg.sender === 'BOT';
            return (
              <div 
                key={i} 
                className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${isBot ? 'self-start' : 'ml-auto flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold shadow-sm ${
                  isBot 
                    ? 'bg-indigo-50 border border-indigo-100 text-indigo-600' 
                    : 'bg-slate-200 border border-slate-300 text-slate-700'
                }`}>
                  {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div className="space-y-1">
                  <div 
                    className={`rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed shadow-sm font-medium whitespace-pre-wrap break-words ${
                      isBot 
                        ? msg.isError 
                          ? 'bg-rose-50 border border-rose-100 text-rose-700 rounded-tl-none'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none' 
                        : 'text-white rounded-tr-none'
                    }`}
                    style={isBot && !msg.isError ? {} : !isBot ? { backgroundColor: primaryColor } : {}}
                  >
                    {msg.content}
                  </div>
                  {/* Timestamp */}
                  <p className={`text-[9px] text-slate-400 font-semibold ${!isBot ? 'text-right' : ''}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Typing indicator */}
          {loading && (
            <div className="flex gap-3 max-w-[75%] self-start animate-pulse">
              <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center bg-indigo-50 border border-indigo-100 text-indigo-600 shadow-sm">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-slate-100 shrink-0">
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <input 
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="ถามคำถามของคุณที่นี่..."
              disabled={loading}
              className="flex-1 border border-slate-200 hover:border-slate-300 focus:border-indigo-500 rounded-2xl px-4 py-2.5 text-sm outline-none transition-colors disabled:bg-slate-50 placeholder:text-slate-400"
              style={{ focusBorderColor: primaryColor }}
            />
            <button 
              type="submit"
              disabled={!inputText.trim() || loading}
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white transition-all shadow-md hover:scale-105 active:scale-95 disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
              style={{ backgroundColor: primaryColor }}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Footer Logo */}
          <div className="mt-3 flex justify-center items-center gap-1 select-none">
            <span className="text-[10px] text-slate-400 font-bold">Powered by</span>
            <a 
              href="/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[10px] font-black text-indigo-600 hover:text-indigo-700 tracking-wider flex items-center gap-0.5"
            >
              AIVA <MessageSquare className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
