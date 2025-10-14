"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAllBikes = findAllBikes;
exports.findBikeById = findBikeById;
exports.createBike = createBike;
exports.updateBike = updateBike;
exports.deleteBike = deleteBike;
const prisma_1 = __importDefault(require("../prisma"));
function findAllBikes() {
    return prisma_1.default.bike.findMany({ include: { category: true, owner: { select: { id: true, email: true, name: true } } } });
}
function findBikeById(id) {
    return prisma_1.default.bike.findUnique({ where: { id }, include: { category: true, owner: { select: { id: true, email: true, name: true } } } });
}
function createBike(data) {
    return prisma_1.default.bike.create({ data });
}
function updateBike(id, data) {
    return prisma_1.default.bike.update({ where: { id }, data });
}
function deleteBike(id) {
    return prisma_1.default.bike.delete({ where: { id } });
}
