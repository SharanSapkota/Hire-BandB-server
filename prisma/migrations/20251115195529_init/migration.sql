/*
  Warnings:

  - You are about to drop the `UserPaymentMethod` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserPaymentMethod" DROP CONSTRAINT "UserPaymentMethod_paymentMethodId_fkey";

-- DropForeignKey
ALTER TABLE "UserPaymentMethod" DROP CONSTRAINT "UserPaymentMethod_userId_fkey";

-- DropTable
DROP TABLE "UserPaymentMethod";

-- CreateTable
CREATE TABLE "UserPaymentMode" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT,
    "address" TEXT,
    "stripeCustomerId" TEXT,
    "stripeVerified" BOOLEAN NOT NULL DEFAULT false,
    "accountNumber" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationMethod" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "UserPaymentMode_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserPaymentMode" ADD CONSTRAINT "UserPaymentMode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
