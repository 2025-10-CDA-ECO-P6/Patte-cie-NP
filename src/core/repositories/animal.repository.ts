import { PrismaClient, Animal as PrismaAnimal } from "../../../generated/prisma/client";
import { Animal } from "../models/Animal.model";

export interface AnimalRepository {
  getById(id: string): Promise<Animal | null>;
  getAll(): Promise<Animal[]>;
  create(animal: Animal): Promise<Animal>;
  update(animal: Animal): Promise<Animal>;
  delete(id: string): Promise<void>;
}

export const AnimalRepositoryImpl = (prisma: PrismaClient): AnimalRepository => ({
  async getById(id: string): Promise<Animal | null> {
    const record = await prisma.animal.findUnique({
      where: { id, isDeleted: false },
    });

    return record ? toDomainAnimal(record) : null;
  },

  async getAll(): Promise<Animal[]> {
    const records = await prisma.animal.findMany({
      where: { isDeleted: false },
    });

    return records.map(toDomainAnimal);
  },

  async create(animal: Animal): Promise<Animal> {
    const record = await prisma.animal.create({
      data: {
        id: animal.id,
        name: animal.name,
        birthDate: animal.birthDate,
        identification: animal.identification,
        createdAt: animal.createdAt,
        isDeleted: animal.deleted,
      },
    });

    return toDomainAnimal(record);
  },

  async update(animal: Animal): Promise<Animal> {
    const record = await prisma.animal.update({
      where: { id: animal.id },
      data: {
        name: animal.name,
        birthDate: animal.birthDate,
        identification: animal.identification,
        updatedAt: new Date(),
        isDeleted: animal.deleted,
      },
    });

    return toDomainAnimal(record);
  },

  async delete(id: string): Promise<void> {
    await prisma.animal.update({
      where: { id },
      data: {
        isDeleted: true,
        updatedAt: new Date(),
      },
    });
  },
});

const toDomainAnimal = (record: PrismaAnimal): Animal =>
  new Animal({
    id: record.id,
    name: record.name,
    birthDate: record.birthDate,
    identification: record.identification ?? undefined,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt ?? undefined,
    isDeleted: record.isDeleted,
  });
