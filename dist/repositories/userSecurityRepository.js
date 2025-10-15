"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findSecurityByUserId = findSecurityByUserId;
exports.upsertSecurity = upsertSecurity;
const prisma_1 = __importDefault(require("../prisma"));
function findSecurityByUserId(userId) {
    return prisma_1.default.userSecurity.findUnique({ where: { userId } });
}
function upsertSecurity(userId, data) {
    return prisma_1.default.userSecurity.upsert({ where: { userId }, update: data, create: { ...data, userId } });
}
