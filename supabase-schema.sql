-- Sweet Puppies — Supabase Schema
-- Execute in Supabase SQL Editor

CREATE TYPE "Sex"                AS ENUM ('Male', 'Female');
CREATE TYPE "PuppyStatus"        AS ENUM ('available', 'reserved', 'sold');
CREATE TYPE "DeliveryMethod"     AS ENUM ('pickup', 'delivery');
CREATE TYPE "ReservationStatus"  AS ENUM ('pending', 'deposit_confirmed', 'preparing', 'ready', 'delivered', 'cancelled');

CREATE TABLE "Puppy" (
  "id"                  SERIAL PRIMARY KEY,
  "name"                TEXT NOT NULL,
  "breed"               TEXT NOT NULL,
  "sex"                 "Sex" NOT NULL,
  "birthDate"           TIMESTAMP NOT NULL,
  "color"               TEXT DEFAULT 'Non spécifiée',
  "microchipNumber"     TEXT UNIQUE,
  "vaccinationStatus"   TEXT DEFAULT 'À jour',
  "dewormingStatus"     TEXT DEFAULT 'À jour',
  "weightCurrent"       FLOAT,
  "weightEstimatedAdult" FLOAT,
  "price"               FLOAT NOT NULL,
  "deposit"             FLOAT,
  "description"         TEXT,
  "pedigreeDocUrl"      TEXT,
  "healthCertificateUrl" TEXT,
  "parentMotherName"    TEXT,
  "parentFatherName"    TEXT,
  "status"              "PuppyStatus" DEFAULT 'available',
  "availableFrom"       TIMESTAMP,
  "location"            TEXT,
  "featured"            BOOLEAN DEFAULT false,
  "isActive"            BOOLEAN DEFAULT true,
  "imageUrl"            TEXT,
  "imageUrl2"           TEXT,
  "imageUrl3"           TEXT,
  "imageUrl4"           TEXT,
  "imageUrl5"           TEXT,
  "videoUrl"            TEXT,
  "createdAt"           TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "Guest" (
  "id"        SERIAL PRIMARY KEY,
  "name"      TEXT NOT NULL,
  "email"     TEXT NOT NULL,
  "phone"     TEXT NOT NULL,
  "address"   TEXT,
  "hasPet"    BOOLEAN,
  "hasLostPet" BOOLEAN,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "Reservation" (
  "id"                SERIAL PRIMARY KEY,
  "reservationNumber" TEXT UNIQUE NOT NULL,
  "puppyId"           INT NOT NULL REFERENCES "Puppy"("id"),
  "guestId"           INT REFERENCES "Guest"("id"),
  "guestName"         TEXT NOT NULL,
  "guestEmail"        TEXT NOT NULL,
  "guestPhone"        TEXT NOT NULL,
  "guestProfession"   TEXT,
  "guestHomeAddress"  TEXT,
  "paymentMethod"     TEXT DEFAULT 'deposit',
  "paymentLabel"      TEXT,
  "hasPet"            BOOLEAN,
  "hasLostPet"        BOOLEAN,
  "discountPercent"   FLOAT,
  "discountAmount"    FLOAT,
  "totalPrice"        FLOAT,
  "depositAmount"     FLOAT,
  "depositPaidAt"     TIMESTAMP,
  "balanceAmount"     FLOAT,
  "balancePaidAt"     TIMESTAMP,
  "deliveryMethod"    "DeliveryMethod" DEFAULT 'pickup',
  "deliveryAddress"   TEXT,
  "status"            "ReservationStatus" DEFAULT 'pending',
  "contractUrl"       TEXT,
  "notes"             TEXT,
  "createdAt"         TIMESTAMP DEFAULT NOW(),
  "updatedAt"         TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "ReservationTracking" (
  "id"              SERIAL PRIMARY KEY,
  "reservationId"   INT NOT NULL REFERENCES "Reservation"("id") ON DELETE CASCADE,
  "status"          "ReservationStatus" NOT NULL,
  "comment"         TEXT,
  "createdAt"       TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "AdminLog" (
  "id"        SERIAL PRIMARY KEY,
  "action"    TEXT NOT NULL,
  "detail"    TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "WaitlistEntry" (
  "id"        SERIAL PRIMARY KEY,
  "breed"     TEXT NOT NULL,
  "name"      TEXT NOT NULL,
  "email"     TEXT NOT NULL,
  "phone"     TEXT,
  "notified"  BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Prisma migrations table
CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
  "id"                  VARCHAR(36) PRIMARY KEY,
  "checksum"            VARCHAR(64) NOT NULL,
  "finished_at"         TIMESTAMP,
  "migration_name"      VARCHAR(255) NOT NULL,
  "logs"                TEXT,
  "rolled_back_at"      TIMESTAMP,
  "started_at"          TIMESTAMP DEFAULT NOW(),
  "applied_steps_count" INT DEFAULT 0
);
