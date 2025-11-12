/*
  Warnings:

  - A unique constraint covering the columns `[paymentTransactionId]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "paymentTransactionId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Booking_paymentTransactionId_key" ON "Booking"("paymentTransactionId");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_paymentTransactionId_fkey" FOREIGN KEY ("paymentTransactionId") REFERENCES "PaymentTransaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
