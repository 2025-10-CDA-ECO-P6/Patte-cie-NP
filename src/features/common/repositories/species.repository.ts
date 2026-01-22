import { PrismaClient } from "../../../../generated/prisma/client";
import { BasePrismaRepository, BaseRepository } from "../../../core/bases/BaseRepository";
import { Species } from "../models/Species.model";

export interface SpeciesRepository extends BaseRepository<Species> {}

export const SpeciesRepositoryImpl = (prisma: PrismaClient): SpeciesRepository => {
  const base = BasePrismaRepository<Species, PrismaSpeciesCreate, PrismaSpeciesUpdate>({
    prisma,
    modelName: "species",
    mapper: SpeciesMapper,
  });

  return {
    ...base,
  };
};

export const SpeciesMapper = {
  toDomain(record: any): Species {
    return new Species({
      id: record.id,
      name: record.name,
      description: record.description ?? undefined,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt ?? undefined,
      isDeleted: record.isDeleted,
    });
  },

  toCreate(entity: Species) {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      createdAt: entity.createdAt,
      isDeleted: entity.deleted,
    };
  },

  toUpdate(entity: Species) {
    return {
      name: entity.name,
      description: entity.description,
      updatedAt: new Date(),
      isDeleted: entity.deleted,
    };
  },
};

type PrismaSpeciesCreate = ReturnType<typeof SpeciesMapper.toCreate>;
type PrismaSpeciesUpdate = ReturnType<typeof SpeciesMapper.toUpdate>;
