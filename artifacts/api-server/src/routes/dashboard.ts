import { Router, type IRouter } from "express";
import { eq, count, avg, sql } from "drizzle-orm";
import { db, auditsTable, proposalsTable, contractsTable, clientsTable, projectsTable } from "@workspace/db";
import { GetDashboardStatsResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/dashboard/stats", async (_req, res): Promise<void> => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [auditStats] = await db.select({
    total: count(),
    avgSeo: avg(auditsTable.seoScore),
    avgGeo: avg(auditsTable.geoScore),
    avgAeo: avg(auditsTable.aeoScore),
  }).from(auditsTable);

  const [auditsThisMonthResult] = await db.select({ cnt: count() })
    .from(auditsTable)
    .where(sql`${auditsTable.createdAt} >= ${startOfMonth}`);

  const [proposalStats] = await db.select({ total: count() }).from(proposalsTable);

  const [acceptedProposals] = await db.select({ cnt: count() })
    .from(proposalsTable)
    .where(eq(proposalsTable.status, "accepted"));

  const [activeContracts] = await db.select({ cnt: count() })
    .from(contractsTable)
    .where(eq(contractsTable.status, "active"));

  const [clientStats] = await db.select({ total: count() }).from(clientsTable);

  const [activeProjects] = await db.select({ cnt: count() })
    .from(projectsTable)
    .where(eq(projectsTable.status, "active"));

  const totalProposals = Number(proposalStats.total);
  const accepted = Number(acceptedProposals.cnt);
  const acceptanceRate = totalProposals > 0 ? Math.round((accepted / totalProposals) * 100) : 0;

  const signedContracts = await db.select({ amount: contractsTable.totalAmount })
    .from(contractsTable)
    .where(sql`${contractsTable.status} IN ('signed', 'active', 'completed')`);

  const totalRevenue = signedContracts.reduce((sum, c) => sum + (c.amount ? Number(c.amount) : 0), 0);

  const signedThisMonth = await db.select({ amount: contractsTable.totalAmount })
    .from(contractsTable)
    .where(sql`${contractsTable.status} IN ('signed', 'active', 'completed') AND ${contractsTable.createdAt} >= ${startOfMonth}`);

  const revenueThisMonth = signedThisMonth.reduce((sum, c) => sum + (c.amount ? Number(c.amount) : 0), 0);

  const stats = {
    totalAudits: Number(auditStats.total),
    auditsThisMonth: Number(auditsThisMonthResult.cnt),
    avgSeoScore: Math.round(Number(auditStats.avgSeo ?? 0)),
    avgGeoScore: Math.round(Number(auditStats.avgGeo ?? 0)),
    avgAeoScore: Math.round(Number(auditStats.avgAeo ?? 0)),
    totalProposals,
    proposalAcceptanceRate: acceptanceRate,
    activeContracts: Number(activeContracts.cnt),
    totalRevenue,
    revenueThisMonth,
    totalClients: Number(clientStats.total),
    activeProjects: Number(activeProjects.cnt),
  };

  res.json(GetDashboardStatsResponse.parse(stats));
});

export default router;
