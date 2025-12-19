import { NextFunction, Request, Response } from "express";
import { BaseController, BaseControllerImpl } from "../../../core/bases/BaseController";
import {
  MedicalCareService,
  MedicalCareCreateDTO,
  MedicalCareUpdateDTO,
  MedicalCareResponseDTO,
  AddTagDTO,
  AddVaccineDTO,
} from "../services/MedicalCareApi.service";
import { asyncHandler } from "../../../core/utils/asyncHandler";

export interface MedicalCareController extends BaseController {
  addTag(req: Request, res: Response, next: NextFunction): Promise<void>;
  removeTag(req: Request, res: Response, next: NextFunction): Promise<void>;
  addVaccine(req: Request, res: Response, next: NextFunction): Promise<void>;
  removeVaccine(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export const MedicalCareControllerImpl = (service: MedicalCareService): MedicalCareController => {
  const baseController = BaseControllerImpl<MedicalCareCreateDTO, MedicalCareUpdateDTO, MedicalCareResponseDTO>(
    service
  );

  return {
    ...baseController,

    addTag: asyncHandler(async (req: Request, res: Response) => {
      const dto: AddTagDTO = req.body;
      const result = await service.addTag(req.params.medicalCareId, dto);
      res.status(201).json(result);
    }),

    removeTag: asyncHandler(async (req: Request, res: Response) => {
      const result = await service.removeTag(req.params.medicalCareId, req.params.tagId);
      res.json(result);
    }),

    addVaccine: asyncHandler(async (req: Request, res: Response) => {
      const dto: AddVaccineDTO = req.body;
      const result = await service.addVaccine(req.params.medicalCareId, dto);
      res.status(201).json(result);
    }),

    removeVaccine: asyncHandler(async (req: Request, res: Response) => {
      const result = await service.removeVaccine(req.params.medicalCareId, req.params.vaccineId);
      res.json(result);
    }),
  };
};