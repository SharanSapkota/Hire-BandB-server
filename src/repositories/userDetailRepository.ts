import prisma from '../prisma';

export function findUserDetailByUserId(userId: number) {
  return prisma.userDetail.findUnique({ where: { userId } });
}

export function upsertUserDetail(userId: number, data: any) {
  return prisma.userDetail.upsert({ where: { userId }, update: data, create: { ...data, userId } });
}
