import { BookingStatus } from '@prisma/client';
import { BOOKING_STATUS } from '../constants/bikeConstants';
import prisma from '../prisma';

export function findAllBookings() {
  return prisma.booking.findMany({ include: { user: true, bike: true, owner: true } });
}

export function findBookingById(id: number) {
  return prisma.booking.findUnique({ where: { id }, include: { user: true, bike: { include: {bikeAddress: true, bikeImages: true}}, owner: true } });
}

export function findMyBookings(userId: number) {
  return prisma.booking.findMany({ where: { userId, status: BOOKING_STATUS.PENDING as BookingStatus }, include: { user: true, bike: { include: { bikeAddress: true } }, owner: true } });
}

export function findBookingsByBikeId(bikeId: number, userId: number) {
  return prisma.booking.findMany({ where: { bikeId, userId }, include: { user: true, bike: true, owner: true } });
}

export function findBookingByBikeIdAndUserId(bikeId: number, userId: number) {
  return prisma.booking.findFirst({ where: { bikeId, userId, status: BOOKING_STATUS.PENDING as BookingStatus } });
}

export function createBooking(data: any) {
  return prisma.booking.create({ data, include: { user: true, bike: true, owner: true } });
}

export function updateBooking(id: number, data: any) {
  return prisma.booking.update({ where: { id }, data, include: { user: true, bike: true, owner: true } });
}

export function deleteBooking(id: number) {
  return prisma.booking.delete({ where: { id } });
}
