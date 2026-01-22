import { Router } from "express";
import { prisma } from "../../../../lib/prisma";
import { SpeciesControllerImpl } from "../controllers/species.controller";
import { SpeciesRepositoryImpl } from "../repositories/species.repository";
import { SpeciesServiceImpl } from "../services/species.service";

const speciesRepository = SpeciesRepositoryImpl(prisma);
const speciesService = SpeciesServiceImpl(speciesRepository);
const speciesController = SpeciesControllerImpl(speciesService);

const router = Router();

router.get("/", speciesController.getAll);
router.get("/:id", speciesController.getById);
router.post("/", speciesController.create);
router.put("/:id", speciesController.update);
router.delete("/:id", speciesController.delete);

export default router;