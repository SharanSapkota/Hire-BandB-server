"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAllRoles = findAllRoles;
exports.findRoleById = findRoleById;
exports.createRole = createRole;
exports.updateRole = updateRole;
exports.deleteRole = deleteRole;
const prisma_1 = __importDefault(require("../prisma"));
function findAllRoles() {
    return prisma_1.default.role.findMany();
}
function findRoleById(id) {
    return prisma_1.default.role.findUnique({ where: { id: BigInt(Number(id)) } });
}
function createRole(data) {
    return prisma_1.default.role.create({ data });
}
function updateRole(id, data) {
    return prisma_1.default.role.update({ where: { id: BigInt(Number(id)) }, data });
}
function deleteRole(id) {
    return prisma_1.default.role.delete({ where: { id: BigInt(Number(id)) } });
}
