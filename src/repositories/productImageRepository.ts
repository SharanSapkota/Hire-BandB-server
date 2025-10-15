import prisma from '../prisma';

export function findImagesByProduct(productId: number) {
  return prisma.productImage.findMany({ where: { productId } });
}

export function createProductImage(data: any) {
  return prisma.productImage.create({ data });
}

export function deleteProductImage(id: number) {
  return prisma.productImage.delete({ where: { id } });
}
