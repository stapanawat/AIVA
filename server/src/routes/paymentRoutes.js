const express = require('express');
const paymentController = require('../controllers/paymentController');
const authenticate = require('../middlewares/auth');

const router = express.Router();

// Public webhook routes (Stripe calls this endpoint)
router.post('/webhook', paymentController.handleStripeWebhook);

// Protected routes to initiate checkout sessions
router.post('/checkout', authenticate, paymentController.createCheckoutSession);

module.exports = router;
