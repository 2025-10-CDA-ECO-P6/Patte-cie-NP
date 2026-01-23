import { Request, Response } from "express";
import { VaccineReminderService } from "../services/VaccineReminderApi.service";

export const VaccineReminderController = (service: VaccineReminderService) => ({

    async getPending(req: Request, res: Response) {
        const now = new Date();
        const reminders = await service.getPendingReminders(now);
        res.json(reminders);
    },

    async create(req: Request, res: Response) {
        const { vaccineId, remindAt } = req.body;

        const reminder = await service.create({
            vaccineId,
            remindAt: new Date(remindAt),
        });

        res.status(201).json(reminder);
    },

    async markAsSent(req: Request, res: Response) {
        const { id } = req.params;

        await service.markAsSent(id);

        res.status(204).send();
    },

    async deleteByVaccineId(req: Request, res: Response) {
        const { vaccineId } = req.params;

        await service.deleteByVaccineId(vaccineId);

        res.status(204).send();
    },
});
