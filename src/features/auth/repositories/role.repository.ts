import { PrismaClient, Role as PrismaRole } from "../../../../generated/prisma/client";
import { Role } from "../models/role.model";

export interface RoleRepository {
    getById(id: string): Promise<Role | null>;
    getByName(name: string): Promise<Role | null>;
    getAll(): Promise<Role[]>;
    create(role: Role): Promise<Role>;
    delete(id: string): Promise<void>;
}

export const RoleRepositoryImpl = (prisma: PrismaClient): RoleRepository => ({
    async getById(id: string): Promise<Role | null> {
        const record = await prisma.role.findUnique({
            where: { id, isDeleted: false },
        });

        return record ? toDomainRole(record) : null;
    },

    async getByName(name: string): Promise<Role | null> {
        const record = await prisma.role.findUnique({
            where: { roleName: name, isDeleted: false },
        });

        return record ? toDomainRole(record) : null;
    },

    async getAll(): Promise<Role[]> {
        const records = await prisma.role.findMany({
            where: { isDeleted: false },
        });

        return records.map(toDomainRole);
    },

    async create(role: Role): Promise<Role> {
        const record = await prisma.role.create({
            data: {
                id: role.id,
                roleName: role.name,
                createdAt: role.createdAt,
                isDeleted: role.isDeleted,
            },
        });

        return toDomainRole(record);
    },

    async delete(id: string): Promise<void> {
        await prisma.role.update({
            where: { id },
            data: {
                isDeleted: true,
                updatedAt: new Date(),
            },
        });
    },
});

const toDomainRole = (record: PrismaRole): Role =>
    new Role({
        id: record.id,
        name: record.roleName as "USER" | "ADMIN",
        createdAt: record.createdAt,
        updatedAt: record.updatedAt ?? undefined,
        isDeleted: record.isDeleted,
    });
