import { getUncachableStripeClient } from './stripeClient.js';

async function main() {
  const stripe = await getUncachableStripeClient();
  const products = await stripe.products.list({ active: true, limit: 20 });
  console.log(`Found ${products.data.length} active products in Stripe:`);
  for (const p of products.data) {
    const prices = await stripe.prices.list({ product: p.id, active: true });
    const amount = prices.data[0]?.unit_amount;
    console.log(`  ${p.name} | ${p.id} | $${amount ? amount / 100 : 'N/A'}`);
  }
}

main().catch((e) => { console.error(e.message); process.exit(1); });
