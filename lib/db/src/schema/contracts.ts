import { pgTable, serial, text, integer, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const contractsTable = pgTable("contracts", {
  id: serial("id").primaryKey(),
  proposalId: integer("proposal_id"),
  clientId: integer("client_id"),
  clientName: text("client_name").notNull(),
  clientEmail: text("client_email").notNull(),
  title: text("title").notNull(),
  content: text("content"),
  totalAmount: numeric("total_amount", { precision: 12, scale: 2 }),
  currency: text("currency").notNull().default("BGN"),
  status: text("status").notNull().default("draft"),
  signedAt: timestamp("signed_at", { withTimezone: true }),
  startDate: timestamp("start_date", { withTimezone: true }),
  endDate: timestamp("end_date", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertContractSchema = createInsertSchema(contractsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertContract = z.infer<typeof insertContractSchema>;
export type Contract = typeof contractsTable.$inferSelect;
