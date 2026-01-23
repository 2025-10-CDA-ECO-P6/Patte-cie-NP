import { PrismaClient } from "../../../../generated/prisma/client";
import { BaseRepository, BasePrismaRepository } from "../../../core/bases/BaseRepository";
import { VaccineReminder } from "../models/VaccineReminder.model";

export interface PendingReminderWithOwner {
  reminderId: string;
  vaccineId: string;
  remindAt: Date;
  ownerEmail: string;
  animalName: string;
  expirationDate: Date;
}

export interface VaccineReminderRepository extends BaseRepository<VaccineReminder> {
  getPendingReminders(now: Date): Promise<VaccineReminder[]>;
  getPendingRemindersWithOwner(now: Date): Promise<PendingReminderWithOwner[]>;
}

export const VaccineReminderRepositoryImpl = (prisma: PrismaClient): VaccineReminderRepository => {
  const base = BasePrismaRepository<
    VaccineReminder,
    PrismaVaccineReminderCreate,
    PrismaVaccineReminderUpdate
  >({
    prisma,
    modelName: "vaccineReminder",
    mapper: VaccineReminderMapper,
  });

  return {
    ...base,

    async getPendingReminders(now: Date): Promise<VaccineReminder[]> {
      const records = await prisma.vaccineReminder.findMany({
        where: {
          isSent: false,
          remindAt: {
            lte: now,
          },
        },
      });

      return records.map(VaccineReminderMapper.toDomain);
    },


    async getPendingRemindersWithOwner(now: Date): Promise<PendingReminderWithOwner[]> {
      const reminders = await prisma.vaccineReminder.findMany({
        where: {
          isSent: false,
          remindAt: {
            lte: now,
          },
        },
        include: {
          vaccine: {
            include: {
              medicalCares: {
                include: {
                  medicalCare: {
                    include: {
                      healthRecord: {
                        include: {
                          animal: {
                            include: {
                              animalOwners: {
                                where: {
                                  endDate: null,
                                },
                                include: {
                                  owner: true,
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      const result: PendingReminderWithOwner[] = [];

      for (const r of reminders) {
        const vaccine = r.vaccine;
        if (!vaccine) continue;

        for (const mc of vaccine.medicalCares) {
          const animal = mc.medicalCare.healthRecord?.animal;
          if (!animal) continue;

          const ownerLink = animal.animalOwners[0];
          if (!ownerLink?.owner?.email) continue;

          result.push({
            reminderId: r.id,
            vaccineId: r.vaccineId,
            remindAt: r.remindAt,
            ownerEmail: ownerLink.owner.email,
            animalName: animal.name,
            expirationDate: vaccine.expirationDate,
          });

          break;
        }
      }

      return result;
    },
  };
};

export const VaccineReminderMapper = {
  toDomain(record: any): VaccineReminder {
    return new VaccineReminder({
      id: record.id,
      vaccineId: record.vaccineId,
      remindAt: record.remindAt,
      isSent: record.isSent,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      isDeleted: record.isDeleted,
    });
  },

  toCreate(entity: VaccineReminder) {
    return {
      id: entity.id,
      vaccineId: entity.vaccineId,
      remindAt: entity.remindAt,
      isSent: entity.isSent,
      createdAt: entity.createdAt,
    };
  },

  toUpdate(entity: VaccineReminder) {
    return {
      isSent: entity.isSent,
    };
  },
};

type PrismaVaccineReminderCreate = ReturnType<typeof VaccineReminderMapper.toCreate>;
type PrismaVaccineReminderUpdate = ReturnType<typeof VaccineReminderMapper.toUpdate>;
