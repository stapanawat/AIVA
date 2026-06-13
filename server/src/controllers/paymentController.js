const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'dummy_key');
const prisma = require('../config/db');
const omiseService = require('../services/omiseService');

// Map plans to Stripe Price IDs (use env or default to fallback keys)
const PRICE_MAP = {
  PRO: {
    monthly: process.env.STRIPE_PRICE_PRO_MONTHLY || 'price_dummy_pro_monthly',
    yearly: process.env.STRIPE_PRICE_PRO_YEARLY || 'price_dummy_pro_yearly',
  },
  ADVANCED: {
    monthly: process.env.STRIPE_PRICE_ADVANCED_MONTHLY || 'price_dummy_advanced_monthly',
    yearly: process.env.STRIPE_PRICE_ADVANCED_YEARLY || 'price_dummy_advanced_yearly',
  }
};

/**
 * Creates a Stripe Checkout Session for a subscription plan
 */
const createCheckoutSession = async (req, res, next) => {
  try {
    const clientId = req.user.clientId;
    const { plan, billingCycle } = req.body; // plan: 'PRO' | 'ADVANCED', billingCycle: 'monthly' | 'yearly'

    if (!clientId) {
      return res.status(400).json({ error: 'User does not belong to any client tenant.' });
    }

    if (!plan || !['PRO', 'ADVANCED'].includes(plan)) {
      return res.status(400).json({ error: 'Valid plan (PRO or ADVANCED) is required.' });
    }

    const cycle = billingCycle === 'yearly' ? 'yearly' : 'monthly';
    const priceId = PRICE_MAP[plan][cycle];

    // Fetch client and owner's email
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      include: { owner: true }
    });

    if (!client) {
      return res.status(404).json({ error: 'Client workspace not found.' });
    }

    const isDevMode = process.env.PAYMENT_DEV_MODE === 'true' || 
                      !process.env.STRIPE_SECRET_KEY || 
                      process.env.STRIPE_SECRET_KEY === 'YOUR_STRIPE_SECRET_KEY' ||
                      process.env.STRIPE_SECRET_KEY === 'YOUR_TEST_STRIPE_SECRET_KEY' ||
                      process.env.STRIPE_SECRET_KEY === 'YOUR_PRODUCTION_STRIPE_SECRET_KEY';

    if (isDevMode) {
      // Mock mode if Stripe is not configured or dev mode is explicitly active
      console.warn('[Stripe Payment] Running in Dev Mode / Mock Mode. Simulating checkout URL.');
      
      // Simulate database update directly for easier dev testing
      const targetEnd = new Date();
      targetEnd.setDate(targetEnd.getDate() + (cycle === 'yearly' ? 365 : 30));
      
      const updatedClient = await prisma.client.update({
        where: { id: clientId },
        data: {
          plan,
          billingCycle: cycle,
          status: 'ACTIVE',
          currentPeriodEnd: targetEnd,
        }
      });

      return res.json({ 
        url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/settings?mock_payment=success`,
        message: 'Mock payment success - plan upgraded directly in dev mode.',
        client: updatedClient
      });
    }

    // Create session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      customer_email: client.owner.email,
      metadata: { 
        clientId: client.id, 
        plan, 
        billingCycle: cycle 
      },
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/settings?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/settings?payment=cancelled`,
    });

    res.json({ url: session.url });
  } catch (error) {
    next(error);
  }
};

/**
 * Handles Stripe Webhooks
 */
const handleStripeWebhook = async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return res.status(400).json({ error: 'Missing stripe signature or webhook secret.' });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
  } catch (err) {
    console.error(`[Stripe Webhook Verification Failed]: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    console.log(`[Stripe Webhook Event Received]: ${event.type}`);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const { clientId, plan, billingCycle } = session.metadata;

        const targetEnd = new Date();
        targetEnd.setDate(targetEnd.getDate() + (billingCycle === 'yearly' ? 365 : 30));

        await prisma.client.update({
          where: { id: clientId },
          data: {
            plan,
            billingCycle,
            status: 'ACTIVE',
            stripeCustomerId: session.customer,
            stripeSubscriptionId: session.subscription,
            currentPeriodEnd: targetEnd
          }
        });
        console.log(`[Stripe Billing SUCCESS]: Upgraded client ${clientId} to ${plan} (${billingCycle})`);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        if (!invoice.subscription) break;

        // Retrieve subscription details to find the end date
        const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
        const currentPeriodEnd = new Date(subscription.current_period_end * 1000);

        await prisma.client.updateMany({
          where: { stripeSubscriptionId: invoice.subscription },
          data: {
            status: 'ACTIVE',
            currentPeriodEnd
          }
        });
        console.log(`[Stripe Renewal SUCCESS]: Renewed subscription ${invoice.subscription} to ${currentPeriodEnd}`);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        if (!invoice.subscription) break;

        await prisma.client.updateMany({
          where: { stripeSubscriptionId: invoice.subscription },
          data: {
            status: 'PAST_DUE'
          }
        });
        console.log(`[Stripe Renewal FAILED]: Subscription ${invoice.subscription} set to PAST_DUE`);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;

        await prisma.client.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            status: 'CANCELLED'
          }
        });
        console.log(`[Stripe Subscription DELETED]: Subscription ${subscription.id} set to CANCELLED`);
        break;
      }

      default:
        console.log(`Unhandled Stripe event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('[Stripe Webhook Handler Error]:', error);
    res.status(500).json({ error: 'Internal server error processing webhook.' });
  }
};

/**
 * Creates an Omise Charge (PromptPay or Card) for a subscription plan
 */
const createOmiseCheckoutSession = async (req, res, next) => {
  try {
    const clientId = req.user.clientId;
    const { plan, billingCycle, paymentMethod } = req.body; // plan: 'BASIC' | 'PRO' | 'ADVANCED', paymentMethod: 'promptpay' | 'card'

    if (!clientId) {
      return res.status(400).json({ error: 'User does not belong to any client tenant.' });
    }

    const validPlans = ['BASIC', 'PRO', 'ADVANCED'];
    if (!plan || !validPlans.includes(plan)) {
      return res.status(400).json({ error: 'Valid plan (BASIC, PRO or ADVANCED) is required.' });
    }

    const cycle = billingCycle === 'yearly' ? 'yearly' : 'monthly';
    const method = paymentMethod === 'card' ? 'card' : 'promptpay';

    // Pricing calculation
    const OMISE_PRICES = {
      BASIC: { monthly: 990, yearly: 10098 },
      PRO: { monthly: 4900, yearly: 49980 },
      ADVANCED: { monthly: 11900, yearly: 121380 }
    };

    const baseAmount = OMISE_PRICES[plan][cycle];
    const totalAmount = baseAmount * 1.07; // Add 7% VAT

    // Fetch client
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      include: { owner: true }
    });

    if (!client) {
      return res.status(404).json({ error: 'Client workspace not found.' });
    }

    // If running in Mock Mode / Dev Mode
    if (omiseService.isDevMode) {
      console.warn('[Omise Payment] Running in Dev Mode / Mock Mode. Simulating checkout.');
      
      const targetEnd = new Date();
      targetEnd.setDate(targetEnd.getDate() + (cycle === 'yearly' ? 365 : 30));

      const updatedClient = await prisma.client.update({
        where: { id: clientId },
        data: {
          plan,
          billingCycle: cycle,
          status: 'ACTIVE',
          currentPeriodEnd: targetEnd,
        }
      });

      return res.json({
        url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/settings?mock_payment=success`,
        status: 'successful',
        chargeId: `chg_mock_${Math.random().toString(36).substring(2)}`,
        qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://aiva.sparexth.com/mock-pay/client/' + clientId,
        client: updatedClient
      });
    }

    // Production flow
    let charge;
    if (method === 'promptpay') {
      const source = await omiseService.createPromptPaySource(totalAmount);
      charge = await omiseService.createCharge({
        amount: totalAmount,
        source: source.id,
        metadata: {
          clientId: client.id,
          plan,
          billingCycle: cycle,
          gateway: 'OMISE'
        }
      });
    } else {
      // For Card payments, the frontend passes a token (req.body.token)
      const { token } = req.body;
      if (!token) {
        return res.status(400).json({ error: 'Card token is required for credit card payment.' });
      }
      charge = await omiseService.createCharge({
        amount: totalAmount,
        card: token,
        metadata: {
          clientId: client.id,
          plan,
          billingCycle: cycle,
          gateway: 'OMISE'
        }
      });
    }

    const qrCodeUrl = charge.source?.scannable_code?.image?.download_uri || null;

    res.json({
      chargeId: charge.id,
      status: charge.status,
      qrCodeUrl,
      url: charge.authorize_uri || null
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handles Omise Webhook events
 */
const handleOmiseWebhook = async (req, res, next) => {
  try {
    const { key, data } = req.body; // Omise webhooks have format { key: 'charge.complete', data: { ... } }
    console.log(`[Omise Webhook Event Received]: ${key}`);

    if (key === 'charge.complete' && data && data.status === 'successful') {
      const { clientId, plan, billingCycle } = data.metadata || {};

      if (clientId && plan && billingCycle) {
        const targetEnd = new Date();
        targetEnd.setDate(targetEnd.getDate() + (billingCycle === 'yearly' ? 365 : 30));

        await prisma.client.update({
          where: { id: clientId },
          data: {
            plan,
            billingCycle,
            status: 'ACTIVE',
            currentPeriodEnd: targetEnd
          }
        });
        console.log(`[Omise Billing SUCCESS]: Upgraded client ${clientId} to ${plan} (${billingCycle})`);
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('[Omise Webhook Handler Error]:', error);
    res.status(500).json({ error: 'Internal server error processing webhook.' });
  }
};

module.exports = {
  createCheckoutSession,
  handleStripeWebhook,
  createOmiseCheckoutSession,
  handleOmiseWebhook
};
