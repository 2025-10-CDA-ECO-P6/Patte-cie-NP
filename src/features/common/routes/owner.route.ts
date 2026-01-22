import { Router } from "express";
import { prisma } from "../../../../lib/prisma";
import { OwnerControllerImpl } from "../controllers/owner.controller";

import { OwnerRepositoryImpl } from "../repositories/owner.repository";
import { OwnerServiceImpl } from "../services/owner.service";

const ownerRepository = OwnerRepositoryImpl(prisma);
const ownerService = OwnerServiceImpl(ownerRepository);
const ownerController = OwnerControllerImpl(ownerService);

const router = Router();

router.get("/", ownerController.getAll);
router.get("/:id", ownerController.getById);
router.post("/", ownerController.create);
router.put("/:id", ownerController.update);
router.delete("/:id", ownerController.delete);

export default router;
