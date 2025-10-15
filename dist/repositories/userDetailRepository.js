"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserDetailByUserId = findUserDetailByUserId;
exports.upsertUserDetail = upsertUserDetail;
const prisma_1 = __importDefault(require("../prisma"));
function findUserDetailByUserId(userId) {
    return prisma_1.default.userDetail.findUnique({ where: { userId } });
}
function upsertUserDetail(userId, data) {
    return prisma_1.default.userDetail.upsert({ where: { userId }, update: data, create: { ...data, userId } });
}
