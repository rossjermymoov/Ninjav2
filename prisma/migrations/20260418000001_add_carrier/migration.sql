-- CreateTable
CREATE TABLE "Carrier" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "logoUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Carrier_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Carrier_key_key" ON "Carrier"("key");

-- CreateIndex
CREATE INDEX "Carrier_key_idx" ON "Carrier"("key");

-- CreateIndex
CREATE INDEX "Carrier_isActive_idx" ON "Carrier"("isActive");
