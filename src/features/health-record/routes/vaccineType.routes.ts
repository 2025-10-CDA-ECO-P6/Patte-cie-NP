import { Router } from "express";
import { prisma } from "../../../../lib/prisma";
import { VaccineTypeControllerImpl } from "../controllers/VaccineType.controller";
import { VaccineTypeRepositoryImpl } from "../repositories/VaccineType.repository";
import { VaccineTypeServiceImpl } from "../services/VaccineTypeApi.service";

const vaccineTypeRepository = VaccineTypeRepositoryImpl(prisma);
const vaccineTypeService = VaccineTypeServiceImpl(vaccineTypeRepository);
const vaccineTypeController = VaccineTypeControllerImpl(vaccineTypeService);

const router = Router();

router.get("/", vaccineTypeController.getAll);
router.get("/:id", vaccineTypeController.getById);
router.get("/name/:name", vaccineTypeController.getByName); // ← route custom
router.post("/", vaccineTypeController.create);
router.put("/:id", vaccineTypeController.update);
router.delete("/:id", vaccineTypeController.delete);

export default router;
