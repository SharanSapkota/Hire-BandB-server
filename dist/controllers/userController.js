"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = me;
exports.list = list;
const prisma_1 = __importDefault(require("../prisma"));
async function me(req, res) {
    const user = await prisma_1.default.user.findUnique({ where: { id: req.user.id }, include: { userRoles: { include: { role: true } }, UserType: true, emails: true } });
    res.json(user);
}
async function list(req, res) {
    const users = await prisma_1.default.user.findMany({ include: { userRoles: { include: { role: true } }, UserType: true, emails: true } });
    res.json(users);
}
