import { Router } from "express";
import { prisma } from "../../../../lib/prisma";
import { TagControllerImpl } from "../controllers/Tag.controller";
import { TagRepositoryImpl } from "../repositories/Tag.repository";
import { TagServiceImpl } from "../services/TagApi.service";

const tagRepository = TagRepositoryImpl(prisma);
const tagService = TagServiceImpl(tagRepository);
const tagController = TagControllerImpl(tagService);

const router = Router();

router.get("/", tagController.getAll);
router.get("/:id", tagController.getById);
router.get("/name/:name", tagController.getByName);
router.post("/", tagController.create);
router.put("/:id", tagController.update);
router.delete("/:id", tagController.delete);

export default router;
