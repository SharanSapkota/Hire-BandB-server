"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAllPaymentMethods = findAllPaymentMethods;
exports.findPaymentMethodById = findPaymentMethodById;
exports.createPaymentMethod = createPaymentMethod;
exports.updatePaymentMethod = updatePaymentMethod;
exports.deletePaymentMethod = deletePaymentMethod;
exports.createPaymentTransaction = createPaymentTransaction;
exports.findPaymentTransactionById = findPaymentTransactionById;
exports.listPaymentTransactions = listPaymentTransactions;
const prisma_1 = __importDefault(require("../prisma"));
function findAllPaymentMethods() {
    return prisma_1.default.paymentMethod.findMany();
}
function findPaymentMethodById(id) {
    return prisma_1.default.paymentMethod.findUnique({ where: { id } });
}
function createPaymentMethod(data) {
    return prisma_1.default.paymentMethod.create({ data });
}
function updatePaymentMethod(id, data) {
    return prisma_1.default.paymentMethod.update({ where: { id }, data });
}
function deletePaymentMethod(id) {
    return prisma_1.default.paymentMethod.delete({ where: { id } });
}
function createPaymentTransaction(data) {
    return prisma_1.default.paymentTransaction.create({ data });
}
function findPaymentTransactionById(id) {
    return prisma_1.default.paymentTransaction.findUnique({ where: { id } });
}
function listPaymentTransactions() {
    return prisma_1.default.paymentTransaction.findMany();
}
