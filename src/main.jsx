import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// ==========================================
// GLOBAL FETCH INTERCEPTOR (Unified Authentication & Error Interception)
// ==========================================
const originalFetch = window.fetch;
window.fetch = async function (url, options = {}) {
  const token = localStorage.getItem('aiva_access_token');
  const isApi = typeof url === 'string' && url.startsWith('/api/');

  // 1. Request Interception: Auto-attach Bearer Token for backend API routes
  if (isApi && token) {
    options.headers = {
      'Authorization': `Bearer ${token}`,
      ...options.headers
    };
  }

  try {
    const response = await originalFetch(url, options);

    // 2. Response Interception: Handle session expiration or privilege mismatch (401 / 403)
    if (isApi && (response.status === 401 || response.status === 403)) {
      console.warn('[AIVA Interceptor] Auth error (401/403) detected on:', url);
      
      const isLoginOrAuth = url.includes('/auth/login') || url.includes('/auth/register');
      if (!isLoginOrAuth) {
        localStorage.removeItem('aiva_access_token');
        localStorage.removeItem('aiva_user');
        
        // Dispatch global event for the React router to trigger logout cleanly
        window.dispatchEvent(new Event('aiva_logout'));
        
        // Hard-redirect to landing page if inside dashboard routes
        if (window.location.pathname !== '/') {
          window.location.href = '/';
        }
      }
    }
    return response;
  } catch (error) {
    throw error;
  }
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
