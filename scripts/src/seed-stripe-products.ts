/**
 * Creates AuditNexus service packages in Stripe.
 * Run: pnpm --filter @workspace/scripts exec tsx src/seed-stripe-products.ts
 *
 * Idempotent — safe to run multiple times.
 */
import { getUncachableStripeClient } from './stripeClient';

const PACKAGES = [
  {
    name: 'AuditNexus SEO Basic',
    description: 'Single-site SEO audit with technical analysis, keyword gaps, and recommendations report.',
    amount: 50000,   // $500
    currency: 'usd',
    metadata: { tier: 'basic', category: 'seo-audit' },
  },
  {
    name: 'AuditNexus SEO Professional',
    description: 'Full SEO + GEO audit with competitor analysis, content strategy, and implementation roadmap.',
    amount: 120000,  // $1,200
    currency: 'usd',
    metadata: { tier: 'pro', category: 'seo-geo-audit' },
  },
  {
    name: 'AuditNexus Enterprise',
    description: 'Complete SEO/GEO/AEO audit suite with monthly reporting, AI visibility analysis, and dedicated support.',
    amount: 240000,  // $2,400
    currency: 'usd',
    metadata: { tier: 'enterprise', category: 'full-audit' },
  },
  {
    name: 'AuditNexus Custom Project',
    description: 'Custom-scoped audit engagement — price set per contract.',
    amount: 100000,  // $1,000 placeholder; actual price created per-contract
    currency: 'usd',
    metadata: { tier: 'custom', category: 'custom' },
  },
];

async function seedProducts() {
  const stripe = await getUncachableStripeClient();
  console.log('Seeding AuditNexus products in Stripe...\n');

  for (const pkg of PACKAGES) {
    // Check if already exists
    const existing = await stripe.products.search({
      query: `name:'${pkg.name}' AND active:'true'`,
    });

    if (existing.data.length > 0) {
      console.log(`✓ Already exists: ${pkg.name} (${existing.data[0].id})`);
      const prices = await stripe.prices.list({ product: existing.data[0].id, active: true });
      if (prices.data.length > 0) {
        console.log(`  └─ Price: $${prices.data[0].unit_amount! / 100} (${prices.data[0].id})\n`);
      }
      continue;
    }

    const product = await stripe.products.create({
      name: pkg.name,
      description: pkg.description,
      metadata: pkg.metadata,
    });

    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: pkg.amount,
      currency: pkg.currency,
    });

    console.log(`✅ Created: ${pkg.name}`);
    console.log(`   Product ID: ${product.id}`);
    console.log(`   Price ID:   ${price.id}`);
    console.log(`   Amount:     $${pkg.amount / 100}\n`);
  }

  console.log('Done. Webhooks will sync products to the local database automatically.');
}

seedProducts().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
