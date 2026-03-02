/*
  Warnings:

  - The values [CONNECTIVITY_EXPERTS] on the enum `ExpertAccessService` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ExpertAccessService_new" AS ENUM ('LAWYERS', 'TOUR_GUIDES', 'TRANSLATORS', 'PHOTOGRAPHERS', 'MEDICAL_ASSISTANTS', 'SECURITY', 'BUSINESS_SCOUTING', 'INTERCONNECTIVITY_EXPERTS', 'DELIVERY_SERVICES', 'CLEANING_SERVICES', 'EVENT_PLANNING');
ALTER TYPE "ExpertAccessService" RENAME TO "ExpertAccessService_old";
ALTER TYPE "ExpertAccessService_new" RENAME TO "ExpertAccessService";
DROP TYPE "public"."ExpertAccessService_old";
COMMIT;

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'PARTNER';
