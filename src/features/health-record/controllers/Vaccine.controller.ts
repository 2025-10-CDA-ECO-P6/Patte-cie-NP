import { Request, Response, NextFunction } from "express";
import { BaseController, BaseControllerImpl } from "../../../core/bases/BaseController";
import { asyncHandler } from "../../../core/utils/asyncHandler";
import { VaccineService, VaccineCreateDTO, VaccineUpdateDTO, VaccineResponseDTO } from "../services/VaccineApi.service";

export interface VaccineController extends BaseController {
  getByVaccineTypeId(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export const VaccineControllerImpl = (service: VaccineService): VaccineController => {
  const baseController = BaseControllerImpl<VaccineCreateDTO, VaccineUpdateDTO, VaccineResponseDTO>(service);

  return {
    ...baseController,

    getByVaccineTypeId: asyncHandler(async (req: Request, res: Response) => {
      const vaccineTypeId = req.params.vaccineTypeId;
      const vaccines = await service.getByVaccineTypeId(vaccineTypeId);
      res.json(vaccines);
    }),
  };
};
