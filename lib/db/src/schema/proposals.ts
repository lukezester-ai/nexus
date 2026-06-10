import { pgTable, serial, text, integer, numeric, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const proposalsTable = pgTable("proposals", {
  id: serial("id").primaryKey(),
  auditId: integer("audit_id"),
  clientId: integer("client_id"),
  clientName: text("client_name").notNull(),
  clientEmail: text("client_email").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  services: jsonb("services").notNull().default([]),
  totalPrice: numeric("total_price", { precision: 12, scale: 2 }).notNull().default("0"),
  currency: text("currency").notNull().default("BGN"),
  status: text("status").notNull().default("draft"),
  validUntil: timestamp("valid_until", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertProposalSchema = createInsertSchema(proposalsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertProposal = z.infer<typeof insertProposalSchema>;
export type Proposal = typeof proposalsTable.$inferSelect;
