import { Request, Response } from 'express';
import * as payService from '../services/paymentService';

export async function listMethods(req: Request, res: Response) {
  const items = await payService.listPaymentMethods();
  res.json(items);
}

export async function createMethod(req: Request, res: Response) {
  const item = await payService.createPaymentMethod(req.body);
  res.status(201).json(item);
}

export async function listTransactions(req: Request, res: Response) {
  const items = await payService.listPaymentTransactions();
  res.json(items);
}

export async function createTransaction(req: Request, res: Response) {
  const item = await payService.createPaymentTransaction(req.body);
  res.status(201).json(item);
}
