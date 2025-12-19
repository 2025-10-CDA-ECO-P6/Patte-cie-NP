import { Request, Response } from "express";
import { BaseController, BaseControllerImpl } from "../../../core/bases/BaseController";
import {
  HealthRecordService,
  HealthRecordCreateDTO,
  HealthRecordUpdateDTO,
  HealthRecordResponseDTO,
  AddMedicalCareDTO,
} from "../services/HealthRecordApi.service";

export interface HealthRecordController extends BaseController {
  getByAnimalId(req: Request, res: Response): Promise<void>;
  addMedicalCare(req: Request, res: Response): Promise<void>;
  removeMedicalCare(req: Request, res: Response): Promise<void>;
}

export const HealthRecordControllerImpl = (service: HealthRecordService) => {
  const baseController = BaseControllerImpl<HealthRecordCreateDTO, HealthRecordUpdateDTO, HealthRecordResponseDTO>(
    service
  );

  return {
    ...baseController,

    async getByAnimalId(req: Request, res: Response) {
      const result = await service.getByAnimalId(req.params.animalId);

      if (!result) {
        res.sendStatus(404);
        return;
      }

      res.json(result);
    },

    async addMedicalCare(req: Request, res: Response) {
      const dto: AddMedicalCareDTO = req.body;

      const result = await service.addMedicalCare(req.params.healthRecordId, dto);

      res.status(201).json(result);
    },

    async removeMedicalCare(req: Request, res: Response) {
      const result = await service.removeMedicalCare(req.params.healthRecordId, req.params.medicalCareId);

      res.json(result);
    },
  };
};
