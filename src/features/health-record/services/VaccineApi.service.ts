import createHttpError from "http-errors";
import { BaseApiService, BaseApiServiceImpl } from "../../../core/bases/BaseApiService";
import { Vaccine } from "../models/Vaccine.model";
import { VaccineRepository } from "../repositories/Vaccine.repository";

export interface VaccineService extends BaseApiService<
  Vaccine,
  VaccineCreateDTO,
  VaccineUpdateDTO,
  VaccineResponseDTO
> {
  getByVaccineTypeId(vaccineTypeId: string): Promise<VaccineResponseDTO[]>;
}

export const VaccineServiceImpl = (repository: VaccineRepository): VaccineService => {
  const toResponseDTO = (vaccine: Vaccine): VaccineResponseDTO => {
    const dto: VaccineResponseDTO = {
      id: vaccine.id,
      vaccineTypeId: vaccine.vaccineTypeId,
      administrationDate: vaccine.administrationDate,
      expirationDate: vaccine.expirationDate,
      batchNumber: vaccine.batchNumber,
      doseNumber: vaccine.doseNumber,
      notes: vaccine.notes,
      vaccineType: vaccine.vaccineType
        ? {
            id: vaccine.vaccineType.id,
            name: vaccine.vaccineType.name,
            defaultValidityDays: vaccine.vaccineType.defaultValidityDays,
            notes: vaccine.vaccineType.notes,
          }
        : undefined,
    };
    validateVaccineResponse(dto);
    return dto;
  };

  const createDomain = (dto: VaccineCreateDTO): Vaccine => {
    validateVaccineInput(dto);
    return new Vaccine({
      id: crypto.randomUUID(),
      vaccineTypeId: dto.vaccineTypeId,
      administrationDate: dto.administrationDate,
      expirationDate: dto.expirationDate,
      batchNumber: dto.batchNumber,
      doseNumber: dto.doseNumber,
      notes: dto.notes,
      createdAt: new Date(),
      isDeleted: false,
    });
  };

  const updateDomain = (existing: Vaccine, dto: VaccineUpdateDTO): Vaccine => {
    validateVaccineInput(dto);
    existing.update({
      vaccineTypeId: dto.vaccineTypeId,
      administrationDate: dto.administrationDate,
      expirationDate: dto.expirationDate,
      batchNumber: dto.batchNumber,
      doseNumber: dto.doseNumber,
      notes: dto.notes,
    });
    return existing;
  };

  const baseService = BaseApiServiceImpl<Vaccine, VaccineCreateDTO, VaccineUpdateDTO, VaccineResponseDTO>(
    repository,
    toResponseDTO,
    createDomain,
    updateDomain,
    validateVaccineInput,
    validateVaccineResponse,
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
  administrationDate: Date;
  expirationDate?: Date;
  batchNumber?: string;
  doseNumber?: number;
  notes?: string;
  vaccineType?: {
    id: string;
    name: string;
    defaultValidityDays?: number;
    notes?: string;
  };
}

export interface VaccineCreateDTO {
  vaccineTypeId: string;
  administrationDate: Date;
  expirationDate?: Date;
  batchNumber?: string;
  doseNumber?: number;
  notes?: string;
}

export interface VaccineUpdateDTO extends VaccineCreateDTO {
  id: string;
}

const validateVaccineInput = (dto: VaccineCreateDTO | VaccineUpdateDTO) => {
  if (!dto.vaccineTypeId || typeof dto.vaccineTypeId !== "string") {
    throw new createHttpError.BadRequest("vaccineTypeId is required and must be a string");
  }
  if (!(dto.administrationDate instanceof Date)) {
    throw new createHttpError.BadRequest("administrationDate must be a valid Date");
  }
  if (dto.expirationDate !== undefined && !(dto.expirationDate instanceof Date)) {
    throw new createHttpError.BadRequest("expirationDate must be a valid Date if provided");
  }
  if (dto.batchNumber !== undefined && typeof dto.batchNumber !== "string") {
    throw new createHttpError.BadRequest("batchNumber must be a string if provided");
  }
  if (dto.doseNumber !== undefined && typeof dto.doseNumber !== "number") {
    throw new createHttpError.BadRequest("doseNumber must be a number if provided");
  }
  if (dto.notes !== undefined && typeof dto.notes !== "string") {
    throw new createHttpError.BadRequest("notes must be a string if provided");
  }
};

const validateVaccineResponse = (dto: VaccineResponseDTO) => {
  if (!dto.id || typeof dto.id !== "string") throw new createHttpError.InternalServerError("Response id is invalid");
  if (!dto.vaccineTypeId || typeof dto.vaccineTypeId !== "string")
    throw new createHttpError.InternalServerError("Response vaccineTypeId is invalid");
  if (!(dto.administrationDate instanceof Date))
    throw new createHttpError.InternalServerError("Response administrationDate is invalid");
  if (dto.expirationDate !== undefined && !(dto.expirationDate instanceof Date))
    throw new createHttpError.InternalServerError("Response expirationDate is invalid");
};