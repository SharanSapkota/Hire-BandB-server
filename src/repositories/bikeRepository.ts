import prisma from '../prisma';

export function findAllBikes() {
  return prisma.bike.findMany({ include: { category: true, owner: { select: { id: true, email: true, name: true } } } });
}

export function findBikeById(id: number) {
  return prisma.bike.findUnique({ where: { id }, include: { category: true, owner: { select: { id: true, email: true, name: true } } } });
}

export function createBike(data: any) {
  return prisma.bike.create({ data });
}

export function updateBike(id: number, data: any) {
  return prisma.bike.update({ where: { id }, data });
}

export function deleteBike(id: number) {
  return prisma.bike.delete({ where: { id } });
}
