import prisma from '../prisma';

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email }, include: { role: true, type: true } });
}

export async function createUser(data: { email: string; password: string; name?: string; roleId?: number; typeId?: number }) {
  return prisma.user.create({ data });
}

export async function findUserById(id: number) {
  return prisma.user.findUnique({ where: { id }, include: { role: true, type: true } });
}
