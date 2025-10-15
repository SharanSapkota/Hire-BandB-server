import { Request, Response } from 'express';
import * as permService from '../services/permissionService';

export async function list(req: Request, res: Response) {
  const items = await permService.listPermissions();
  res.json(items);
}

export async function get(req: Request, res: Response) {
  const id = Number(req.params.id);
  const item = await permService.getPermission(id);
  if (!item) return res.status(404).json({ error: 'not found' });
  res.json(item);
}

export async function create(req: Request, res: Response) {
  const item = await permService.createPermission(req.body);
  res.status(201).json(item);
}

export async function update(req: Request, res: Response) {
  const id = Number(req.params.id);
  const updated = await permService.updatePermission(id, req.body);
  res.json(updated);
}

export async function remove(req: Request, res: Response) {
  const id = Number(req.params.id);
  await permService.deletePermission(id);
  res.json({ ok: true });
}
