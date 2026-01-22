import { BaseController, BaseControllerImpl } from "../../../core/bases/BaseController";
import { asyncHandler } from "../../../core/utils/asyncHandler";
import { AnimalResponseDTO, AnimalService, CreateAnimalDTO, UpdateAnimalDTO } from "../services/animal.service";
import { Request, Response, NextFunction } from "express";

export interface AnimalController extends BaseController {
  addOwner(req: Request, res: Response, next: NextFunction): Promise<void>;
  removeOwner(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export const AnimalControllerImpl = (animalService: AnimalService): AnimalController => {
  const baseController = BaseControllerImpl<CreateAnimalDTO, UpdateAnimalDTO, AnimalResponseDTO>(animalService);

  return {
    ...baseController,

    addOwner: asyncHandler(async (req: Request, res: Response) => {
      const { animalId, ownerId } = req.params;

      const result = await animalService.addOwner(animalId, ownerId);
      res.status(201).json(result);
    }),

    removeOwner: asyncHandler(async (req: Request, res: Response) => {
      const { animalId, ownerId } = req.params;

      const result = await animalService.removeOwner(animalId, ownerId);
      res.json(result);
    }),
  };
};