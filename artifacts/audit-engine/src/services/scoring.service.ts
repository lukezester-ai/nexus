import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), "../../.env") });

const scoreSchema = z.object({
  score: z.number().min(0).max(100),
  potential: z.number().min(0).max(100)
});

const auditScoringSchema = z.object({
  readability: scoreSchema,
  answerReady: scoreSchema,
  trust: scoreSchema,
  platform: scoreSchema
});

export class ScoringService {
  async generateScores(rawData: any) {
    if (!process.env.OPENAI_API_KEY) {
      console.warn("[WARN] No OPENAI_API_KEY, returning fallback scores.");
      return {
        readability: { score: 50, potential: 50 },
        answerReady: { score: 50, potential: 50 },
        trust: { score: 50, potential: 50 },
        platform: { score: 50, potential: 50 }
      };
    }

    try {
      const { object } = await generateObject({
        model: openai("gpt-4o"),
        schema: auditScoringSchema,
        system: "You are an AI SEO/AEO Audit evaluator. Calculate scores (0-100) and potential (remaining points to 100) based on the scraped technical data.",
        prompt: `Evaluate this website data:\n${JSON.stringify(rawData, null, 2)}`
      });
      return object;
    } catch (err) {
      console.error("AI Scoring failed:", err);
      return {
        readability: { score: 40, potential: 60 },
        answerReady: { score: 40, potential: 60 },
        trust: { score: 40, potential: 60 },
        platform: { score: 40, potential: 60 }
      };
    }
  }
}
