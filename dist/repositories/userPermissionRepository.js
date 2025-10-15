"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAllUserPermissions = findAllUserPermissions;
exports.findUserPermissionById = findUserPermissionById;
exports.createUserPermission = createUserPermission;
exports.updateUserPermission = updateUserPermission;
exports.deleteUserPermission = deleteUserPermission;
const prisma_1 = __importDefault(require("../prisma"));
function findAllUserPermissions() {
    return prisma_1.default.userPermission.findMany({ include: { permission: true, user: true } });
}
function findUserPermissionById(id) {
    return prisma_1.default.userPermission.findUnique({ where: { id }, include: { permission: true, user: true } });
}
function createUserPermission(data) {
    return prisma_1.default.userPermission.create({ data, include: { permission: true, user: true } });
}
function updateUserPermission(id, data) {
    return prisma_1.default.userPermission.update({ where: { id }, data, include: { permission: true, user: true } });
}
function deleteUserPermission(id) {
    return prisma_1.default.userPermission.delete({ where: { id } });
}
