---
name: Stripe connector credentials key
description: The Replit Stripe integration stores the API secret under a different key than expected.
---

The Replit Stripe connector returns `settings.secret` (not `settings.secret_key`) for the Stripe secret API key.
The publishable key is `settings.publishable`. Account ID is `settings.account_id`.

**Why:** The skill template used `settings.secret_key` but the actual connector JSON shape uses `settings.secret`. This caused silent failures where credentials appeared connected but Stripe returned "missing secret key".

**How to apply:** In any `getStripeCredentials()` function, read as:
```ts
const secretKey = settings?.secret ?? settings?.secret_key;
```
The fallback `?? settings?.secret_key` is kept for forward compatibility.
