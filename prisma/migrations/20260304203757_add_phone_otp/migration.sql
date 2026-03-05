-- CreateTable (idempotent: first migration may have already created this)
CREATE TABLE IF NOT EXISTS "PhoneOtp" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "otpHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PhoneOtp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "PhoneOtp_phone_key" ON "PhoneOtp"("phone");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "PhoneOtp_phone_idx" ON "PhoneOtp"("phone");
