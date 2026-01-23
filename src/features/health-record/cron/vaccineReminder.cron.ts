import cron from "node-cron";
import { VaccineReminderService } from "../services/VaccineReminderApi.service";
import { sendEmail } from "../../email/services/email.service";

export const startVaccineReminderCron = (
    vaccineReminderService: VaccineReminderService
) => {
    cron.schedule("0 9 * * *", async () => {
        console.log("[CRON] Checking vaccine reminders...");

        try {
            const now = new Date();


            const reminders = await vaccineReminderService.getPendingRemindersWithOwner(now);

            if (reminders.length === 0) {
                console.log("[CRON] No reminders to send.");
                return;
            }

            console.log(`[CRON] ${reminders.length} reminder(s) to send.`);

            for (const reminder of reminders) {
                console.log(
                    `[CRON] Sending reminder email to ${reminder.ownerEmail} for vaccineId=${reminder.vaccineId}`
                );

                await sendEmail(
                    reminder.ownerEmail,
                    "🐾 Rappel de vaccination - Patte & Cie",
                    `Bonjour,

Le vaccin de votre animal arrive bientôt à expiration.

Merci de penser à prendre rendez-vous chez votre vétérinaire.

— Patte & Cie`
                );


                await vaccineReminderService.markAsSent(reminder.reminderId);
            }

            console.log("[CRON] Done.");
        } catch (error) {
            console.error("[CRON] Error while processing vaccine reminders:", error);
        }
    });
};
