import app from "./app";
import { logger } from "./lib/logger";
import { runMigrations } from 'stripe-replit-sync';
import { getStripeSync } from './stripeClient';

async function initStripe() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    logger.warn('DATABASE_URL not set — skipping Stripe init');
    return;
  }
  try {
    logger.info('Initializing Stripe schema...');
    await runMigrations({ databaseUrl, schema: 'stripe' });
    logger.info('Stripe schema ready');

    const stripeSync = await getStripeSync();
    const webhookBaseUrl = `https://${process.env.REPLIT_DOMAINS?.split(',')[0]}`;
    await stripeSync.findOrCreateManagedWebhook(`${webhookBaseUrl}/api/stripe/webhook`);
    logger.info('Stripe webhook configured');

    stripeSync.syncBackfill()
      .then(() => logger.info('Stripe data synced'))
      .catch((err) => logger.error({ err }, 'Stripe backfill error'));
  } catch (err) {
    logger.warn({ err }, 'Stripe init failed — continuing without Stripe');
  }
}

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

import { db } from '@workspace/db';
import { sql } from 'drizzle-orm';

await initStripe();

try {
  logger.info('Running auto-migrations for audit_tasks...');
  await db.execute(sql`ALTER TABLE "audit_tasks" ADD COLUMN IF NOT EXISTS "details" text;`);
  logger.info('Auto-migrations complete.');
} catch (err) {
  logger.error({ err }, 'Failed to auto-migrate audit_tasks');
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
});
