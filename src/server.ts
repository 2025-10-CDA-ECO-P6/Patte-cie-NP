import app from "./app";
import config from "./.config/config";
import { prisma } from "../lib/prisma";
import { VaccineReminderRepositoryImpl } from "./features/health-record/repositories/VaccineReminder.repository";
import { VaccineReminderServiceImpl } from "./features/health-record/services/VaccineReminderApi.service";
import { startVaccineReminderCron } from "./features/health-record/cron/vaccineReminder.cron";

const vaccineReminderRepository = VaccineReminderRepositoryImpl(prisma);
const vaccineReminderService = VaccineReminderServiceImpl(vaccineReminderRepository);

startVaccineReminderCron(vaccineReminderService);

// Start server
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
