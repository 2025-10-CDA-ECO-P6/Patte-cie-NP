import { Router } from "express";
import { prisma } from "../../../../lib/prisma";
import { AnimalControllerImpl } from "../controllers/animal.controller";
import { AnimalRepositoryImpl } from "../repositories/animal.repository";
import { AnimalServiceImpl } from "../services/animal.service";
import { OwnerRepositoryImpl } from "../repositories/owner.repository";

const animalRepository = AnimalRepositoryImpl(prisma);
const ownerRepository = OwnerRepositoryImpl(prisma);
const animalService = AnimalServiceImpl(animalRepository, ownerRepository);
const animalController = AnimalControllerImpl(animalService);

const router = Router();

router.get("/", animalController.getAll);
router.get("/:id", animalController.getById);
router.post("/", animalController.create);
router.put("/:id", animalController.update);
router.delete("/:id", animalController.delete);

router.post("/:animalId/owners/:ownerId", animalController.addOwner);
router.delete("/:animalId/owners/:ownerId", animalController.removeOwner);

export default router;
