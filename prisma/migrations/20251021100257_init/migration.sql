/*
  Warnings:

  - You are about to drop the column `address2` on the `UserDetail` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserDetail" DROP COLUMN "address2",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "placeId" TEXT,
ADD COLUMN     "postalCode" TEXT,
ADD COLUMN     "street" TEXT,
ALTER COLUMN "country" SET DATA TYPE TEXT;
