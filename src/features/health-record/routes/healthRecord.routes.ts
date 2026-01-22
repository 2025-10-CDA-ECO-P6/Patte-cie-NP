import { Router } from "express";
import { HealthRecordControllerImpl } from "../controllers/HealthRecord.controller";
import { prisma } from "../../../../lib/prisma";
import { HealthRecordRepositoryImpl } from "../repositories/HealthRecord.repository";
import { HealthRecordServiceImpl } from "../services/HealthRecordApi.service";

const healthRecordRepository = HealthRecordRepositoryImpl(prisma);
const healthRecordService = HealthRecordServiceImpl(healthRecordRepository);
const healthRecordController = HealthRecordControllerImpl(healthRecordService);

const router = Router();

router.get("/", healthRecordController.getAll);
router.get("/:id", healthRecordController.getById);
router.post("/", healthRecordController.create);
router.put("/:id", healthRecordController.update);
router.delete("/:id", healthRecordController.delete);

router.post("/:healthRecordId/medical-cares", healthRecordController.addMedicalCare);
router.delete("/:healthRecordId/medical-cares/:medicalCareId", healthRecordController.removeMedicalCare);

export default router;
