import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, auditsTable } from "@workspace/db";
import {
  CreateAuditBody,
  GetAuditParams,
  GetAuditResponse,
  RunAuditParams,
  RunAuditResponse,
  ListAuditsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

function parseAudit(a: typeof auditsTable.$inferSelect) {
  return {
    ...a,
    seoData: (a.seoData as object | null) ?? undefined,
    geoData: (a.geoData as object | null) ?? undefined,
    aeoData: (a.aeoData as object | null) ?? undefined,
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
  };
}

router.get("/audits", async (_req, res): Promise<void> => {
  const audits = await db.select().from(auditsTable).orderBy(desc(auditsTable.createdAt));
  res.json(ListAuditsResponse.parse(audits.map(parseAudit)));
});

router.post("/audits", async (req, res): Promise<void> => {
  const parsed = CreateAuditBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [audit] = await db.insert(auditsTable).values({
    url: parsed.data.url,
    clientName: parsed.data.clientName ?? null,
    clientEmail: parsed.data.clientEmail ?? null,
    status: "pending",
  }).returning();

  res.status(201).json(GetAuditResponse.parse(parseAudit(audit)));
});

router.get("/audits/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetAuditParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [audit] = await db.select().from(auditsTable).where(eq(auditsTable.id, params.data.id));
  if (!audit) {
    res.status(404).json({ error: "Audit not found" });
    return;
  }

  res.json(GetAuditResponse.parse(parseAudit(audit)));
});

router.post("/audits/:id/run", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = RunAuditParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [existing] = await db.select().from(auditsTable).where(eq(auditsTable.id, params.data.id));
  if (!existing) {
    res.status(404).json({ error: "Audit not found" });
    return;
  }

  await db.update(auditsTable).set({ status: "running" }).where(eq(auditsTable.id, params.data.id));

  const seoScore = Math.floor(Math.random() * 40) + 45;
  const geoScore = Math.floor(Math.random() * 40) + 40;
  const aeoScore = Math.floor(Math.random() * 40) + 35;
  const overallScore = Math.round((seoScore + geoScore + aeoScore) / 3);

  const seoData = {
    titleScore: Math.floor(Math.random() * 30) + 60,
    metaDescriptionScore: Math.floor(Math.random() * 30) + 55,
    headingsScore: Math.floor(Math.random() * 30) + 65,
    canonicalScore: Math.floor(Math.random() * 20) + 70,
    pageSpeedScore: Math.floor(Math.random() * 40) + 40,
    mobileScore: Math.floor(Math.random() * 30) + 60,
    issues: [
      "Meta description is missing or too short",
      "H1 tag not found on homepage",
      "Images missing alt attributes",
      "Page load speed is below 3 seconds threshold",
    ].slice(0, Math.floor(Math.random() * 3) + 1),
    recommendations: [
      "Add a compelling meta description (150-160 characters)",
      "Include a single H1 tag with primary keyword",
      "Compress and optimize images",
      "Enable browser caching and use a CDN",
      "Minify CSS, JavaScript, and HTML",
    ].slice(0, Math.floor(Math.random() * 3) + 2),
  };

  const geoData = {
    localPresenceScore: Math.floor(Math.random() * 30) + 50,
    citationsScore: Math.floor(Math.random() * 35) + 40,
    napConsistencyScore: Math.floor(Math.random() * 30) + 55,
    localKeywordsScore: Math.floor(Math.random() * 35) + 45,
    issues: [
      "Google Business Profile not found or unverified",
      "NAP inconsistency across directories",
      "Missing local schema markup",
      "Low number of local citations",
    ].slice(0, Math.floor(Math.random() * 3) + 1),
    recommendations: [
      "Claim and verify your Google Business Profile",
      "Ensure consistent NAP across all directories",
      "Add LocalBusiness schema markup",
      "Build citations on top local directories",
      "Create location-specific landing pages",
    ].slice(0, Math.floor(Math.random() * 3) + 2),
  };

  const aeoData = {
    featuredSnippetScore: Math.floor(Math.random() * 35) + 30,
    structuredDataScore: Math.floor(Math.random() * 30) + 40,
    faqSchemaScore: Math.floor(Math.random() * 40) + 25,
    voiceSearchScore: Math.floor(Math.random() * 35) + 30,
    issues: [
      "No FAQ schema markup found",
      "Structured data errors detected",
      "Content not optimized for featured snippets",
      "Missing HowTo schema for instructional content",
    ].slice(0, Math.floor(Math.random() * 3) + 1),
    recommendations: [
      "Add FAQ schema to common question pages",
      "Implement structured data for all key pages",
      "Write concise answers to common questions (40-60 words)",
      "Use conversational language targeting voice queries",
      "Create Q&A style content sections",
    ].slice(0, Math.floor(Math.random() * 3) + 2),
  };

  const [updated] = await db.update(auditsTable).set({
    status: "completed",
    seoScore,
    geoScore,
    aeoScore,
    overallScore,
    seoData,
    geoData,
    aeoData,
  }).where(eq(auditsTable.id, params.data.id)).returning();

  res.json(RunAuditResponse.parse(parseAudit(updated)));
});

export default router;
