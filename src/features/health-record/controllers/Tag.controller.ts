import { NextFunction, Request, Response } from "express";
import { BaseController, BaseControllerImpl } from "../../../core/bases/BaseController";
import { asyncHandler } from "../../../core/utils/asyncHandler";
import { TagService, TagCreateDTO, TagUpdateDTO, TagResponseDTO } from "../services/TagApi.service";

export interface TagController extends BaseController {
  getByName(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export const TagControllerImpl = (service: TagService): TagController => {
  const baseController = BaseControllerImpl<TagCreateDTO, TagUpdateDTO, TagResponseDTO>(service);

  return {
    ...baseController,

    getByName: asyncHandler(async (req: Request, res: Response) => {
      const name = req.params.name;
      const result = await service.getByName(name);
      res.json(result);
    }),
  };
};
