const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'dummy_key');
const prisma = require('../config/db');

// Map plans to Stripe Price IDs (use env or default to fallback keys)
const PRICE_MAP = {
  BASIC: {
    monthly: process.env.STRIPE_PRICE_BASIC_MONTHLY || 'price_dummy_basic_monthly',
    halfYear: process.env.STRIPE_PRICE_BASIC_HALF_YEAR || 'price_dummy_basic_half_year',
    yearly: process.env.STRIPE_PRICE_BASIC_YEARLY || 'price_dummy_basic_yearly',
  },
  PRO: {
    monthly: process.env.STRIPE_PRICE_PRO_MONTHLY || 'price_dummy_pro_monthly',
    halfYear: process.env.STRIPE_PRICE_PRO_HALF_YEAR || 'price_dummy_pro_half_year',
    yearly: process.env.STRIPE_PRICE_PRO_YEARLY || 'price_dummy_pro_yearly',
  },
  ADVANCED: {
    monthly: process.env.STRIPE_PRICE_ADVANCED_MONTHLY || 'price_dummy_advanced_monthly',
    halfYear: process.env.STRIPE_PRICE_ADVANCED_HALF_YEAR || 'price_dummy_advanced_half_year',
    yearly: process.env.STRIPE_PRICE_ADVANCED_YEARLY || 'price_dummy_advanced_yearly',
  }
};

const MOCK_PRICES = {
  BASIC: { monthly: 990, halfYear: 5643, yearly: 10098 },
  PRO: { monthly: 4900, halfYear: 27930, yearly: 49980 },
  ADVANCED: { monthly: 11900, halfYear: 67830, yearly: 121380 }
};

/**
 * Creates a Stripe Checkout Session for a subscription plan
 */
const createCheckoutSession = async (req, res, next) => {
  try {
    const clientId = req.user.clientId;
    const { plan, billingCycle, paymentMethod } = req.body; // plan: 'BASIC' | 'PRO' | 'ADVANCED', billingCycle: 'monthly' | 'halfYear' | 'yearly', paymentMethod: 'card' | 'promptpay'
    const origin = req.get('origin') || process.env.FRONTEND_URL || 'http://localhost:3000';

    if (!clientId) {
      return res.status(400).json({ error: 'User does not belong to any client tenant.' });
    }

    if (!plan || !['BASIC', 'PRO', 'ADVANCED'].includes(plan)) {
      return res.status(400).json({ error: 'Valid plan (BASIC, PRO or ADVANCED) is required.' });
    }

    if (!billingCycle || !['monthly', 'halfYear', 'yearly'].includes(billingCycle)) {
      return res.status(400).json({ error: 'Valid billingCycle (monthly, halfYear, or yearly) is required.' });
    }

    const priceId = PRICE_MAP[plan][billingCycle];

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
      if (billingCycle === 'yearly') {
        targetEnd.setDate(targetEnd.getDate() + 365);
      } else if (billingCycle === 'halfYear') {
        targetEnd.setDate(targetEnd.getDate() + 180);
      } else {
        targetEnd.setDate(targetEnd.getDate() + 30);
      }
      
      const updatedClient = await prisma.client.update({
        where: { id: clientId },
        data: {
          plan,
          billingCycle: billingCycle,
          status: 'ACTIVE',
          currentPeriodEnd: targetEnd,
        }
      });

      return res.json({ 
        url: `${origin}/settings?mock_payment=success`,
        message: 'Mock payment success - plan upgraded directly in dev mode.',
        client: updatedClient
      });
    }

    const method = paymentMethod === 'promptpay' ? 'promptpay' : 'card';
    const checkoutMode = method === 'promptpay' ? 'payment' : 'subscription';

    // Construct unified VAT 7% inclusive pricing for both promptpay (one-time) and card (subscription)
    const lineItems = [{
      price_data: {
        currency: 'thb',
        product_data: {
          name: `AIVA ${plan} Plan - ${billingCycle === 'monthly' ? 'รายเดือน' : billingCycle === 'halfYear' ? 'ราย 6 เดือน' : 'รายปี'} (รวม VAT 7%)`,
        },
        unit_amount: Math.round(MOCK_PRICES[plan][billingCycle] * 1.07 * 100),
        ...(method === 'card' ? {
          recurring: {
            interval: billingCycle === 'yearly' ? 'year' : 'month',
            interval_count: billingCycle === 'halfYear' ? 6 : 1
          }
        } : {})
      },
      quantity: 1
    }];

    // Create session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: [method],
      line_items: lineItems,
      mode: checkoutMode,
      customer_email: client.owner.email,
      metadata: { 
        clientId: client.id, 
        plan, 
        billingCycle: billingCycle 
      },
      success_url: `${origin}/settings?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/settings?payment=cancelled`,
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
        if (billingCycle === 'yearly') {
          targetEnd.setDate(targetEnd.getDate() + 365);
        } else if (billingCycle === 'halfYear') {
          targetEnd.setDate(targetEnd.getDate() + 180);
        } else {
          targetEnd.setDate(targetEnd.getDate() + 30);
        }

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
