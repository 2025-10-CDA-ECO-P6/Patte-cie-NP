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
  const toResponseDTO = (mc: MedicalCare): MedicalCareResponseDTO => ({
    id: mc.id,
    healthRecordId: mc.healthRecordId,
    veterinarianId: mc.veterinarianId,
    type: mc.type,
    description: mc.description,
    careDate: mc.careDate,
    tags: mc.tags.map((t) => ({ id: t.tagId, name: t.tag?.name })),
    vaccines: mc.vaccines.map((v) => ({ id: v.vaccineId, name: v.vaccine?.name })),
  });

  const createDomain = (dto: MedicalCareCreateDTO): MedicalCare =>
    new MedicalCare({
      id: crypto.randomUUID(),
      healthRecordId: dto.healthRecordId,
      veterinarianId: dto.veterinarianId,
      type: dto.type,
      description: dto.description,
      careDate: dto.careDate,
      createdAt: new Date(),
      isDeleted: false,
    });

  const updateDomain = (existing: MedicalCare, dto: MedicalCareUpdateDTO): MedicalCare => {
    existing.type = dto.type;
    existing.description = dto.description;
    existing.careDate = dto.careDate;
    return existing;
  };

  const baseService = BaseApiServiceImpl(repository, toResponseDTO, createDomain, updateDomain);

  return {
    ...baseService,

    async addTag(medicalCareId, dto) {
      const mc = await repository.getById(medicalCareId, true);
      if (!mc) throw new Error("MedicalCare not found");

      const tag = await tagRepository.getById(dto.tagId);
      if (!tag) throw new Error("Tag not found");

      mc.addTag(tag);
      return toResponseDTO(await repository.update(mc, true));
    },

    async removeTag(medicalCareId, tagId) {
      const mc = await repository.getById(medicalCareId, true);
      if (!mc) throw new Error("MedicalCare not found");

      mc.removeTag(tagId);
      return toResponseDTO(await repository.update(mc, true));
    },

    async addVaccine(medicalCareId, dto) {
      const mc = await repository.getById(medicalCareId, true);
      if (!mc) throw new Error("MedicalCare not found");

      const vaccine = await vaccineRepository.getById(dto.vaccineId);
      if (!vaccine) throw new Error("Vaccine not found");

      mc.addVaccine(vaccine);
      return toResponseDTO(await repository.update(mc, true));
    },

    async removeVaccine(medicalCareId, vaccineId) {
      const mc = await repository.getById(medicalCareId, true);
      if (!mc) throw new Error("MedicalCare not found");

      mc.removeVaccine(vaccineId);
      return toResponseDTO(await repository.update(mc, true));
    },
  };
};

export interface MedicalCareResponseDTO {
  id: string;
  healthRecordId: string;
  veterinarianId: string;
  type: string;
  description: string;
  careDate: Date;
  tags: { id: string; name?: string }[];
  vaccines: { id: string; name?: string }[];
}

export interface MedicalCareCreateDTO {
  healthRecordId: string;
  veterinarianId: string;
  type: string;
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