import { NextFunction, Request, Response } from "express";
import { BaseController, BaseControllerImpl } from "../../../core/bases/BaseController";
import {
  HealthRecordService,
  HealthRecordCreateDTO,
  HealthRecordUpdateDTO,
  HealthRecordResponseDTO,
  AddMedicalCareDTO,
} from "../services/HealthRecordApi.service";
import { asyncHandler } from "../../../core/utils/asyncHandler";

export interface HealthRecordController extends BaseController {
  getByAnimalId(req: Request, res: Response, next: NextFunction): Promise<void>;
  addMedicalCare(req: Request, res: Response, next: NextFunction): Promise<void>;
  removeMedicalCare(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export const HealthRecordControllerImpl = (service: HealthRecordService): HealthRecordController => {
  const baseController = BaseControllerImpl<HealthRecordCreateDTO, HealthRecordUpdateDTO, HealthRecordResponseDTO>(
    service
  );

  return {
    ...baseController,

    getByAnimalId: asyncHandler(async (req: Request, res: Response) => {
      const result = await service.getByAnimalId(req.params.animalId);

      if (!result) {
        res.sendStatus(404);
        return;
      }

      res.json(result);
    }),

    addMedicalCare: asyncHandler(async (req: Request, res: Response) => {
      const dto: AddMedicalCareDTO = req.body;
      const result = await service.addMedicalCare(req.params.healthRecordId, dto);
      res.status(201).json(result);
    }),

    removeMedicalCare: asyncHandler(async (req: Request, res: Response) => {
      const result = await service.removeMedicalCare(req.params.healthRecordId, req.params.medicalCareId);
      res.json(result);
    }),
  };
};