import { Router } from "express";
import { RoleController } from "../controllers/role.controller";
import { RoleService } from "../services/role.service";
import { RoleRepositoryImpl } from "../repositories/role.repository";
import { prisma } from "../../../../lib/prisma";

const router = Router();

const roleRepository = RoleRepositoryImpl(prisma);
const roleService = new RoleService(roleRepository);
const roleController = RoleController(roleService);

router.get("/roles", roleController.getAll);
router.get("/roles/:id", roleController.getById);
router.post("/roles", roleController.create);

export default router;
