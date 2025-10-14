import * as userRepo from '../repositories/userRepository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'change_me';

export async function signup(payload: { name?: string; email: string; password: string }) {
  const existing = await userRepo.findUserByEmail(payload.email);
  if (existing) throw new Error('email_in_use');
  const hashed = await bcrypt.hash(payload.password, 10);

  // default role/type lookup
  const defaultRole = await (await import('../prisma')).default.userRole.findFirst({ where: { name: 'USER' } });
  const defaultType = await (await import('../prisma')).default.userType.findFirst({ where: { name: 'CUSTOMER' } });

  const user = await userRepo.createUser({ email: payload.email, password: hashed, name: payload.name, roleId: defaultRole ? defaultRole.id : undefined, typeId: defaultType ? defaultType.id : undefined });
  const token = jwt.sign({ userId: user.id, role: defaultRole ? defaultRole.name : 'USER' }, JWT_SECRET, { expiresIn: '7d' });
  return { user: { id: user.id, email: user.email, name: user.name }, token };
}

export async function login(payload: { email: string; password: string }) {
  const user = await userRepo.findUserByEmail(payload.email);
  if (!user) throw new Error('invalid_credentials');
  const ok = await bcrypt.compare(payload.password, user.password);
  if (!ok) throw new Error('invalid_credentials');
  const token = jwt.sign({ userId: user.id, role: user.role ? user.role.name : 'USER' }, JWT_SECRET, { expiresIn: '7d' });
  return { user: { id: user.id, email: user.email, name: user.name }, token };
}
