import { PrismaClient } from "../../../../generated/prisma/client";
import { BaseRepository, BasePrismaRepository } from "../../../core/bases/BaseRepository";
import { Vaccine } from "../models/Vaccine.model";
import { VaccineType } from "../models/VaccinType.model";


export interface VaccineRepository extends BaseRepository<Vaccine> {
  getByVaccineTypeId(vaccineTypeId: string, withRelations?: boolean): Promise<Vaccine[]>;
}

export const VaccineRepositoryImpl = (prisma: PrismaClient): VaccineRepository => {
  const defaultInclude = { vaccineType: true };

  const base = BasePrismaRepository<Vaccine, PrismaVaccineCreate, PrismaVaccineUpdate>({
    prisma,
    modelName: "vaccine",
    mapper: VaccineMapper,
    defaultInclude,
  });

  return {
    ...base,

    async getByVaccineTypeId(vaccineTypeId: string, withRelations = false): Promise<Vaccine[]> {
      const records = await prisma.vaccine.findMany({
        where: { vaccineTypeId, isDeleted: false },
        include: withRelations ? defaultInclude : undefined,
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
      administrationDate: record.administrationDate,
      expirationDate: record.expirationDate,
      batchNumber: record.batchNumber,
      doseNumber: record.doseNumber,
      notes: record.notes,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt ?? undefined,
      isDeleted: record.isDeleted,
      vaccineType: record.vaccineType
        ? new VaccineType({
            id: record.vaccineType.id,
            name: record.vaccineType.name,
            defaultValidityDays: record.vaccineType.defaultValidityDays,
            notes: record.vaccineType.notes,
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
      administrationDate: entity.administrationDate,
      expirationDate: entity.expirationDate,
      batchNumber: entity.batchNumber,
      doseNumber: entity.doseNumber,
      notes: entity.notes,
      createdAt: entity.createdAt,
      isDeleted: entity.deleted, // utilise le getter public
    };
  },

  toUpdate(entity: Vaccine) {
    return {
      vaccineTypeId: entity.vaccineTypeId,
      administrationDate: entity.administrationDate,
      expirationDate: entity.expirationDate,
      batchNumber: entity.batchNumber,
      doseNumber: entity.doseNumber,
      notes: entity.notes,
      updatedAt: new Date(),
      isDeleted: entity.deleted, // utilise le getter public
    };
  },
};

type PrismaVaccineCreate = ReturnType<typeof VaccineMapper.toCreate>;
type PrismaVaccineUpdate = ReturnType<typeof VaccineMapper.toUpdate>;
