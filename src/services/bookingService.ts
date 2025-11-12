import * as bookingRepo from '../repositories/bookingRepository';
import prisma from '../prisma';
import * as notifService from './notificationService';
import { BOOKING_STATUS, NOTIFICATION_TYPE } from '../constants/bikeConstants';
import { ERROR_MESSAGES } from '../constants/errorConstant';
import ROLES from '../constants/roleConstant';

export async function listBookings() {
  return bookingRepo.findAllBookings();
}

export async function getBookingById(id: number) {
  return bookingRepo.findBookingById(id);
}

export async function bookingsByBikeId(bikeId: number, userId: number) {
  return bookingRepo.findBookingsByBikeId(bikeId, userId);
}

export async function listMyBookings(userId: number) {
  return bookingRepo.findMyBookings(userId);
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
  // compute primary email/name for currentUser
  const renterEmail = currentUser.emails && currentUser.emails.length ? currentUser.emails.find((e: any) => e.isPrimary)?.email || currentUser.emails[0].email : null;
  const renterName = [currentUser.firstName, currentUser.lastName].filter(Boolean).join(' ') || renterEmail;
  // notify owner
  await notifService.createNotification({ userId: bike.ownerId, bookingId: created.id, type: 'rental_request', title: 'New booking', message: `Bike ${bike.name} was booked by ${renterName}` });
  // notify renter
  // await notifService.createNotification({ userId: currentUser.id, bookingId: created.id, title: 'Booking created', message: `Your booking for bike ${bike.name} is pending` });
  return created;
}

export async function rejectBooking(id: number, currentUser: any) {
  const booking = await bookingRepo.findBookingById(id);
  if (!booking) throw new Error(ERROR_MESSAGES.NOT_FOUND);
  if (booking.ownerId !== currentUser.id) throw new Error(ERROR_MESSAGES.FORBIDDEN);
  if (booking.status !== BOOKING_STATUS.PENDING) throw new Error(ERROR_MESSAGES.BOOKING_NOT_PENDING);
  const updated = await bookingRepo.updateBooking(id, { status: BOOKING_STATUS.REJECTED });

  await notifService.createNotification({ userId: booking.userId, bookingId: updated.id, title: 'Booking rejected', message: `Your booking for bike ${booking.bike.name} was rejected` });
  return updated;
}

export async function approveBooking(id: number, currentUser: any) {
  const booking = await bookingRepo.findBookingById(id);
  if (!booking) throw new Error(ERROR_MESSAGES.NOT_FOUND);
  if (booking.ownerId !== currentUser.id) throw new Error(ERROR_MESSAGES.FORBIDDEN);
  if (booking.status !== BOOKING_STATUS.PENDING) throw new Error(ERROR_MESSAGES.BOOKING_NOT_PENDING);
  const updated = await bookingRepo.updateBooking(id, { status: BOOKING_STATUS.APPROVED });

  await notifService.markNotificationRead(booking.userId);
  await notifService.createNotification({ userId: booking.userId, bookingId: updated.id, type: NOTIFICATION_TYPE.RENTAL_ACCEPTED, title: 'Booking accepted', message: `Your booking for bike ${booking.bike.name} was accepted` });
  return updated;
}

export async function updateBooking(id: number, payload: any, currentUser: any) {
  const booking = await bookingRepo.findBookingById(id);
  if (!booking) throw new Error(ERROR_MESSAGES.NOT_FOUND);

  // only renter or owner or admin can update
  const role = currentUser.userRoles && currentUser.userRoles.length ? currentUser.userRoles[0].role : null;
  const isOwner = currentUser.id === booking.ownerId || (role && (role.code === ROLES.ADMIN || role.name === ROLES.ADMIN));
  const isRenter = currentUser.id === booking.userId;
  if (!isOwner && !isRenter) throw new Error(ERROR_MESSAGES.FORBIDDEN);

  const data: any = {};
  if (payload.status) data.status = payload.status;
  if (payload.completedAt) data.completedAt = new Date(payload.completedAt);
  if (payload.startTime) data.startTime = new Date(payload.startTime);
  if (payload.endTime) data.endTime = new Date(payload.endTime);

  const updated = await bookingRepo.updateBooking(id, data);
  await notifService.createNotification({ userId: booking.ownerId, bookingId: updated.id, title: 'Booking updated', message: `Booking ${updated.id} status changed to ${updated.status}` });
  return updated;
}

export async function deleteBooking(id: number, currentUser: any) {
  const booking = await bookingRepo.findBookingById(id);
  if (!booking) throw new Error(ERROR_MESSAGES.NOT_FOUND);
  const role2 = currentUser.userRoles && currentUser.userRoles.length ? currentUser.userRoles[0].role : null;
  if (currentUser.id !== booking.userId && currentUser.id !== booking.ownerId && !(role2 && (role2.code === 'ADMIN' || role2.name === 'ADMIN'))) throw new Error('forbidden');
  return bookingRepo.deleteBooking(id);
}
