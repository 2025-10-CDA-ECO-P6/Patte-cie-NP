import { Router } from "express";
import healthRecordRoute from "./healthRecord.routes";
import medicalCareRoute from "./medicalCare.routes";
import tagRoute from "./tag.routes";
import vaccineRoute from "./vaccine.routes";
import vaccineTypeRoute from "./vaccineType.routes";
import vaccineReminderRoute from "./vaccineReminder.routes";

const router = Router();

// Modules
router.use("/health-records", healthRecordRoute);
router.use("/medical-cares", medicalCareRoute);
router.use("/tags", tagRoute);
router.use("/vaccines", vaccineRoute);
router.use("/vaccine-types", vaccineTypeRoute);
router.use("/vaccine-reminders", vaccineReminderRoute);

export default router;
