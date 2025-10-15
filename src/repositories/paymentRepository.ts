import prisma from '../prisma';

export function findAllPaymentMethods() {
  return prisma.paymentMethod.findMany();
}

export function findPaymentMethodById(id: number) {
  return prisma.paymentMethod.findUnique({ where: { id } });
}

export function createPaymentMethod(data: any) {
  return prisma.paymentMethod.create({ data });
}

export function updatePaymentMethod(id: number, data: any) {
  return prisma.paymentMethod.update({ where: { id }, data });
}

export function deletePaymentMethod(id: number) {
  return prisma.paymentMethod.delete({ where: { id } });
}

export function createPaymentTransaction(data: any) {
  return prisma.paymentTransaction.create({ data });
}

export function findPaymentTransactionById(id: number) {
  return prisma.paymentTransaction.findUnique({ where: { id } });
}

export function listPaymentTransactions() {
  return prisma.paymentTransaction.findMany();
}
