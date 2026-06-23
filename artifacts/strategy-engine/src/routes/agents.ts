import { Router, type IRouter } from "express";
import { db, decisionsTable } from "@workspace/db";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

const router: IRouter = Router();

const ProposeActionBody = z.object({
  prompt: z.string().min(1),
});

const proposalSchema = z.object({
  proposedAction: z.string().describe("The specific corporate action to take (e.g. 'Lease 3 John Deere Combines')"),
  context: z.object({
    reasoning: z.string().describe("Why the agent believes this is the right action"),
    expectedROI: z.string().describe("Expected return on investment or savings"),
    urgency: z.enum(["LOW", "MEDIUM", "HIGH"]),
  }),
});

router.post("/agents/terra-iq/propose", async (req, res): Promise<void> => {
  const parsed = ProposeActionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  // If no API key, mock the proposal
  if (!process.env.OPENAI_API_KEY) {
    const [decision] = await db.insert(decisionsTable).values({
      sourceAgent: "TerraIQ Operations Agent",
      decisionType: "Strategic Optimization",
      proposedAction: `Simulated Proposal: ${parsed.data.prompt}`,
      context: {
        reasoning: "Simulated because OPENAI_API_KEY is missing.",
        expectedROI: "15% optimization",
        urgency: "MEDIUM"
      },
      status: "pending_audit",
    }).returning();
    
    res.status(201).json(decision);
    return;
  }

  const systemPrompt = `
You are the lead AI Operations Agent for TerraIQ (part of the Nexus Core ecosystem).
Your goal is to optimize farming logistics, procurement, and field operations.
You are optimistic, aggressive in pursuing profit, and willing to take calculated risks.
The user will give you a general operational goal or problem.
You must output a highly specific, formal proposed corporate action that solves the problem.
`.trim();

  try {
    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: proposalSchema,
      system: systemPrompt,
      prompt: `Operational Directive: ${parsed.data.prompt}`,
    });

    const [decision] = await db.insert(decisionsTable).values({
      sourceAgent: "TerraIQ Operations Agent",
      decisionType: "Operational Optimization",
      proposedAction: object.proposedAction,
      context: object.context,
      status: "pending_audit",
    }).returning();

    res.status(201).json(decision);
  } catch (error) {
    console.error("[ERROR] TerraIQ Agent Failed:", error);
    res.status(500).json({ error: "Agent failed to generate proposal." });
  }
});

export default router;
