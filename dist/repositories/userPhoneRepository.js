"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findPhonesByUser = findPhonesByUser;
exports.createPhone = createPhone;
exports.updatePhone = updatePhone;
exports.deletePhone = deletePhone;
const prisma_1 = __importDefault(require("../prisma"));
function findPhonesByUser(userId) {
    return prisma_1.default.userPhone.findMany({ where: { userId } });
}
function createPhone(data) {
    return prisma_1.default.userPhone.create({ data });
}
function updatePhone(id, data) {
    return prisma_1.default.userPhone.update({ where: { id: BigInt(Number(id)) }, data });
}
function deletePhone(id) {
    return prisma_1.default.userPhone.delete({ where: { id: BigInt(Number(id)) } });
}
