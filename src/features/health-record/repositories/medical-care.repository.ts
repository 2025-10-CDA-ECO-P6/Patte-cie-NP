import { Prisma, PrismaClient } from "../../../../generated/prisma/client";
import { BasePrismaRepository, BaseRepository, PrismaMapper } from "../../../core/bases/BaseRepository";
import { MedicalCare } from "../models/MedicalCare.model";
import { MedicalCareTag } from "../models/MedicalCareTag";
import { MedicalCareVaccine } from "../models/MedicalCareVaccine.model";
import { Tag } from "../models/Tag.model";
import { Vaccine } from "../models/Vaccine.model";
import { VaccineType } from "../models/VaccinType.model";

export interface MedicalCareRepository extends BaseRepository<MedicalCare> {
  getByHealthRecordId(healthRecordId: string): Promise<MedicalCare[]>;
  getByIdWithRelations(id: string): Promise<MedicalCare | null>;
}

export const MedicalCareRepositoryImpl = (prisma: PrismaClient): MedicalCareRepository => {
  const base = BasePrismaRepository<MedicalCare, PrismaMedicalCareCreate, PrismaMedicalCareUpdate>({
    prisma,
    modelName: "medicalCare",
    mapper: MedicalCareMapper,
  });

  return {
    ...base,

    async getByHealthRecordId(healthRecordId: string): Promise<MedicalCare[]> {
      const records = await prisma.medicalCare.findMany({
        where: {
          healthRecordId,
          isDeleted: false,
        },
        include: {
          tags: { where: { isDeleted: false }, include: { tag: true } },
          vaccines: { where: { isDeleted: false }, include: { vaccine: { include: { vaccineType: true } } } },
        },
      });

      return records.map(MedicalCareMapper.toDomain);
    },

    async getByIdWithRelations(id: string): Promise<MedicalCare | null> {
      const record = await prisma.medicalCare.findUnique({
        where: { id },
        include: {
          tags: { where: { isDeleted: false }, include: { tag: true } },
          vaccines: { where: { isDeleted: false }, include: { vaccine: { include: { vaccineType: true } } } },
        },
      });

      return record ? MedicalCareMapper.toDomain(record) : null;
    },
  };
};

type PrismaMedicalCareWithRelations = Prisma.MedicalCareGetPayload<{
  include: {
    tags: { where: { isDeleted: false }; include: { tag: true } };
    vaccines: { where: { isDeleted: false }; include: { vaccine: { include: { vaccineType: true } } } };
  };
}>;

export const MedicalCareMapper = {
  toDomain(record: PrismaMedicalCareWithRelations | any): MedicalCare {
    return new MedicalCare({
      id: record.id,
      healthRecordId: record.healthRecordId,
      veterinarianId: record.veterinarianId,
      type: record.type,
      description: record.description,
      careDate: record.careDate,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt ?? undefined,
      isDeleted: record.isDeleted,
      tags: record.tags?.map(
        (mt: any) =>
          new MedicalCareTag({
            id: `${mt.medicalCareId}_${mt.tagId}`,
            medicalCareId: mt.medicalCareId,
            tagId: mt.tagId,
            createdAt: mt.createdAt,
            updatedAt: mt.updatedAt ?? undefined,
            isDeleted: mt.isDeleted,
            tag: mt.tag
              ? new Tag({
                  id: mt.tag.id,
                  name: mt.tag.name,
                  createdAt: mt.tag.createdAt,
                  updatedAt: mt.tag.updatedAt ?? undefined,
                  isDeleted: mt.tag.isDeleted,
                })
              : undefined,
          })
      ),
      vaccines: record.vaccines?.map(
        (mv: any) =>
          new MedicalCareVaccine({
            id: `${mv.medicalCareId}_${mv.vaccineId}`,
            medicalCareId: mv.medicalCareId,
            vaccineId: mv.vaccineId,
            createdAt: mv.createdAt,
            updatedAt: mv.updatedAt ?? undefined,
            isDeleted: mv.isDeleted,
            vaccine: mv.vaccine
              ? new Vaccine({
                  id: mv.vaccine.id,
                  vaccineTypeId: mv.vaccine.vaccineTypeId,
                  name: mv.vaccine.name,
                  createdAt: mv.vaccine.createdAt,
                  updatedAt: mv.vaccine.updatedAt ?? undefined,
                  isDeleted: mv.vaccine.isDeleted,
                  vaccineType: mv.vaccine.vaccineType
                    ? new VaccineType({
                        id: mv.vaccine.vaccineType.id,
                        name: mv.vaccine.vaccineType.name,
                        createdAt: mv.vaccine.vaccineType.createdAt,
                        updatedAt: mv.vaccine.vaccineType.updatedAt ?? undefined,
                        isDeleted: mv.vaccine.vaccineType.isDeleted,
                      })
                    : undefined,
                })
              : undefined,
          })
      ),
    });
  },

  toCreate(entity: MedicalCare) {
    return {
      id: entity.id,
      healthRecordId: entity.healthRecordId,
      veterinarianId: entity.veterinarianId,
      type: entity.type,
      description: entity.description,
      careDate: entity.careDate,
      createdAt: entity.createdAt,
      isDeleted: entity.deleted,
    };
  },

  toUpdate(entity: MedicalCare) {
    return {
      type: entity.type,
      description: entity.description,
      careDate: entity.careDate,
      updatedAt: new Date(),
      isDeleted: entity.deleted,
    };
  },
};

type PrismaMedicalCareCreate = ReturnType<typeof MedicalCareMapper.toCreate>;
type PrismaMedicalCareUpdate = ReturnType<typeof MedicalCareMapper.toUpdate>;
