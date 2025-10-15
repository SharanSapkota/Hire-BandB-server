import prisma from '../prisma';

export function findReviewsByProduct(productId: number) {
  return prisma.review.findMany({ where: { productId } });
}

export function createReview(data: any) {
  return prisma.review.create({ data });
}
