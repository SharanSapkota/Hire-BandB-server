import { Request, Response } from 'express';
import * as secService from '../services/userSecurityService';

export async function get(req: Request, res: Response) {
  const userId = Number(req.params.userId || (req as any).user?.id);
  const item = await secService.getSecurity(userId);
  if (!item) return res.status(404).json({ error: 'not found' });
  res.json(item);
}

export async function upsert(req: Request, res: Response) {
  const userId = Number(req.params.userId || (req as any).user?.id);
  const item = await secService.upsertSecurity(userId, req.body);
  res.json(item);
}
