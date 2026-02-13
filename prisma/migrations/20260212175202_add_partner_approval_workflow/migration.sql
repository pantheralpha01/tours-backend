-- CreateEnum
CREATE TYPE "PartnerApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Partner" ADD COLUMN     "approvalStatus" "PartnerApprovalStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "approvedById" TEXT,
ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "rejectedReason" TEXT;

-- CreateIndex
CREATE INDEX "Partner_approvalStatus_idx" ON "Partner"("approvalStatus");

-- CreateIndex
CREATE INDEX "Partner_createdById_idx" ON "Partner"("createdById");

-- CreateIndex
CREATE INDEX "Partner_approvedById_idx" ON "Partner"("approvedById");

-- AddForeignKey
ALTER TABLE "Partner" ADD CONSTRAINT "Partner_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partner" ADD CONSTRAINT "Partner_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
