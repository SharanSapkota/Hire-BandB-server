/*
  Warnings:

  - You are about to drop the column `images` on the `BikeImages` table. All the data in the column will be lost.
  - Added the required column `imageUrl` to the `BikeImages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BikeImages" DROP COLUMN "images",
ADD COLUMN     "imageUrl" TEXT NOT NULL;
