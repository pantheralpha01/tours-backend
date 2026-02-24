-- AlterEnum
ALTER TYPE "OfferStatus" ADD VALUE IF NOT EXISTS 'APPROVED';

-- AlterTable
ALTER TABLE "OfferProposal"
ADD COLUMN "approvedById" TEXT,
ADD COLUMN "approvedAt" TIMESTAMP(3),
ADD COLUMN "approvalNotes" TEXT,
ADD COLUMN "publishedById" TEXT,
ADD COLUMN "publishedAt" TIMESTAMP(3),
ADD COLUMN "publishedChannel" TEXT,
ADD COLUMN "publishNotes" TEXT,
ADD COLUMN "shareSlug" TEXT,
ADD COLUMN "shareUrl" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "OfferProposal_shareSlug_key" ON "OfferProposal"("shareSlug");
CREATE INDEX "OfferProposal_approvedById_idx" ON "OfferProposal"("approvedById");
CREATE INDEX "OfferProposal_publishedById_idx" ON "OfferProposal"("publishedById");

-- AddForeignKey
ALTER TABLE "OfferProposal" ADD CONSTRAINT "OfferProposal_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "OfferProposal" ADD CONSTRAINT "OfferProposal_publishedById_fkey" FOREIGN KEY ("publishedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
