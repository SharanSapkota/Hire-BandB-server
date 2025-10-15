import { Request, Response } from 'express';
import * as rentService from '../services/rentalService';

export async function list(req: Request, res: Response) {
  const items = await rentService.listRentals();
  res.json(items);
}

export async function get(req: Request, res: Response) {
  const id = Number(req.params.id);
  const item = await rentService.getRental(id);
  if (!item) return res.status(404).json({ error: 'not found' });
  res.json(item);
}

export async function create(req: Request, res: Response) {
  const item = await rentService.createRental(req.body);
  res.status(201).json(item);
}

export async function update(req: Request, res: Response) {
  const id = Number(req.params.id);
  const updated = await rentService.updateRental(id, req.body);
  res.json(updated);
}

export async function remove(req: Request, res: Response) {
  const id = Number(req.params.id);
  await rentService.deleteRental(id);
  res.json({ ok: true });
}
