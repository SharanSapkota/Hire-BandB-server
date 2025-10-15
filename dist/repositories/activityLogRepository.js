"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listLogsByUser = listLogsByUser;
exports.createLog = createLog;
const prisma_1 = __importDefault(require("../prisma"));
function listLogsByUser(userId) {
    return prisma_1.default.activityLog.findMany({ where: { userId } });
}
function createLog(data) {
    return prisma_1.default.activityLog.create({ data });
}
