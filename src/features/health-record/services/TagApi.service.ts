import createHttpError from "http-errors";
import { BaseApiService, BaseApiServiceImpl } from "../../../core/bases/BaseApiService";
import { Tag } from "../models/Tag.model";
import { TagRepository } from "../repositories/Tag.repository";

export interface TagService extends BaseApiService<Tag, TagCreateDTO, TagUpdateDTO, TagResponseDTO> {
  getByName(name: string): Promise<TagResponseDTO | null>;
}

export const TagServiceImpl = (repository: TagRepository): TagService => {
  const toResponseDTO = (tag: Tag): TagResponseDTO => {
    const dto: TagResponseDTO = { id: tag.id, name: tag.name };
    validateTagResponse(dto);
    return dto;
  };

  const createDomain = (dto: TagCreateDTO): Tag => {
    validateTagInput(dto);
    return new Tag({
      id: crypto.randomUUID(),
      name: dto.name,
      createdAt: new Date(),
      isDeleted: false,
    });
  };

  const updateDomain = (existing: Tag, dto: TagUpdateDTO): Tag => {
    validateTagInput(dto);
    existing.updateName(dto.name);
    return existing;
  };

  const baseService = BaseApiServiceImpl<Tag, TagCreateDTO, TagUpdateDTO, TagResponseDTO>(
    repository,
    toResponseDTO,
    createDomain,
    updateDomain,
    validateTagInput,
    validateTagResponse
  );

  return {
    ...baseService,

    async getByName(name: string): Promise<TagResponseDTO> {
      if (!name || typeof name !== "string") {
        throw new createHttpError.BadRequest("Name must be a non-empty string");
      }

      const tag = await repository.getByName(name);
      if (!tag) throw new createHttpError.NotFound(`Tag with name "${name}" not found`);

      return toResponseDTO(tag);
    },
  };
};

export interface TagResponseDTO {
  id: string;
  name: string;
}

export interface TagCreateDTO {
  name: string;
}

export interface TagUpdateDTO extends TagCreateDTO {
  id: string;
}

const validateTagInput = (dto: TagCreateDTO | TagUpdateDTO) => {
  if (!dto.name || typeof dto.name !== "string") {
    throw new createHttpError.BadRequest("Tag name is required and must be a string");
  }
};

const validateTagResponse = (dto: TagResponseDTO) => {
  if (!dto.id || typeof dto.id !== "string") {
    throw new createHttpError.InternalServerError("Response id is invalid");
  }
  if (!dto.name || typeof dto.name !== "string") {
    throw new createHttpError.InternalServerError("Response name is invalid");
  }
};