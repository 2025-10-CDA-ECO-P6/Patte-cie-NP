import { Request, Response, NextFunction } from "express";
import { BaseController, BaseControllerImpl } from "../../../core/bases/BaseController";
import { asyncHandler } from "../../../core/utils/asyncHandler";
import {
  VaccineTypeService,
  VaccineTypeCreateDTO,
  VaccineTypeUpdateDTO,
  VaccineTypeResponseDTO,
} from "../services/VaccineTypeApi.service";

export interface VaccineTypeController extends BaseController {
  getByName(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export const VaccineTypeControllerImpl = (service: VaccineTypeService): VaccineTypeController => {
  const baseController = BaseControllerImpl<VaccineTypeCreateDTO, VaccineTypeUpdateDTO, VaccineTypeResponseDTO>(
    service
  );

  return {
    ...baseController,

    getByName: asyncHandler(async (req: Request, res: Response) => {
      const name = req.params.name;
      const result = await service.getByName(name);
      res.json(result);
    }),
  };
};
