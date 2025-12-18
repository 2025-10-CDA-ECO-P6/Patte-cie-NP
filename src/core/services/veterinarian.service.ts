import { randomUUID } from "crypto";
import { Veterinarian } from "../models/veterinarian.model";
import { VeterinarianRepository } from "../repositories/veterinarian.repository";

export interface VeterinarianService {
    getById(id: string): Promise<VeterinarianResponseDTO | null>;
    getAll(): Promise<VeterinarianResponseDTO[]>;
    create(dto: CreateVeterinarianDTO): Promise<VeterinarianResponseDTO>;
    update(dto: UpdateVeterinarianDTO): Promise<VeterinarianResponseDTO>;
    delete(id: string): Promise<void>;
}

export const VeterinarianServiceImpl = (
    veterinarianRepository: VeterinarianRepository
): VeterinarianService => ({
    async getById(id: string): Promise<VeterinarianResponseDTO | null> {
        const veterinarian = await veterinarianRepository.getById(id);
        return veterinarian ? toVeterinarianResponseDTO(veterinarian) : null;
    },

    async getAll(): Promise<VeterinarianResponseDTO[]> {
        const veterinarians = await veterinarianRepository.getAll();
        return veterinarians.map(toVeterinarianResponseDTO);
    },

    async create(dto: CreateVeterinarianDTO): Promise<VeterinarianResponseDTO> {
        const veterinarian = new Veterinarian({
            id: randomUUID(),
            firstName: dto.firstName,
            lastName: dto.lastName,
            email: dto.email,
            phone: dto.phone,
            licenseNumber: dto.licenseNumber,
            createdAt: new Date(),
            isDeleted: false,
        });

        const saved = await veterinarianRepository.create(veterinarian);
        return toVeterinarianResponseDTO(saved);
    },

    async update(dto: UpdateVeterinarianDTO): Promise<VeterinarianResponseDTO> {
        const existing = await veterinarianRepository.getById(dto.id);
        if (!existing) throw new Error("Veterinarian not found");

        const updatedVeterinarian = new Veterinarian({
            id: existing.id,
            firstName: dto.firstName ?? existing.firstName,
            lastName: dto.lastName ?? existing.lastName,
            email: dto.email ?? existing.email,
            phone: dto.phone ?? existing.phone,
            licenseNumber: dto.licenseNumber ?? existing.licenseNumber,
            createdAt: existing.createdAt,
            updatedAt: new Date(),
            isDeleted: existing.deleted,
        });

        const saved = await veterinarianRepository.update(updatedVeterinarian);
        return toVeterinarianResponseDTO(saved);
    },

    async delete(id: string): Promise<void> {
        await veterinarianRepository.delete(id);
    },
});

export interface CreateVeterinarianDTO {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    licenseNumber: string;
}

export interface UpdateVeterinarianDTO {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    licenseNumber?: string;
}

export interface VeterinarianResponseDTO {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    licenseNumber: string;
}

const toVeterinarianResponseDTO = (
    veterinarian: Veterinarian
): VeterinarianResponseDTO => ({
    id: veterinarian.id,
    firstName: veterinarian.firstName,
    lastName: veterinarian.lastName,
    email: veterinarian.email,
    phone: veterinarian.phone,
    licenseNumber: veterinarian.licenseNumber,
});

