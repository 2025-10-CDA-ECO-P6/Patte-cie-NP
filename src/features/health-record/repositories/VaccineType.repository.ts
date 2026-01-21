import { PrismaClient } from "../../../../generated/prisma/client";
import { BaseRepository, BasePrismaRepository } from "../../../core/bases/BaseRepository";
import { VaccineType } from "../models/VaccinType.model";

export interface VaccineTypeRepository extends BaseRepository<VaccineType> {
  getByName(name: string, withRelations?: boolean): Promise<VaccineType | null>;
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
        include: withRelations ? {} : undefined, // ici tu peux ajouter relations si besoin
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
      defaultValidityDays: record.defaultValidityDays,
      notes: record.notes,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt ?? undefined,
      isDeleted: record.isDeleted,
    });
  },

  toCreate(entity: VaccineType) {
    return {
      id: entity.id,
      name: entity.name,
      defaultValidityDays: entity.defaultValidityDays,
      notes: entity.notes,
      createdAt: entity.createdAt,
      isDeleted: entity.deleted,
    };
  },

  toUpdate(entity: VaccineType) {
    return {
      name: entity.name,
      defaultValidityDays: entity.defaultValidityDays,
      notes: entity.notes,
      updatedAt: new Date(),
      isDeleted: entity.deleted,
    };
  },
};

type PrismaVaccineTypeCreate = ReturnType<typeof VaccineTypeMapper.toCreate>;
type PrismaVaccineTypeUpdate = ReturnType<typeof VaccineTypeMapper.toUpdate>;