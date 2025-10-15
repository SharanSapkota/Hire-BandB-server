"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findMethodsByUser = findMethodsByUser;
exports.createUserPaymentMethod = createUserPaymentMethod;
exports.deleteUserPaymentMethod = deleteUserPaymentMethod;
const prisma_1 = __importDefault(require("../prisma"));
function findMethodsByUser(userId) {
    return prisma_1.default.userPaymentMethod.findMany({ where: { userId }, include: { paymentMethod: true } });
}
function createUserPaymentMethod(data) {
    return prisma_1.default.userPaymentMethod.create({ data, include: { paymentMethod: true } });
}
function deleteUserPaymentMethod(id) {
    return prisma_1.default.userPaymentMethod.delete({ where: { id } });
}
