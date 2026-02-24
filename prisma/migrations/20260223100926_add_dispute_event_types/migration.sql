-- CreateEnum
CREATE TYPE "EscrowReleaseStatus" AS ENUM ('ON_HOLD', 'SCHEDULED', 'RELEASED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PayoutStatus" AS ENUM ('PENDING', 'APPROVED', 'SENT', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ShiftStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "BookingEventType" ADD VALUE 'DISPUTE_CREATED';
ALTER TYPE "BookingEventType" ADD VALUE 'DISPUTE_STATUS_CHANGED';

-- DropIndex
DROP INDEX "Dispatch_status_idx";

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "balanceAmount" DECIMAL(12,2),
ADD COLUMN     "balanceDueDate" TIMESTAMP(3),
ADD COLUMN     "depositAmount" DECIMAL(12,2),
ADD COLUMN     "depositDueDate" TIMESTAMP(3),
ADD COLUMN     "depositPercentage" DECIMAL(5,4),
ADD COLUMN     "splitPaymentEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "splitPaymentNotes" TEXT;

-- AlterTable
ALTER TABLE "Dispatch" ADD COLUMN     "metadata" JSONB;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "recordedById" TEXT;

-- CreateTable
CREATE TABLE "AgentShift" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "bookingId" TEXT,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "status" "ShiftStatus" NOT NULL DEFAULT 'SCHEDULED',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgentShift_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EscrowAccount" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "totalAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "releasedAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "currency" "Currency" NOT NULL DEFAULT 'USD',
    "releaseStatus" "EscrowReleaseStatus" NOT NULL DEFAULT 'ON_HOLD',
    "releaseScheduledAt" TIMESTAMP(3),
    "releasedAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EscrowAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payout" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "escrowAccountId" TEXT,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'USD',
    "status" "PayoutStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "metadata" JSONB,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payout_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AgentShift_agentId_idx" ON "AgentShift"("agentId");

-- CreateIndex
CREATE INDEX "AgentShift_bookingId_idx" ON "AgentShift"("bookingId");

-- CreateIndex
CREATE INDEX "AgentShift_startAt_idx" ON "AgentShift"("startAt");

-- CreateIndex
CREATE UNIQUE INDEX "EscrowAccount_bookingId_key" ON "EscrowAccount"("bookingId");

-- CreateIndex
CREATE INDEX "Payout_bookingId_idx" ON "Payout"("bookingId");

-- CreateIndex
CREATE INDEX "Payout_escrowAccountId_idx" ON "Payout"("escrowAccountId");

-- CreateIndex
CREATE INDEX "Payout_createdById_idx" ON "Payout"("createdById");

-- CreateIndex
CREATE INDEX "Payment_recordedById_idx" ON "Payment"("recordedById");

-- AddForeignKey
ALTER TABLE "AgentShift" ADD CONSTRAINT "AgentShift_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentShift" ADD CONSTRAINT "AgentShift_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_recordedById_fkey" FOREIGN KEY ("recordedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EscrowAccount" ADD CONSTRAINT "EscrowAccount_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payout" ADD CONSTRAINT "Payout_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payout" ADD CONSTRAINT "Payout_escrowAccountId_fkey" FOREIGN KEY ("escrowAccountId") REFERENCES "EscrowAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payout" ADD CONSTRAINT "Payout_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
