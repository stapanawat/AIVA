const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'dummy_key');
const prisma = require('../config/db');

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

module.exports = {
  createCheckoutSession,
  handleStripeWebhook
};
