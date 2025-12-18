import { Prisma, PrismaClient} from "../../../../generated/prisma/client";
import { BasePrismaRepository, BaseRepository } from "../../../core/bases/BaseRepository";
import { HealthRecord } from "../models/HealthRecord.model";
import { MedicalCare } from "../models/MedicalCare.model";
import { MedicalCareTag } from "../models/MedicalCareTag";
import { MedicalCareVaccine } from "../models/MedicalCareVaccine.model";
import { Tag } from "../models/Tag.model";
import { Vaccine } from "../models/Vaccine.model";
import { VaccineType } from "../models/VaccinType.model";

export interface HealthRecordRepository extends BaseRepository<HealthRecord> {
  getByAnimalId(animalId: string): Promise<HealthRecord | null>;
  getByIdWithRelations(id: string): Promise<HealthRecord | null>;
}

export const HealthRecordRepositoryImpl = (prisma: PrismaClient): HealthRecordRepository => {
  const base = BasePrismaRepository<HealthRecord, PrismaHealthRecordCreate, PrismaHealthRecordUpdate>({
    prisma,
    modelName: "healthRecord",
    mapper: HealthRecordMapper,
  });

  return {
    ...base,

    async getByAnimalId(animalId: string): Promise<HealthRecord | null> {
      const record = await prisma.healthRecord.findFirst({
        where: { animalId, isDeleted: false },
      });

      return record ? HealthRecordMapper.toDomain(record) : null;
    },

    async getByIdWithRelations(id: string): Promise<HealthRecord | null> {
      const record = await prisma.healthRecord.findUnique({
        where: { id },
        include: {
          medicalCares: {
            where: { isDeleted: false },
            include: {
              tags: { where: { isDeleted: false }, include: { tag: true } },
              vaccines: { where: { isDeleted: false }, include: { vaccine: { include: { vaccineType: true } } } },
            },
          },
        },
      });

      return record ? HealthRecordMapper.toDomain(record) : null;
    },
  };
};

type PrismaHealthRecordWithRelations = Prisma.HealthRecordGetPayload<{
  include: {
    medicalCares: {
      where: { isDeleted: false };
      include: {
        tags: { where: { isDeleted: false }; include: { tag: true } };
        vaccines: { where: { isDeleted: false }; include: { vaccine: { include: { vaccineType: true } } } };
      };
    };
  };
}>;

export const HealthRecordMapper = {
  toDomain(record: PrismaHealthRecordWithRelations | any): HealthRecord {
    return new HealthRecord({
      id: record.id,
      animalId: record.animalId,
      description: record.description,
      recordDate: record.recordDate,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt ?? undefined,
      isDeleted: record.isDeleted,
      medicalCares: record.medicalCares?.map(
        (mc: any) =>
          new MedicalCare({
            id: mc.id,
            healthRecordId: mc.healthRecordId,
            veterinarianId: mc.veterinarianId,
            type: mc.type,
            description: mc.description,
            careDate: mc.careDate,
            createdAt: mc.createdAt,
            updatedAt: mc.updatedAt ?? undefined,
            isDeleted: mc.isDeleted,
            tags: mc.tags?.map(
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
            vaccines: mc.vaccines?.map(
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
          })
      ),
    });
  },

  toCreate(entity: HealthRecord) {
    return {
      id: entity.id,
      animalId: entity.animalId,
      description: entity.description,
      recordDate: entity.recordDate,
      createdAt: entity.createdAt,
      isDeleted: entity.deleted,
    };
  },

  toUpdate(entity: HealthRecord) {
    return {
      description: entity.description,
      recordDate: entity.recordDate,
      updatedAt: new Date(),
      isDeleted: entity.deleted,
    };
  },
};

type PrismaHealthRecordCreate = ReturnType<typeof HealthRecordMapper.toCreate>;
type PrismaHealthRecordUpdate = ReturnType<typeof HealthRecordMapper.toUpdate>;