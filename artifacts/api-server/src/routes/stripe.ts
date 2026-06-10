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

/**
 * POST /api/stripe/checkout
 *
 * Two modes:
 * 1. Standard package: { priceId }
 * 2. Contract checkout: { contractId, contractAmount (cents), contractTitle, clientEmail }
 *    → creates a one-time price for the contract amount, then opens checkout
 */
router.post('/stripe/checkout', async (req, res) => {
  const { priceId, contractId, contractAmount, contractTitle, clientEmail, successUrl, cancelUrl } = req.body;
  const baseUrl = `https://${process.env.REPLIT_DOMAINS?.split(',')[0]}`;
  const successRedirect = successUrl ?? `${baseUrl}/audit-nexus/payment/success?session_id={CHECKOUT_SESSION_ID}`;
  const cancelRedirect = cancelUrl ?? `${baseUrl}/audit-nexus/payment/cancel`;

  try {
    const stripe = await getUncachableStripeClient();

    let resolvedPriceId: string;

    if (priceId && typeof priceId === 'string') {
      // Mode 1: use a pre-existing Stripe price
      const price = await stripeStorage.getPrice(priceId);
      if (!price) return res.status(404).json({ error: 'Price not found' });
      resolvedPriceId = priceId;
    } else if (contractAmount && typeof contractAmount === 'number' && contractAmount > 0) {
      // Mode 2: create a one-time price for this specific contract
      // First, find the "AuditNexus Custom Project" product (or any active product)
      const products = await stripeStorage.listProductsWithPrices();
      const customProduct = products.find((r: any) =>
        r.product_metadata && r.product_metadata.tier === 'custom'
      );

      let productId: string;
      if (customProduct) {
        productId = customProduct.product_id as string;
      } else {
        // Fallback: create a minimal product on the fly
        const p = await stripe.products.create({
          name: 'AuditNexus Custom Project',
          metadata: { tier: 'custom', category: 'custom' },
        });
        productId = p.id;
      }

      // Create a fresh one-time price for this contract's amount
      const price = await stripe.prices.create({
        product: productId,
        unit_amount: contractAmount,
        currency: 'usd',
        metadata: contractId ? { contractId: String(contractId) } : {},
      });
      resolvedPriceId = price.id;
    } else {
      return res.status(400).json({ error: 'Provide either priceId or contractAmount' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: resolvedPriceId, quantity: 1 }],
      mode: 'payment',
      customer_email: clientEmail,
      metadata: contractId ? { contractId: String(contractId) } : {},
      payment_intent_data: {
        description: contractTitle ? `AuditNexus — ${contractTitle}` : 'AuditNexus Service',
        metadata: contractId ? { contractId: String(contractId) } : {},
      },
      success_url: successRedirect,
      cancel_url: cancelRedirect,
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
