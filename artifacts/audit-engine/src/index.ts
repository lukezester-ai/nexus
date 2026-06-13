import { logger } from "./lib/logger";
import { subscribeEvent, publishEvent } from "@workspace/shared/event-bus";
import { AuditService } from "./services/audit.service";
import { db } from "@workspace/db";
import { sagaStateTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const auditService = new AuditService();

async function startAuditWorker() {
  logger.info("Starting Audit Engine Worker...");
  
  await subscribeEvent('audit.requested', 'audit-engine', async (event) => {
    const { correlationId, data } = event;
    const { url } = data;
    
    logger.info(`[Audit Engine] Processing audit for ${url}`);
    
    try {
      // Update Saga State
      await db.update(sagaStateTable)
        .set({ step: 'audit_processing' })
        .where(eq(sagaStateTable.correlationId, correlationId));

      const auditResult = await auditService.runAudit(url);
      
      // Instead of completing, trigger Strategy Engine
      await publishEvent('strategy.requested', {
        auditId: auditResult.auditId,
        url: auditResult.url,
        scored: auditResult.scored
      }, correlationId);
      
    } catch (error: any) {
      logger.error({ error }, `[Audit Engine] Audit failed for ${url}`);
      
      await db.update(sagaStateTable)
        .set({ step: 'audit_failed', status: 'failed', data: { error: error.message } })
        .where(eq(sagaStateTable.correlationId, correlationId));
        
      await publishEvent('audit.failed', { url, error: error.message }, correlationId);
    }
  });
}

startAuditWorker().catch((err) => {
  logger.error({ err }, "Failed to start Audit Engine Worker");
  process.exit(1);
});
