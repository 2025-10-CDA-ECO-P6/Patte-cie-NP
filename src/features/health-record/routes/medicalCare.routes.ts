import { Router } from "express";
import { prisma } from "../../../../lib/prisma";
import { MedicalCareControllerImpl } from "../controllers/MedicalCare.controller";
import { MedicalCareRepositoryImpl } from "../repositories/MedicalCare.repository";
import { TagRepositoryImpl } from "../repositories/Tag.repository";
import { VaccineRepositoryImpl } from "../repositories/Vaccine.repository";
import { MedicalCareServiceImpl } from "../services/MedicalCareApi.service";

const medicalCareRepository = MedicalCareRepositoryImpl(prisma);
const tagRepository = TagRepositoryImpl(prisma);
const vaccineRepository = VaccineRepositoryImpl(prisma);

const medicalCareService = MedicalCareServiceImpl(medicalCareRepository, tagRepository, vaccineRepository);
const medicalCareController = MedicalCareControllerImpl(medicalCareService);

const router = Router();

router.get("/", medicalCareController.getAll);
router.get("/:id", medicalCareController.getById);
router.post("/", medicalCareController.create);
router.put("/:id", medicalCareController.update);
router.delete("/:id", medicalCareController.delete);


router.post("/:medicalCareId/tags", medicalCareController.addTag);
router.delete("/:medicalCareId/tags/:tagId", medicalCareController.removeTag);
router.post("/:medicalCareId/vaccines", medicalCareController.addVaccine);
router.delete("/:medicalCareId/vaccines/:vaccineId", medicalCareController.removeVaccine);

export default router;
