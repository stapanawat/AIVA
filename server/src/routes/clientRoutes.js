const express = require('express');
const clientController = require('../controllers/clientController');
const integrationController = require('../controllers/integrationController');
const authenticate = require('../middlewares/auth');
const { authorizeRoles, checkTenantAccess } = require('../middlewares/authorize');
const { createLeadRules = null } = require('../middlewares/validate') || {}; // Safely handle if validate doesn't export it
const multer = require('multer');

const router = express.Router();

// Configure Multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Public OAuth Callback for integrations (Must be before authentication middleware)
router.get('/integrations/oauth/:platform/callback', integrationController.handleOAuthCallback);

// Apply authentication and client role access controls
router.use(authenticate);
router.use(authorizeRoles('CLIENT_OWNER', 'CLIENT_ADMIN', 'CLIENT_STAFF'));

// Stats
router.get('/dashboard/stats', clientController.getDashboardStats);

// Knowledge Base
router.get('/knowledge', clientController.getKnowledgeBase);
router.post('/knowledge', upload.single('file'), clientController.createKnowledgeEntry);

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
router.get('/settings', clientController.getSettings);
router.post('/settings', clientController.updateSettings);

// Integrations
router.get('/integrations', integrationController.getIntegrations);
router.post('/integrations', integrationController.connectIntegration);
router.delete('/integrations/:platform', integrationController.disconnectIntegration);
router.get('/integrations/oauth/:platform', integrationController.startOAuth);

// AI Copy Generation
router.post('/ai/content-gen', clientController.generateAIContent);

// Branches
router.get('/branches', clientController.getBranches);
router.post('/branches', clientController.createBranch);

// Rules
router.get('/rules', clientController.getFollowUpRules);
router.post('/rules', clientController.createFollowUpRule);
router.put('/rules/:id/toggle', clientController.toggleFollowUpRule);

// Feedback
router.get('/feedback', clientController.getFeedbacks);
router.post('/feedback', clientController.createFeedback);

// Lead Scores & Lost Revenues
router.get('/lead-scores', clientController.getLeadScores);
router.get('/lost-revenues', clientController.getLostRevenues);

module.exports = router;
