"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAssignedByOwner = findAssignedByOwner;
exports.createProductAssigned = createProductAssigned;
exports.updateProductAssigned = updateProductAssigned;
const prisma_1 = __importDefault(require("../prisma"));
function findAssignedByOwner(ownerId) {
    return prisma_1.default.productAssigned.findMany({ where: { ownerId } });
}
function createProductAssigned(data) {
    return prisma_1.default.productAssigned.create({ data });
}
function updateProductAssigned(id, data) {
    return prisma_1.default.productAssigned.update({ where: { id }, data });
}
