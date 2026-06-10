import { Router, type IRouter } from "express";
import healthRouter from "./health";
import auditsRouter from "./audits";
import clientsRouter from "./clients";
import proposalsRouter from "./proposals";
import contractsRouter from "./contracts";
import projectsRouter from "./projects";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(auditsRouter);
router.use(clientsRouter);
router.use(proposalsRouter);
router.use(contractsRouter);
router.use(projectsRouter);
router.use(dashboardRouter);

export default router;
