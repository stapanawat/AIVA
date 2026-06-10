const express = require('express');
const partnerController = require('../controllers/partnerController');
const authenticate = require('../middlewares/auth');
const { authorizeRoles } = require('../middlewares/authorize');

const router = express.Router();

// Apply authentication and partner role checks
router.use(authenticate);
router.use(authorizeRoles('PARTNER_MAIN', 'PARTNER_SUB'));

router.get('/stats', partnerController.getPartnerStats);
router.get('/referrals', partnerController.getReferrals);
router.post('/referrals', partnerController.createReferralLink);
router.get('/network', partnerController.getSubPartners);
router.get('/payouts', partnerController.getPayouts);
router.post('/payouts/request', partnerController.requestPayout);
router.get('/clients', partnerController.getClients);

module.exports = router;
