import createHttpError from "http-errors";
import { BaseApiService, BaseApiServiceImpl } from "../../../core/bases/BaseApiService";
import { HealthRecord } from "../models/HealthRecord.model";
import { MedicalCare } from "../models/MedicalCare.model";
import { HealthRecordRepository } from "../repositories/HealthRecord.repository";
import { MedicalCareResponseDTO } from "./MedicalCareApi.service";

export interface HealthRecordService extends BaseApiService<
  HealthRecord,
  HealthRecordCreateDTO,
  HealthRecordUpdateDTO,
  HealthRecordResponseDTO
> {
  getByAnimalId(animalId: string): Promise<HealthRecordResponseDTO>;
  addMedicalCare(healthRecordId: string, dto: AddMedicalCareDTO): Promise<HealthRecordResponseDTO>;
  removeMedicalCare(healthRecordId: string, medicalCareId: string): Promise<HealthRecordResponseDTO>;
}

export const HealthRecordServiceImpl = (repository: HealthRecordRepository): HealthRecordService => {
  const toResponseDTO = (hr: HealthRecord): HealthRecordResponseDTO => ({
    id: hr.id,
    animalId: hr.animalId,
    description: hr.description,
    recordDate: hr.recordDate,
    medicalCares: hr.medicalCares?.map((mc) => ({
      id: mc.id,
      healthRecordId: mc.healthRecordId,
      veterinarianId: mc.veterinarianId,
      description: mc.description,
      careDate: mc.careDate,
      tags: mc.tags.map((t) => ({ id: t.tagId, name: t.tag?.name })),
      vaccines: mc.vaccines.map((v) => ({
        id: v.vaccineId,
        administrationDate: v.vaccine?.administrationDate!,
        expirationDate: v.vaccine?.expirationDate,
        batchNumber: v.vaccine?.batchNumber,
        doseNumber: v.vaccine?.doseNumber,
        notes: v.vaccine?.notes,
        vaccineType: v.vaccine?.vaccineType
          ? {
              id: v.vaccine.vaccineType.id,
              name: v.vaccine.vaccineType.name,
              defaultValidityDays: v.vaccine.vaccineType.defaultValidityDays,
              notes: v.vaccine.vaccineType.notes,
            }
          : undefined,
      })),
    })),
  });

  const createDomain = (dto: HealthRecordCreateDTO): HealthRecord => {
    validateHealthRecordInput(dto);
    return new HealthRecord({
      id: crypto.randomUUID(),
      animalId: dto.animalId,
      description: dto.description,
      recordDate: dto.recordDate,
      createdAt: new Date(),
      isDeleted: false,
    });
  };

  const updateDomain = (existing: HealthRecord, dto: HealthRecordUpdateDTO): HealthRecord => {
    validateHealthRecordInput(dto);
    existing.update(dto.description, dto.recordDate);
    return existing;
  };

  const baseService = BaseApiServiceImpl(
    repository,
    toResponseDTO,
    createDomain,
    updateDomain,
    validateHealthRecordInput,
    validateHealthRecordResponse,
  );

  return {
    ...baseService,

    async getByAnimalId(animalId: string): Promise<HealthRecordResponseDTO> {
      if (!animalId || typeof animalId !== "string") {
        throw new createHttpError.BadRequest("animalId is required and must be a string");
      }

      const hr = await repository.getByAnimalId(animalId, true);
      if (!hr) throw new createHttpError.NotFound(`HealthRecord for animal ${animalId} not found`);

      const dto = toResponseDTO(hr);
      validateHealthRecordResponse(dto);
      return dto;
    },

    async addMedicalCare(healthRecordId: string, dto: AddMedicalCareDTO): Promise<HealthRecordResponseDTO> {
      validateMedicalCareInput(dto);

      const hr = await repository.getById(healthRecordId, true);
      if (!hr) throw new createHttpError.NotFound(`HealthRecord with id ${healthRecordId} not found`);

      const medicalCare = new MedicalCare({
        id: crypto.randomUUID(),
        healthRecordId: hr.id,
        veterinarianId: dto.veterinarianId,
        description: dto.description,
        careDate: dto.careDate,
        createdAt: new Date(),
        isDeleted: false,
      });

      hr.addMedicalCare(medicalCare);

      const saved = await repository.update(hr, true);
      if (!saved)
        throw new createHttpError.InternalServerError(`Failed to add MedicalCare to HealthRecord ${healthRecordId}`);

      const response = toResponseDTO(saved);
      validateHealthRecordResponse(response);
      return response;
    },

    async removeMedicalCare(healthRecordId: string, medicalCareId: string): Promise<HealthRecordResponseDTO> {
      const hr = await repository.getById(healthRecordId, true);
      if (!hr) throw new createHttpError.NotFound(`HealthRecord with id ${healthRecordId} not found`);

      try {
        hr.removeMedicalCare(medicalCareId);
      } catch (err: any) {
        throw new createHttpError.NotFound(err.message);
      }

      const saved = await repository.update(hr, true);
      if (!saved)
        throw new createHttpError.InternalServerError(`Failed to update HealthRecord with id ${healthRecordId}`);

      const response = toResponseDTO(saved);
      validateHealthRecordResponse(response);
      return response;
    },
  };
};

// DTOs
export interface HealthRecordCreateDTO {
  animalId: string;
  description: string;
  recordDate: Date;
}

export interface HealthRecordUpdateDTO extends HealthRecordCreateDTO {
  id: string;
}

export interface HealthRecordResponseDTO {
  id: string;
  animalId: string;
  description: string;
  recordDate: Date;
  medicalCares?: MedicalCareResponseDTO[];
}

export interface AddMedicalCareDTO {
  veterinarianId: string;
  description: string;
  careDate: Date;
}

// Validations
const validateHealthRecordInput = (dto: HealthRecordCreateDTO | HealthRecordUpdateDTO) => {
  if (!dto.animalId || typeof dto.animalId !== "string") {
    throw new createHttpError.BadRequest("animalId is required and must be a string");
  }
  if (!dto.description || typeof dto.description !== "string" || dto.description.trim().length < 3) {
    throw new createHttpError.BadRequest("description must be a string with at least 3 characters");
  }
  if (!dto.recordDate || !(dto.recordDate instanceof Date)) {
    throw new createHttpError.BadRequest("recordDate is required and must be a Date");
  }
  if (dto.recordDate > new Date()) {
    throw new createHttpError.BadRequest("recordDate cannot be in the future");
  }
};

const validateMedicalCareInput = (dto: AddMedicalCareDTO) => {
  if (!dto.veterinarianId || typeof dto.veterinarianId !== "string") {
    throw new createHttpError.BadRequest("veterinarianId is required and must be a string");
  }
  if (!dto.description || typeof dto.description !== "string" || dto.description.trim().length < 3) {
    throw new createHttpError.BadRequest("description must be a string with at least 3 characters");
  }
  if (!dto.careDate || !(dto.careDate instanceof Date)) {
    throw new createHttpError.BadRequest("careDate is required and must be a Date");
  }
  if (dto.careDate > new Date()) {
    throw new createHttpError.BadRequest("careDate cannot be in the future");
  }
};

const validateHealthRecordResponse = (dto: HealthRecordResponseDTO) => {
  if (!dto.id || typeof dto.id !== "string") {
    throw new createHttpError.InternalServerError("Response id is invalid");
  }
  if (!dto.animalId || typeof dto.animalId !== "string") {
    throw new createHttpError.InternalServerError("Response animalId is invalid");
  }
  if (!dto.recordDate || !(dto.recordDate instanceof Date)) {
    throw new createHttpError.InternalServerError("Response recordDate is invalid");
  }
  if (dto.medicalCares) {
    dto.medicalCares.forEach((mc) => {
      if (!mc.id || typeof mc.id !== "string") {
        throw new createHttpError.InternalServerError("MedicalCare id is invalid");
      }
      if (!mc.description || typeof mc.description !== "string" || mc.description.trim().length < 3) {
        throw new createHttpError.InternalServerError("MedicalCare description is invalid");
      }
      if (!mc.careDate || !(mc.careDate instanceof Date)) {
        throw new createHttpError.InternalServerError("MedicalCare careDate is invalid");
      }
    });
  }
};