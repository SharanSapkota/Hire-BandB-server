import { Request, Response } from 'express';
import * as notifService from '../services/notificationService';

export async function list(req: Request, res: Response) {
  const userId = req.user.id;
  const items = await notifService.listNotifications(userId);
  res.json(items);
}

export async function markRead(req: Request, res: Response) {
  const id = Number(req.params.id);
  const updated = await notifService.markNotificationRead(id);
  res.json(updated);
}
