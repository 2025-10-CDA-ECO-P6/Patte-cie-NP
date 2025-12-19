import { Prisma, PrismaClient } from "../../../../generated/prisma/client";
import { BasePrismaRepository, BaseRepository, PrismaMapper } from "../../../core/bases/BaseRepository";
import { MedicalCare } from "../models/MedicalCare.model";
import { MedicalCareTag } from "../models/MedicalCareTag";
import { MedicalCareVaccine } from "../models/MedicalCareVaccine.model";
import { Tag } from "../models/Tag.model";
import { Vaccine } from "../models/Vaccine.model";
import { VaccineType } from "../models/VaccinType.model";

export interface MedicalCareRepository extends BaseRepository<MedicalCare> {
  getByHealthRecordId(healthRecordId: string, withRelations?: boolean): Promise<MedicalCare[]>;
}

export const MedicalCareRepositoryImpl = (prisma: PrismaClient): MedicalCareRepository => {
  const defaultInclude = {
    tags: { where: { isDeleted: false }, include: { tag: true } },
    vaccines: { where: { isDeleted: false }, include: { vaccine: { include: { vaccineType: true } } } },
  };

  const base = BasePrismaRepository<MedicalCare, PrismaMedicalCareCreate, PrismaMedicalCareUpdate>({
    prisma,
    modelName: "medicalCare",
    mapper: MedicalCareMapper,
    defaultInclude,
  });

  return {
    ...base,

    async getByHealthRecordId(healthRecordId: string, withRelations = false): Promise<MedicalCare[]> {
      const records = await prisma.medicalCare.findMany({
        where: {
          healthRecordId,
          isDeleted: false,
        },
        include: withRelations ? defaultInclude : undefined,
      });

      return records.map(MedicalCareMapper.toDomain);
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
      tags: entity.tags.map((t) => ({ tagId: t.tagId, createdAt: t.createdAt, isDeleted: t.deleted })),
      vaccines: entity.vaccines.map((v) => ({ vaccineId: v.vaccineId, createdAt: v.createdAt, isDeleted: v.deleted })),
    };
  },

  toUpdate(entity: MedicalCare) {
    const createTags = entity.tags
      .filter((t) => !t.id)
      .map((t) => ({ tagId: t.tagId, createdAt: t.createdAt, isDeleted: t.deleted }));
    const updateTags = entity.tags
      .filter((t) => t.id)
      .map((t) => ({
        where: { medicalCareId_tagId: { medicalCareId: entity.id, tagId: t.tagId } },
        data: { isDeleted: t.deleted },
      }));

    const createVaccines = entity.vaccines
      .filter((v) => !v.id)
      .map((v) => ({ vaccineId: v.vaccineId, createdAt: v.createdAt, isDeleted: v.deleted }));
    const updateVaccines = entity.vaccines
      .filter((v) => v.id)
      .map((v) => ({
        where: { medicalCareId_vaccineId: { medicalCareId: entity.id, vaccineId: v.vaccineId } },
        data: { isDeleted: v.deleted },
      }));

    return {
      type: entity.type,
      description: entity.description,
      careDate: entity.careDate,
      updatedAt: new Date(),
      isDeleted: entity.deleted,
      tags: {
        create: createTags,
        updateMany: updateTags,
      },
      vaccines: {
        create: createVaccines,
        updateMany: updateVaccines,
      },
    };
  },
};

type PrismaMedicalCareCreate = ReturnType<typeof MedicalCareMapper.toCreate>;
type PrismaMedicalCareUpdate = ReturnType<typeof MedicalCareMapper.toUpdate>;
