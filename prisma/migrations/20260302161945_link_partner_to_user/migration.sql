/*
  Warnings:

  - You are about to drop the column `createdById` on the `Partner` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Partner` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `Partner` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Partner` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Partner` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Partner` table. All the data in the column will be lost.
  - You are about to drop the `PartnerInvite` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Partner` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[partnerId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Partner` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Partner" DROP CONSTRAINT "Partner_createdById_fkey";

-- DropForeignKey
ALTER TABLE "PartnerInvite" DROP CONSTRAINT "PartnerInvite_invitedById_fkey";

-- DropForeignKey
ALTER TABLE "PartnerInvite" DROP CONSTRAINT "PartnerInvite_partnerId_fkey";

-- DropIndex
DROP INDEX "Partner_createdById_idx";

-- DropIndex
DROP INDEX "Partner_email_idx";

-- DropIndex
DROP INDEX "Partner_email_key";

-- AlterTable
ALTER TABLE "Partner" DROP COLUMN "createdById",
DROP COLUMN "email",
DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "password",
DROP COLUMN "phone",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "partnerId" TEXT;

-- DropTable
DROP TABLE "PartnerInvite";

-- DropEnum
DROP TYPE "PartnerInviteStatus";

-- CreateIndex
CREATE UNIQUE INDEX "Partner_userId_key" ON "Partner"("userId");

-- CreateIndex
CREATE INDEX "Partner_userId_idx" ON "Partner"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_partnerId_key" ON "User"("partnerId");

-- AddForeignKey
ALTER TABLE "Partner" ADD CONSTRAINT "Partner_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
