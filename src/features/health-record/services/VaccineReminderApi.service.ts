import createHttpError from "http-errors";
import { BaseApiService, BaseApiServiceImpl } from "../../../core/bases/BaseApiService";
import { VaccineReminder } from "../models/VaccineReminder.model";
import { VaccineReminderRepository } from "../repositories/VaccineReminder.repository";
import { PendingReminderWithOwner } from "../repositories/VaccineReminder.repository";


export interface VaccineReminderService extends BaseApiService<
    VaccineReminder,
    VaccineReminderCreateDTO,
    VaccineReminderUpdateDTO,
    VaccineReminderResponseDTO
> {
    getPendingReminders(now: Date): Promise<VaccineReminderResponseDTO[]>;
    getPendingRemindersWithOwner(now: Date): Promise<PendingReminderWithOwner[]>;
    markAsSent(id: string): Promise<void>;
    deleteByVaccineId(vaccineId: string): Promise<void>;
    updateByVaccineId(vaccineId: string, remindAt: Date): Promise<void>;
}

export const VaccineReminderServiceImpl = (
    repository: VaccineReminderRepository,
): VaccineReminderService => {

    const toResponseDTO = (reminder: VaccineReminder): VaccineReminderResponseDTO => {
        return {
            id: reminder.id,
            vaccineId: reminder.vaccineId,
            remindAt: reminder.remindAt,
            isSent: reminder.isSent,
            createdAt: reminder.createdAt,
        };
    };

    const createDomain = (dto: VaccineReminderCreateDTO): VaccineReminder => {
        validateCreateInput(dto);

        return new VaccineReminder({
            id: crypto.randomUUID(),
            vaccineId: dto.vaccineId,
            remindAt: dto.remindAt,
            isSent: false,
            createdAt: new Date(),
            updatedAt: undefined,
            isDeleted: false,
        });
    };

    const updateDomain = (existing: VaccineReminder, dto: VaccineReminderUpdateDTO): VaccineReminder => {
        if (dto.isSent !== undefined) {
            existing.markAsSent();
        }
        return existing;
    };

    const baseService = BaseApiServiceImpl<
        VaccineReminder,
        VaccineReminderCreateDTO,
        VaccineReminderUpdateDTO,
        VaccineReminderResponseDTO
    >(repository, toResponseDTO, createDomain, updateDomain);

    return {
        ...baseService,

        async getPendingReminders(now: Date): Promise<VaccineReminderResponseDTO[]> {
            if (!(now instanceof Date)) {
                throw new createHttpError.BadRequest("now must be a Date");
            }

            const reminders = await repository.getPendingReminders(now);
            return reminders.map(toResponseDTO);
        },

        async getPendingRemindersWithOwner(now: Date): Promise<PendingReminderWithOwner[]> {
            if (!(now instanceof Date)) {
                throw new createHttpError.BadRequest("now must be a Date");
            }

            return repository.getPendingRemindersWithOwner(now);
        },

        async markAsSent(id: string): Promise<void> {
            if (!id || typeof id !== "string") {
                throw new createHttpError.BadRequest("id must be a non-empty string");
            }

            const reminder = await repository.getById(id);
            if (!reminder) {
                throw new createHttpError.NotFound("Reminder not found");
            }

            reminder.markAsSent();
            await repository.update(reminder);
        },

        async deleteByVaccineId(vaccineId: string): Promise<void> {
            if (!vaccineId || typeof vaccineId !== "string") {
                throw new createHttpError.BadRequest("vaccineId must be a non-empty string");
            }

            const all = await repository.getAll();
            const reminder = all.find(r => r.vaccineId === vaccineId);

            if (!reminder) return;

            await repository.delete(reminder.id);
        },

        async updateByVaccineId(vaccineId: string, remindAt: Date): Promise<void> {
            if (!vaccineId || typeof vaccineId !== "string") {
                throw new createHttpError.BadRequest("vaccineId must be a non-empty string");
            }
            if (!(remindAt instanceof Date)) {
                throw new createHttpError.BadRequest("remindAt must be a Date");
            }

            const all = await repository.getAll();
            const reminder = all.find(r => r.vaccineId === vaccineId);

            if (!reminder) {
                await baseService.create({ vaccineId, remindAt });
                return;
            }

            reminder.updateRemindAt(remindAt);
            await repository.update(reminder);
        },
    };
};

export interface VaccineReminderResponseDTO {
    id: string;
    vaccineId: string;
    remindAt: Date;
    isSent: boolean;
    createdAt: Date;
}

export interface VaccineReminderCreateDTO {
    vaccineId: string;
    remindAt: Date;
}

export interface VaccineReminderUpdateDTO {
    id: string;
    isSent?: boolean;
}

const validateCreateInput = (dto: VaccineReminderCreateDTO) => {
    if (!dto.vaccineId || typeof dto.vaccineId !== "string") {
        throw new createHttpError.BadRequest("vaccineId is required and must be a string");
    }
    if (!(dto.remindAt instanceof Date)) {
        throw new createHttpError.BadRequest("remindAt must be a valid Date");
    }
};
