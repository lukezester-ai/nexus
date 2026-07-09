// @ts-nocheck
import Stripe from 'stripe';

async function getStripeCredentials(): Promise<{ secretKey: string }> {
  // Support direct env var for local/CI usage
  if (process.env.STRIPE_SECRET_KEY) {
    return { secretKey: process.env.STRIPE_SECRET_KEY };
  }

  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? "repl " + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
      ? "depl " + process.env.WEB_REPL_RENEWAL
      : null;

  if (!hostname || !xReplitToken) {
    throw new Error(
      'Missing Stripe credentials. Set STRIPE_SECRET_KEY env var or run in Replit with the Stripe connector connected.'
    );
  }

  const resp = await fetch(
    `https://${hostname}/api/v2/connection?include_secrets=true&connector_names=stripe`,
    {
      headers: { Accept: "application/json", X_REPLIT_TOKEN: xReplitToken },
      signal: AbortSignal.timeout(10_000),
    }
  );

  if (!resp.ok) {
    throw new Error(`Failed to fetch Stripe credentials: ${resp.status} ${resp.statusText}`);
  }

  const data = await resp.json();
  const settings = data.items?.[0]?.settings;

  const secretKey = settings?.secret ?? settings?.secret_key;
  if (!secretKey) {
    throw new Error(
      'Stripe integration not connected or missing secret key. ' +
      'Connect Stripe via the Integrations tab first.'
    );
  }

  return { secretKey };
}

export async function getUncachableStripeClient(): Promise<Stripe> {
  const { secretKey } = await getStripeCredentials();
  return new Stripe(secretKey);
}
