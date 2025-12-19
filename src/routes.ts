import { Router } from "express";

import coreRoutes from "./core/routes";
import moduleHealthRecordRoutes from "./features/health-record/routes";

const router = Router();

router.use(coreRoutes);
router.use(moduleHealthRecordRoutes);

export default router;
