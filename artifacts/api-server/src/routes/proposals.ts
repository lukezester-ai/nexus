import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, proposalsTable } from "@workspace/db";
import {
  CreateProposalBody,
  GetProposalParams,
  GetProposalResponse,
  UpdateProposalParams,
  UpdateProposalBody,
  UpdateProposalResponse,
  ListProposalsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

function parseProposal(p: typeof proposalsTable.$inferSelect) {
  return {
    ...p,
    totalPrice: Number(p.totalPrice),
    services: (p.services as object[] | null) ?? [],
    validUntil: p.validUntil ? p.validUntil.toISOString() : null,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

router.get("/proposals", async (_req, res): Promise<void> => {
  const proposals = await db.select().from(proposalsTable).orderBy(desc(proposalsTable.createdAt));
  res.json(ListProposalsResponse.parse(proposals.map(parseProposal)));
});

router.post("/proposals", async (req, res): Promise<void> => {
  const parsed = CreateProposalBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [proposal] = await db.insert(proposalsTable).values({
    auditId: parsed.data.auditId ?? null,
    clientId: parsed.data.clientId ?? null,
    clientName: parsed.data.clientName,
    clientEmail: parsed.data.clientEmail,
    title: parsed.data.title,
    description: parsed.data.description ?? null,
    services: parsed.data.services ?? [],
    totalPrice: String(parsed.data.totalPrice ?? 0),
    currency: parsed.data.currency ?? "BGN",
    status: "draft",
    validUntil: parsed.data.validUntil ? new Date(parsed.data.validUntil) : null,
  }).returning();

  res.status(201).json(GetProposalResponse.parse(parseProposal(proposal)));
});

router.get("/proposals/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetProposalParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [proposal] = await db.select().from(proposalsTable).where(eq(proposalsTable.id, params.data.id));
  if (!proposal) {
    res.status(404).json({ error: "Proposal not found" });
    return;
  }

  res.json(GetProposalResponse.parse(parseProposal(proposal)));
});

router.patch("/proposals/:id", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateProposalParams.safeParse({ id: parseInt(rawId, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateProposalBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updateData: Record<string, unknown> = {};
  if (parsed.data.title !== undefined) updateData.title = parsed.data.title;
  if (parsed.data.description !== undefined) updateData.description = parsed.data.description;
  if (parsed.data.services !== undefined) updateData.services = parsed.data.services;
  if (parsed.data.totalPrice !== undefined) updateData.totalPrice = String(parsed.data.totalPrice);
  if (parsed.data.status !== undefined) updateData.status = parsed.data.status;
  if (parsed.data.validUntil !== undefined) updateData.validUntil = new Date(parsed.data.validUntil);

  const [proposal] = await db.update(proposalsTable).set(updateData).where(eq(proposalsTable.id, params.data.id)).returning();
  if (!proposal) {
    res.status(404).json({ error: "Proposal not found" });
    return;
  }

  res.json(UpdateProposalResponse.parse(parseProposal(proposal)));
});

export default router;
