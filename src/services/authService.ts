import * as userRepo from '../repositories/userRepository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'change_me';

function userDisplayName(u: any) {
  return [u.firstName, u.lastName].filter(Boolean).join(' ') || null;
}

export async function signup(payload: { firstName?: string; lastName?: string; email: string; password: string }) {
  const existing = await userRepo.findUserByEmail(payload.email);
  if (existing) throw new Error('email_in_use');
  const hashed = await bcrypt.hash(payload.password, 10);

  // default role/type lookup
  const prisma = await import('../prisma');
  const defaultRole = await prisma.default.role.findFirst({ where: { code: 'USER' } });
  const defaultType = await prisma.default.userType.findFirst({ where: { name: 'CUSTOMER' } });

  const user = await userRepo.createUser({ email: payload.email, password: hashed, firstName: payload.firstName, lastName: payload.lastName, roleId: defaultRole ? defaultRole.id : undefined, typeId: defaultType ? defaultType.id : undefined });

  const roleCode = defaultRole ? defaultRole.code : 'USER';
  const token = jwt.sign({ userId: user.id, role: roleCode }, JWT_SECRET, { expiresIn: '7d' });
  return { user: { id: user.id, email: payload.email, name: userDisplayName(user) }, token };
}

export async function login(payload: { email: string; password: string }) {
  const user = await userRepo.findUserByEmail(payload.email);
  if (!user) throw new Error('invalid_credentials');
  const ok = await bcrypt.compare(payload.password, user.password);
  if (!ok) throw new Error('invalid_credentials');

  const role = user.userRoles && user.userRoles.length ? user.userRoles[0].role : null;
  const roleCode = role ? role.code : 'USER';
  const token = jwt.sign({ userId: user.id, role: roleCode }, JWT_SECRET, { expiresIn: '7d' });

  // get primary email
  const primaryEmail = user.emails && user.emails.length ? user.emails.find((e: any) => e.isPrimary)?.email || user.emails[0].email : null;
  return { user: { id: user.id, email: primaryEmail, name: userDisplayName(user) }, token };
}
