/*
  Warnings:

  - You are about to drop the column `type` on the `MedicalCare` table. All the data in the column will be lost.
  - You are about to drop the column `vaccineId` on the `MedicalCare` table. All the data in the column will be lost.
  - Changed the type of `phone` on the `Veterinarian` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "MedicalCare" DROP COLUMN "type",
DROP COLUMN "vaccineId";

-- AlterTable
ALTER TABLE "Veterinarian" DROP COLUMN "phone",
ADD COLUMN     "phone" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ownerId" TEXT,
    "veterinarianId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userId_key" ON "UserProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_ownerId_key" ON "UserProfile"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_veterinarianId_key" ON "UserProfile"("veterinarianId");

-- CreateIndex
CREATE UNIQUE INDEX "Veterinarian_phone_key" ON "Veterinarian"("phone");

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_veterinarianId_fkey" FOREIGN KEY ("veterinarianId") REFERENCES "Veterinarian"("id") ON DELETE SET NULL ON UPDATE CASCADE;
