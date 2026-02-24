-- CreateEnum
CREATE TYPE "CommunitySubscriptionFrequency" AS ENUM ('INSTANT', 'DAILY');

-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'COMMUNITY';

-- CreateTable
CREATE TABLE "CommunitySubscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "topicId" TEXT,
    "postId" TEXT,
    "frequency" "CommunitySubscriptionFrequency" NOT NULL DEFAULT 'INSTANT',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CommunitySubscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CommunitySubscription_userId_idx" ON "CommunitySubscription"("userId");
CREATE INDEX "CommunitySubscription_topicId_idx" ON "CommunitySubscription"("topicId");
CREATE INDEX "CommunitySubscription_postId_idx" ON "CommunitySubscription"("postId");
CREATE UNIQUE INDEX "CommunitySubscription_userId_topicId_key" ON "CommunitySubscription"("userId", "topicId");
CREATE UNIQUE INDEX "CommunitySubscription_userId_postId_key" ON "CommunitySubscription"("userId", "postId");

-- AddForeignKey
ALTER TABLE "CommunitySubscription"
  ADD CONSTRAINT "CommunitySubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CommunitySubscription"
  ADD CONSTRAINT "CommunitySubscription_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "CommunityTopic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CommunitySubscription"
  ADD CONSTRAINT "CommunitySubscription_postId_fkey" FOREIGN KEY ("postId") REFERENCES "CommunityPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
