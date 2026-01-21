import { Router } from "express";

import coreRoutes from "./features/common/routes";
import moduleHealthRecordRoutes from "./features/health-record/routes";
import authRoutes from "./features/auth/routes";

const router = Router();

router.use(coreRoutes);
router.use(moduleHealthRecordRoutes);
router.use(authRoutes);

export default router;
