/*
  Warnings:

  - You are about to drop the column `stripeCustomerId` on the `UserPaymentMode` table. All the data in the column will be lost.
  - You are about to drop the column `stripeVerified` on the `UserPaymentMode` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserPaymentMode" DROP COLUMN "stripeCustomerId",
DROP COLUMN "stripeVerified",
ADD COLUMN     "customerId" TEXT;
