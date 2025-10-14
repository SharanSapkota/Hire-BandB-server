"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listBookings = listBookings;
exports.getBooking = getBooking;
exports.createBooking = createBooking;
exports.updateBooking = updateBooking;
exports.deleteBooking = deleteBooking;
const bookingRepo = __importStar(require("../repositories/bookingRepository"));
const prisma_1 = __importDefault(require("../prisma"));
const notifService = __importStar(require("./notificationService"));
async function listBookings() {
    return bookingRepo.findAllBookings();
}
async function getBooking(id) {
    return bookingRepo.findBookingById(id);
}
async function createBooking(payload, currentUser) {
    const { bikeId, startTime, endTime } = payload;
    // ensure bike exists
    const bike = await prisma_1.default.bike.findUnique({ where: { id: Number(bikeId) } });
    if (!bike)
        throw new Error('bike_not_found');
    // owner is bike.ownerId
    const data = {
        userId: currentUser.id,
        bikeId: bike.id,
        ownerId: bike.ownerId,
        status: 'PENDING',
        startTime: startTime ? new Date(startTime) : null,
        endTime: endTime ? new Date(endTime) : null,
    };
    const created = await bookingRepo.createBooking(data);
    // notify owner
    await notifService.createNotification({ userId: bike.ownerId, bookingId: created.id, title: 'New booking', message: `Bike ${bike.name} was booked by ${currentUser.email}` });
    // notify renter
    await notifService.createNotification({ userId: currentUser.id, bookingId: created.id, title: 'Booking created', message: `Your booking for bike ${bike.name} is pending` });
    return created;
}
async function updateBooking(id, payload, currentUser) {
    const booking = await bookingRepo.findBookingById(id);
    if (!booking)
        throw new Error('not_found');
    // only renter or owner or admin can update
    const isOwner = currentUser.id === booking.ownerId || (currentUser.role && currentUser.role.name === 'ADMIN');
    const isRenter = currentUser.id === booking.userId;
    if (!isOwner && !isRenter)
        throw new Error('forbidden');
    const data = {};
    if (payload.status)
        data.status = payload.status;
    if (payload.completedAt)
        data.completedAt = new Date(payload.completedAt);
    if (payload.startTime)
        data.startTime = new Date(payload.startTime);
    if (payload.endTime)
        data.endTime = new Date(payload.endTime);
    const updated = await bookingRepo.updateBooking(id, data);
    // notify both parties about status change
    await notifService.createNotification({ userId: booking.ownerId, bookingId: updated.id, title: 'Booking updated', message: `Booking ${updated.id} status changed to ${updated.status}` });
    await notifService.createNotification({ userId: booking.userId, bookingId: updated.id, title: 'Booking updated', message: `Your booking ${updated.id} status changed to ${updated.status}` });
    return updated;
}
async function deleteBooking(id, currentUser) {
    const booking = await bookingRepo.findBookingById(id);
    if (!booking)
        throw new Error('not_found');
    if (currentUser.id !== booking.userId && currentUser.id !== booking.ownerId && !(currentUser.role && currentUser.role.name === 'ADMIN'))
        throw new Error('forbidden');
    return bookingRepo.deleteBooking(id);
}
