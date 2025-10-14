import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'change_me';

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization as string | undefined;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'missing token' });
  const token = auth.split(' ')[1];
  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.userId }, include: { role: true, type: true } });
    if (!user) return res.status(401).json({ error: 'invalid token' });
    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ error: 'invalid token' });
  }
}

export function authorizeRoles(...allowed: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const roleName = req.user && req.user.role ? req.user.role.name : null;
    if (!roleName || !allowed.includes(roleName)) return res.status(403).json({ error: 'forbidden' });
    next();
  };
}
