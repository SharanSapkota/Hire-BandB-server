import { Request, Response } from 'express';
import * as phoneService from '../services/userPhoneService';

export async function list(req: Request, res: Response) {
  const userId = Number(req.params.userId || (req as any).user?.id);
  const items = await phoneService.listPhones(userId);
  res.json(items);
}

export async function create(req: Request, res: Response) {
  const data = { ...(req.body || {}), userId: Number(req.params.userId || (req as any).user?.id) };
  const item = await phoneService.createPhone(data);
  res.status(201).json(item);
}

export async function update(req: Request, res: Response) {
  const id = BigInt(Number(req.params.id));
  const updated = await phoneService.updatePhone(id, req.body);
  res.json(updated);
}

export async function remove(req: Request, res: Response) {
  const id = BigInt(Number(req.params.id));
  await phoneService.deletePhone(id);
  res.json({ ok: true });
}
