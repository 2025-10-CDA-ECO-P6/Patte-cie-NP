import { randomUUID } from "crypto";
import { Owner } from "../models/Owner.model";
import { AnimalOwnerRepository } from "../repositories/animal-owner.repository";
import { OwnerRepository } from "../repositories/owner.repository";

export interface OwnerService {
  getById(id: string): Promise<OwnerResponseDTO | null>;
  getAll(): Promise<OwnerResponseDTO[]>;
  create(dto: CreateOwnerDTO): Promise<OwnerResponseDTO>;
  update(dto: UpdateOwnerDTO): Promise<OwnerResponseDTO>;
  delete(id: string): Promise<void>;
}
export const OwnerServiceImpl = (
  ownerRepository: OwnerRepository,
  animalOwnerRepository: AnimalOwnerRepository
): OwnerService => ({
  async getById(id: string): Promise<OwnerResponseDTO | null> {
    const owner = await ownerRepository.getById(id);
    return owner ? toOwnerResponseDTO(owner) : null;
  },

  async getAll(): Promise<OwnerResponseDTO[]> {
    const owners = await ownerRepository.getAll();
    return owners.map(toOwnerResponseDTO);
  },

  async create(dto: CreateOwnerDTO): Promise<OwnerResponseDTO> {
    const owner = new Owner({
      id: randomUUID(),
      ...dto,
      createdAt: new Date(),
      isDeleted: false,
    });

    const savedOwner = await ownerRepository.create(owner);
    return toOwnerResponseDTO(savedOwner);
  },

  async update(dto: UpdateOwnerDTO): Promise<OwnerResponseDTO> {
    const existing = await ownerRepository.getById(dto.id);
    if (!existing) throw new Error("Owner not found");

    const updatedOwner = new Owner({
      id: existing.id,
      firstName: dto.firstName ?? existing.firstName,
      lastName: dto.lastName ?? existing.lastName,
      email: dto.email ?? existing.email,
      adresse: dto.adresse ?? existing.adresse,
      phoneNumber: dto.phoneNumber ?? existing.phoneNumber,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
      isDeleted: existing.deleted,
    });

    const saved = await ownerRepository.update(updatedOwner);
    return toOwnerResponseDTO(saved);
  },

  async delete(id: string): Promise<void> {
    await ownerRepository.delete(id);
  },
});

export interface CreateOwnerDTO {
  firstName: string;
  lastName: string;
  email: string;
  adresse: string;
  phoneNumber: number;
}

export interface UpdateOwnerDTO {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  adresse?: string;
  phoneNumber?: number;
}

export interface OwnerResponseDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  adresse: string;
  phoneNumber: number;
}

const toOwnerResponseDTO = (owner: Owner): OwnerResponseDTO => ({
  id: owner.id,
  firstName: owner.firstName,
  lastName: owner.lastName,
  email: owner.email,
  adresse: owner.adresse,
  phoneNumber: owner.phoneNumber,
});
