import * as payRepo from '../repositories/paymentRepository';

export function listPaymentMethods() {
  return payRepo.findAllPaymentMethods();
}

export function getPaymentMethod(id: number) {
  return payRepo.findPaymentMethodById(id);
}

export function createPaymentMethod(data: any) {
  return payRepo.createPaymentMethod(data);
}

export function updatePaymentMethod(id: number, data: any) {
  return payRepo.updatePaymentMethod(id, data);
}

export function deletePaymentMethod(id: number) {
  return payRepo.deletePaymentMethod(id);
}

export function createPaymentTransaction(data: any) {
  return payRepo.createPaymentTransaction(data);
}

export function getPaymentTransaction(id: number) {
  return payRepo.findPaymentTransactionById(id);
}

export function listPaymentTransactions() {
  return payRepo.listPaymentTransactions();
}
