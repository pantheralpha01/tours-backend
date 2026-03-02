-- AlterEnum
ALTER TYPE "PaymentStatus" ADD VALUE 'PARTIAL';

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('FULL_PAYMENT', 'PARTIAL_PAYMENT');

-- AlterTable Booking
ALTER TABLE "Booking" ADD COLUMN "customerPhoneNumber" TEXT,
ADD COLUMN "paymentType" "PaymentType" NOT NULL DEFAULT 'FULL_PAYMENT',
ADD COLUMN "costAtBooking" DECIMAL(12,2),
ADD COLUMN "costPostEvent" DECIMAL(12,2),
ADD COLUMN "totalCost" DECIMAL(12,2),
ADD COLUMN "payPostEventDueDate" TIMESTAMP(3),
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Create BookingPartner Table
CREATE TABLE "BookingPartner" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bookingId" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "partnerName" TEXT NOT NULL,
    "partnerPhoneNumber" TEXT,
    "description" TEXT,
    "costAtBooking" DECIMAL(12,2) NOT NULL,
    "costPostEvent" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "totalCost" DECIMAL(12,2) NOT NULL,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'UNPAID',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BookingPartner_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking" ("id") ON DELETE CASCADE,
    CONSTRAINT "BookingPartner_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner" ("id") ON DELETE RESTRICT,
    UNIQUE ("bookingId", "partnerId")
);

-- CreateIndex
CREATE INDEX "BookingPartner_bookingId_idx" ON "BookingPartner"("bookingId");
CREATE INDEX "BookingPartner_partnerId_idx" ON "BookingPartner"("partnerId");
