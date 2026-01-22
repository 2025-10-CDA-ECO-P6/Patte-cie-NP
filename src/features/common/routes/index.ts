import { Router } from "express";
import animalsRoute from "./animal.route";
import ownersRoute from "./owner.route";
import speciesRoute from "./species.routes";
import veterinariansRoute from "./veterinarian.route";

const router = Router();

router.use("/animals", animalsRoute);
router.use("/species", speciesRoute);
router.use("/owners", ownersRoute);
router.use("/veterinarians", veterinariansRoute);

export default router;
