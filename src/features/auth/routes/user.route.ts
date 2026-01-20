import { Router } from "express";
import { prisma } from "../../../../lib/prisma";
import { UserRepositoryImpl } from "../repositories/user.repository";
import { UserServiceImpl } from "../services/user.service";
import { UserController } from "../controllers/user.controller";
import { authenticationMiddleware } from "../middlewares/auth.middleware";

const router = Router();

const userRepository = UserRepositoryImpl(prisma);
const userService = UserServiceImpl(userRepository);
const userController = UserController(userService);

// Routes protégées
router.get("/users", authenticationMiddleware, userController.getAll);
router.get("/users/:id", authenticationMiddleware, userController.getById);
router.post("/users", authenticationMiddleware, userController.create);
router.put("/users/:id", authenticationMiddleware, userController.update);
router.delete("/users/:id", authenticationMiddleware, userController.delete);

export default router;