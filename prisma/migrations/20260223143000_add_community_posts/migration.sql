-- CreateEnum
CREATE TYPE "CommunityPostStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'FLAGGED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "CommunityVisibility" AS ENUM ('PUBLIC', 'MEMBERS_ONLY');

-- CreateEnum
CREATE TYPE "CommunityReactionType" AS ENUM ('LIKE', 'LOVE', 'INSIGHTFUL', 'CURIOUS');

-- CreateEnum
CREATE TYPE "CommunityCommentStatus" AS ENUM ('PUBLISHED', 'HIDDEN', 'DELETED');

-- CreateTable
CREATE TABLE "CommunityTopic" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "color" TEXT,
    "metadata" JSONB,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommunityTopic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityPost" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "coverImage" TEXT,
    "tags" JSONB,
    "metadata" JSONB,
    "status" "CommunityPostStatus" NOT NULL DEFAULT 'DRAFT',
    "visibility" "CommunityVisibility" NOT NULL DEFAULT 'PUBLIC',
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "pinnedAt" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3),
    "lastActivityAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reactionCount" INTEGER NOT NULL DEFAULT 0,
    "commentCount" INTEGER NOT NULL DEFAULT 0,
    "authorId" TEXT NOT NULL,
    "topicId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommunityPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityReaction" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "CommunityReactionType" NOT NULL DEFAULT 'LIKE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommunityReaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityComment" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "parentId" TEXT,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" "CommunityCommentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommunityComment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CommunityTopic_name_key" ON "CommunityTopic"("name");
CREATE UNIQUE INDEX "CommunityTopic_slug_key" ON "CommunityTopic"("slug");
CREATE INDEX "CommunityTopic_createdById_idx" ON "CommunityTopic"("createdById");

CREATE UNIQUE INDEX "CommunityPost_slug_key" ON "CommunityPost"("slug");
CREATE INDEX "CommunityPost_authorId_idx" ON "CommunityPost"("authorId");
CREATE INDEX "CommunityPost_topicId_idx" ON "CommunityPost"("topicId");
CREATE INDEX "CommunityPost_status_idx" ON "CommunityPost"("status");
CREATE INDEX "CommunityPost_visibility_idx" ON "CommunityPost"("visibility");
CREATE INDEX "CommunityPost_isPinned_lastActivityAt_idx" ON "CommunityPost"("isPinned", "lastActivityAt");

CREATE UNIQUE INDEX "CommunityReaction_postId_userId_key" ON "CommunityReaction"("postId", "userId");
CREATE INDEX "CommunityReaction_userId_idx" ON "CommunityReaction"("userId");

CREATE INDEX "CommunityComment_postId_idx" ON "CommunityComment"("postId");
CREATE INDEX "CommunityComment_userId_idx" ON "CommunityComment"("userId");
CREATE INDEX "CommunityComment_parentId_idx" ON "CommunityComment"("parentId");

-- AddForeignKey
ALTER TABLE "CommunityTopic" ADD CONSTRAINT "CommunityTopic_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "CommunityPost" ADD CONSTRAINT "CommunityPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CommunityPost" ADD CONSTRAINT "CommunityPost_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "CommunityTopic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "CommunityReaction" ADD CONSTRAINT "CommunityReaction_postId_fkey" FOREIGN KEY ("postId") REFERENCES "CommunityPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CommunityReaction" ADD CONSTRAINT "CommunityReaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CommunityComment" ADD CONSTRAINT "CommunityComment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "CommunityPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CommunityComment" ADD CONSTRAINT "CommunityComment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "CommunityComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CommunityComment" ADD CONSTRAINT "CommunityComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
