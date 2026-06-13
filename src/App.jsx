import React, { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import Platform from './pages/Platform';
import Partner from './pages/Partner';
import SuperAdmin from './pages/SuperAdmin';

export default function App() {
  const [route, setRoute] = useState('landing');
  const [isSwitcherExpanded, setIsSwitcherExpanded] = useState(true);

  // Re-run Lucide icons render when changing portals
  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [route]);

  // Listen for global logout event from fetch interceptor
  useEffect(() => {
    const handleLogout = () => {
      setRoute('landing');
    };
    window.addEventListener('aiva_logout', handleLogout);
    return () => window.removeEventListener('aiva_logout', handleLogout);
  }, []);

  // Capture Google Login token, user profile, or payment redirect from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const userStr = params.get('user');
    if (token && userStr) {
      localStorage.setItem('aiva_access_token', token);
      localStorage.setItem('aiva_user', userStr);
      // Clean query params from URL without reloading page
      window.history.replaceState({}, document.title, window.location.pathname);
      setRoute('platform');
    }

    // Check if redirecting from payment portal
    if (params.get('mock_payment') === 'success' || params.get('payment') === 'success') {
      const storedToken = localStorage.getItem('aiva_access_token');
      if (storedToken) {
        setRoute('platform');
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 relative">
      {/* Portals Router */}
      {route === 'landing' && (
        <LandingPage 
          onLogin={() => setRoute('platform')}
          onOpenCheckout={(plan) => setRoute('platform')}
          onContactSales={() => {}}
        />
      )}
      {route === 'platform' && <Platform onLogout={() => setRoute('landing')} />}
      {route === 'partner' && <Partner onLogout={() => setRoute('landing')} />}
      {route === 'super-admin' && <SuperAdmin onLogout={() => setRoute('landing')} />}

      {/* Floating Developer Portal Switcher */}
      {isSwitcherExpanded ? (
        <div className="fixed bottom-4 right-4 z-[9999] bg-slate-900/95 backdrop-blur-md text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700/50 flex flex-wrap items-center gap-3 text-xs font-bold transition-all">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-slate-400">Portal Switcher:</span>
          <button 
            onClick={() => setRoute('landing')} 
            className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${route === 'landing' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-300'}`}
          >
            🏠 Landing Page
          </button>
          <button 
            onClick={() => setRoute('platform')} 
            className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${route === 'platform' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-300'}`}
          >
            💻 Client Platform
          </button>
          <button 
            onClick={() => setRoute('partner')} 
            className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${route === 'partner' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-300'}`}
          >
            🤝 Partner Portal
          </button>
          <button 
            onClick={() => setRoute('super-admin')} 
            className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${route === 'super-admin' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-300'}`}
          >
            👑 Super Admin
          </button>
          
          <div className="h-4 w-px bg-slate-700/60 mx-1"></div>
          
          <button 
            onClick={() => setIsSwitcherExpanded(false)}
            className="hover:bg-slate-800 p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center justify-center"
            title="Minimize Switcher"
          >
            ✕
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsSwitcherExpanded(true)}
          className="fixed bottom-4 right-4 z-[9999] bg-slate-900/95 hover:bg-slate-800 backdrop-blur-md text-white p-3 rounded-full shadow-2xl border border-slate-700/50 flex items-center justify-center transition-all cursor-pointer group"
          title="Open Portal Switcher"
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-out whitespace-nowrap text-xs font-bold text-slate-300 group-hover:ml-2">
            Open Switcher
          </span>
        </button>
      )}
    </div>
  );
}
