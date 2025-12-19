import { NextFunction, Request, Response } from "express";
import { QueryOptions } from "../types/QueryOptions";
import { BaseApiService } from "./BaseApiService";
import { asyncHandler } from "../utils/asyncHandler";

export interface BaseController {
  getById(req: Request, res: Response, next: NextFunction): Promise<void>;
  getAll(req: Request, res: Response, next: NextFunction): Promise<void>;
  create(req: Request, res: Response, next: NextFunction): Promise<void>;
  update(req: Request, res: Response, next: NextFunction): Promise<void>;
  delete(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export const BaseControllerImpl = <TCreateDTO, TUpdateDTO extends { id: string }, TResponseDTO>(
  service: BaseApiService<unknown, TCreateDTO, TUpdateDTO, TResponseDTO>
): BaseController => ({
  getById: asyncHandler(async (req: Request, res: Response) => {
    const options: QueryOptions = { withRelations: req.query.withRelations === "true" };
    const result = await service.getById(req.params.id, options);

    if (!result) {
      res.sendStatus(404);
      return;
    }

    res.json(result);
  }),

  getAll: asyncHandler(async (req: Request, res: Response) => {
    const options: QueryOptions = { withRelations: req.query.withRelations === "true" };
    const result = await service.getAll(options);
    res.json(result);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const dto: TCreateDTO = req.body;
    const result = await service.create(dto);
    res.status(201).json(result);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const body = req.body as Omit<TUpdateDTO, "id">;
    const dto = { ...body, id: req.params.id } as TUpdateDTO;
    const result = await service.update(dto);
    res.json(result);
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    await service.delete(req.params.id);
    res.sendStatus(204);
  }),
});
