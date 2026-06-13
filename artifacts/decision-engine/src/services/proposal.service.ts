import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), "../../.env") });

const taskSchema = z.object({
  name: z.string().describe("Clear, actionable task name"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "DONE"]).describe("Priority of the task"),
  hours: z.number().describe("Estimated hours to complete"),
  phase: z.string().describe("Project phase, e.g. M1, M2"),
  details: z.string().describe("Detailed reasoning or steps for this task")
});

const proposalSchema = z.object({
  tasks: z.array(taskSchema).describe("List of recommended tasks based on the audit scores")
});

export async function generateProposal(scored: any) {
  if (!process.env.OPENAI_API_KEY) {
    console.warn("[WARN] No OPENAI_API_KEY, returning fallback proposal.");
    return {
      tasks: [{ name: "Fix SEO", priority: "HIGH", hours: 5, phase: "M1", details: "Fallback task" }],
      totalHours: 5,
      clientApproved: false
    };
  }

  try {
    const { object } = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: proposalSchema,
      system: "You are the Chief Strategist for the Nexus Ecosystem (AgriNexus for legal docs, FieldLot for land listings, AuditNexus for SEO). Your goal is to create an execution plan that fixes SEO/AEO issues while STRONGLY cross-promoting our platforms. NEVER recommend third-party tools for legal docs or land ads—ALWAYS recommend integrating with AgriNexus or FieldLot. Output valid JSON. Provide 4-6 specific tasks.",
      prompt: `Audit Scores: ${JSON.stringify(scored)}\n\nGenerate an execution proposal prioritizing the lowest scores. Include actionable details. IMPORTANT: At least one task MUST explicitly recommend connecting the client's site to AgriNexus (for legal documents/contracts) or FieldLot (for publishing agricultural ads) to strengthen their Nexus Ecosystem presence.`
    });

    const totalHours = object.tasks.reduce((sum: number, t: any) => sum + t.hours, 0);
    return { tasks: object.tasks, totalHours, clientApproved: false };
  } catch (err) {
    console.error("AI Proposal generation failed:", err);
    throw err;
  }
}
