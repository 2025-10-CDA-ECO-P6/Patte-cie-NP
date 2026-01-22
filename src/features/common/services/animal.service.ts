import { randomUUID } from "node:crypto";
import { Animal } from "../models/Animal.model";
import { AnimalRepository } from "../repositories/animal.repository";
import { AnimalOwner } from "../models/AnimalOwner.model";
import createHttpError from "http-errors";
import { BaseApiService, BaseApiServiceImpl } from "../../../core/bases/BaseApiService";
import { OwnerRepository } from "../repositories/owner.repository";

export interface AnimalService extends BaseApiService<Animal, CreateAnimalDTO, UpdateAnimalDTO, AnimalResponseDTO> {
  addOwner(animalId: string, ownerId: string): Promise<AnimalResponseDTO>;
  removeOwner(animalId: string, ownerId: string): Promise<AnimalResponseDTO>;
}

export const AnimalServiceImpl = (
  animalRepository: AnimalRepository,
  ownerRepository: OwnerRepository,
): AnimalService => {
  const toResponseDTO = (animal: Animal): AnimalResponseDTO => ({
    id: animal.id,
    name: animal.name,
    birthDate: animal.birthDate,
    identification: animal.identification,
    speciesId: animal.speciesId,
  });

  const createDomain = (dto: CreateAnimalDTO): Animal => {
    validateAnimalInput(dto);

    return new Animal({
      id: randomUUID(),
      name: dto.name,
      birthDate: new Date(dto.birthDate),
      identification: dto.identification,
      speciesId: dto.speciesId,
      createdAt: new Date(),
      isDeleted: false,
    });
  };

  const updateDomain = (existing: Animal, dto: UpdateAnimalDTO): Animal => {
    validateAnimalInput(dto, true);

    existing.update({
      name: dto.name,
      birthDate: dto.birthDate,
      identification: dto.identification,
      speciesId: dto.speciesId,
    });

    return existing;
  };

  const baseService = BaseApiServiceImpl(
    animalRepository,
    toResponseDTO,
    createDomain,
    updateDomain,
    validateAnimalInput,
    (dto: AnimalResponseDTO) => {
      if (!dto.id || !dto.name || !dto.birthDate)
        throw new createHttpError.InternalServerError("Invalid animal response");
    },
  );

  return {
    ...baseService,

    async create(dto: CreateAnimalDTO): Promise<AnimalResponseDTO> {
      validateAnimalInput(dto);

      const animal = createDomain(dto);

      if (dto.ownerId) {
        const relation = AnimalOwner.create(animal.id, dto.ownerId);
        animal.addOwner(relation);
      }

      const savedAnimal = await animalRepository.create(animal, true); // include owners
      return toResponseDTO(savedAnimal);
    },

    async addOwner(animalId: string, ownerId: string) {
      const animal = await animalRepository.getById(animalId, true);
      if (!animal) throw new createHttpError.NotFound(`Animal with id ${animalId} not found`);

      const owner = await ownerRepository.getById(ownerId, true);
      if (!owner) throw new createHttpError.NotFound(`Owner with id ${ownerId} not found`);

      const relation = AnimalOwner.create(animal.id, owner.id);
      animal.addOwner(relation);

      const saved = await animalRepository.update(animal, true);
      if (!saved) throw new createHttpError.InternalServerError(`Failed to update animal with id ${animalId}`);

      return toResponseDTO(saved);
    },

    async removeOwner(animalId: string, ownerId: string) {
      const animal = await animalRepository.getById(animalId, true);
      if (!animal) throw new createHttpError.NotFound(`Animal with id ${animalId} not found`);

      const relation = animal.owners.find((o) => o.ownerId === ownerId && !o.deleted);
      if (!relation) throw new createHttpError.NotFound(`Owner relation not found for ownerId ${ownerId}`);

      relation.close();
      const saved = await animalRepository.update(animal, true);
      if (!saved) throw new createHttpError.InternalServerError(`Failed to update animal with id ${animalId}`);

      return toResponseDTO(saved);
    },
  };
};

export interface CreateAnimalDTO {
  name: string;
  birthDate: Date;
  identification?: number;
  speciesId: string;
  ownerId?: string;
}

export interface UpdateAnimalDTO {
  id: string;
  name?: string;
  birthDate?: Date;
  identification?: number;
  speciesId?: string;
}

export interface AnimalResponseDTO {
  id: string;
  name: string;
  birthDate: Date;
  identification?: number;
  speciesId?: string;
}

const validateAnimalInput = (dto: CreateAnimalDTO | UpdateAnimalDTO, partial = false) => {
  if (!partial || dto.name !== undefined) {
    if (!dto.name || typeof dto.name !== "string") throw new createHttpError.BadRequest("name is required");
  }
  if (!partial || dto.birthDate !== undefined) {
    if (!dto.birthDate || Number.isNaN(new Date(dto.birthDate).getTime()))
      throw new createHttpError.BadRequest("birthDate is required and must be a valid date");
  }
  if (!partial || dto.speciesId !== undefined) {
    if (!dto.speciesId || typeof dto.speciesId !== "string")
      throw new createHttpError.BadRequest("speciesId is required");
  }
};
