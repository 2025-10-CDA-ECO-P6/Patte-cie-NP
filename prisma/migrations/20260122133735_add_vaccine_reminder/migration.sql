-- CreateTable
CREATE TABLE "VaccineReminder" (
    "id" TEXT NOT NULL,
    "vaccineId" TEXT NOT NULL,
    "remindAt" TIMESTAMP(3) NOT NULL,
    "isSent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VaccineReminder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VaccineReminder_vaccineId_key" ON "VaccineReminder"("vaccineId");

-- CreateIndex
CREATE INDEX "VaccineReminder_remindAt_idx" ON "VaccineReminder"("remindAt");

-- CreateIndex
CREATE INDEX "VaccineReminder_isSent_idx" ON "VaccineReminder"("isSent");

-- AddForeignKey
ALTER TABLE "VaccineReminder" ADD CONSTRAINT "VaccineReminder_vaccineId_fkey" FOREIGN KEY ("vaccineId") REFERENCES "Vaccine"("id") ON DELETE CASCADE ON UPDATE CASCADE;
