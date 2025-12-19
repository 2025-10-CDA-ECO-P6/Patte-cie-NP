import { Request, Response } from "express";
import { BaseController, BaseControllerImpl } from "../../../core/bases/BaseController";
import {
  MedicalCareService,
  MedicalCareCreateDTO,
  MedicalCareUpdateDTO,
  MedicalCareResponseDTO,
  AddTagDTO,
  AddVaccineDTO,
} from "../services/MedicalCareApi.service";

export interface MedicalCareController extends BaseController {
  addTag(req: Request, res: Response): Promise<void>;
  removeTag(req: Request, res: Response): Promise<void>;
  addVaccine(req: Request, res: Response): Promise<void>;
  removeVaccine(req: Request, res: Response): Promise<void>;
}

export const MedicalCareControllerImpl = (service: MedicalCareService): MedicalCareController => {
  const baseController = BaseControllerImpl<MedicalCareCreateDTO, MedicalCareUpdateDTO, MedicalCareResponseDTO>(
    service
  );

  return {
    ...baseController,

    async addTag(req: Request, res: Response) {
      const dto: AddTagDTO = req.body;

      const result = await service.addTag(req.params.medicalCareId, dto);
      res.status(201).json(result);
    },

    async removeTag(req: Request, res: Response) {
      const result = await service.removeTag(req.params.medicalCareId, req.params.tagId);
      res.json(result);
    },

    async addVaccine(req: Request, res: Response) {
      const dto: AddVaccineDTO = req.body;

      const result = await service.addVaccine(req.params.medicalCareId, dto);
      res.status(201).json(result);
    },

    async removeVaccine(req: Request, res: Response) {
      const result = await service.removeVaccine(req.params.medicalCareId, req.params.vaccineId);
      res.json(result);
    },
  };
};
