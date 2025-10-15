import prisma from '../prisma';

export function findAllProductPrices() {
  return prisma.productPrice.findMany();
}

export function createProductPrice(data: any) {
  return prisma.productPrice.create({ data });
}

export function findPriceById(id: number) {
  return prisma.productPrice.findUnique({ where: { id } });
}
