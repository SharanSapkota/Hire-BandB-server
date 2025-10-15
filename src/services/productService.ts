import * as prodRepo from '../repositories/productRepository';
import prisma from '../prisma';

export async function listProducts() {
  return prodRepo.findAllProducts();
}

export async function getProduct(id: number) {
  return prodRepo.findProductById(id);
}

export async function createProduct(payload: any, ownerId?: number) {
  const { name, categoryId, productPriceId, hourlyRate, dailyRate, latitude, longitude } = payload;
  const data: any = { name, ownerId, categoryId, productPriceId, hourlyRate, dailyRate, latitude, longitude };
  return prodRepo.createProduct(data);
}

export async function updateProduct(id: number, payload: any) {
  return prodRepo.updateProduct(id, payload);
}

export async function deleteProduct(id: number) {
  return prodRepo.deleteProduct(id);
}
