// @ts-nocheck
import { db } from '@workspace/db';
import { sql } from 'drizzle-orm';

async function main() {
  const res = await db.execute(
    sql`SELECT tablename FROM pg_tables WHERE schemaname='stripe' ORDER BY tablename`
  );
  const tables = res.rows.map((r: any) => r.tablename);
  if (tables.length === 0) {
    console.log('NO TABLES in stripe schema');
  } else {
    console.log('stripe tables:', tables.join(', '));
  }
  process.exit(0);
}

main().catch((e) => { console.error(e.message); process.exit(1); });
