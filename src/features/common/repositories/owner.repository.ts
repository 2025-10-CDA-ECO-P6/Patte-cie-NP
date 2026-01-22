import { Owner } from "../models/Owner.model";
import { PrismaClient } from "../../../../generated/prisma/client";
import { BasePrismaRepository, BaseRepository } from "../../../core/bases/BaseRepository";
import { AnimalMapper } from "./animal.repository";

export interface OwnerRepository extends BaseRepository<Owner> {
  getByEmail(email: string, withRelations?: boolean): Promise<Owner | null>;
}

export const OwnerRepositoryImpl = (prisma: PrismaClient): OwnerRepository => {
  const defaultInclude = {
    animalOwners: {
      where: { isDeleted: false },
      include: { animal: { include: { species: true } } },
    },
  };

  const base = BasePrismaRepository<Owner, PrismaOwnerCreate, PrismaOwnerUpdate>({
    prisma,
    modelName: "owner",
    mapper: OwnerMapper,
    defaultInclude,
  });

  return {
    ...base,

    async getByEmail(email: string, withRelations = false): Promise<Owner | null> {
      const record = await prisma.owner.findFirst({
        where: { email, isDeleted: false },
        include: withRelations ? defaultInclude : undefined,
      });
      return record ? OwnerMapper.toDomain(record) : null;
    },
  };
};

export const OwnerMapper = {
  toDomain(record: any): Owner {
    const animalOwners =
      record.animalOwners?.map((ao: any) => {
        const animal = ao.animal ? AnimalMapper.toDomain(ao.animal) : undefined;
        return { ...ao, animal };
      }) ?? [];

    return new Owner({
      id: record.id,
      firstName: record.firstName,
      lastName: record.lastName,
      email: record.email,
      address: record.adresse, // Prisma field name
      phoneNumber: record.phoneNumber,
      animalOwners,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt ?? undefined,
      isDeleted: record.isDeleted,
    });
  },

  toCreate(entity: Owner) {
    return {
      id: entity.id,
      firstName: entity.firstName,
      lastName: entity.lastName,
      email: entity.email,
      address: entity.address,
      phoneNumber: entity.phoneNumber,
      createdAt: entity.createdAt,
      isDeleted: entity.deleted,
      animalOwners: {
        create: entity.animalOwners.map((ao) => ({
          id: ao.id,
          animalId: ao.animalId,
          startDate: ao.startDate,
          isDeleted: ao.deleted,
          createdAt: ao.createdAt,
        })),
      },
    };
  },

  toUpdate(entity: Owner) {
    const createRelations = entity.animalOwners
      .filter((ao) => !ao.id)
      .map((ao) => ({
        id: ao.id,
        animalId: ao.animalId,
        startDate: ao.startDate,
        isDeleted: ao.deleted,
        createdAt: ao.createdAt,
      }));

    const updateRelations = entity.animalOwners
      .filter((ao) => ao.id)
      .map((ao) => ({
        where: { id: ao.id },
        data: { isDeleted: ao.deleted },
      }));

    return {
      firstName: entity.firstName,
      lastName: entity.lastName,
      email: entity.email,
      address: entity.address,
      phoneNumber: entity.phoneNumber,
      updatedAt: new Date(),
      isDeleted: entity.deleted,
      animalOwners: {
        create: createRelations,
        updateMany: updateRelations,
      },
    };
  },
};
type PrismaOwnerCreate = ReturnType<typeof OwnerMapper.toCreate>;
type PrismaOwnerUpdate = ReturnType<typeof OwnerMapper.toUpdate>;
