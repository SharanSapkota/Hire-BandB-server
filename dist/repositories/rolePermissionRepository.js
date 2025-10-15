"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAllRolePermissions = findAllRolePermissions;
exports.findRolePermissionById = findRolePermissionById;
exports.createRolePermission = createRolePermission;
exports.updateRolePermission = updateRolePermission;
exports.deleteRolePermission = deleteRolePermission;
const prisma_1 = __importDefault(require("../prisma"));
function findAllRolePermissions() {
    return prisma_1.default.rolePermission.findMany({ include: { permission: true, role: true } });
}
function findRolePermissionById(id) {
    return prisma_1.default.rolePermission.findUnique({ where: { id }, include: { permission: true, role: true } });
}
function createRolePermission(data) {
    return prisma_1.default.rolePermission.create({ data, include: { permission: true, role: true } });
}
function updateRolePermission(id, data) {
    return prisma_1.default.rolePermission.update({ where: { id }, data, include: { permission: true, role: true } });
}
function deleteRolePermission(id) {
    return prisma_1.default.rolePermission.delete({ where: { id } });
}
