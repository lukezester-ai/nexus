import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

import * as dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), "../../.env") });

export const contractSchema = z.object({
  title: z.string().describe("Официално заглавие на договора на български език"),
  content: z.string().describe("Пълният текст на договора, форматиран в Markdown. Включва страни, предмет, условия, неустойки и подписи."),
  totalAmount: z.number().describe("Очакваната стойност на сделката в лева. Ако не е приложимо, върни 0."),
});

export type DraftedContract = z.infer<typeof contractSchema>;

export async function draftLegalContract(decisionDetails: any, trustScoreDetails: any): Promise<DraftedContract> {
  // Graceful fallback if no API key
  if (!process.env.OPENAI_API_KEY) {
    console.warn(`[WARN] OPENAI_API_KEY not found. Running simulated legal drafting.`);
    return {
      title: "Договор за изпълнение (Симулиран)",
      content: "### ДОГОВОР\n\nТова е автоматично генериран тестов договор, тъй като липсва OpenAI API ключ.\n\n**Предмет:** " + decisionDetails.proposedAction + "\n\n**Одобрено на база:** " + trustScoreDetails.executiveSummary + "\n\nПодпис: _______________",
      totalAmount: 100000,
    };
  }

  const systemPrompt = `
Вие сте главен юрисконсулт (Agrinexus Law Agent) в екосистемата Nexus Core.
Вашата задача е да превърнете едно одобрено корпоративно бизнес решение в строг, правно издържан договор.
МНОГО ВАЖНО: Договорът трябва да бъде ДВУЕЗИЧЕН (BILINGUAL) - на Български и на Английски език. Всяка точка или параграф трябва първо да е написана на български, а веднага след нея (на нов ред) да следва преводът на английски език (за предпочитане в курсив - *italics*).
Текстът трябва да бъде форматиран в Markdown и да изглежда като истински юридически документ.

Структура на договора (и на двата езика):
1. Заглавие (с центриране).
2. Дата и място на сключване.
3. Страни (Nexus Intelligence Group и Изпълнител/Доставчик - измислете име ако няма конкретно).
4. Предмет на договора (базиран на решението).
5. Права и задължения.
6. Финансови условия (включете очакваната сума в лева/BGN).
7. Неустойки и прекратяване.
8. Място за подписи (двуезично).

Отразете всякакви рискове, споменати в одита, като специални клаузи (например: ако има финансов риск, добавете строга клауза за неустойка).
`.trim();

  const prompt = `
МОЛЯ, ГЕНЕРИРАЙТЕ ДОГОВОР ВЪЗ ОСНОВА НА СЛЕДНОТО ОДОБРЕНО РЕШЕНИЕ:

Предмет на решението: ${decisionDetails.proposedAction}
Мотиви: ${decisionDetails.context?.reasoning || "Оптимизация на процесите"}
Финален Trust Score (Оценка на риска): ${trustScoreDetails.overallScore}/100
Ниво на риск: ${trustScoreDetails.overallRisk}
Коментар от одиторите: ${trustScoreDetails.executiveSummary}
`;

  try {
    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: contractSchema,
      system: systemPrompt,
      prompt: prompt,
    });

    return object;
  } catch (error) {
    console.error("[ERROR] Legal Agent Failed:", error);
    return {
      title: "Грешка при генериране на договор",
      content: "Възникна системна грешка при връзката с OpenAI. Моля, проверете логовeте.",
      totalAmount: 0,
    };
  }
}
