-- CreateEnum
CREATE TYPE "PartnerEventType" AS ENUM ('APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "PartnerEvent" (
    "id" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "type" "PartnerEventType" NOT NULL,
    "actorId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PartnerEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PartnerEvent_partnerId_idx" ON "PartnerEvent"("partnerId");

-- AddForeignKey
ALTER TABLE "PartnerEvent" ADD CONSTRAINT "PartnerEvent_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE CASCADE ON UPDATE CASCADE;
