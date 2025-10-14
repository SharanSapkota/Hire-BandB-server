import * as bookingRepo from '../repositories/bookingRepository';
import prisma from '../prisma';
import * as notifService from './notificationService';

export async function listBookings() {
  return bookingRepo.findAllBookings();
}

export async function getBooking(id: number) {
  return bookingRepo.findBookingById(id);
}

export async function createBooking(payload: any, currentUser: any) {
  const { bikeId, startTime, endTime } = payload;
  // ensure bike exists
  const bike = await prisma.bike.findUnique({ where: { id: Number(bikeId) } });
  if (!bike) throw new Error('bike_not_found');

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

export async function updateBooking(id: number, payload: any, currentUser: any) {
  const booking = await bookingRepo.findBookingById(id);
  if (!booking) throw new Error('not_found');

  // only renter or owner or admin can update
  const isOwner = currentUser.id === booking.ownerId || (currentUser.role && currentUser.role.name === 'ADMIN');
  const isRenter = currentUser.id === booking.userId;
  if (!isOwner && !isRenter) throw new Error('forbidden');

  const data: any = {};
  if (payload.status) data.status = payload.status;
  if (payload.completedAt) data.completedAt = new Date(payload.completedAt);
  if (payload.startTime) data.startTime = new Date(payload.startTime);
  if (payload.endTime) data.endTime = new Date(payload.endTime);

  const updated = await bookingRepo.updateBooking(id, data);
  // notify both parties about status change
  await notifService.createNotification({ userId: booking.ownerId, bookingId: updated.id, title: 'Booking updated', message: `Booking ${updated.id} status changed to ${updated.status}` });
  await notifService.createNotification({ userId: booking.userId, bookingId: updated.id, title: 'Booking updated', message: `Your booking ${updated.id} status changed to ${updated.status}` });
  return updated;
}

export async function deleteBooking(id: number, currentUser: any) {
  const booking = await bookingRepo.findBookingById(id);
  if (!booking) throw new Error('not_found');
  if (currentUser.id !== booking.userId && currentUser.id !== booking.ownerId && !(currentUser.role && currentUser.role.name === 'ADMIN')) throw new Error('forbidden');
  return bookingRepo.deleteBooking(id);
}
