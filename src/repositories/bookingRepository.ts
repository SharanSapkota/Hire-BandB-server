import prisma from '../prisma';

export function findAllBookings() {
  return prisma.booking.findMany({ include: { user: true, bike: true, owner: true } });
}

export function findBookingById(id: number) {
  return prisma.booking.findUnique({ where: { id }, include: { user: true, bike: true, owner: true } });
}

export function findMyBookings(userId: number) {
  return prisma.booking.findMany({ where: { userId }, include: { user: true, bike: { include: { bikeAddress: true } }, owner: true } });
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
