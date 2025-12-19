import { BaseApiService, BaseApiServiceImpl } from "../../../core/bases/BaseApiService";
import { Tag } from "../models/Tag.model";
import { TagRepository } from "../repositories/Tag.repository";

export interface TagService extends BaseApiService<Tag, TagCreateDTO, TagUpdateDTO, TagResponseDTO> {
  getByName(name: string): Promise<TagResponseDTO | null>;
}

export const TagServiceImpl = (repository: TagRepository): TagService => {
  const toResponseDTO = (tag: Tag): TagResponseDTO => ({
    id: tag.id,
    name: tag.name,
  });

  const createDomain = (dto: TagCreateDTO): Tag =>
    new Tag({
      id: crypto.randomUUID(),
      name: dto.name,
      createdAt: new Date(),
      isDeleted: false,
    });

  const updateDomain = (existing: Tag, dto: TagUpdateDTO): Tag => {
    existing.name = dto.name;
    return existing;
  };

  const baseService = BaseApiServiceImpl<Tag, TagCreateDTO, TagUpdateDTO, TagResponseDTO>(
    repository,
    toResponseDTO,
    createDomain,
    updateDomain
  );

  return {
    ...baseService,

    async getByName(name: string) {
      const tag = await repository.getByName(name);
      return tag ? toResponseDTO(tag) : null;
    },
  };
};

// DTOs

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

// QueryOptions si nécessaire pour BaseApiService
export interface QueryOptions {
  withRelations?: boolean;
}
