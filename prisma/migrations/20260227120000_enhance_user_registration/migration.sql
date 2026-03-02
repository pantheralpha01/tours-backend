-- Add enhanced user registration fields
ALTER TABLE "User" ADD COLUMN "emailVerified" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN "emailVerifiedAt" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN "phone" TEXT;
ALTER TABLE "User" ADD COLUMN "phoneVerified" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN "phoneVerifiedAt" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN "idNumber" TEXT;
ALTER TABLE "User" ADD COLUMN "idType" TEXT;
ALTER TABLE "User" ADD COLUMN "profilePicUrl" TEXT;
ALTER TABLE "User" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Add unique constraints for phone and idNumber
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");
CREATE UNIQUE INDEX "User_idNumber_key" ON "User"("idNumber");

-- Add index for email verification status
CREATE INDEX "User_emailVerified_idx" ON "User"("emailVerified");
CREATE INDEX "User_phoneVerified_idx" ON "User"("phoneVerified");
