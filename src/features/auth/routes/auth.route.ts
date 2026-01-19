import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authenticationMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/login", AuthController.login);
router.post("/refresh", AuthController.refresh);
router.post("/register", AuthController.register);
router.post("/logout", authenticationMiddleware, AuthController.logout);

export default router;