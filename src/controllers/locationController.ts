import { Request, Response } from 'express';
import * as locService from '../services/locationService';

export async function list(req: Request, res: Response) {
  const userId = Number(req.params.userId || (req as any).user?.id);
  const items = await locService.listLocations(userId);
  res.json(items);
}

export async function create(req: Request, res: Response) {
  const data = { ...(req.body || {}), userId: Number(req.params.userId || (req as any).user?.id) };
  const item = await locService.createLocation(data);
  res.status(201).json(item);
}

export async function remove(req: Request, res: Response) {
  const id = Number(req.params.id);
  await locService.deleteLocation(id);
  res.json({ ok: true });
}
