import prisma from '../prisma';

export function findSecurityByUserId(userId: number) {
  return prisma.userSecurity.findUnique({ where: { userId } });
}

export function upsertSecurity(userId: number, data: any) {
  return prisma.userSecurity.upsert({ where: { userId }, update: data, create: { ...data, userId } });
}
