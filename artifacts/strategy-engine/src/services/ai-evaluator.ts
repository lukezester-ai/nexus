import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

// Initialize config - expects OPENAI_API_KEY in environment
import * as dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), "../../.env") });

export const evaluationSchema = z.object({
  confidenceScore: z.number().min(0).max(100).describe("Score from 0 to 100 based on validation criteria"),
  riskLevel: z.enum(["LOW", "MEDIUM", "HIGH"]).describe("Categorized risk level of the proposed action"),
  recommendation: z.enum(["APPROVED", "FLAGGED", "REJECTED"]).describe("Final recommendation for this specific module"),
  findings: z.array(z.string()).describe("List of exactly 3 concise, analytical reasons justifying the score and risk"),
});

export type EvaluationResult = z.infer<typeof evaluationSchema>;

export async function runAuditModule(decisionContext: string, moduleName: string): Promise<EvaluationResult> {
  // If no API key is provided, gracefully fall back to simulation to prevent crashes
  if (!process.env.OPENAI_API_KEY) {
    console.warn(`[WARN] OPENAI_API_KEY not found. Running simulated audit for ${moduleName}`);
    return simulateAudit(moduleName);
  }

  const systemPrompt = `
You are the lead auditor for the "${moduleName}" module within the Nexus Core Trust Engine.
Your job is to evaluate proposed enterprise actions and generate a strict evaluation.
Be highly critical, pessimistic, and risk-averse. You are an auditor looking for flaws.

Role for ${moduleName}:
- If 'Financial Impact Validator', focus on ROI, cash flow risks, and market volatility.
- If 'Legal & Compliance Checker', focus on regulatory risks, liabilities, and contract validity.
- If 'Historical Precedent Analyzer', focus on past failures, market trends, and historical ROI.
- If 'Source Verification Engine', focus on the reliability and trustworthiness of the data sources.
- If 'Operational Execution Risk', focus on logistics, physical implementation, and downtime.

Analyze the proposed decision context. Be rigorous.
Return exactly the structured JSON output requested.
`.trim();

  try {
    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: evaluationSchema,
      system: systemPrompt,
      prompt: `Please evaluate the following proposed enterprise decision:\n\n${decisionContext}`,
    });

    return object;
  } catch (error) {
    console.error(`[ERROR] AI Audit Failed for ${moduleName}:`, error);
    return {
      confidenceScore: 0,
      riskLevel: "HIGH",
      recommendation: "FLAGGED",
      findings: ["AI Service Error: Failed to generate a reliable audit."],
    };
  }
}

// Fallback logic for local testing without API keys
function simulateAudit(moduleName: string): EvaluationResult {
  const isRisky = Math.random() > 0.7;
  return {
    confidenceScore: isRisky ? Math.floor(Math.random() * 40) + 20 : Math.floor(Math.random() * 20) + 80,
    riskLevel: isRisky ? "HIGH" : "LOW",
    recommendation: isRisky ? "FLAGGED" : "APPROVED",
    findings: [
      `Simulated validation check passed for ${moduleName}.`,
      `Risk metrics fall within acceptable thresholds.`,
      `No critical anomalies detected in historical patterns.`
    ],
  };
}
