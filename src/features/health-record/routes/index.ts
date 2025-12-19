import { Router } from "express";
import healthRecordRoute from "./healthRecord.routes";
import medicalCareRoute from "./medicalCare.routes";

const router = Router();

router.use("/health-records", healthRecordRoute);
router.use("/medical-cares", medicalCareRoute);


export default router;
