import createHttpError from "http-errors";
import { QueryOptions } from "../types/QueryOptions";
import { BaseRepository } from "./BaseRepository";

export interface BaseApiService<TDomain, TCreateDTO, TUpdateDTO, TResponseDTO> {
  getById(id: string, options?: QueryOptions): Promise<TResponseDTO | null>;
  getAll(options?: QueryOptions): Promise<TResponseDTO[]>;
  create(dto: TCreateDTO): Promise<TResponseDTO>;
  update(dto: TUpdateDTO): Promise<TResponseDTO>;
  delete(id: string): Promise<void>;
}

export const BaseApiServiceImpl = <TDomain, TCreateDTO, TUpdateDTO, TResponseDTO>(
  repository: BaseRepository<TDomain>,
  toResponseDTO: (domain: TDomain) => TResponseDTO,
  createDomain: (dto: TCreateDTO) => TDomain,
  updateDomain: (existing: TDomain, dto: TUpdateDTO) => TDomain,
  validateInput?: (dto: TCreateDTO | TUpdateDTO) => void,
  validateOutput?: (response: TResponseDTO) => void
): BaseApiService<TDomain, TCreateDTO, TUpdateDTO, TResponseDTO> => ({
  async getById(id: string, options?: QueryOptions): Promise<TResponseDTO> {
    const entity = await repository.getById(id, options?.withRelations);
    if (!entity) {
      throw new createHttpError.NotFound(`Entity with id ${id} not found`);
    }

    const dto = toResponseDTO(entity);
    validateOutput?.(dto);
    return dto;
  },

  async getAll(options?: QueryOptions): Promise<TResponseDTO[]> {
    const entities = await repository.getAll(options?.withRelations);
    const dtos = entities.map(toResponseDTO);
    if (dtos.length && validateOutput) validateOutput(dtos[0]);
    return dtos;
  },

  async create(dto: TCreateDTO): Promise<TResponseDTO> {
    validateInput?.(dto);

    const entity = createDomain(dto);
    const saved = await repository.create(entity);
    const response = toResponseDTO(saved);

    validateOutput?.(response);
    return response;
  },

  async update(dto: TUpdateDTO): Promise<TResponseDTO> {
    validateInput?.(dto);

    const existing = await repository.getById((dto as any).id, true);
    if (!existing) {
      throw new createHttpError.NotFound(`Entity with id ${(dto as any).id} not found`);
    }

    const updated = updateDomain(existing, dto);
    const saved = await repository.update(updated, true);
    if (!saved) {
      throw new createHttpError.NotFound(`Entity with id ${(dto as any).id} not found`);
    }

    const response = toResponseDTO(saved);
    validateOutput?.(response);
    return response;
  },

  async delete(id: string): Promise<void> {
    const deleted = await repository.delete(id);
    if (!deleted) {
      throw new createHttpError.NotFound(`Entity with id ${id} not found`);
    }
  },
});