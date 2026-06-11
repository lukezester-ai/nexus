import { Router, type IRouter } from "express";
import healthRouter from "./health";
import trustEngineRouter from "./trust-engine";
import clientsRouter from "./clients";
import proposalsRouter from "./proposals";
import contractsRouter from "./contracts";
import projectsRouter from "./projects";
import dashboardRouter from "./dashboard";
import stripeRouter from "./stripe";
import agentsRouter from "./agents";

const router: IRouter = Router();

router.use(healthRouter);
router.use(trustEngineRouter);
router.use(clientsRouter);
router.use(proposalsRouter);
router.use(contractsRouter);
router.use(projectsRouter);
router.use(dashboardRouter);
router.use(stripeRouter);
router.use(agentsRouter);

export default router;
