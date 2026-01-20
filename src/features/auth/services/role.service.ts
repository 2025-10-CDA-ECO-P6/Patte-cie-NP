import { Role, RoleName } from "../models/role.model";
import { RoleRepository } from "../repositories/role.repository";
import { randomUUID } from "crypto";

export interface CreateRoleDTO {
    name: RoleName;
}

export interface RoleResponseDTO {
    id: string;
    name: RoleName;
    createdAt: Date;
}

export class RoleService {
    constructor(private readonly roleRepository: RoleRepository) { }

    async getAll(): Promise<RoleResponseDTO[]> {
        const roles = await this.roleRepository.getAll();
        return roles.map(toRoleResponseDTO);
    }

    async getById(id: string): Promise<RoleResponseDTO | null> {
        const role = await this.roleRepository.getById(id);
        return role ? toRoleResponseDTO(role) : null;
    }

    async create(dto: CreateRoleDTO): Promise<RoleResponseDTO> {
        const existing = await this.roleRepository.getByName(dto.name);
        if (existing) {
            throw new Error("Role already exists");
        }

        const role = new Role({
            id: randomUUID(),
            name: dto.name,
            createdAt: new Date(),
            isDeleted: false,
        });

        const saved = await this.roleRepository.create(role);
        return toRoleResponseDTO(saved);
    }
}

const toRoleResponseDTO = (role: Role): RoleResponseDTO => ({
    id: role.id,
    name: role.name,
    createdAt: role.createdAt,
});
