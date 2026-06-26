-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('Male', 'Female');

-- CreateEnum
CREATE TYPE "SaleType" AS ENUM ('solo', 'couple');

-- CreateEnum
CREATE TYPE "ParrotStatus" AS ENUM ('available', 'reserved', 'sold');

-- CreateEnum
CREATE TYPE "DeliveryMethod" AS ENUM ('pickup', 'delivery');

-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('pending', 'deposit_confirmed', 'preparing', 'ready', 'delivered', 'cancelled');

-- CreateTable
CREATE TABLE "Parrot" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "species" TEXT NOT NULL,
    "sex" "Sex" NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "color" TEXT NOT NULL,
    "saleType" "SaleType" NOT NULL DEFAULT 'solo',
    "ringNumber" TEXT,
    "handFed" BOOLEAN NOT NULL DEFAULT true,
    "talkingAbility" TEXT,
    "healthCertificateUrl" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "deposit" DOUBLE PRECISION,
    "description" TEXT,
    "pedigreeDocUrl" TEXT,
    "parentMotherName" TEXT,
    "parentFatherName" TEXT,
    "partnerName" TEXT,
    "partnerSex" "Sex",
    "partnerBirthDate" TIMESTAMP(3),
    "partnerColor" TEXT,
    "partnerPedigreeDocUrl" TEXT,
    "status" "ParrotStatus" NOT NULL DEFAULT 'available',
    "availableFrom" TIMESTAMP(3),
    "location" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "imageUrl" TEXT,
    "imageUrl2" TEXT,
    "imageUrl3" TEXT,
    "imageUrl4" TEXT,
    "imageUrl5" TEXT,
    "videoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Parrot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guest" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT,
    "hasPet" BOOLEAN,
    "hasLostPet" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Guest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" SERIAL NOT NULL,
    "reservationNumber" TEXT NOT NULL,
    "parrotId" INTEGER NOT NULL,
    "guestId" INTEGER,
    "guestName" TEXT NOT NULL,
    "guestEmail" TEXT NOT NULL,
    "guestPhone" TEXT NOT NULL,
    "guestProfession" TEXT,
    "guestHomeAddress" TEXT,
    "paymentMethod" TEXT NOT NULL DEFAULT 'deposit',
    "paymentLabel" TEXT,
    "hasPet" BOOLEAN,
    "hasLostPet" BOOLEAN,
    "discountPercent" DOUBLE PRECISION,
    "discountAmount" DOUBLE PRECISION,
    "totalPrice" DOUBLE PRECISION,
    "depositAmount" DOUBLE PRECISION,
    "depositPaidAt" TIMESTAMP(3),
    "balanceAmount" DOUBLE PRECISION,
    "balancePaidAt" TIMESTAMP(3),
    "deliveryMethod" "DeliveryMethod" NOT NULL DEFAULT 'pickup',
    "deliveryAddress" TEXT,
    "status" "ReservationStatus" NOT NULL DEFAULT 'pending',
    "contractUrl" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReservationTracking" (
    "id" SERIAL NOT NULL,
    "reservationId" INTEGER NOT NULL,
    "status" "ReservationStatus" NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReservationTracking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminLog" (
    "id" SERIAL NOT NULL,
    "action" TEXT NOT NULL,
    "detail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WaitlistEntry" (
    "id" SERIAL NOT NULL,
    "species" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "notified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WaitlistEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Parrot_ringNumber_key" ON "Parrot"("ringNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_reservationNumber_key" ON "Reservation"("reservationNumber");

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_parrotId_fkey" FOREIGN KEY ("parrotId") REFERENCES "Parrot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservationTracking" ADD CONSTRAINT "ReservationTracking_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
