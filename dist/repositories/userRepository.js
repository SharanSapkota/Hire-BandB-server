"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserByEmail = findUserByEmail;
exports.createUser = createUser;
exports.findUserById = findUserById;
const prisma_1 = __importDefault(require("../prisma"));
async function findUserByEmail(email) {
    return prisma_1.default.user.findUnique({ where: { email }, include: { role: true, type: true } });
}
async function createUser(data) {
    return prisma_1.default.user.create({ data });
}
async function findUserById(id) {
    return prisma_1.default.user.findUnique({ where: { id }, include: { role: true, type: true } });
}
