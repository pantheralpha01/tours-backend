-- CreateEnum
CREATE TYPE "DispatchEventType" AS ENUM ('CREATED', 'ASSIGNED', 'STATUS_CHANGED');

-- CreateTable
CREATE TABLE "DispatchEvent" (
    "id" TEXT NOT NULL,
    "dispatchId" TEXT NOT NULL,
    "type" "DispatchEventType" NOT NULL,
    "actorId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DispatchEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DispatchEvent_dispatchId_idx" ON "DispatchEvent"("dispatchId");

-- CreateIndex
CREATE INDEX "DispatchEvent_createdAt_idx" ON "DispatchEvent"("createdAt");

-- AddForeignKey
ALTER TABLE "DispatchEvent" ADD CONSTRAINT "DispatchEvent_dispatchId_fkey" FOREIGN KEY ("dispatchId") REFERENCES "Dispatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
