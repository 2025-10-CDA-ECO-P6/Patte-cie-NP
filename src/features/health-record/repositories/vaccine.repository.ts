import { PrismaClient } from "../../../../generated/prisma/client";
import { BaseRepository, BasePrismaRepository } from "../../../core/bases/BaseRepository";
import { Vaccine } from "../models/Vaccine.model";
import { VaccineType } from "../models/VaccinType.model";

export interface VaccineRepository extends BaseRepository<Vaccine> {
  getByVaccineTypeId(vaccineTypeId: string): Promise<Vaccine[]>;
}

export const VaccineRepositoryImpl = (prisma: PrismaClient): VaccineRepository => {
  const base = BasePrismaRepository<Vaccine, PrismaVaccineCreate, PrismaVaccineUpdate>({
    prisma,
    modelName: "vaccine",
    mapper: VaccineMapper,
  });

  return {
    ...base,

    async getByVaccineTypeId(vaccineTypeId: string): Promise<Vaccine[]> {
      const records = await prisma.vaccine.findMany({
        where: { vaccineTypeId, isDeleted: false },
        include: { vaccineType: true },
      });

      return records.map(VaccineMapper.toDomain);
    },
  };
};

export const VaccineMapper = {
  toDomain(record: any): Vaccine {
    return new Vaccine({
      id: record.id,
      vaccineTypeId: record.vaccineTypeId,
      name: record.name,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt ?? undefined,
      isDeleted: record.isDeleted,
      vaccineType: record.vaccineType
        ? new VaccineType({
            id: record.vaccineType.id,
            name: record.vaccineType.name,
            createdAt: record.vaccineType.createdAt,
            updatedAt: record.vaccineType.updatedAt ?? undefined,
            isDeleted: record.vaccineType.isDeleted,
          })
        : undefined,
    });
  },

  toCreate(entity: Vaccine) {
    return {
      id: entity.id,
      vaccineTypeId: entity.vaccineTypeId,
      name: entity.name,
      createdAt: entity.createdAt,
      isDeleted: entity.deleted,
    };
  },

  toUpdate(entity: Vaccine) {
    return {
      vaccineTypeId: entity.vaccineTypeId,
      name: entity.name,
      updatedAt: new Date(),
      isDeleted: entity.deleted,
    };
  },
};

type PrismaVaccineCreate = ReturnType<typeof VaccineMapper.toCreate>;
type PrismaVaccineUpdate = ReturnType<typeof VaccineMapper.toUpdate>;
