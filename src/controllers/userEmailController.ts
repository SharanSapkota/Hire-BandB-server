import { Request, Response } from 'express';
import * as emailService from '../services/userEmailService';

export async function list(req: Request, res: Response) {
  const userId = Number(req.params.userId || (req as any).user?.id);
  const items = await emailService.listEmails(userId);
  res.json(items);
}

export async function create(req: Request, res: Response) {
  const data = { ...(req.body || {}), userId: Number(req.params.userId || (req as any).user?.id) };
  const item = await emailService.createEmail(data);
  res.status(201).json(item);
}

export async function setPrimary(req: Request, res: Response) {
  const id = Number(req.params.id);
  const userId = Number(req.params.userId || (req as any).user?.id);
  await emailService.setPrimary(id, userId);
  res.json({ ok: true });
}
