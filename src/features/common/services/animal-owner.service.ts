import { randomUUID } from "crypto";
import { AnimalOwner } from "../models/AnimalOwner.model";
import { AnimalOwnerRepository } from "../repositories/animal-owner.repository";
import { AnimalRepository } from "../repositories/animal.repository";
import { OwnerRepository } from "../repositories/owner.repository";

export interface AnimalOwnershipService {
  assignAnimalToOwner(dto: AssignAnimalDTO): Promise<AnimalOwnerResponseDTO>;
  transferAnimal(dto: TransferAnimalDTO): Promise<void>;
  getOwnershipHistory(animalId: string): Promise<AnimalOwnerResponseDTO[]>;
}

export const AnimalOwnershipServiceImpl = (
  animalOwnerRepository: AnimalOwnerRepository,
  animalRepository: AnimalRepository,
  ownerRepository: OwnerRepository
): AnimalOwnershipService => ({
  async assignAnimalToOwner(dto: AssignAnimalDTO): Promise<AnimalOwnerResponseDTO> {
    const { animalId, ownerId, startDate = new Date() } = dto;

    const animal = await animalRepository.getById(animalId);
    if (!animal) throw new Error("Animal not found");

    const owner = await ownerRepository.getById(ownerId);
    if (!owner) throw new Error("Owner not found");

    const activeOwnership = await animalOwnerRepository.getActiveByAnimalId(animalId);
    if (activeOwnership) throw new Error("Animal already has an active owner");

    const link = new AnimalOwner({
      id: randomUUID(),
      animalId,
      ownerId,
      startDate,
      createdAt: new Date(),
      isDeleted: false,
    });

    const saved = await animalOwnerRepository.create(link);
    return toAnimalOwnerResponseDTO(saved);
  },

  async transferAnimal(dto: TransferAnimalDTO): Promise<void> {
    const { animalId, newOwnerId, transferDate = new Date() } = dto;

    const activeOwnership = await animalOwnerRepository.getActiveByAnimalId(animalId);
    if (!activeOwnership) throw new Error("Animal has no active owner");

    await animalOwnerRepository.closeOwnership(activeOwnership.id, transferDate);

    await this.assignAnimalToOwner({
      animalId,
      ownerId: newOwnerId,
      startDate: transferDate,
    });
  },

  async getOwnershipHistory(animalId: string): Promise<AnimalOwnerResponseDTO[]> {
    const history = await animalOwnerRepository.getHistoryByAnimalId(animalId);
    return history.map(toAnimalOwnerResponseDTO);
  },
});

export interface AssignAnimalDTO {
  animalId: string;
  ownerId: string;
  startDate?: Date;
}

export interface TransferAnimalDTO {
  animalId: string;
  newOwnerId: string;
  transferDate?: Date;
}

export interface AnimalOwnerResponseDTO {
  id: string;
  animalId: string;
  ownerId: string;
  startDate: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt?: Date;
}

const toAnimalOwnerResponseDTO = (link: AnimalOwner): AnimalOwnerResponseDTO => ({
  id: link.id,
  animalId: link.animalId,
  ownerId: link.ownerId,
  startDate: link.startDate,
  endDate: link.endDate,
  createdAt: link.createdAt,
  updatedAt: link["updatedAt"],
});
