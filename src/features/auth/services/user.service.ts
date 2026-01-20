import { randomUUID } from "crypto";
import bcrypt from "bcrypt";
import { User } from "../models/User.model";
import { UserRepository } from "../repositories/user.repository";

export interface UserService {
    getById(id: string): Promise<UserResponseDTO | null>;
    getAll(): Promise<UserResponseDTO[]>;
    create(dto: CreateUserDTO): Promise<UserResponseDTO>;
    update(dto: UpdateUserDTO): Promise<UserResponseDTO>;
    delete(id: string): Promise<void>;
}

export const UserServiceImpl = (
    userRepository: UserRepository
): UserService => ({
    async getById(id: string): Promise<UserResponseDTO | null> {
        const user = await userRepository.getById(id);
        return user ? toUserResponseDTO(user) : null;
    },

    async getAll(): Promise<UserResponseDTO[]> {
        const users = await userRepository.getAll();
        return users.map(toUserResponseDTO);
    },

    async create(dto: CreateUserDTO): Promise<UserResponseDTO> {
        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const user = new User({
            id: randomUUID(),
            email: dto.email,
            password: hashedPassword,
            roleId: dto.roleId,
            createdAt: new Date(),
            isDeleted: false,
        });

        const savedUser = await userRepository.create(user);
        return toUserResponseDTO(savedUser);
    },

    async update(dto: UpdateUserDTO): Promise<UserResponseDTO> {
        const existing = await userRepository.getById(dto.id);
        if (!existing) throw new Error("User not found");

        const updatedUser = new User({
            id: existing.id,
            email: dto.email ?? existing.email,
            password: dto.password
                ? await bcrypt.hash(dto.password, 10)
                : existing.password,
            roleId: dto.roleId ?? existing.roleId,
            createdAt: existing.createdAt,
            updatedAt: new Date(),
            isDeleted: existing.deleted,
        });

        const saved = await userRepository.update(updatedUser);
        return toUserResponseDTO(saved);
    },

    async delete(id: string): Promise<void> {
        await userRepository.delete(id);
    },
});

export interface CreateUserDTO {
    email: string;
    password: string;
    roleId: string;
}

export interface UpdateUserDTO {
    id: string;
    email?: string;
    password?: string;
    roleId?: string;
}

export interface UserResponseDTO {
    id: string;
    email: string;
    roleId: string;
}

const toUserResponseDTO = (user: User): UserResponseDTO => ({
    id: user.id,
    email: user.email,
    roleId: user.roleId,
});
