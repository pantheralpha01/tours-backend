/*
  Warnings:

  - You are about to drop the column `name` on the `Partner` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `Partner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Partner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Partner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Partner` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `Partner` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "PartnerServiceCategory" AS ENUM ('GET_AROUND', 'VERIFIED_STAYS', 'LIVE_LIKE_LOCAL', 'EXPERT_ACCESS', 'GEAR_UP', 'GET_ENTERTAINED');

-- CreateEnum
CREATE TYPE "GetAroundService" AS ENUM ('AIRPORT_TRANSFERS', 'PRIVATE_DRIVERS', 'CAR_RENTALS', 'EV_CHARGING', 'SCOOTER_BIKE_RENTALS', 'TOURS', 'CITY_TRANSFERS');

-- CreateEnum
CREATE TYPE "VerifiedStaysService" AS ENUM ('BOUTIQUE_HOTELS', 'VETTED_RENTALS', 'ECO_LODGES', 'LUXURY_CAMPS');

-- CreateEnum
CREATE TYPE "LiveLikeLocalService" AS ENUM ('HOME_COOKED_MEALS', 'NEIGHBORHOOD_WALKS', 'LANGUAGE_EXCHANGE', 'CULTURAL_LEARNING');

-- CreateEnum
CREATE TYPE "ExpertAccessService" AS ENUM ('LAWYERS', 'TOUR_GUIDES', 'TRANSLATORS', 'PHOTOGRAPHERS', 'MEDICAL_ASSISTANTS', 'SECURITY', 'BUSINESS_SCOUTING', 'CONNECTIVITY_EXPERTS', 'DELIVERY_SERVICES', 'CLEANING_SERVICES', 'EVENT_PLANNING');

-- CreateEnum
CREATE TYPE "GearUpService" AS ENUM ('CAMPING_GEAR', 'HIKING_EQUIPMENT', 'TECH_RENTALS');

-- CreateEnum
CREATE TYPE "GetEntertainedService" AS ENUM ('CLUB', 'DINE_OUT', 'MASSAGE_SPA');

-- DropForeignKey
ALTER TABLE "BookingPartner" DROP CONSTRAINT "BookingPartner_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "BookingPartner" DROP CONSTRAINT "BookingPartner_partnerId_fkey";

-- DropIndex
DROP INDEX "User_emailVerified_idx";

-- DropIndex
DROP INDEX "User_phoneVerified_idx";

-- Delete existing partner data to allow schema changes
DELETE FROM "BookingPartner";
DELETE FROM "PartnerEvent";
DELETE FROM "PartnerInvite";
DELETE FROM "Partner";

-- AlterTable
ALTER TABLE "Booking" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "BookingPartner" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "CommunitySubscription" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Partner" DROP COLUMN "name",
ADD COLUMN     "businessName" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "expertAccessServices" TEXT[],
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "gearUpServices" TEXT[],
ADD COLUMN     "getAroundServices" TEXT[],
ADD COLUMN     "getEntertainedServices" TEXT[],
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "liveLikeLocalServices" TEXT[],
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "serviceCategories" TEXT[],
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "verifiedStaysServices" TEXT[],
ADD COLUMN     "website" TEXT,
ALTER COLUMN "email" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "Partner_email_idx" ON "Partner"("email");

-- AddForeignKey
ALTER TABLE "BookingPartner" ADD CONSTRAINT "BookingPartner_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingPartner" ADD CONSTRAINT "BookingPartner_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
