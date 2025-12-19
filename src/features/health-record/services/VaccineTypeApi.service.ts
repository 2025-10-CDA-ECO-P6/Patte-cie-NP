import createHttpError from "http-errors";
import { BaseApiService, BaseApiServiceImpl } from "../../../core/bases/BaseApiService";
import { VaccineType } from "../models/VaccinType.model";
import { VaccineTypeRepository } from "../repositories/VaccineType.repository";

export interface VaccineTypeService
  extends BaseApiService<VaccineType, VaccineTypeCreateDTO, VaccineTypeUpdateDTO, VaccineTypeResponseDTO> {
  getByName(name: string): Promise<VaccineTypeResponseDTO | null>;
}

export const VaccineTypeServiceImpl = (repository: VaccineTypeRepository): VaccineTypeService => {
  const toResponseDTO = (v: VaccineType): VaccineTypeResponseDTO => {
    const dto: VaccineTypeResponseDTO = {
      id: v.id,
      name: v.name,
    };
    validateVaccineTypeResponse(dto);
    return dto;
  };

  const createDomain = (dto: VaccineTypeCreateDTO): VaccineType => {
    validateVaccineTypeInput(dto);
    return new VaccineType({
      id: crypto.randomUUID(),
      name: dto.name,
      createdAt: new Date(),
      isDeleted: false,
    });
  };

  const updateDomain = (existing: VaccineType, dto: VaccineTypeUpdateDTO): VaccineType => {
    validateVaccineTypeInput(dto);
    existing.updateName(dto.name);
    return existing;
  };

  const baseService = BaseApiServiceImpl<
    VaccineType,
    VaccineTypeCreateDTO,
    VaccineTypeUpdateDTO,
    VaccineTypeResponseDTO
  >(repository, toResponseDTO, createDomain, updateDomain, validateVaccineTypeInput, validateVaccineTypeResponse);

  return {
    ...baseService,

    async getByName(name: string): Promise<VaccineTypeResponseDTO> {
      if (!name || typeof name !== "string") {
        throw new createHttpError.BadRequest("Name must be a non-empty string");
      }

      const entity = await repository.getByName(name);
      if (!entity) {
        throw new createHttpError.NotFound(`VaccineType with name "${name}" not found`);
      }

      return toResponseDTO(entity);
    },
  };
};

export interface VaccineTypeResponseDTO {
  id: string;
  name: string;
}

export interface VaccineTypeCreateDTO {
  name: string;
}

export interface VaccineTypeUpdateDTO extends VaccineTypeCreateDTO {
  id: string;
}

const validateVaccineTypeInput = (dto: VaccineTypeCreateDTO | VaccineTypeUpdateDTO) => {
  if (!dto.name || typeof dto.name !== "string") {
    throw new createHttpError.BadRequest("VaccineType name is required and must be a string");
  }
};

const validateVaccineTypeResponse = (dto: VaccineTypeResponseDTO) => {
  if (!dto.id || typeof dto.id !== "string") throw new createHttpError.InternalServerError("Response id is invalid");
  if (!dto.name || typeof dto.name !== "string")
    throw new createHttpError.InternalServerError("Response name is invalid");
};
