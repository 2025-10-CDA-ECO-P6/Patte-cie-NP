import createHttpError from "http-errors";
import { BaseApiService, BaseApiServiceImpl } from "../../../core/bases/BaseApiService";
import { MedicalCare } from "../models/MedicalCare.model";
import { Tag } from "../models/Tag.model";
import { Vaccine } from "../models/Vaccine.model";
import { MedicalCareRepository } from "../repositories/MedicalCare.repository";
import { TagRepository } from "../repositories/Tag.repository";
import { VaccineRepository } from "../repositories/Vaccine.repository";

export interface MedicalCareService
  extends BaseApiService<MedicalCare, MedicalCareCreateDTO, MedicalCareUpdateDTO, MedicalCareResponseDTO> {
  addTag(medicalCareId: string, dto: AddTagDTO): Promise<MedicalCareResponseDTO>;
  removeTag(medicalCareId: string, tagId: string): Promise<MedicalCareResponseDTO>;
  addVaccine(medicalCareId: string, dto: AddVaccineDTO): Promise<MedicalCareResponseDTO>;
  removeVaccine(medicalCareId: string, vaccineId: string): Promise<MedicalCareResponseDTO>;
}

export const MedicalCareServiceImpl = (
  repository: MedicalCareRepository,
  tagRepository: TagRepository,
  vaccineRepository: VaccineRepository
): MedicalCareService => {
  const toResponseDTO = (mc: MedicalCare): MedicalCareResponseDTO => {
    const dto: MedicalCareResponseDTO = {
      id: mc.id,
      healthRecordId: mc.healthRecordId,
      veterinarianId: mc.veterinarianId,
      description: mc.description,
      careDate: mc.careDate,
      tags: mc.tags.map((t) => ({ id: t.tagId, name: t.tag?.name })),
      vaccines: mc.vaccines.map((v) => ({ id: v.vaccineId, name: v.vaccine?.name })),
    };
    validateMedicalCareResponse(dto);
    return dto;
  };

  const createDomain = (dto: MedicalCareCreateDTO): MedicalCare => {
    validateMedicalCareInput(dto);
    return new MedicalCare({
      id: crypto.randomUUID(),
      healthRecordId: dto.healthRecordId,
      veterinarianId: dto.veterinarianId,
      description: dto.description,
      careDate: dto.careDate,
      createdAt: new Date(),
      isDeleted: false,
    });
  };

  const updateDomain = (existing: MedicalCare, dto: MedicalCareUpdateDTO): MedicalCare => {
    validateMedicalCareInput(dto);
    existing.setDescription(dto.description);
    existing.setCareDate(dto.careDate);
    return existing;
  };

  const baseService = BaseApiServiceImpl(
    repository,
    toResponseDTO,
    createDomain,
    updateDomain,
    validateMedicalCareInput,
    validateMedicalCareResponse
  );

  return {
    ...baseService,

    async addTag(medicalCareId: string, dto: AddTagDTO) {
      validateAddTagInput(dto);

      const mc = await repository.getById(medicalCareId, true);
      if (!mc) throw new createHttpError.NotFound(`MedicalCare with id ${medicalCareId} not found`);

      const tag = await tagRepository.getById(dto.tagId);
      if (!tag) throw new createHttpError.NotFound(`Tag with id ${dto.tagId} not found`);

      mc.addTag(tag);

      const saved = await repository.update(mc, true);
      if (!saved) throw new createHttpError.InternalServerError(`Failed to update MedicalCare with id ${mc.id}`);

      return toResponseDTO(saved);
    },

    async removeTag(medicalCareId: string, tagId: string) {
      const mc = await repository.getById(medicalCareId, true);
      if (!mc) throw new createHttpError.NotFound(`MedicalCare with id ${medicalCareId} not found`);

      mc.removeTag(tagId);

      const saved = await repository.update(mc, true);
      if (!saved) throw new createHttpError.InternalServerError(`Failed to update MedicalCare with id ${mc.id}`);

      return toResponseDTO(saved);
    },

    async addVaccine(medicalCareId: string, dto: AddVaccineDTO) {
      validateAddVaccineInput(dto);

      const mc = await repository.getById(medicalCareId, true);
      if (!mc) throw new createHttpError.NotFound(`MedicalCare with id ${medicalCareId} not found`);

      const vaccine = await vaccineRepository.getById(dto.vaccineId);
      if (!vaccine) throw new createHttpError.NotFound(`Vaccine with id ${dto.vaccineId} not found`);

      mc.addVaccine(vaccine);

      const saved = await repository.update(mc, true);
      if (!saved) throw new createHttpError.InternalServerError(`Failed to update MedicalCare with id ${mc.id}`);

      return toResponseDTO(saved);
    },

    async removeVaccine(medicalCareId: string, vaccineId: string) {
      const mc = await repository.getById(medicalCareId, true);
      if (!mc) throw new createHttpError.NotFound(`MedicalCare with id ${medicalCareId} not found`);

      mc.removeVaccine(vaccineId);

      const saved = await repository.update(mc, true);
      if (!saved) throw new createHttpError.InternalServerError(`Failed to update MedicalCare with id ${mc.id}`);

      return toResponseDTO(saved);
    },
  };
};

export interface MedicalCareResponseDTO {
  id: string;
  healthRecordId: string;
  veterinarianId: string;
  description: string;
  careDate: Date;
  tags: { id: string; name?: string }[];
  vaccines: { id: string; name?: string }[];
}

export interface MedicalCareCreateDTO {
  healthRecordId: string;
  veterinarianId: string;
  description: string;
  careDate: Date;
  tags?: Tag[];
  vaccines?: Vaccine[];
}

export interface MedicalCareUpdateDTO extends MedicalCareCreateDTO {
  id: string;
}

export interface AddTagDTO {
  tagId: string;
}

export interface AddVaccineDTO {
  vaccineId: string;
}

const validateMedicalCareInput = (dto: MedicalCareCreateDTO | MedicalCareUpdateDTO) => {
  if (!dto.healthRecordId || typeof dto.healthRecordId !== "string") {
    throw new createHttpError.BadRequest("healthRecordId is required and must be a string");
  }
  if (!dto.veterinarianId || typeof dto.veterinarianId !== "string") {
    throw new createHttpError.BadRequest("veterinarianId is required and must be a string");
  }
  if (!dto.description || typeof dto.description !== "string") {
    throw new createHttpError.BadRequest("description is required and must be a string");
  }
  if (!dto.careDate || !(dto.careDate instanceof Date)) {
    throw new createHttpError.BadRequest("careDate is required and must be a Date");
  }
};

const validateAddTagInput = (dto: AddTagDTO) => {
  if (!dto.tagId || typeof dto.tagId !== "string") {
    throw new createHttpError.BadRequest("tagId is required and must be a string");
  }
};

const validateAddVaccineInput = (dto: AddVaccineDTO) => {
  if (!dto.vaccineId || typeof dto.vaccineId !== "string") {
    throw new createHttpError.BadRequest("vaccineId is required and must be a string");
  }
};

const validateMedicalCareResponse = (dto: MedicalCareResponseDTO) => {
  if (!dto.id || typeof dto.id !== "string") throw new createHttpError.InternalServerError("Response id is invalid");
  if (!dto.healthRecordId || typeof dto.healthRecordId !== "string")
    throw new createHttpError.InternalServerError("Response healthRecordId is invalid");
  if (!dto.veterinarianId || typeof dto.veterinarianId !== "string")
    throw new createHttpError.InternalServerError("Response veterinarianId is invalid");
  if (!dto.careDate || !(dto.careDate instanceof Date))
    throw new createHttpError.InternalServerError("Response careDate is invalid");

  dto.tags.forEach((t) => {
    if (!t.id || typeof t.id !== "string") throw new createHttpError.InternalServerError("Tag id is invalid");
  });

  dto.vaccines.forEach((v) => {
    if (!v.id || typeof v.id !== "string") throw new createHttpError.InternalServerError("Vaccine id is invalid");
  });
};