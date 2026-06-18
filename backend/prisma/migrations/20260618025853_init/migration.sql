-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('ACTIVE', 'PENDING', 'PURCHASED', 'CONFIRMED', 'EXPIRED', 'CANCELLED');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "username" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Drop" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "totalStock" INTEGER NOT NULL,
    "availableStock" INTEGER NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "stockVersion" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Drop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "dropId" UUID NOT NULL,
    "status" "ReservationStatus" NOT NULL DEFAULT 'PENDING',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Purchase" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "dropId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");

-- CreateIndex
CREATE INDEX "Drop_startTime_idx" ON "Drop"("startTime");

-- CreateIndex
CREATE INDEX "Drop_availableStock_idx" ON "Drop"("availableStock");

-- CreateIndex
CREATE INDEX "Drop_startTime_availableStock_idx" ON "Drop"("startTime", "availableStock");

-- CreateIndex
CREATE INDEX "Reservation_userId_idx" ON "Reservation"("userId");

-- CreateIndex
CREATE INDEX "Reservation_dropId_idx" ON "Reservation"("dropId");

-- CreateIndex
CREATE INDEX "Reservation_userId_dropId_idx" ON "Reservation"("userId", "dropId");

-- CreateIndex
CREATE INDEX "Reservation_dropId_status_idx" ON "Reservation"("dropId", "status");

-- CreateIndex
CREATE INDEX "Reservation_status_expiresAt_idx" ON "Reservation"("status", "expiresAt");

-- CreateIndex
CREATE INDEX "Purchase_userId_idx" ON "Purchase"("userId");

-- CreateIndex
CREATE INDEX "Purchase_dropId_idx" ON "Purchase"("dropId");

-- CreateIndex
CREATE INDEX "Purchase_dropId_createdAt_idx" ON "Purchase"("dropId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Purchase_userId_dropId_key" ON "Purchase"("userId", "dropId");

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_dropId_fkey" FOREIGN KEY ("dropId") REFERENCES "Drop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_dropId_fkey" FOREIGN KEY ("dropId") REFERENCES "Drop"("id") ON DELETE CASCADE ON UPDATE CASCADE;
