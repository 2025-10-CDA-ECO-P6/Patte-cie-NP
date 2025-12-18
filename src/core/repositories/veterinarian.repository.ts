import { PrismaClient, Veterinarian as PrismaVeterinarian } from "../../../generated/prisma/client";
import { Veterinarian } from "../models/veterinarian.model";

export interface VeterinarianRepository {
    getById(id: string): Promise<Veterinarian | null>;
    getAll(): Promise<Veterinarian[]>;
    create(veterinarian: Veterinarian): Promise<Veterinarian>;
    update(veterinarian: Veterinarian): Promise<Veterinarian>;
    delete(id: string): Promise<void>;
}

export const VeterinarianRepositoryImpl = (
    prisma: PrismaClient
): VeterinarianRepository => ({
    async getById(id: string): Promise<Veterinarian | null> {
        const record = await prisma.veterinarian.findUnique({
            where: { id, isDeleted: false },
        });

        return record ? toDomainVeterinarian(record) : null;
    },

    async getAll(): Promise<Veterinarian[]> {
        const records = await prisma.veterinarian.findMany({
            where: { isDeleted: false },
        });

        return records.map(toDomainVeterinarian);
    },

    async create(veterinarian: Veterinarian): Promise<Veterinarian> {
        const record = await prisma.veterinarian.create({
            data: {
                id: veterinarian.id,
                firstName: veterinarian.firstName,
                lastName: veterinarian.lastName,
                email: veterinarian.email,
                phone: veterinarian.phone,
                licenseNumber: veterinarian.licenseNumber,
                createdAt: veterinarian.createdAt,
                isDeleted: veterinarian.deleted,
            },
        });

        return toDomainVeterinarian(record);
    },

    async update(veterinarian: Veterinarian): Promise<Veterinarian> {
        const record = await prisma.veterinarian.update({
            where: { id: veterinarian.id },
            data: {
                firstName: veterinarian.firstName,
                lastName: veterinarian.lastName,
                email: veterinarian.email,
                phone: veterinarian.phone,
                licenseNumber: veterinarian.licenseNumber,
                updatedAt: new Date(),
                isDeleted: veterinarian.deleted,
            },
        });

        return toDomainVeterinarian(record);
    },

    async delete(id: string): Promise<void> {
        await prisma.veterinarian.update({
            where: { id },
            data: {
                isDeleted: true,
                updatedAt: new Date(),
            },
        });
    },
});

const toDomainVeterinarian = (record: PrismaVeterinarian): Veterinarian =>
    new Veterinarian({
        id: record.id,
        firstName: record.firstName,
        lastName: record.lastName,
        email: record.email,
        phone: record.phone,
        licenseNumber: record.licenseNumber,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt ?? undefined,
        isDeleted: record.isDeleted
    });
