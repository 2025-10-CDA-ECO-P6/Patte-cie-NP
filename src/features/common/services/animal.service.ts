import { randomUUID } from "crypto";
import { Animal } from "../models/Animal.model";
import { AnimalRepository } from "../repositories/animal.repository";
import { AnimalOwnerRepository } from "../repositories/animal-owner.repository";

export interface AnimalService {
  getById(id: string): Promise<AnimalResponseDTO | null>;
  getAll(): Promise<AnimalResponseDTO[]>;
  create(dto: CreateAnimalDTO): Promise<AnimalResponseDTO>;
  update(dto: UpdateAnimalDTO): Promise<AnimalResponseDTO>;
  delete(id: string): Promise<void>;
}

export const AnimalServiceImpl = (
  animalRepository: AnimalRepository,
  animalOwnerRepository: AnimalOwnerRepository
): AnimalService => ({
  async getById(id: string): Promise<AnimalResponseDTO | null> {
    const animal = await animalRepository.getById(id);
    return animal ? toAnimalResponseDTO(animal) : null;
  },

  async getAll(): Promise<AnimalResponseDTO[]> {
    const animals = await animalRepository.getAll();
    return animals.map(toAnimalResponseDTO);
  },

  async create(dto: CreateAnimalDTO): Promise<AnimalResponseDTO> {
    const animal = new Animal({
      id: randomUUID(),
      ...dto,
      createdAt: new Date(),
      isDeleted: false,
    });

    const savedAnimal = await animalRepository.create(animal);
    return toAnimalResponseDTO(savedAnimal);
  },

  async update(dto: UpdateAnimalDTO): Promise<AnimalResponseDTO> {
    const existing = await animalRepository.getById(dto.id);
    if (!existing) throw new Error("Animal not found");

    const updatedAnimal = new Animal({
      id: existing.id,
      name: dto.name ?? existing.name,
      birthDate: dto.birthDate ?? existing.birthDate,
      identification: dto.identification ?? existing.identification,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
      isDeleted: existing.deleted,
    });

    const saved = await animalRepository.update(updatedAnimal);
    return toAnimalResponseDTO(saved);
  },

  async delete(id: string): Promise<void> {
    await animalRepository.delete(id);
  },
});

export interface CreateAnimalDTO {
  name: string;
  birthDate: Date;
  identification?: number;
}

export interface UpdateAnimalDTO {
  id: string;
  name?: string;
  birthDate?: Date;
  identification?: number;
}

export interface AnimalResponseDTO {
  id: string;
  name: string;
  birthDate: Date;
  identification?: number;
}

const toAnimalResponseDTO = (animal: Animal): AnimalResponseDTO => ({
  id: animal.id,
  name: animal.name,
  birthDate: animal.birthDate,
  identification: animal.identification,
});
