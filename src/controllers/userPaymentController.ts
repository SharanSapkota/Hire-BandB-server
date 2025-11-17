// import { Request, Response } from 'express';
// import * as upmRepo from '../repositories/userPaymentMethodRepository';

// export async function list(req: Request, res: Response) {
//   const userId = Number(req.params.userId || (req as any).user?.id);
//   const items = await upmRepo.findMethodsByUser(userId);
//   res.json(items);
// }

// export async function create(req: Request, res: Response) {
//   const data = { ...(req.body || {}), userId: Number(req.params.userId || (req as any).user?.id) };
//   const item = await upmRepo.createUserPaymentMethod(data);
//   res.status(201).json(item);
// }
