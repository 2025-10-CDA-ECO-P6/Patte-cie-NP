import { Router } from "express";
import { prisma } from "../../../lib/prisma";
import { OwnerController } from "../controllers/owner.controller";
import { AnimalOwnerRepositoryImpl } from "../repositories/animal-owner.repository";
import { OwnerRepositoryImpl } from "../repositories/owner.repository";
import { OwnerServiceImpl } from "../services/owner.service";

const ownerService = OwnerServiceImpl(OwnerRepositoryImpl(prisma), AnimalOwnerRepositoryImpl(prisma));

const ownerController = OwnerController(ownerService);

const router = Router();
router.get("/", ownerController.getAll);
router.get("/:id", ownerController.getById);
router.post("/", ownerController.create);
router.put("/:id", ownerController.update);
router.delete("/:id", ownerController.delete);

export default router;
