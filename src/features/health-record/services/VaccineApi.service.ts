import { BaseApiService, BaseApiServiceImpl } from "../../../core/bases/BaseApiService";
import { Vaccine } from "../models/Vaccine.model";
import { VaccineRepository } from "../repositories/Vaccine.repository";

export interface VaccineService
  extends BaseApiService<Vaccine, VaccineCreateDTO, VaccineUpdateDTO, VaccineResponseDTO> {
  getByVaccineTypeId(vaccineTypeId: string): Promise<VaccineResponseDTO[]>;
}

export const VaccineServiceImpl = (repository: VaccineRepository): VaccineService => {
  const toResponseDTO = (vaccine: Vaccine): VaccineResponseDTO => ({
    id: vaccine.id,
    vaccineTypeId: vaccine.vaccineTypeId,
    name: vaccine.name,
    vaccineType: vaccine.vaccineType ? { id: vaccine.vaccineType.id, name: vaccine.vaccineType.name } : undefined,
  });

  const createDomain = (dto: VaccineCreateDTO): Vaccine =>
    new Vaccine({
      id: crypto.randomUUID(),
      vaccineTypeId: dto.vaccineTypeId,
      name: dto.name,
      createdAt: new Date(),
      isDeleted: false,
    });

  const updateDomain = (existing: Vaccine, dto: VaccineUpdateDTO): Vaccine => {
    existing.name = dto.name;
    existing.vaccineTypeId = dto.vaccineTypeId;
    return existing;
  };

  const baseService = BaseApiServiceImpl<Vaccine, VaccineCreateDTO, VaccineUpdateDTO, VaccineResponseDTO>(
    repository,
    toResponseDTO,
    createDomain,
    updateDomain
  );

  return {
    ...baseService,

    async getByVaccineTypeId(vaccineTypeId: string) {
      const vaccines = await repository.getByVaccineTypeId(vaccineTypeId, true);
      return vaccines.map(toResponseDTO);
    },
  };
};

// DTOs

export interface VaccineResponseDTO {
  id: string;
  vaccineTypeId: string;
  name: string;
  vaccineType?: { id: string; name: string };
}

export interface VaccineCreateDTO {
  vaccineTypeId: string;
  name: string;
}

export interface VaccineUpdateDTO extends VaccineCreateDTO {
  id: string;
}
