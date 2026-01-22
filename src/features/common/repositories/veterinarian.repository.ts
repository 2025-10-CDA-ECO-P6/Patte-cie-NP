import { PrismaClient } from "../../../../generated/prisma/client";
import { BasePrismaRepository, BaseRepository } from "../../../core/bases/BaseRepository";
import { Veterinarian } from "../models/veterinarian.model";

export interface VeterinarianRepository extends BaseRepository<Veterinarian> {}

export const VeterinarianRepositoryImpl = (prisma: PrismaClient): VeterinarianRepository => {
  const defaultInclude = {
    medicalCares: { where: { isDeleted: false }, include: { tags: true, vaccines: true } },
  };

  const base = BasePrismaRepository<Veterinarian, PrismaVeterinarianCreate, PrismaVeterinarianUpdate>({
    prisma,
    modelName: "veterinarian",
    mapper: VeterinarianMapper,
    defaultInclude,
  });

  return {
    ...base,
  };
};

export const VeterinarianMapper = {
  toDomain(record: any): Veterinarian {
    return new Veterinarian({
      id: record.id,
      firstName: record.firstName,
      lastName: record.lastName,
      email: record.email,
      phone: record.phone,
      licenseNumber: record.licenseNumber,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt ?? undefined,
      isDeleted: record.isDeleted,
    });
  },

  toCreate(entity: Veterinarian) {
    return {
      id: entity.id,
      firstName: entity.firstName,
      lastName: entity.lastName,
      email: entity.email,
      phone: entity.phone,
      licenseNumber: entity.licenseNumber,
      createdAt: entity.createdAt,
      isDeleted: entity.deleted,
    };
  },

  toUpdate(entity: Veterinarian) {
    return {
      firstName: entity.firstName,
      lastName: entity.lastName,
      email: entity.email,
      phone: entity.phone,
      licenseNumber: entity.licenseNumber,
      updatedAt: new Date(),
      isDeleted: entity.deleted,
    };
  },
};

type PrismaVeterinarianCreate = ReturnType<typeof VeterinarianMapper.toCreate>;
type PrismaVeterinarianUpdate = ReturnType<typeof VeterinarianMapper.toUpdate>;
