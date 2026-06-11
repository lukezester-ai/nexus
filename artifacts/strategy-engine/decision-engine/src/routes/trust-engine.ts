import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, decisionsTable, validationsTable, trustScoresTable, contractsTable } from "@workspace/db";
import { z } from "zod/v4";

import { runAuditModule } from "../services/ai-evaluator";
import { draftLegalContract } from "../services/legal-agent";

const router: IRouter = Router();

// Zod schema for incoming decisions
const CreateDecisionBody = z.object({
  sourceAgent: z.string(),
  decisionType: z.string(),
  proposedAction: z.string(),
  context: z.record(z.any()).optional(),
});

router.post("/trust-engine/decisions", async (req, res): Promise<void> => {
  const parsed = CreateDecisionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [decision] = await db.insert(decisionsTable).values({
    sourceAgent: parsed.data.sourceAgent,
    decisionType: parsed.data.decisionType,
    proposedAction: parsed.data.proposedAction,
    context: parsed.data.context ?? null,
    status: "pending_audit",
  }).returning();

  res.status(201).json(decision);
});

router.post("/trust-engine/decisions/:id/validate", async (req, res): Promise<void> => {
  const decisionId = parseInt(req.params.id, 10);
  if (isNaN(decisionId)) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  const [decision] = await db.select().from(decisionsTable).where(eq(decisionsTable.id, decisionId));
  if (!decision) {
    res.status(404).json({ error: "Decision not found" });
    return;
  }

  // Define the audit modules for Nexus Trust Engine
  const modules = [
    "Source Verification Engine",
    "AI Reasoning Auditor",
    "Financial Impact Validator",
    "Legal Compliance Validator",
    "Historical Outcome Validator"
  ];

  let totalConf = 0;
  let highestRisk = "LOW";

  // Run AI evaluators
  for (const modName of modules) {
    const result = await runAuditModule(decision.proposedAction, modName);
    
    await db.insert(validationsTable).values({
      decisionId,
      module: modName,
      confidenceScore: result.confidenceScore,
      riskLevel: result.riskLevel,
      recommendation: result.recommendation,
      findings: result.findings
    });
    
    totalConf += result.confidenceScore;
    if (result.riskLevel === "HIGH") highestRisk = "HIGH";
    else if (result.riskLevel === "MEDIUM" && highestRisk === "LOW") highestRisk = "MEDIUM";
  }

  const avgConf = Math.round(totalConf / modules.length);
  const overallRisk = highestRisk;
  
  const [trustScore] = await db.insert(trustScoresTable).values({
    decisionId,
    overallScore: avgConf,
    overallRisk,
    finalVerdict: overallRisk === "HIGH" ? "REJECTED" : "APPROVED",
    executiveSummary: `Decision audited by ${modules.length} AI modules with ${avgConf}% overall confidence. Highest detected risk is ${overallRisk}.`
  }).returning();

  await db.update(decisionsTable).set({ status: "validated" }).where(eq(decisionsTable.id, decisionId));

  res.json({ decision: { ...decision, status: "validated" }, trustScore });
});

router.get("/trust-engine/decisions", async (_req, res): Promise<void> => {
  const decisions = await db.select().from(decisionsTable).orderBy(desc(decisionsTable.createdAt));
  res.json(decisions);
});

router.get("/trust-engine/decisions/:id", async (req, res): Promise<void> => {
  const decisionId = parseInt(req.params.id, 10);
  if (isNaN(decisionId)) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  const [decision] = await db.select().from(decisionsTable).where(eq(decisionsTable.id, decisionId));
  if (!decision) {
    res.status(404).json({ error: "Decision not found" });
    return;
  }

  const validations = await db.select().from(validationsTable).where(eq(validationsTable.decisionId, decisionId));
  const [trustScore] = await db.select().from(trustScoresTable).where(eq(trustScoresTable.decisionId, decisionId));

  res.json({ decision, validations, trustScore });
});

router.post("/trust-engine/decisions/:id/execute", async (req, res): Promise<void> => {
  const decisionId = parseInt(req.params.id, 10);
  if (isNaN(decisionId)) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  const [decision] = await db.select().from(decisionsTable).where(eq(decisionsTable.id, decisionId));
  if (!decision || decision.status !== "validated") {
    res.status(400).json({ error: "Decision not found or not validated" });
    return;
  }

  const [trustScore] = await db.select().from(trustScoresTable).where(eq(trustScoresTable.decisionId, decisionId));
  
  // Call Agrinexus Law Agent to draft the contract
  const contractData = await draftLegalContract(decision, trustScore || {});

  // Save the contract
  const [contract] = await db.insert(contractsTable).values({
    proposalId: decisionId,
    clientId: 1, // Default mock client
    clientName: "Вътрешен Изпълнител",
    clientEmail: "ops@nexuscore.local",
    title: contractData.title,
    content: contractData.content,
    totalAmount: contractData.totalAmount.toString(),
    status: "draft",
  }).returning();

  // Mark decision as executed
  await db.update(decisionsTable).set({ status: "executed" }).where(eq(decisionsTable.id, decisionId));

  res.status(201).json({ decision: { ...decision, status: "executed" }, contract });
});

export default router;
