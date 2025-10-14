import { Request, Response } from 'express';
import * as bikeService from '../services/bikeService';

export async function list(req: Request, res: Response) {
  const bikes = await bikeService.listBikes();
  res.json(bikes);
}

export async function get(req: Request, res: Response) {
  const id = Number(req.params.id);
  const bike = await bikeService.getBike(id);
  if (!bike) return res.status(404).json({ error: 'not found' });
  res.json(bike);
}

export async function create(req: Request, res: Response) {
  try {
    const bike = await bikeService.createBike(req.body, req.user.id);
    res.status(201).json(bike);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal error' });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const updated = await bikeService.updateBike(id, req.body, req.user);
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
    await bikeService.deleteBike(id, req.user);
    res.json({ ok: true });
  } catch (err: any) {
    if (err.message === 'not_found') return res.status(404).json({ error: 'not found' });
    if (err.message === 'forbidden') return res.status(403).json({ error: 'forbidden' });
    console.error(err);
    res.status(500).json({ error: 'internal error' });
  }
}
