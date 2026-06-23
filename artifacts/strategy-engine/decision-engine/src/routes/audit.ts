import { Router } from "express";
import { AuditService } from "../services/audit.service";
import { db } from "@workspace/db";
import { auditsTable, auditTasksTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router = Router();
const auditService = new AuditService();

router.post("/audit", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      res.status(400).json({ error: "URL is required" });
      return;
    }
    const result = await auditService.runAudit(url);
    res.json(result);
  } catch (error) {
    console.error("Audit error:", error);
    res.status(500).json({ error: "Failed to run audit" });
  }
});

router.get("/audit/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [audit] = await db.select().from(auditsTable).where(eq(auditsTable.id, id));
    if (!audit) {
      res.status(404).json({ error: "Audit not found" });
      return;
    }
    
    const tasks = await db.select().from(auditTasksTable).where(eq(auditTasksTable.auditId, id));
    
    res.json({ audit, tasks });
  } catch (error) {
    console.error("Fetch audit error:", error);
    res.status(500).json({ error: "Failed to fetch audit" });
  }
});

export default router;
