"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAllRentals = findAllRentals;
exports.findRentalById = findRentalById;
exports.createRental = createRental;
exports.updateRental = updateRental;
exports.deleteRental = deleteRental;
const prisma_1 = __importDefault(require("../prisma"));
function findAllRentals() {
    return prisma_1.default.rental.findMany({ include: { product: true, payer: false } });
}
function findRentalById(id) {
    return prisma_1.default.rental.findUnique({ where: { id }, include: { product: true } });
}
function createRental(data) {
    return prisma_1.default.rental.create({ data, include: { product: true } });
}
function updateRental(id, data) {
    return prisma_1.default.rental.update({ where: { id }, data, include: { product: true } });
}
function deleteRental(id) {
    return prisma_1.default.rental.delete({ where: { id } });
}
