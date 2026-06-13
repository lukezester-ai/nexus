import { logger } from "./lib/logger";
import { subscribeEvent, publishEvent } from "@workspace/shared/event-bus";
import { generateProposal } from "./services/proposal.service";
import { db } from "@workspace/db";
import { sagaStateTable, auditsTable, auditTasksTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

async function startStrategyWorker() {
  logger.info("Starting Strategy Engine Worker...");
  
  await subscribeEvent('strategy.requested', 'strategy-engine', async (event) => {
    const { correlationId, data } = event;
    const { auditId, scored, url } = data;
    
    logger.info(`[Strategy Engine] Generating proposal for audit ${auditId}`);
    
    try {
      await db.update(sagaStateTable)
        .set({ step: 'strategy_processing' })
        .where(eq(sagaStateTable.correlationId, correlationId));

      const proposal = generateProposal(scored);
      
      // Save timeline to audit table
      await db.update(auditsTable)
        .set({ timelineJson: proposal.tasks })
        .where(eq(auditsTable.id, auditId));

      // Insert tasks
      if (proposal.tasks && proposal.tasks.length > 0) {
        await db.insert(auditTasksTable).values(
          proposal.tasks.map(t => ({
            auditId,
            name: t.name,
            priority: t.priority,
            hours: t.hours,
            phase: t.phase
          }))
        );
      }
      
      await db.update(sagaStateTable)
        .set({ step: 'strategy_completed', status: 'completed' })
        .where(eq(sagaStateTable.correlationId, correlationId));
      
      // Publish the final event that Decision Engine (Gateway) is waiting for
      await publishEvent('audit.completed', { auditId, url, scored, proposal }, correlationId);
      
    } catch (error: any) {
      logger.error({ error }, `[Strategy Engine] Strategy generation failed for audit ${auditId}`);
      
      await db.update(sagaStateTable)
        .set({ step: 'strategy_failed', status: 'failed', data: { error: error.message } })
        .where(eq(sagaStateTable.correlationId, correlationId));
        
      await publishEvent('audit.failed', { auditId, error: error.message }, correlationId);
    }
  });
}

startStrategyWorker().catch((err) => {
  logger.error({ err }, "Failed to start Strategy Engine Worker");
  process.exit(1);
});
