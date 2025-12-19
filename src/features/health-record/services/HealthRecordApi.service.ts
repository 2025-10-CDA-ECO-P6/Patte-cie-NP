import { BaseApiService, BaseApiServiceImpl } from "../../../core/bases/BaseApiService";
import { HealthRecord } from "../models/HealthRecord.model";
import { MedicalCare } from "../models/MedicalCare.model";
import { HealthRecordRepository } from "../repositories/HealthRecord.repository";
import { MedicalCareResponseDTO } from "./MedicalCareApi.service";

export interface HealthRecordService
  extends BaseApiService<HealthRecord, HealthRecordCreateDTO, HealthRecordUpdateDTO, HealthRecordResponseDTO> {

  getByAnimalId(animalId: string): Promise<HealthRecordResponseDTO | null>;
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
      type: mc.type,
      description: mc.description,
      careDate: mc.careDate,
      tags: mc.tags.map((t) => ({ id: t.tagId, name: t.tag?.name })),
      vaccines: mc.vaccines.map((v) => ({ id: v.vaccineId, name: v.vaccine?.name })),
    })),
  });

  const createDomain = (dto: HealthRecordCreateDTO): HealthRecord =>
    new HealthRecord({
      id: crypto.randomUUID(),
      animalId: dto.animalId,
      description: dto.description,
      recordDate: dto.recordDate,
      createdAt: new Date(),
      isDeleted: false,
    });

  const updateDomain = (existing: HealthRecord, dto: HealthRecordUpdateDTO): HealthRecord => {
    existing.description = dto.description;
    existing.recordDate = dto.recordDate;
    return existing;
  };

  const baseService = BaseApiServiceImpl(repository, toResponseDTO, createDomain, updateDomain);

  return {
    ...baseService,

    async getByAnimalId(animalId: string) {
      const hr = await repository.getByAnimalId(animalId, true);
      return hr ? toResponseDTO(hr) : null;
    },

    async addMedicalCare(healthRecordId, dto) {
      const hr = await repository.getById(healthRecordId, true);
      if (!hr) throw new Error("HealthRecord not found");

      hr.addMedicalCare(
        new MedicalCare({
          id: crypto.randomUUID(),
          healthRecordId: hr.id,
          veterinarianId: dto.veterinarianId,
          type: dto.type,
          description: dto.description,
          careDate: dto.careDate,
          createdAt: new Date(),
          isDeleted: false,
        })
      );

      const saved = await repository.update(hr, true);
      return toResponseDTO(saved);
    },

    async removeMedicalCare(healthRecordId, medicalCareId) {
      const hr = await repository.getById(healthRecordId, true);
      if (!hr) throw new Error("HealthRecord not found");

      hr.removeMedicalCare(medicalCareId);

      const saved = await repository.update(hr, true);
      return toResponseDTO(saved);
    },
  };
};

export interface HealthRecordResponseDTO {
  id: string;
  animalId: string;
  description: string;
  recordDate: Date;
  medicalCares?: MedicalCareResponseDTO[];
}

export interface HealthRecordCreateDTO {
  animalId: string;
  description: string;
  recordDate: Date;
}

export interface HealthRecordUpdateDTO extends HealthRecordCreateDTO {
  id: string;
}

export interface AddMedicalCareDTO {
  veterinarianId: string;
  type: string;
  description: string;
  careDate: Date;
}
