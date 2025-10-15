import prisma from '../prisma';

export function findAssignedByOwner(ownerId: number) {
  return prisma.productAssigned.findMany({ where: { ownerId } });
}

export function createProductAssigned(data: any) {
  return prisma.productAssigned.create({ data });
}

export function updateProductAssigned(id: number, data: any) {
  return prisma.productAssigned.update({ where: { id }, data });
}
