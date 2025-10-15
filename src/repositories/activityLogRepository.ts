import prisma from '../prisma';

export function listLogsByUser(userId: number) {
  return prisma.activityLog.findMany({ where: { userId } });
}

export function createLog(data: any) {
  return prisma.activityLog.create({ data });
}
