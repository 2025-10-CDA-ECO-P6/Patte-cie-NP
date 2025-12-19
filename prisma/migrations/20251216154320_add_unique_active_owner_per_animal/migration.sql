-- This is an empty migration.
CREATE UNIQUE INDEX "unique_active_owner_per_animal"
ON "AnimalOwner" ("animalId")
WHERE "endDate" IS NULL AND "isDeleted" = false;