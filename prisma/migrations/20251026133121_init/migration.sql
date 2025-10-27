/*
  Warnings:

  - You are about to drop the column `number` on the `UserPhone` table. All the data in the column will be lost.
  - Added the required column `phone` to the `UserPhone` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserPhone" DROP COLUMN "number",
ADD COLUMN     "phone" TEXT NOT NULL;
