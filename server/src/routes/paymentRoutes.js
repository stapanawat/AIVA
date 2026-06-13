const express = require('express');
const paymentController = require('../controllers/paymentController');
const authenticate = require('../middlewares/auth');

const router = express.Router();

// Public webhook routes (Stripe and Omise call these endpoints)
router.post('/webhook', paymentController.handleStripeWebhook);
router.post('/omise/webhook', paymentController.handleOmiseWebhook);

// Protected routes to initiate checkout sessions
router.post('/checkout', authenticate, paymentController.createCheckoutSession);
router.post('/omise/checkout', authenticate, paymentController.createOmiseCheckoutSession);

module.exports = router;
