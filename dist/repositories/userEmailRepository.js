"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findEmailsByUser = findEmailsByUser;
exports.createUserEmail = createUserEmail;
exports.setPrimaryEmail = setPrimaryEmail;
const prisma_1 = __importDefault(require("../prisma"));
function findEmailsByUser(userId) {
    return prisma_1.default.userEmail.findMany({ where: { userId } });
}
function createUserEmail(data) {
    return prisma_1.default.userEmail.create({ data });
}
function setPrimaryEmail(id, userId) {
    // clear existing primary
    return prisma_1.default.$transaction([
        prisma_1.default.userEmail.updateMany({ where: { userId }, data: { isPrimary: false } }),
        prisma_1.default.userEmail.update({ where: { id }, data: { isPrimary: true } })
    ]);
}
