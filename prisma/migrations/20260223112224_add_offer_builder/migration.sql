-- CreateEnum
CREATE TYPE "OfferStatus" AS ENUM ('DRAFT', 'SENT', 'ACCEPTED', 'DECLINED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "OfferAssetType" AS ENUM ('LOGO', 'SIGNATURE');

-- CreateTable
CREATE TABLE "OfferTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "defaultCurrency" "Currency" NOT NULL DEFAULT 'USD',
    "baseAmount" DECIMAL(12,2),
    "feePercentage" DECIMAL(5,4),
    "itinerary" JSONB,
    "addons" JSONB,
    "assetConfig" JSONB,
    "metadata" JSONB,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OfferTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OfferProposal" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "templateId" TEXT,
    "status" "OfferStatus" NOT NULL DEFAULT 'DRAFT',
    "currency" "Currency" NOT NULL DEFAULT 'USD',
    "baseAmount" DECIMAL(12,2) NOT NULL,
    "feeAmount" DECIMAL(12,2) NOT NULL,
    "discountAmount" DECIMAL(12,2) NOT NULL,
    "totalAmount" DECIMAL(12,2) NOT NULL,
    "feePercentage" DECIMAL(5,4) NOT NULL,
    "discountRate" DECIMAL(5,4) NOT NULL,
    "itinerary" JSONB,
    "priceBreakdown" JSONB,
    "notes" TEXT,
    "pdfUrl" TEXT,
    "logoUrl" TEXT,
    "signatureUrl" TEXT,
    "expiresAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OfferProposal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OfferAsset" (
    "id" TEXT NOT NULL,
    "proposalId" TEXT,
    "templateId" TEXT,
    "type" "OfferAssetType" NOT NULL,
    "url" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OfferAsset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OfferTemplate_slug_key" ON "OfferTemplate"("slug");

-- CreateIndex
CREATE INDEX "OfferProposal_bookingId_idx" ON "OfferProposal"("bookingId");

-- CreateIndex
CREATE INDEX "OfferProposal_templateId_idx" ON "OfferProposal"("templateId");

-- CreateIndex
CREATE INDEX "OfferAsset_proposalId_idx" ON "OfferAsset"("proposalId");

-- CreateIndex
CREATE INDEX "OfferAsset_templateId_idx" ON "OfferAsset"("templateId");

-- AddForeignKey
ALTER TABLE "OfferTemplate" ADD CONSTRAINT "OfferTemplate_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferProposal" ADD CONSTRAINT "OfferProposal_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferProposal" ADD CONSTRAINT "OfferProposal_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "OfferTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferAsset" ADD CONSTRAINT "OfferAsset_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "OfferProposal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferAsset" ADD CONSTRAINT "OfferAsset_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "OfferTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;
