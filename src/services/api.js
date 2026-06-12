// ==========================================
// AIVA - API Service Layer
// ใช้เป็น abstraction layer ระหว่าง mock กับ production
// ==========================================
import { USE_MOCK } from '../config';
import {
  MOCK_STATS, MOCK_KNOWLEDGE, MOCK_INBOX_LIST, MOCK_CHATS,
  MOCK_LEADS, MOCK_RULES, MOCK_PIPELINE, MOCK_BRANCHES,
  MOCK_LEAD_SCORES, MOCK_LOST_REVENUES, MOCK_FEEDBACK_LIST,
  MOCK_TEAM_MEMBERS,
  MOCK_PARTNERS, MOCK_CUSTOMERS, MOCK_PAYOUT_DATA, MOCK_TICKETS, MOCK_ANNOUNCEMENTS,
  MOCK_TRACKING_LINKS, MOCK_SUB_PARTNERS, MOCK_REPLY_COMMENTS, MOCK_BILLING_HISTORY
} from '../data/mockData';

// ==========================================
// BASE API HELPERS
// ==========================================
const getToken = () => localStorage.getItem('aiva_access_token');

const apiRequest = async (url, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers
  };

  const res = await fetch(url, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || `API Error: ${res.status}`);
  }

  return data;
};

export const apiGet = (url) => apiRequest(url);
export const apiPost = (url, body) => apiRequest(url, { method: 'POST', body: JSON.stringify(body) });

// ==========================================
// PLATFORM API
// ==========================================
export const fetchDashboardStats = async () => {
  if (USE_MOCK) return MOCK_STATS;
  return apiGet('/api/client/stats');
};

export const fetchKnowledge = async () => {
  if (USE_MOCK) return MOCK_KNOWLEDGE;
  return apiGet('/api/client/knowledge');
};

export const fetchInboxList = async () => {
  if (USE_MOCK) return MOCK_INBOX_LIST;
  return apiGet('/api/client/inbox');
};

export const fetchChatMessages = async (chatId) => {
  if (USE_MOCK) return MOCK_CHATS[chatId] || [];
  return apiGet(`/api/client/inbox/${chatId}/messages`);
};

export const fetchLeads = async () => {
  if (USE_MOCK) return MOCK_LEADS;
  try {
    const data = await apiGet('/api/client/leads');
    const list = [];
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
    return list;
  } catch (err) {
    console.warn('Failed to fetch leads:', err);
    return [];
  }
};

export const fetchPipeline = async () => {
  if (USE_MOCK) return MOCK_PIPELINE;
  return apiGet('/api/client/pipeline');
};

export const fetchBranches = async () => {
  if (USE_MOCK) return MOCK_BRANCHES;
  return apiGet('/api/client/branches');
};

export const fetchTeamMembers = async () => {
  if (USE_MOCK) return MOCK_TEAM_MEMBERS;
  try {
    const data = await apiGet('/api/client/team');
    const list = [];
    data.forEach(m => {
      const formatted = {
        id: m.id, name: m.name, email: m.email, role: m.role,
        status: m.status === 'ACTIVE' ? 'Active' : 'Pending',
        branch: 'All Branches'
      };
      const idx = list.findIndex(item => item.email === formatted.email);
      if (idx > -1) { list[idx] = { ...list[idx], ...formatted }; } 
      else { list.push(formatted); }
    });
    return list;
  } catch (err) {
    console.warn('Failed to fetch team:', err);
    return [];
  }
};

export const fetchBillingHistory = async () => {
  if (USE_MOCK) return MOCK_BILLING_HISTORY;
  return apiGet('/api/client/billing-history');
};

// ==========================================
// SUPER ADMIN API
// ==========================================
export const fetchPartners = async () => {
  if (USE_MOCK) return MOCK_PARTNERS;
  try {
    const data = await apiGet('/api/admin/partners');
    const merged = [];
    data.forEach(dbPartner => {
      const idx = merged.findIndex(p => p.id === dbPartner.id);
      if (idx > -1) { merged[idx] = { ...merged[idx], ...dbPartner }; }
      else { merged.push(dbPartner); }
    });
    return merged;
  } catch (err) {
    console.warn('Failed to fetch partners:', err);
    return [];
  }
};

export const fetchCustomers = async () => {
  if (USE_MOCK) return MOCK_CUSTOMERS;
  return apiGet('/api/admin/customers');
};

export const fetchPayouts = async () => {
  if (USE_MOCK) return MOCK_PAYOUT_DATA;
  try {
    const data = await apiGet('/api/admin/payouts');
    const list = [];
    data.forEach(p => {
      const formatted = {
        id: p.id, partnerId: p.partner.id, name: p.partner.name,
        type: 'บุคคล',
        tier: p.partner.id === 'P88942' ? 'Gold(25%)' : 'Bronze(15%)',
        kyc: 'Approved',
        sales: p.amount / 0.25, comm: p.amount, wht: p.amount * 0.03, net: p.amount * 0.97,
        status: p.status === 'APPROVED' ? 'Paid' : p.status === 'REJECTED' ? 'Hold' : 'Ready'
      };
      const idx = list.findIndex(item => item.partnerId === formatted.partnerId);
      if (idx > -1) { list[idx] = { ...list[idx], ...formatted }; }
      else { list.push(formatted); }
    });
    const netTotal = list.reduce((sum, item) => sum + item.net, 0);
    const whtTotal = list.reduce((sum, item) => sum + item.wht, 0);
    return {
      '2026-06': { netTotal, whtTotal, count: list.length, hold: list.filter(item => item.status === 'Hold').length, list }
    };
  } catch (err) {
    console.warn('Failed to fetch payouts:', err);
    return { '2026-06': { netTotal: 0, whtTotal: 0, count: 0, hold: 0, list: [] } };
  }
};

export const fetchTickets = async () => {
  if (USE_MOCK) return MOCK_TICKETS;
  return apiGet('/api/admin/tickets');
};

export const fetchAnnouncements = async () => {
  if (USE_MOCK) return MOCK_ANNOUNCEMENTS;
  return apiGet('/api/admin/announcements');
};

// ==========================================
// PARTNER API
// ==========================================
export const fetchTrackingLinks = async () => {
  if (USE_MOCK) return MOCK_TRACKING_LINKS;
  return apiGet('/api/partner/tracking');
};

export const fetchSubPartners = async () => {
  if (USE_MOCK) return MOCK_SUB_PARTNERS;
  return apiGet('/api/partner/sub-partners');
};

// ==========================================
// RE-EXPORT MOCK DATA for backward compatibility
// Pages ที่ยังต้องใช้ mock data constants โดยตรง
// ==========================================
export {
  MOCK_STATS, MOCK_KNOWLEDGE, MOCK_INBOX_LIST, MOCK_CHATS,
  MOCK_LEADS, MOCK_RULES, MOCK_PIPELINE, MOCK_BRANCHES,
  MOCK_LEAD_SCORES, MOCK_LOST_REVENUES, MOCK_FEEDBACK_LIST,
  MOCK_TEAM_MEMBERS, MOCK_PARTNERS, MOCK_CUSTOMERS,
  MOCK_PAYOUT_DATA, MOCK_TICKETS, MOCK_ANNOUNCEMENTS,
  MOCK_TRACKING_LINKS, MOCK_SUB_PARTNERS, MOCK_REPLY_COMMENTS,
  MOCK_BILLING_HISTORY
};
