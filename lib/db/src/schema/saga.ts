import { pgTable, text, varchar, timestamp, jsonb } from "drizzle-orm/pg-core";

export const sagaStateTable = pgTable("saga_state", {
  correlationId: text("correlation_id").primaryKey(),
  step: varchar("step", { length: 50 }),
  data: jsonb("data"),
  status: varchar("status", { length: 20 }), // pending, completed, failed
  createdAt: timestamp("created_at").defaultNow(),
});
