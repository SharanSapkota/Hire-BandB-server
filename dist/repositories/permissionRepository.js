"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAllPermissions = findAllPermissions;
exports.findPermissionById = findPermissionById;
exports.createPermission = createPermission;
exports.updatePermission = updatePermission;
exports.deletePermission = deletePermission;
const prisma_1 = __importDefault(require("../prisma"));
function findAllPermissions() {
    return prisma_1.default.permission.findMany();
}
function findPermissionById(id) {
    return prisma_1.default.permission.findUnique({ where: { id } });
}
function createPermission(data) {
    return prisma_1.default.permission.create({ data });
}
function updatePermission(id, data) {
    return prisma_1.default.permission.update({ where: { id }, data });
}
function deletePermission(id) {
    return prisma_1.default.permission.delete({ where: { id } });
}
