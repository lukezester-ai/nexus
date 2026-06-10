import { Router, type IRouter } from 'express';
import { stripeStorage } from '../stripeStorage';
import { getUncachableStripeClient } from '../stripeClient';

const router: IRouter = Router();

router.get('/stripe/products', async (req, res) => {
  try {
    const rows = await stripeStorage.listProductsWithPrices();
    const productsMap = new Map<string, any>();
    for (const row of rows) {
      if (!productsMap.has(row.product_id as string)) {
        productsMap.set(row.product_id as string, {
          id: row.product_id,
          name: row.product_name,
          description: row.product_description,
          active: row.product_active,
          metadata: row.product_metadata,
          prices: [],
        });
      }
      if (row.price_id) {
        productsMap.get(row.product_id as string).prices.push({
          id: row.price_id,
          unitAmount: row.unit_amount,
          currency: row.currency,
          recurring: row.recurring,
          active: row.price_active,
        });
      }
    }
    res.json({ data: Array.from(productsMap.values()) });
  } catch (err) {
    req.log.error({ err }, 'Failed to list Stripe products');
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

router.post('/stripe/checkout', async (req, res) => {
  const { priceId, clientEmail, contractId, successUrl, cancelUrl } = req.body;
  if (!priceId || typeof priceId !== 'string') {
    return res.status(400).json({ error: 'priceId is required' });
  }
  const baseUrl = `https://${process.env.REPLIT_DOMAINS?.split(',')[0]}`;

  try {
    const stripe = await getUncachableStripeClient();

    const price = await stripeStorage.getPrice(priceId);
    if (!price) {
      return res.status(404).json({ error: 'Price not found' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: (price.recurring ? 'subscription' : 'payment') as 'subscription' | 'payment',
      customer_email: clientEmail,
      metadata: contractId ? { contractId: String(contractId) } : {},
      success_url: successUrl ?? `${baseUrl}/audit-nexus/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl ?? `${baseUrl}/audit-nexus/payment/cancel`,
    });

    res.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    req.log.error({ err }, 'Failed to create checkout session');
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

router.get('/stripe/session/:sessionId', async (req, res) => {
  try {
    const stripe = await getUncachableStripeClient();
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
    res.json({
      id: session.id,
      status: session.payment_status,
      customerEmail: session.customer_email,
      amountTotal: session.amount_total,
      currency: session.currency,
      metadata: session.metadata,
    });
  } catch (err) {
    req.log.error({ err }, 'Failed to get checkout session');
    res.status(500).json({ error: 'Failed to get session' });
  }
});

export default router;
