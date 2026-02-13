/*
  Warnings:

  - The `currency` column on the `Payment` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('USD', 'KES');

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "commissionCurrency" "Currency" NOT NULL DEFAULT 'KES',
ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'USD';

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "currency",
ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'USD';
