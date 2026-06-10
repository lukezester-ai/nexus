import { pgTable, serial, text, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const auditsTable = pgTable("audits", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  clientName: text("client_name"),
  clientEmail: text("client_email"),
  status: text("status").notNull().default("pending"),
  seoScore: integer("seo_score"),
  geoScore: integer("geo_score"),
  aeoScore: integer("aeo_score"),
  overallScore: integer("overall_score"),
  seoData: jsonb("seo_data"),
  geoData: jsonb("geo_data"),
  aeoData: jsonb("aeo_data"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertAuditSchema = createInsertSchema(auditsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertAudit = z.infer<typeof insertAuditSchema>;
export type Audit = typeof auditsTable.$inferSelect;
