import { Request, Response } from 'express';
import * as idService from '../services/identificationService';

export async function listServices(req: Request, res: Response) {
  const items = await idService.listServices();
  res.json(items);
}

export async function createService(req: Request, res: Response) {
  const item = await idService.createService(req.body);
  res.status(201).json(item);
}

export async function createIdentity(req: Request, res: Response) {
  const data = { ...(req.body || {}), userId: Number(req.params.userId || (req as any).user?.id) };
  const item = await idService.createIdentity(data);
  res.status(201).json(item);
}

export async function listIdentities(req: Request, res: Response) {
  const userId = Number(req.params.userId || (req as any).user?.id);
  const items = await idService.listIdentities(userId);
  res.json(items);
}
