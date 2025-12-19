import createHttpError from "http-errors";
import { BaseApiService, BaseApiServiceImpl } from "../../../core/bases/BaseApiService";
import { Vaccine } from "../models/Vaccine.model";
import { VaccineRepository } from "../repositories/Vaccine.repository";

export interface VaccineService
  extends BaseApiService<Vaccine, VaccineCreateDTO, VaccineUpdateDTO, VaccineResponseDTO> {
  getByVaccineTypeId(vaccineTypeId: string): Promise<VaccineResponseDTO[]>;
}

export const VaccineServiceImpl = (repository: VaccineRepository): VaccineService => {
  const toResponseDTO = (vaccine: Vaccine): VaccineResponseDTO => {
    const dto: VaccineResponseDTO = {
      id: vaccine.id,
      vaccineTypeId: vaccine.vaccineTypeId,
      name: vaccine.name,
      vaccineType: vaccine.vaccineType ? { id: vaccine.vaccineType.id, name: vaccine.vaccineType.name } : undefined,
    };
    validateVaccineResponse(dto);
    return dto;
  };

  const createDomain = (dto: VaccineCreateDTO): Vaccine => {
    validateVaccineInput(dto);
    return new Vaccine({
      id: crypto.randomUUID(),
      vaccineTypeId: dto.vaccineTypeId,
      name: dto.name,
      createdAt: new Date(),
      isDeleted: false,
    });
  };

  const updateDomain = (existing: Vaccine, dto: VaccineUpdateDTO): Vaccine => {
    validateVaccineInput(dto);
    existing.update(dto.name, dto.vaccineTypeId);
    return existing;
  };

  const baseService = BaseApiServiceImpl<Vaccine, VaccineCreateDTO, VaccineUpdateDTO, VaccineResponseDTO>(
    repository,
    toResponseDTO,
    createDomain,
    updateDomain,
    validateVaccineInput,
    validateVaccineResponse
  );

  return {
    ...baseService,

    async getByVaccineTypeId(vaccineTypeId: string): Promise<VaccineResponseDTO[]> {
      if (!vaccineTypeId || typeof vaccineTypeId !== "string") {
        throw new createHttpError.BadRequest("vaccineTypeId must be a non-empty string");
      }

      const vaccines = await repository.getByVaccineTypeId(vaccineTypeId, true);
      if (!vaccines || vaccines.length === 0) {
        throw new createHttpError.NotFound(`No vaccines found for vaccineTypeId ${vaccineTypeId}`);
      }

      return vaccines.map(toResponseDTO);
    },
  };
};

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

const validateVaccineInput = (dto: VaccineCreateDTO | VaccineUpdateDTO) => {
  if (!dto.vaccineTypeId || typeof dto.vaccineTypeId !== "string") {
    throw new createHttpError.BadRequest("vaccineTypeId is required and must be a string");
  }
  if (!dto.name || typeof dto.name !== "string") {
    throw new createHttpError.BadRequest("name is required and must be a string");
  }
};

const validateVaccineResponse = (dto: VaccineResponseDTO) => {
  if (!dto.id || typeof dto.id !== "string") throw new createHttpError.InternalServerError("Response id is invalid");
  if (!dto.vaccineTypeId || typeof dto.vaccineTypeId !== "string")
    throw new createHttpError.InternalServerError("Response vaccineTypeId is invalid");
  if (!dto.name || typeof dto.name !== "string")
    throw new createHttpError.InternalServerError("Response name is invalid");
  if (dto.vaccineType) {
    if (!dto.vaccineType.id || typeof dto.vaccineType.id !== "string")
      throw new createHttpError.InternalServerError("Response vaccineType id is invalid");
    if (!dto.vaccineType.name || typeof dto.vaccineType.name !== "string")
      throw new createHttpError.InternalServerError("Response vaccineType name is invalid");
  }
};
