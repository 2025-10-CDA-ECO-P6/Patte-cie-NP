import { PrismaClient } from "../../../generated/prisma/client";

export interface BaseRepository<T> {
  getById(id: string, include?: any): Promise<T | null>;
  getAll(include?: any): Promise<T[]>;
  create(entity: T, include?: any): Promise<T>;
  update(entity: T, include?: any): Promise<T>;
  delete(id: string): Promise<void>;
}

export interface PrismaMapper<TDomain, TPrismaCreate, TPrismaUpdate> {
  toDomain(record: any): TDomain;
  toCreate(domain: TDomain): TPrismaCreate;
  toUpdate(domain: TDomain): TPrismaUpdate;
}

type PrismaModel = {
  findUnique: Function;
  findFirst: Function;
  findMany: Function;
  create: Function;
  update: Function;
  delete?: Function;
};

export const BasePrismaRepository = <TDomain, TCreate, TUpdate>(params: {
  prisma: PrismaClient;
  modelName: keyof PrismaClient;
  mapper: PrismaMapper<TDomain, TCreate, TUpdate>;
  defaultInclude?: any;
}) => {
  const { prisma, modelName, mapper, defaultInclude } = params;
  const model: PrismaModel = (prisma as any)[modelName];

  return {
    async getById(id: string, withRelations = false): Promise<TDomain | null> {
      const record = await model.findFirst({
        where: { id, isDeleted: false },
        include: withRelations ? defaultInclude : undefined,
      });

      return record ? mapper.toDomain(record) : null;
    },

    async getAll(withRelations = false): Promise<TDomain[]> {
      const records = await model.findMany({
        where: { isDeleted: false },
        include: withRelations ? defaultInclude : undefined,
      });

      return records.map(mapper.toDomain);
    },

    async create(entity: TDomain, withRelations = false): Promise<TDomain> {
      const record = await model.create({
        data: mapper.toCreate(entity),
        include: withRelations ? defaultInclude : undefined,
      });

      return mapper.toDomain(record);
    },

    async update(entity: TDomain, withRelations = false): Promise<TDomain> {
      const data = mapper.toUpdate(entity);

      const record = await model.update({
        where: { id: (entity as any).id },
        data,
        include: withRelations ? defaultInclude : undefined,
      });

      return mapper.toDomain(record);
    },

    async delete(id: string): Promise<void> {
      await model.update({
        where: { id },
        data: { isDeleted: true, updatedAt: new Date() },
      });
    },
  };
};
