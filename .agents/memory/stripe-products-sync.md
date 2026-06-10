---
name: Stripe products sync strategy
description: How to reliably serve Stripe products from the API when stripe-replit-sync backfill is incomplete.
---

`stripe-replit-sync`'s `syncBackfill()` may only sync a subset of products from Stripe into `stripe.products` (depends on timing and what events have fired). It is not reliable as a source of truth for product listings.

**Why:** When we seeded 4+ products via the Stripe API before the server had registered its webhook, the backfill only captured 1. The webhook events fired after the products were created but before the webhook was registered were lost.

**How to apply:** For the `/api/stripe/products` endpoint, query the Stripe API directly:
```ts
const products = await stripe.products.list({ active: true, limit: 20 });
```
Reserve `stripe.products` DB table for high-throughput webhook-driven analytics. Do NOT rely on it for primary product reads in routes.

Similarly, in the checkout route, find the "custom" product via `stripe.products.list()` not `stripeStorage.listProductsWithPrices()`.
