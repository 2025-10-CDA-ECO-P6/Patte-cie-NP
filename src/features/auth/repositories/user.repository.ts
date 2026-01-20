import { PrismaClient, User as PrismaUser } from "../../../../generated/prisma/client";
import { User } from "../models/User.model";

export interface UserRepository {
    getById(id: string): Promise<User | null>;
    getAll(): Promise<User[]>;
    getByEmail(email: string): Promise<User | null>;
    create(user: User): Promise<User>;
    update(user: User): Promise<User>;
    delete(id: string): Promise<void>;
}

export const UserRepositoryImpl = (
    prisma: PrismaClient
): UserRepository => ({
    async getById(id: string): Promise<User | null> {
        const record = await prisma.user.findUnique({
            where: { id },
        });

        if (!record || record.isDeleted) return null;

        return toDomainUser(record);
    },

    async getAll(): Promise<User[]> {
        const records = await prisma.user.findMany({
            where: { isDeleted: false },
        });

        return records.map(toDomainUser);
    },

    async getByEmail(email: string): Promise<User | null> {
        const record = await prisma.user.findUnique({
            where: { email },
        });

        if (!record || record.isDeleted) return null;

        return toDomainUser(record);
    },

    async create(user: User): Promise<User> {
        const record = await prisma.user.create({
            data: {
                id: user.id,
                email: user.email,
                password: user.password,
                roleId: user.roleId,
                createdAt: user.createdAt,
                isDeleted: user.deleted,
            },
        });

        return toDomainUser(record);
    },

    async update(user: User): Promise<User> {
        const record = await prisma.user.update({
            where: { id: user.id },
            data: {
                email: user.email,
                password: user.password,
                roleId: user.roleId,
                updatedAt: new Date(),
                isDeleted: user.deleted,
            },
        });

        return toDomainUser(record);
    },

    async delete(id: string): Promise<void> {
        await prisma.user.update({
            where: { id },
            data: {
                isDeleted: true,
                updatedAt: new Date(),
            },
        });
    },
});

const toDomainUser = (record: PrismaUser): User =>
    new User({
        id: record.id,
        email: record.email,
        password: record.password,
        roleId: record.roleId,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt ?? undefined,
        isDeleted: record.isDeleted,
    });
