import { PrismaClient } from "../../../generated/prisma/client";

export interface BaseRepository<T> {
  getById(id: string): Promise<T | null>;
  getAll(): Promise<T[]>;
  create(entity: T): Promise<T>;
  update(entity: T): Promise<T>;
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
}) => {
  const { prisma, modelName, mapper } = params;
  const model: PrismaModel = (prisma as any)[modelName];

  return {
    async getById(id: string, include?: any): Promise<TDomain | null> {
      const record = await model.findFirst({
        where: { id, isDeleted: false },
        include,
      });
      return record ? mapper.toDomain(record) : null;
    },

    async getAll(include?: any): Promise<TDomain[]> {
      const records = await model.findMany({
        where: { isDeleted: false },
        include,
      });
      return records.map(mapper.toDomain);
    },

    async create(entity: TDomain): Promise<TDomain> {
      const record = await model.create({
        data: mapper.toCreate(entity),
      });
      return mapper.toDomain(record);
    },

    async update(entity: TDomain): Promise<TDomain> {
      const record = await model.update({
        where: { id: (entity as any).id },
        data: mapper.toUpdate(entity),
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