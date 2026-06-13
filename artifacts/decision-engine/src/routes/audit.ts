import { Router } from "express";
import { db } from "@workspace/db";
import { auditsTable, auditTasksTable, sagaStateTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { publishEvent, subscribeEvent } from "@workspace/shared/event-bus";
import { v4 as uuidv4 } from "uuid";
import { AuditService } from "../services/audit.service";

const router = Router();

// In-memory store for synchronous requests (In real world, use WebSockets or Redis pub/sub)
export const pendingAuditRequests = new Map<string, { resolve: Function, reject: Function, timeout: NodeJS.Timeout }>();

// Listen for completed audits to resolve the pending HTTP requests
setTimeout(() => {
  subscribeEvent('audit.completed', 'decision-engine-audit', async (event) => {
    const { correlationId, data } = event;
    const pending = pendingAuditRequests.get(correlationId);
    if (pending) {
      clearTimeout(pending.timeout);
      pending.resolve(data);
      pendingAuditRequests.delete(correlationId);
    }
  }).catch(console.error);
}, 1000);

router.post("/audit", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }
    
    // Create saga state just for tracking
    const correlationId = uuidv4();
    await db.insert(sagaStateTable).values({
      correlationId,
      step: 'audit_started',
      status: 'pending',
      data: { url }
    });

    // Run audit completely synchronously inline!
    const auditService = new AuditService();
    const result = await auditService.runAudit(url);
    
    await db.update(sagaStateTable).set({ step: 'audit_completed', status: 'completed' }).where(eq(sagaStateTable.correlationId, correlationId));

    res.json(result);
  } catch (error: any) {
    console.error("Audit error:", error);
    res.status(500).json({ error: error.message || "Failed to run audit" });
  }
});

router.get("/audit/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [audit] = await db.select().from(auditsTable).where(eq(auditsTable.id, id as string));
    if (!audit) {
      return res.status(404).json({ error: "Audit not found" });
    }
    
    const tasks = await db.select().from(auditTasksTable).where(eq(auditTasksTable.auditId, id as string));
    
    res.json({ audit, tasks });
  } catch (error) {
    console.error("Fetch audit error:", error);
    res.status(500).json({ error: "Failed to fetch audit" });
  }
});

export default router;
