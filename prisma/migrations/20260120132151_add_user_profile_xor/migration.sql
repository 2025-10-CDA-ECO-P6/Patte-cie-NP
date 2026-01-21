-- This is an empty migration.
ALTER TABLE "UserProfile"
ADD CONSTRAINT user_profile_xor
CHECK (
  ("ownerId" IS NOT NULL AND "veterinarianId" IS NULL)
  OR
  ("veterinarianId" IS NOT NULL AND "ownerId" IS NULL)
);