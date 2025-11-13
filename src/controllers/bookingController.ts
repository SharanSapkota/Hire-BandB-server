import { Request, Response } from 'express';
import * as bookingService from '../services/bookingService';
import { sendFailure, sendSuccess } from '../utils/response';
import { ERROR_MESSAGES } from '../constants/errorConstant';
import { bookingPresenter } from '../presentation/booking';
import { bikePresenter } from '../presentation/bike';

export async function list(req: Request, res: Response) {
  const bookings = await bookingService.listBookings();
  res.json(bookings);
}

export async function listMyBookings(req: Request, res: Response) {
  const bookings = await bookingService.listMyBookings(req.user.id);
  const myBookings = bookingPresenter(bookings);
  return sendSuccess(res, myBookings, 200);
}

export async function get(req: Request, res: Response) {
  const id = Number(req.params.id);
  const booking = await bookingService.getBooking(id);
  const presentableBooking = bookingPresenter(booking)
  if (!booking) return sendFailure(res, { error: ERROR_MESSAGES.NOT_FOUND }, 404);
  return sendSuccess(res, presentableBooking, 200);
}

export async function create(req: Request, res: Response) {
  try {
    const booking = await bookingService.createBooking(req.body, req.user);
    return sendSuccess(res, booking, 201);
  } catch (err: any) {
    if (err.message === 'bike_not_found') return res.status(404).json({ error: 'bike not found' });
    console.error(err);
    res.status(500).json({ error: 'internal error' });
  }
}

export async function rejectBooking(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const rejected = await bookingService.rejectBooking(id, req.user);
    sendSuccess(res, rejected);
  } catch (err: any) {
    if (err.message === ERROR_MESSAGES.NOT_FOUND) return sendFailure(res, { error: ERROR_MESSAGES.NOT_FOUND }, 404);
    if (err.message === ERROR_MESSAGES.FORBIDDEN) return sendFailure(res, { error: ERROR_MESSAGES.FORBIDDEN }, 403);
    console.error(err);
    return sendFailure(res, { error: ERROR_MESSAGES.INTERNAL_ERROR }, 500);
  }
}

export async function approveBooking(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const approved = await bookingService.approveBooking(id, req.user);
    sendSuccess(res, approved, 200);
  } catch (err: any) {
    if (err.message === ERROR_MESSAGES.NOT_FOUND) return sendFailure(res, { error: ERROR_MESSAGES.NOT_FOUND }, 404);
    if (err.message === ERROR_MESSAGES.FORBIDDEN) return sendFailure(res, { error: ERROR_MESSAGES.FORBIDDEN }, 403);
    console.error(err);
    return sendFailure(res, { error: ERROR_MESSAGES.INTERNAL_ERROR }, 500);
  }
}

export async function update(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const updated = await bookingService.updateBooking(id, req.body, req.user);
    return sendSuccess(res, updated, 200);
  } catch (err: any) {
    if (err.message === ERROR_MESSAGES.NOT_FOUND) return sendFailure(res, { error: ERROR_MESSAGES.NOT_FOUND }, 404);
    if (err.message === ERROR_MESSAGES.FORBIDDEN) return sendFailure(res, { error: ERROR_MESSAGES.FORBIDDEN }, 403);
    console.error(err);
    return sendFailure(res, { error: ERROR_MESSAGES.INTERNAL_ERROR }, 500);
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    await bookingService.deleteBooking(id, req.user);
    return sendSuccess(res, { ok: true }, 200);
  } catch (err: any) {
    if (err.message === ERROR_MESSAGES.NOT_FOUND) return sendFailure(res, { error: ERROR_MESSAGES.NOT_FOUND }, 404);
    if (err.message === ERROR_MESSAGES.FORBIDDEN) return sendFailure(res, { error: ERROR_MESSAGES.FORBIDDEN }, 403);
    console.error(err);
    return sendFailure(res, { error: ERROR_MESSAGES.INTERNAL_ERROR }, 500);
  }
}
