import { Request, Response } from 'express';
import * as bookingService from '../services/bookingService';

export async function list(req: Request, res: Response) {
  const bookings = await bookingService.listBookings();
  res.json(bookings);
}

export async function get(req: Request, res: Response) {
  const id = Number(req.params.id);
  const booking = await bookingService.getBooking(id);
  if (!booking) return res.status(404).json({ error: 'not found' });
  res.json(booking);
}

export async function create(req: Request, res: Response) {
  try {
    const booking = await bookingService.createBooking(req.body, req.user);
    res.status(201).json(booking);
  } catch (err: any) {
    if (err.message === 'bike_not_found') return res.status(404).json({ error: 'bike not found' });
    console.error(err);
    res.status(500).json({ error: 'internal error' });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const updated = await bookingService.updateBooking(id, req.body, req.user);
    res.json(updated);
  } catch (err: any) {
    if (err.message === 'not_found') return res.status(404).json({ error: 'not found' });
    if (err.message === 'forbidden') return res.status(403).json({ error: 'forbidden' });
    console.error(err);
    res.status(500).json({ error: 'internal error' });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    await bookingService.deleteBooking(id, req.user);
    res.json({ ok: true });
  } catch (err: any) {
    if (err.message === 'not_found') return res.status(404).json({ error: 'not found' });
    if (err.message === 'forbidden') return res.status(403).json({ error: 'forbidden' });
    console.error(err);
    res.status(500).json({ error: 'internal error' });
  }
}
