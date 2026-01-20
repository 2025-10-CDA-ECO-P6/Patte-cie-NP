import { PrismaClient, User as PrismaUser } from "../../../../generated/prisma/client";
import { User } from "../models/User.model";

export interface UserRepository {
    getById(id: string): Promise<User | null>;
    getByEmail(email: string): Promise<User | null>;
    create(user: User): Promise<User>;
}

export const UserRepositoryImpl = (prisma: PrismaClient): UserRepository => ({
    async getById(id: string): Promise<User | null> {
        const record = await prisma.user.findUnique({
            where: { id, isDeleted: false },
        });

        return record ? toDomainUser(record) : null;
    },

    async getByEmail(email: string): Promise<User | null> {
        const record = await prisma.user.findUnique({
            where: { email },
        });

        return record ? toDomainUser(record) : null;
    },

    async create(user: User): Promise<User> {
        const record = await prisma.user.create({
            data: {
                id: user.id,
                email: user.email,
                password: user.password,
                roleId: user.roleId,
                createdAt: user.createdAt,
                isDeleted: user.isDeleted,
            },
        });

        return toDomainUser(record);
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
