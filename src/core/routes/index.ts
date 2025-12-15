import { Router } from "express";
import testRouter from "./test.route";

const router = Router();

router.use("/test", testRouter);

export default router;
