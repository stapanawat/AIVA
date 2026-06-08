const express = require('express');
const paymentController = require('../controllers/paymentController');
const authenticate = require('../middlewares/auth');

const router = express.Router();

// Public webhook route (Stripe calls this endpoint)
router.post('/webhook', paymentController.handleStripeWebhook);

// Protected route to initiate a checkout session
router.post('/checkout', authenticate, paymentController.createCheckoutSession);

module.exports = router;
