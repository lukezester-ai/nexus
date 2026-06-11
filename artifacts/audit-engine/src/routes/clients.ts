import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, clientsTable } from "@workspace/db";
import {
  CreateClientBody,
  GetClientParams,
  GetClientResponse,
  ListClientsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

function parseClient(c: typeof clientsTable.$inferSelect) {
  return {
    ...c,
    totalRevenue: Number(c.totalRevenue),
    createdAt: c.createdAt.toISOString(),
  };
}

router.get("/clients", async (_req, res): Promise<void> => {
  const clients = await db.select().from(clientsTable).orderBy(desc(clientsTable.createdAt));
  res.json(ListClientsResponse.parse(clients.map(parseClient)));
});

router.post("/clients", async (req, res): Promise<void> => {
  const parsed = CreateClientBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [client] = await db.insert(clientsTable).values({
    name: parsed.data.name,
    email: parsed.data.email,
    company: parsed.data.company ?? null,
    phone: parsed.data.phone ?? null,
    website: parsed.data.website ?? null,
    notes: parsed.data.notes ?? null,
  }).returning();

  res.status(201).json(GetClientResponse.parse(parseClient(client)));
});

router.get("/clients/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetClientParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [client] = await db.select().from(clientsTable).where(eq(clientsTable.id, params.data.id));
  if (!client) {
    res.status(404).json({ error: "Client not found" });
    return;
  }

  res.json(GetClientResponse.parse(parseClient(client)));
});

export default router;
