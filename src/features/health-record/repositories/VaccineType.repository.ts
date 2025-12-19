import { PrismaClient } from "../../../../generated/prisma/client";
import { BaseRepository, BasePrismaRepository } from "../../../core/bases/BaseRepository";
import { VaccineType } from "../models/VaccinType.model";

export interface VaccineTypeRepository extends BaseRepository<VaccineType> {
  getByName(name: string): Promise<VaccineType | null>;
}

export const VaccineTypeRepositoryImpl = (prisma: PrismaClient): VaccineTypeRepository => {
  const base = BasePrismaRepository<VaccineType, PrismaVaccineTypeCreate, PrismaVaccineTypeUpdate>({
    prisma,
    modelName: "vaccineType",
    mapper: VaccineTypeMapper,
  });

  return {
    ...base,

    async getByName(name: string, withRelations = false): Promise<VaccineType | null> {
      const record = await prisma.vaccineType.findFirst({
        where: { name, isDeleted: false },
        include: withRelations ? {} : undefined,
      });

      return record ? VaccineTypeMapper.toDomain(record) : null;
    },
  };
};

export const VaccineTypeMapper = {
  toDomain(record: any): VaccineType {
    return new VaccineType({
      id: record.id,
      name: record.name,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt ?? undefined,
      isDeleted: record.isDeleted,
    });
  },

  toCreate(entity: VaccineType) {
    return {
      id: entity.id,
      name: entity.name,
      createdAt: entity.createdAt,
      isDeleted: entity.deleted,
    };
  },

  toUpdate(entity: VaccineType) {
    return {
      name: entity.name,
      updatedAt: new Date(),
      isDeleted: entity.deleted,
    };
  },
};

type PrismaVaccineTypeCreate = ReturnType<typeof VaccineTypeMapper.toCreate>;
type PrismaVaccineTypeUpdate = ReturnType<typeof VaccineTypeMapper.toUpdate>;
