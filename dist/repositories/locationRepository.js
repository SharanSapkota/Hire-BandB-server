"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listLocationsByUser = listLocationsByUser;
exports.createLocation = createLocation;
exports.deleteLocation = deleteLocation;
const prisma_1 = __importDefault(require("../prisma"));
function listLocationsByUser(userId) {
    return prisma_1.default.location.findMany({ where: { userId } });
}
function createLocation(data) {
    return prisma_1.default.location.create({ data });
}
function deleteLocation(id) {
    return prisma_1.default.location.delete({ where: { id } });
}
