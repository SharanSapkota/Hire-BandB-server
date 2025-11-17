// import { Request, Response } from 'express';
// import * as detailService from '../services/userDetailService';

// export async function get(req: Request, res: Response) {
//   const userId = Number(req.params.userId || (req as any).user?.id);
//   const item = await detailService.getDetail(userId);
//   if (!item) return res.status(404).json({ error: 'not found' });
//   res.json(item);
// }

// export async function upsert(req: Request, res: Response) {
//   const userId = Number(req.params.userId || (req as any).user?.id);
//   const item = await detailService.upsertDetail(userId, req.body);
//   res.json(item);
// }
