const express = require('express');
const adminController = require('../controllers/adminController');
const authenticate = require('../middlewares/auth');
const { authorizeRoles } = require('../middlewares/authorize');

const router = express.Router();

// Apply authentication and restrict all routes to SUPER_ADMIN role only
router.use(authenticate);
router.use(authorizeRoles('SUPER_ADMIN'));

router.get('/partners', adminController.getPartners);
router.post('/partners/:id/kyc', adminController.updatePartnerKyc);
router.get('/payouts', adminController.getPayouts);
router.post('/payouts/:id/approve', adminController.approvePayout);
router.post('/broadcast', adminController.createAnnouncement);
router.get('/announcements', adminController.getAnnouncements);
router.get('/tickets', adminController.getTickets);
router.get('/customers', adminController.getCustomers);

module.exports = router;
