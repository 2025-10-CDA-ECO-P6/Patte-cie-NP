import { PrismaClient } from "../../../../generated/prisma/client";
import { BasePrismaRepository, BaseRepository } from "../../../core/bases/BaseRepository";
import { Animal } from "../models/Animal.model";
import { OwnerMapper } from "./owner.repository";
import { SpeciesMapper } from "./species.repository";

export interface AnimalRepository extends BaseRepository<Animal> {}

export const AnimalRepositoryImpl = (prisma: PrismaClient): AnimalRepository => {
  const defaultInclude = {
    species: true,
    animalOwners: {
      where: { isDeleted: false },
      include: { owner: true },
    },
  };

  const base = BasePrismaRepository<Animal, PrismaAnimalCreate, PrismaAnimalUpdate>({
    prisma,
    modelName: "animal",
    mapper: AnimalMapper,
    defaultInclude,
  });

  return {
    ...base,
  };
};

export const AnimalMapper = {
  toDomain(record: any): Animal {
    const species = record.species ? SpeciesMapper.toDomain(record.species) : undefined;

    const owners =
      record.animalOwners?.map((ao: any) => ({
        ...ao,
        owner: ao.owner ? OwnerMapper.toDomain(ao.owner) : undefined,
      })) ?? [];

    return new Animal({
      id: record.id,
      speciesId: record.speciesId,
      name: record.name,
      birthDate: record.birthDate,
      identification: record.identification ?? undefined,
      photoUrl: record.photoUrl ?? undefined,
      species,
      owners,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt ?? undefined,
      isDeleted: record.isDeleted,
    });
  },

  toCreate(entity: Animal) {
    return {
      id: entity.id,
      name: entity.name,
      birthDate: entity.birthDate,
      identification: entity.identification,
      photoUrl: entity.photoUrl,
      speciesId: entity.speciesId,
      createdAt: entity.createdAt,
      isDeleted: entity.deleted,
      animalOwners: {
        create: entity.owners.map((o) => ({
          id: o.id,
          ownerId: o.ownerId,
          startDate: o.startDate,
          isDeleted: o.deleted,
          createdAt: o.createdAt,
        })),
      },
    };
  },

  toUpdate(entity: Animal) {
    const createOwners = entity.owners
      .filter((o) => !o.id)
      .map((o) => ({
        ownerId: o.ownerId,
        startDate: o.startDate,
        isDeleted: o.deleted,
        createdAt: o.createdAt,
      }));

    const updateOwners = entity.owners
      .filter((o) => o.id)
      .map((o) => ({
        where: { id: o.id },
        data: { isDeleted: o.deleted, endDate: o.endDate, updatedAt: new Date() },
      }));

    return {
      name: entity.name,
      birthDate: entity.birthDate,
      identification: entity.identification,
      photoUrl: entity.photoUrl,
      speciesId: entity.speciesId,
      updatedAt: new Date(),
      isDeleted: entity.deleted,
      animalOwners: {
        create: createOwners,
        updateMany: updateOwners,
      },
    };
  },
};

type PrismaAnimalCreate = ReturnType<typeof AnimalMapper.toCreate>;
type PrismaAnimalUpdate = ReturnType<typeof AnimalMapper.toUpdate>;
