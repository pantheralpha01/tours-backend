/*
  Warnings:

  - You are about to drop the column `bookingReference` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `children` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `contractId` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `customerEmail` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `destination` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `numberOfGuests` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `pets` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `pickupLocation` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `specialRequests` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `bookingRef` on the `Contract` table. All the data in the column will be lost.
  - You are about to drop the column `signatureUrl` on the `Contract` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Contract` table. All the data in the column will be lost.
  - You are about to drop the column `version` on the `Contract` table. All the data in the column will be lost.
  - You are about to drop the `Invoice` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Transaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "EmailActionType" AS ENUM ('VERIFY_EMAIL', 'RESET_PASSWORD');

-- DropForeignKey
ALTER TABLE "Contract" DROP CONSTRAINT "Contract_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_invoiceId_fkey";

-- DropIndex
DROP INDEX "Booking_bookingReference_key";

-- DropIndex
DROP INDEX "Booking_contractId_idx";

-- DropIndex
DROP INDEX "Contract_bookingId_key";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "bookingReference",
DROP COLUMN "children",
DROP COLUMN "contractId",
DROP COLUMN "customerEmail",
DROP COLUMN "destination",
DROP COLUMN "numberOfGuests",
DROP COLUMN "pets",
DROP COLUMN "pickupLocation",
DROP COLUMN "specialRequests";

-- AlterTable
ALTER TABLE "Contract" DROP COLUMN "bookingRef",
DROP COLUMN "signatureUrl",
DROP COLUMN "updatedAt",
DROP COLUMN "version";

-- DropTable
DROP TABLE "Invoice";

-- DropTable
DROP TABLE "Transaction";

-- DropEnum
DROP TYPE "InvoiceStatus";

-- DropEnum
DROP TYPE "TransactionType";

-- CreateTable
CREATE TABLE "EmailActionToken" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "type" "EmailActionType" NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailActionToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailActionToken_tokenHash_key" ON "EmailActionToken"("tokenHash");

-- CreateIndex
CREATE INDEX "EmailActionToken_userId_type_idx" ON "EmailActionToken"("userId", "type");

-- CreateIndex
CREATE INDEX "EmailActionToken_expiresAt_idx" ON "EmailActionToken"("expiresAt");

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailActionToken" ADD CONSTRAINT "EmailActionToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
