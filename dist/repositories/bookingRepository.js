"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAllBookings = findAllBookings;
exports.findBookingById = findBookingById;
exports.createBooking = createBooking;
exports.updateBooking = updateBooking;
exports.deleteBooking = deleteBooking;
const prisma_1 = __importDefault(require("../prisma"));
function findAllBookings() {
    return prisma_1.default.booking.findMany({ include: { user: true, bike: true, owner: true } });
}
function findBookingById(id) {
    return prisma_1.default.booking.findUnique({ where: { id }, include: { user: true, bike: true, owner: true } });
}
function createBooking(data) {
    return prisma_1.default.booking.create({ data, include: { user: true, bike: true, owner: true } });
}
function updateBooking(id, data) {
    return prisma_1.default.booking.update({ where: { id }, data, include: { user: true, bike: true, owner: true } });
}
function deleteBooking(id) {
    return prisma_1.default.booking.delete({ where: { id } });
}
