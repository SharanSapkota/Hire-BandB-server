import { Request, Response } from 'express';
import * as assetService from '../services/productAssetService';

export async function listImages(req: Request, res: Response) {
  const productId = Number(req.params.productId);
  const items = await assetService.listImages(productId);
  res.json(items);
}

export async function createImage(req: Request, res: Response) {
  const data = { ...(req.body || {}) };
  const item = await assetService.createImage(data);
  res.status(201).json(item);
}

export async function createPrice(req: Request, res: Response) {
  const item = await assetService.createPrice(req.body);
  res.status(201).json(item);
}

export async function listPrices(req: Request, res: Response) {
  const items = await assetService.listPrices();
  res.json(items);
}

export async function createAssigned(req: Request, res: Response) {
  const item = await assetService.createAssigned(req.body);
  res.status(201).json(item);
}

export async function listAssigned(req: Request, res: Response) {
  const ownerId = Number(req.params.ownerId || (req as any).user?.id);
  const items = await assetService.listAssigned(ownerId);
  res.json(items);
}
