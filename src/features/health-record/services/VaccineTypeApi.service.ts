import { BaseApiService, BaseApiServiceImpl } from "../../../core/bases/BaseApiService";
import { VaccineType } from "../models/VaccinType.model";
import { VaccineTypeRepository } from "../repositories/VaccineType.repository";

export interface VaccineTypeService
  extends BaseApiService<VaccineType, VaccineTypeCreateDTO, VaccineTypeUpdateDTO, VaccineTypeResponseDTO> {
  getByName(name: string): Promise<VaccineTypeResponseDTO | null>;
}

export const VaccineTypeServiceImpl = (repository: VaccineTypeRepository): VaccineTypeService => {
  const toResponseDTO = (v: VaccineType): VaccineTypeResponseDTO => ({
    id: v.id,
    name: v.name,
  });

  const createDomain = (dto: VaccineTypeCreateDTO): VaccineType =>
    new VaccineType({
      id: crypto.randomUUID(),
      name: dto.name,
      createdAt: new Date(),
      isDeleted: false,
    });

  const updateDomain = (existing: VaccineType, dto: VaccineTypeUpdateDTO): VaccineType => {
    existing.name = dto.name;
    return existing;
  };

  const baseService = BaseApiServiceImpl<
    VaccineType,
    VaccineTypeCreateDTO,
    VaccineTypeUpdateDTO,
    VaccineTypeResponseDTO
  >(repository, toResponseDTO, createDomain, updateDomain);

  return {
    ...baseService,

    async getByName(name: string): Promise<VaccineTypeResponseDTO | null> {
      const entity = await repository.getByName(name);
      if (!entity) return null;
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
