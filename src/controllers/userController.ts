import { Request, Response } from 'express';
import prisma from '../prisma';

export async function me(req: Request, res: Response) {
  const user = await prisma.user.findUnique({ where: { id: req.user.id }, include: { role: true, type: true } });
  res.json(user);
}

export async function list(req: Request, res: Response) {
  const users = await prisma.user.findMany({ include: { role: true, type: true } });
  res.json(users);
}
