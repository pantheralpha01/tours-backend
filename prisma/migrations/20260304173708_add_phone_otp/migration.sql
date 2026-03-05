/*
  Warnings:

  - You are about to drop the `EmailActionToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "EmailActionToken" DROP CONSTRAINT "EmailActionToken_userId_fkey";

-- DropTable
DROP TABLE "EmailActionToken";

-- DropEnum
DROP TYPE "EmailActionType";

-- CreateTable
CREATE TABLE "PhoneOtp" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "otpHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PhoneOtp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PhoneOtp_phone_key" ON "PhoneOtp"("phone");

-- CreateIndex
CREATE INDEX "PhoneOtp_phone_idx" ON "PhoneOtp"("phone");
