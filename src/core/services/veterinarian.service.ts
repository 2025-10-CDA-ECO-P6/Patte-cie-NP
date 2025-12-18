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
        const veterinarian = new Veterinarian(
            randomUUID(),
            dto.firstName,
            dto.lastName,
            dto.email,
            dto.phone,
            dto.licenseNumber,
            new Date(),
            null,
            false
        );

        const saved = await veterinarianRepository.create(veterinarian);
        return toVeterinarianResponseDTO(saved);
    },

    async update(dto: UpdateVeterinarianDTO): Promise<VeterinarianResponseDTO> {
        const existing = await veterinarianRepository.getById(dto.id);
        if (!existing) throw new Error("Veterinarian not found");

        const updatedVeterinarian = new Veterinarian(
            existing.id,
            dto.firstName ?? existing.firstName,
            dto.lastName ?? existing.lastName,
            dto.email ?? existing.email,
            dto.phone ?? existing.phone,
            dto.licenseNumber ?? existing.licenseNumber,
            existing.createdAt,
            new Date(),
            existing.deleted
        );

        const saved = await veterinarianRepository.update(updatedVeterinarian);
        return toVeterinarianResponseDTO(saved);
    },

    async delete(id: string): Promise<void> {
        await veterinarianRepository.delete(id);
    },
});
