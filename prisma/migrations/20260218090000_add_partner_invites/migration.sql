-- CreateEnum
CREATE TYPE "PartnerInviteStatus" AS ENUM ('PENDING', 'ACCEPTED', 'EXPIRED');

-- AlterEnum
ALTER TYPE "PartnerEventType" ADD VALUE 'INVITED';
ALTER TYPE "PartnerEventType" ADD VALUE 'INVITE_ACCEPTED';

-- CreateTable
CREATE TABLE "PartnerInvite" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" "PartnerInviteStatus" NOT NULL DEFAULT 'PENDING',
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "metadata" JSONB,
    "partnerId" TEXT,
    "invitedById" TEXT NOT NULL,
    "acceptedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PartnerInvite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PartnerInvite_token_key" ON "PartnerInvite"("token");
CREATE INDEX "PartnerInvite_status_idx" ON "PartnerInvite"("status");
CREATE INDEX "PartnerInvite_email_idx" ON "PartnerInvite"("email");
CREATE INDEX "PartnerInvite_partnerId_idx" ON "PartnerInvite"("partnerId");
CREATE INDEX "PartnerInvite_invitedById_idx" ON "PartnerInvite"("invitedById");

-- AddForeignKey
ALTER TABLE "PartnerInvite" ADD CONSTRAINT "PartnerInvite_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "PartnerInvite" ADD CONSTRAINT "PartnerInvite_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
