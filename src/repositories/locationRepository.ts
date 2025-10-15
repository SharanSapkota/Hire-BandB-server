import prisma from '../prisma';

export function listLocationsByUser(userId: number) {
  return prisma.location.findMany({ where: { userId } });
}

export function createLocation(data: any) {
  return prisma.location.create({ data });
}

export function deleteLocation(id: number) {
  return prisma.location.delete({ where: { id } });
}
