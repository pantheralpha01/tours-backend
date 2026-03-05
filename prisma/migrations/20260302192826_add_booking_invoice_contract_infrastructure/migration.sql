/*
  Warnings:

  - A unique constraint covering the columns `[bookingReference]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[bookingId]` on the table `Contract` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bookingReference` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerEmail` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bookingRef` to the `Contract` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Contract` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT', 'SENT', 'PARTIALLY_PAID', 'PAID', 'OVERDUE');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('DEPOSIT', 'BALANCE');

-- DropForeignKey
ALTER TABLE "Contract" DROP CONSTRAINT "Contract_bookingId_fkey";

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "bookingReference" TEXT NOT NULL,
ADD COLUMN     "children" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "contractId" TEXT,
ADD COLUMN     "customerEmail" TEXT NOT NULL,
ADD COLUMN     "destination" JSONB,
ADD COLUMN     "numberOfGuests" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "pets" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "pickupLocation" JSONB,
ADD COLUMN     "specialRequests" TEXT;

-- AlterTable
ALTER TABLE "Contract" ADD COLUMN     "bookingRef" TEXT NOT NULL,
ADD COLUMN     "signatureUrl" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "bookingRef" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "status" "InvoiceStatus" NOT NULL DEFAULT 'DRAFT',
    "totalAmount" DECIMAL(12,2) NOT NULL,
    "depositAmount" DECIMAL(12,2),
    "balanceAmount" DECIMAL(12,2),
    "paidAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "currency" "Currency" NOT NULL DEFAULT 'USD',
    "dueDate" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "fileUrl" TEXT,
    "paymentLink" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "bookingRef" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'USD',
    "status" "PaymentState" NOT NULL DEFAULT 'PENDING',
    "paymentMethod" TEXT,
    "reference" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_invoiceNumber_key" ON "Invoice"("invoiceNumber");

-- CreateIndex
CREATE INDEX "Invoice_bookingId_idx" ON "Invoice"("bookingId");

-- CreateIndex
CREATE INDEX "Invoice_status_idx" ON "Invoice"("status");

-- CreateIndex
CREATE INDEX "Invoice_dueDate_idx" ON "Invoice"("dueDate");

-- CreateIndex
CREATE INDEX "Transaction_invoiceId_idx" ON "Transaction"("invoiceId");

-- CreateIndex
CREATE INDEX "Transaction_transactionId_idx" ON "Transaction"("transactionId");

-- CreateIndex
CREATE INDEX "Transaction_bookingRef_idx" ON "Transaction"("bookingRef");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_bookingReference_key" ON "Booking"("bookingReference");

-- CreateIndex
CREATE INDEX "Booking_contractId_idx" ON "Booking"("contractId");

-- CreateIndex
CREATE UNIQUE INDEX "Contract_bookingId_key" ON "Contract"("bookingId");

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;
