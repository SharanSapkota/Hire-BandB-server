import { Request, Response } from 'express';
import * as catRepo from '../repositories/categoryRepository';

export async function list(req: Request, res: Response) {
  const items = await catRepo.findAllCategories();
  res.json(items);
}

export async function create(req: Request, res: Response) {
  const item = await catRepo.createCategory(req.body);
  res.status(201).json(item);
}
