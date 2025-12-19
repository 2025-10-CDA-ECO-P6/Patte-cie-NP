import { Router } from "express";
import { prisma } from "../../../../lib/prisma";
import { VaccineControllerImpl } from "../controllers/Vaccine.controller";
import { VaccineRepositoryImpl } from "../repositories/Vaccine.repository";
import { VaccineServiceImpl } from "../services/VaccineApi.service";

const vaccineRepository = VaccineRepositoryImpl(prisma);
const vaccineService = VaccineServiceImpl(vaccineRepository);
const vaccineController = VaccineControllerImpl(vaccineService);

const router = Router();

router.get("/", vaccineController.getAll);
router.get("/:id", vaccineController.getById);
router.get("/type/:vaccineTypeId", vaccineController.getByVaccineTypeId);
router.post("/", vaccineController.create);
router.put("/:id", vaccineController.update);
router.delete("/:id", vaccineController.delete);

export default router;
