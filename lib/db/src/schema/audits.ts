import { pgTable, text, timestamp, integer, uuid, boolean, jsonb } from "drizzle-orm/pg-core";

export const auditsTable = pgTable("audits", {
  id: uuid("id").defaultRandom().primaryKey(),
  url: text("url").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  userId: text("user_id"), // Optional if anonymous initially

  aiReadabilityScore: integer("ai_readability_score").default(0),
  aiReadabilityPotential: integer("ai_readability_potential").default(0),
  
  answerReadyScore: integer("answer_ready_score").default(0),
  answerReadyPotential: integer("answer_ready_potential").default(0),
  
  trustAuthorityScore: integer("trust_authority_score").default(0),
  trustAuthorityPotential: integer("trust_authority_potential").default(0),
  
  platformPresenceScore: integer("platform_presence_score").default(0),
  platformPresencePotential: integer("platform_presence_potential").default(0),
  
  status: text("status").default("pending"), // pending, running, completed, failed
  
  // Proposal Engine JSON output
  timelineJson: jsonb("timeline_json"), 
  clientApproved: boolean("client_approved").default(false),
  pdfUrl: text("pdf_url")
});

export const auditTasksTable = pgTable("audit_tasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  auditId: uuid("audit_id").references(() => auditsTable.id).notNull(),
  
  name: text("name").notNull(),
  priority: text("priority").notNull(), // DONE, HIGH, MEDIUM, LOW
  hours: integer("hours").notNull().default(0),
  phase: text("phase").notNull(), // M1, M2, M3, M4, M5, M6
});
