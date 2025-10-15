import prisma from '../prisma';

export function findEmailsByUser(userId: number) {
  return prisma.userEmail.findMany({ where: { userId } });
}

export function createUserEmail(data: any) {
  return prisma.userEmail.create({ data });
}

export function setPrimaryEmail(id: number, userId: number) {
  // clear existing primary
  return prisma.$transaction([
    prisma.userEmail.updateMany({ where: { userId }, data: { isPrimary: false } }),
    prisma.userEmail.update({ where: { id }, data: { isPrimary: true } })
  ]);
}
