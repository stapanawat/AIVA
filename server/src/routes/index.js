const express = require('express');
const authRoutes = require('./authRoutes');
const clientRoutes = require('./clientRoutes');
const partnerRoutes = require('./partnerRoutes');
const adminRoutes = require('./adminRoutes');
const paymentRoutes = require('./paymentRoutes');
const webhookRoutes = require('./webhookRoutes');
const widgetRoutes = require('./widgetRoutes');

const router = express.Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/client', clientRoutes);
router.use('/partner', partnerRoutes);
router.use('/admin', adminRoutes);
router.use('/payments', paymentRoutes);
router.use('/webhooks', webhookRoutes);
router.use('/widget', widgetRoutes);

module.exports = router;
