const express = require('express');
const clientController = require('../controllers/clientController');
const authenticate = require('../middlewares/auth');
const { authorizeRoles, checkTenantAccess } = require('../middlewares/authorize');
const { createLeadRules } = require('../middlewares/validate');

const router = express.Router();

// Apply authentication and client role access controls
router.use(authenticate);
router.use(authorizeRoles('CLIENT_OWNER', 'CLIENT_ADMIN', 'CLIENT_STAFF'));

// Stats
router.get('/dashboard/stats', clientController.getDashboardStats);

// Knowledge Base
router.get('/knowledge', clientController.getKnowledgeBase);
router.post('/knowledge', clientController.createKnowledgeEntry);

// Live Chats (with BOLA/IDOR protection middleware)
router.get('/chats', clientController.getChats);
router.get('/chats/:id/messages', checkTenantAccess('chat'), clientController.getChatMessages);
router.post('/chats/:id/send', checkTenantAccess('chat'), clientController.sendChatMessage);

// Leads / CRM
router.get('/leads', clientController.getLeads);
router.post('/leads', createLeadRules, clientController.createOrUpdateLead);

// Team Management
router.get('/team', clientController.getTeamMembers);
router.post('/team/invite', clientController.inviteTeamMember);

// System Settings
router.post('/settings', clientController.updateSettings);

// AI Copy Generation
router.post('/ai/content-gen', clientController.generateAIContent);

module.exports = router;
