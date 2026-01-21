/*
  Warnings:

  - You are about to drop the column `name` on the `Vaccine` table. All the data in the column will be lost.
  - Added the required column `administrationDate` to the `Vaccine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expirationDate` to the `Vaccine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `defaultValidityDays` to the `VaccineType` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vaccine" DROP COLUMN "name",
ADD COLUMN     "administrationDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "batchNumber" TEXT,
ADD COLUMN     "doseNumber" INTEGER,
ADD COLUMN     "expirationDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "notes" TEXT;

-- AlterTable
ALTER TABLE "VaccineType" ADD COLUMN     "defaultValidityDays" INTEGER NOT NULL,
ADD COLUMN     "notes" TEXT;
