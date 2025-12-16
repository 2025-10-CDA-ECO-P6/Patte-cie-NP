import { Router } from "express";
import { prisma } from "../../../lib/prisma";
import { AnimalController } from "../controllers/animal.controller";
import { AnimalOwnerRepositoryImpl } from "../repositories/animal-owner.repository";
import { AnimalRepositoryImpl } from "../repositories/animal.repository";
import { AnimalServiceImpl } from "../services/animal.service";

const animalService = AnimalServiceImpl(AnimalRepositoryImpl(prisma), AnimalOwnerRepositoryImpl(prisma));

const animalController = AnimalController(animalService);

const router = Router();
router.get("/", animalController.getAll);
router.get("/:id", animalController.getById);
router.post("/", animalController.create);
router.put("/:id", animalController.update);
router.delete("/:id", animalController.delete);

export default router;
