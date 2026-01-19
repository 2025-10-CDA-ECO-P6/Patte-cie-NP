import { PrismaClient, AnimalOwner as PrismaAnimalOwner } from "../../../../generated/prisma/client";
import { AnimalOwner } from "../models/AnimalOwner.model";

export interface AnimalOwnerRepository {
  getById(id: string): Promise<AnimalOwner | null>;

  getActiveByAnimalId(animalId: string): Promise<AnimalOwner | null>;
  getHistoryByAnimalId(animalId: string): Promise<AnimalOwner[]>;

  create(link: AnimalOwner): Promise<AnimalOwner>;
  closeOwnership(id: string, endDate: Date): Promise<void>;
}

export const AnimalOwnerRepositoryImpl = (prisma: PrismaClient): AnimalOwnerRepository => ({
  async getById(id: string): Promise<AnimalOwner | null> {
    const record = await prisma.animalOwner.findUnique({
      where: { id, isDeleted: false },
    });

    return record ? toDomainAnimalOwner(record) : null;
  },

  async getActiveByAnimalId(animalId: string): Promise<AnimalOwner | null> {
    const record = await prisma.animalOwner.findFirst({
      where: {
        animalId,
        endDate: null,
        isDeleted: false,
      },
    });

    return record ? toDomainAnimalOwner(record) : null;
  },

  async getHistoryByAnimalId(animalId: string): Promise<AnimalOwner[]> {
    const records = await prisma.animalOwner.findMany({
      where: {
        animalId,
        isDeleted: false,
      },
      orderBy: {
        startDate: "desc",
      },
    });

    return records.map(toDomainAnimalOwner);
  },

  async create(link: AnimalOwner): Promise<AnimalOwner> {
    const record = await prisma.animalOwner.create({
      data: {
        id: link.id,
        animalId: link.animalId,
        ownerId: link.ownerId,
        startDate: link.startDate,
        endDate: link.endDate,
        createdAt: link.createdAt,
        isDeleted: link.deleted,
      },
    });

    return toDomainAnimalOwner(record);
  },

  async closeOwnership(id: string, endDate: Date): Promise<void> {
    await prisma.animalOwner.update({
      where: { id },
      data: {
        endDate,
        updatedAt: new Date(),
      },
    });
  },
});

const toDomainAnimalOwner = (record: PrismaAnimalOwner): AnimalOwner =>
  new AnimalOwner({
    id: record.id,
    animalId: record.animalId,
    ownerId: record.ownerId,
    startDate: record.startDate,
    endDate: record.endDate ?? undefined,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt ?? undefined,
    isDeleted: record.isDeleted,
  });
