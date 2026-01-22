import { randomUUID } from "node:crypto";
import createHttpError from "http-errors";
import { Species } from "../models/Species.model";
import { SpeciesRepository } from "../repositories/species.repository";
import { BaseApiService, BaseApiServiceImpl } from "../../../core/bases/BaseApiService";

export interface SpeciesService extends BaseApiService<
  Species,
  CreateSpeciesDTO,
  UpdateSpeciesDTO,
  SpeciesResponseDTO
> {}

export const SpeciesServiceImpl = (repository: SpeciesRepository): SpeciesService => {
  const toResponseDTO = (species: Species): SpeciesResponseDTO => ({
    id: species.id,
    name: species.name,
    description: species.description,
  });

  const createDomain = (dto: CreateSpeciesDTO): Species => {
    validateSpeciesInput(dto);

    return new Species({
      id: randomUUID(),
      name: dto.name,
      description: dto.description,
      createdAt: new Date(),
      isDeleted: false,
    });
  };

  const updateDomain = (existing: Species, dto: UpdateSpeciesDTO): Species => {
    validateSpeciesInput(dto, true);

    existing.update({
      name: dto.name,
      description: dto.description,
    });

    return existing;
  };

  return BaseApiServiceImpl(
    repository,
    toResponseDTO,
    createDomain,
    updateDomain,
    validateSpeciesInput,
    (dto: SpeciesResponseDTO) => {
      if (!dto.id || !dto.name) {
        throw new createHttpError.InternalServerError("Invalid species response");
      }
    },
  );
};

export interface CreateSpeciesDTO {
  name: string;
  description?: string;
}

export interface UpdateSpeciesDTO {
  id: string;
  name?: string;
  description?: string;
}

export interface SpeciesResponseDTO {
  id: string;
  name: string;
  description?: string;
}

const validateSpeciesInput = (dto: CreateSpeciesDTO | UpdateSpeciesDTO, partial = false) => {
  if (!partial || dto.name !== undefined) {
    if (!dto.name?.trim()) {
      throw new createHttpError.BadRequest("Species name is required");
    }
  }
};
