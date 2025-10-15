import { Request, Response } from 'express';
import * as prodService from '../services/productService';

export async function list(req: Request, res: Response) {
  const items = await prodService.listProducts();
  res.json(items);
}

export async function get(req: Request, res: Response) {
  const id = Number(req.params.id);
  const item = await prodService.getProduct(id);
  if (!item) return res.status(404).json({ error: 'not found' });
  res.json(item);
}

export async function create(req: Request, res: Response) {
  const ownerId = req.body.ownerId || (req as any).user?.id;
  const item = await prodService.createProduct(req.body, ownerId);
  res.status(201).json(item);
}

export async function update(req: Request, res: Response) {
  const id = Number(req.params.id);
  const updated = await prodService.updateProduct(id, req.body);
  res.json(updated);
}

export async function remove(req: Request, res: Response) {
  const id = Number(req.params.id);
  await prodService.deleteProduct(id);
  res.json({ ok: true });
}
