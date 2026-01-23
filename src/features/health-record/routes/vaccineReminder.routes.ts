import { Router } from "express";
import { prisma } from "../../../../lib/prisma";

import { VaccineReminderRepositoryImpl } from "../repositories/VaccineReminder.repository";
import { VaccineReminderServiceImpl } from "../services/VaccineReminderApi.service";
import { VaccineReminderController } from "../controllers/VaccineReminder.controller";

const router = Router();

const vaccineReminderRepository = VaccineReminderRepositoryImpl(prisma);
const vaccineReminderService = VaccineReminderServiceImpl(vaccineReminderRepository);
const vaccineReminderController = VaccineReminderController(vaccineReminderService);

router.get("/pending", vaccineReminderController.getPending);
router.post("/", vaccineReminderController.create);
router.patch("/:id/mark-sent", vaccineReminderController.markAsSent);
router.delete("/by-vaccine/:vaccineId", vaccineReminderController.deleteByVaccineId);

export default router;
