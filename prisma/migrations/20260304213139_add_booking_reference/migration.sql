-- CreateTable BookingSequence
CREATE TABLE "BookingSequence" (
    "id" TEXT NOT NULL,
    "lastSeq" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "BookingSequence_pkey" PRIMARY KEY ("id")
);

-- AlterTable Booking: add referenceNumber + referenceSeq
ALTER TABLE "Booking" ADD COLUMN "referenceSeq" INTEGER;
ALTER TABLE "Booking" ADD COLUMN "referenceNumber" TEXT;

-- Back-fill existing rows with a temporary unique reference
UPDATE "Booking"
SET
  "referenceSeq" = seq,
  "referenceNumber" = 'TF-' || TO_CHAR("createdAt", 'YYYYMM') || '-' || LPAD(seq::TEXT, 5, '0')
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY "createdAt") AS seq FROM "Booking"
) AS numbered
WHERE "Booking".id = numbered.id;

-- Now make them NOT NULL + unique after back-fill
ALTER TABLE "Booking" ALTER COLUMN "referenceSeq" SET NOT NULL;
ALTER TABLE "Booking" ALTER COLUMN "referenceNumber" SET NOT NULL;
CREATE UNIQUE INDEX "Booking_referenceNumber_key" ON "Booking"("referenceNumber");
CREATE INDEX "Booking_referenceNumber_idx" ON "Booking"("referenceNumber");

-- Seed BookingSequence with the highest seq per month already used
INSERT INTO "BookingSequence" ("id", "lastSeq")
SELECT
  TO_CHAR("createdAt", 'YYYY-MM') AS id,
  MAX("referenceSeq") AS "lastSeq"
FROM "Booking"
GROUP BY TO_CHAR("createdAt", 'YYYY-MM')
ON CONFLICT ("id") DO UPDATE SET "lastSeq" = EXCLUDED."lastSeq";
