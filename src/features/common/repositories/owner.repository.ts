import { Owner } from "../models/Owner.model";
import { PrismaClient, Owner as PrismaOwner } from "../../../../generated/prisma/client";

export interface OwnerRepository {
  getById(id: string): Promise<Owner | null>;
  getAll(): Promise<Owner[]>;
  create(data: Owner): Promise<Owner>;
  update(data: Owner): Promise<Owner>;
  delete(id: string): Promise<void>;
}

export const OwnerRepositoryImpl = (prisma: PrismaClient): OwnerRepository => ({
  async getById(id: string): Promise<Owner | null> {
    const record = await prisma.owner.findUnique({
      where: { id, isDeleted: false },
    });

    return record ? toDomainOwner(record) : null;
  },

  async getAll(): Promise<Owner[]> {
    const records = await prisma.owner.findMany({
      where: { isDeleted: false },
    });

    return records.map(toDomainOwner);
  },

  async create(owner: Owner): Promise<Owner> {
    const record = await prisma.owner.create({
      data: {
        id: owner.id,
        firstName: owner.firstName,
        lastName: owner.lastName,
        email: owner.email,
        adresse: owner.adresse,
        phoneNumber: owner.phoneNumber,
        createdAt: owner.createdAt,
        isDeleted: owner.deleted,
      },
    });

    return toDomainOwner(record);
  },

  async update(owner: Owner): Promise<Owner> {
    const record = await prisma.owner.update({
      where: { id: owner.id },
      data: {
        firstName: owner.firstName,
        lastName: owner.lastName,
        email: owner.email,
        adresse: owner.adresse,
        phoneNumber: owner.phoneNumber,
        updatedAt: new Date(),
        isDeleted: owner.deleted,
      },
    });

    return toDomainOwner(record);
  },

  async delete(id: string): Promise<void> {
    await prisma.owner.update({
      where: { id },
      data: {
        isDeleted: true,
        updatedAt: new Date(),
      },
    });
  },
});

const toDomainOwner = (record: PrismaOwner): Owner =>
  new Owner({
    id: record.id,
    firstName: record.firstName,
    lastName: record.lastName,
    email: record.email,
    adresse: record.adresse,
    phoneNumber: record.phoneNumber,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt ?? undefined,
    isDeleted: record.isDeleted,
  });
