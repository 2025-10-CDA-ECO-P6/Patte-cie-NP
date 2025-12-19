import { PrismaClient } from "../../../../generated/prisma/client";
import { BaseRepository, BasePrismaRepository } from "../../../core/bases/BaseRepository";
import { Tag } from "../models/Tag.model";

export interface TagRepository extends BaseRepository<Tag> {
  getByName(name: string, withRelations?: boolean): Promise<Tag | null>;
}

export const TagRepositoryImpl = (prisma: PrismaClient): TagRepository => {
  const base = BasePrismaRepository<Tag, PrismaTagCreate, PrismaTagUpdate>({
    prisma,
    modelName: "tag",
    mapper: TagMapper,
  });

  return {
    ...base,

    async getByName(name: string, withRelations = false): Promise<Tag | null> {
      const record = await prisma.tag.findFirst({
        where: { name, isDeleted: false },
        include: withRelations ? {} : undefined,
      });

      return record ? TagMapper.toDomain(record) : null;
    },
  };
};

export const TagMapper = {
  toDomain(record: any): Tag {
    return new Tag({
      id: record.id,
      name: record.name,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt ?? undefined,
      isDeleted: record.isDeleted,
    });
  },

  toCreate(entity: Tag) {
    return {
      id: entity.id,
      name: entity.name,
      createdAt: entity.createdAt,
      isDeleted: entity.deleted,
    };
  },

  toUpdate(entity: Tag) {
    return {
      name: entity.name,
      updatedAt: new Date(),
      isDeleted: entity.deleted,
    };
  },
};

type PrismaTagCreate = ReturnType<typeof TagMapper.toCreate>;
type PrismaTagUpdate = ReturnType<typeof TagMapper.toUpdate>;
