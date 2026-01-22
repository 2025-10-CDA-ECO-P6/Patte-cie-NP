import { Router } from "express";
import { prisma } from "../../../../lib/prisma";
import { VeterinarianControllerImpl } from "../controllers/veterinarian.controller";
import { VeterinarianRepositoryImpl } from "../repositories/veterinarian.repository";
import { VeterinarianServiceImpl } from "../services/veterinarian.service";

const veterinarianRepository = VeterinarianRepositoryImpl(prisma);
const veterinarianService = VeterinarianServiceImpl(veterinarianRepository);
const veterinarianController = VeterinarianControllerImpl(veterinarianService);

const router = Router();

router.get("/", veterinarianController.getAll);
router.get("/:id", veterinarianController.getById);
router.post("/", veterinarianController.create);
router.put("/:id", veterinarianController.update);
router.delete("/:id", veterinarianController.delete);

export default router;
