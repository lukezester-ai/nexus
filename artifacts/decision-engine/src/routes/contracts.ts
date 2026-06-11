import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, contractsTable } from "@workspace/db";
import {
  CreateContractBody,
  GetContractParams,
  GetContractResponse,
  UpdateContractParams,
  UpdateContractBody,
  UpdateContractResponse,
  ListContractsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

function parseContract(c: typeof contractsTable.$inferSelect) {
  return {
    ...c,
    totalAmount: c.totalAmount != null ? Number(c.totalAmount) : null,
    signedAt: c.signedAt ? c.signedAt.toISOString() : null,
    startDate: c.startDate ? c.startDate.toISOString() : null,
    endDate: c.endDate ? c.endDate.toISOString() : null,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  };
}

router.get("/contracts", async (_req, res): Promise<void> => {
  const contracts = await db.select().from(contractsTable).orderBy(desc(contractsTable.createdAt));
  res.json(ListContractsResponse.parse(contracts.map(parseContract)));
});

router.post("/contracts", async (req, res): Promise<void> => {
  const parsed = CreateContractBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [contract] = await db.insert(contractsTable).values({
    proposalId: parsed.data.proposalId ?? null,
    clientId: parsed.data.clientId ?? null,
    clientName: parsed.data.clientName,
    clientEmail: parsed.data.clientEmail,
    title: parsed.data.title,
    content: parsed.data.content ?? null,
    totalAmount: parsed.data.totalAmount != null ? String(parsed.data.totalAmount) : null,
    currency: parsed.data.currency ?? "BGN",
    status: "draft",
    startDate: parsed.data.startDate ? new Date(parsed.data.startDate) : null,
    endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
  }).returning();

  res.status(201).json(GetContractResponse.parse(parseContract(contract)));
});

router.get("/contracts/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetContractParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [contract] = await db.select().from(contractsTable).where(eq(contractsTable.id, params.data.id));
  if (!contract) {
    res.status(404).json({ error: "Contract not found" });
    return;
  }

  res.json(GetContractResponse.parse(parseContract(contract)));
});

router.patch("/contracts/:id", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateContractParams.safeParse({ id: parseInt(rawId, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateContractBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updateData: Record<string, unknown> = {};
  if (parsed.data.status !== undefined) updateData.status = parsed.data.status;
  if (parsed.data.content !== undefined) updateData.content = parsed.data.content;
  if (parsed.data.signedAt !== undefined) updateData.signedAt = new Date(parsed.data.signedAt);
  if (parsed.data.startDate !== undefined) updateData.startDate = new Date(parsed.data.startDate);
  if (parsed.data.endDate !== undefined) updateData.endDate = new Date(parsed.data.endDate);

  const [contract] = await db.update(contractsTable).set(updateData).where(eq(contractsTable.id, params.data.id)).returning();
  if (!contract) {
    res.status(404).json({ error: "Contract not found" });
    return;
  }

  res.json(UpdateContractResponse.parse(parseContract(contract)));
});

export default router;
