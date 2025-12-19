import { Router } from "express";
import animalRoute from "./animal.route";
import ownerRoute from "./owner.route";

const router = Router();

router.use("/animal", animalRoute);
router.use("/owner", ownerRoute);

export default router;
