import { Router } from "express";
import authRoutes from "./auth.route";
import userRoutes from "./user.route";
import roleRoutes from "./roles.route";


const router = Router();

router.use(authRoutes);
router.use(userRoutes);
router.use(roleRoutes);

export default router;
