import * as imgRepo from '../repositories/productImageRepository';
import * as priceRepo from '../repositories/productPriceRepository';
import * as assignedRepo from '../repositories/productAssignedRepository';

export function listImages(productId: number) {
  return imgRepo.findImagesByProduct(productId);
}

export function createImage(data: any) {
  return imgRepo.createProductImage(data);
}

export function createPrice(data: any) {
  return priceRepo.createProductPrice(data);
}

export function listPrices() {
  return priceRepo.findAllProductPrices();
}

export function createAssigned(data: any) {
  return assignedRepo.createProductAssigned(data);
}

export function listAssigned(ownerId: number) {
  return assignedRepo.findAssignedByOwner(ownerId);
}
