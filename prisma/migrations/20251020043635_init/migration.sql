/*
  Warnings:

  - Added the required column `bikeId` to the `Bike` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bike" ADD COLUMN     "bikeId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "BikeImages" (
    "id" SERIAL NOT NULL,
    "bikeId" INTEGER NOT NULL,
    "images" TEXT NOT NULL,

    CONSTRAINT "BikeImages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BikeAddress" (
    "id" SERIAL NOT NULL,
    "bikeId" INTEGER NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "address" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "postalCode" TEXT,
    "placeId" TEXT,

    CONSTRAINT "BikeAddress_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BikeImages" ADD CONSTRAINT "BikeImages_bikeId_fkey" FOREIGN KEY ("bikeId") REFERENCES "Bike"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BikeAddress" ADD CONSTRAINT "BikeAddress_bikeId_fkey" FOREIGN KEY ("bikeId") REFERENCES "Bike"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
