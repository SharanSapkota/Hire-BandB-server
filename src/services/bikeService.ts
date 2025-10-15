import * as bikeRepo from '../repositories/bikeRepository';
import prisma from '../prisma';

export async function listBikes() {
  return bikeRepo.findAllBikes();
}

export async function getBike(id: number) {
  return bikeRepo.findBikeById(id);
}

export async function createBike(payload: any, ownerId: number) {
  const { name, description, rentAmount, status, startTime, endTime, categoryName } = payload;
  let category = null;
  if (categoryName) {
    category = await prisma.category.upsert({ where: { name: categoryName }, update: {}, create: { name: categoryName } });
  }
  const data = {
    name,
    description,
    rentAmount: rentAmount != null ? Number(rentAmount) : 0,
    status,
    startTime: startTime ? new Date(startTime) : null,
    endTime: endTime ? new Date(endTime) : null,
    ownerId,
    categoryId: category ? category.id : undefined
  };
  return bikeRepo.createBike(data);
}

export async function updateBike(id: number, payload: any, currentUser: any) {
  const bike = await bikeRepo.findBikeById(id);
  if (!bike) throw new Error('not_found');
  const currentRole = currentUser.userRoles && currentUser.userRoles.length ? currentUser.userRoles[0].role : null;
  if (currentUser.id !== bike.ownerId && currentRole && (currentRole.code !== 'ADMIN' && currentRole.name !== 'ADMIN')) throw new Error('forbidden');

  const { name, description, rentAmount, status, startTime, endTime, categoryName } = payload;
  let category = null;
  if (categoryName) {
    category = await prisma.category.upsert({ where: { name: categoryName }, update: {}, create: { name: categoryName } });
  }
  const data = {
    name: name ?? bike.name,
    description: description ?? bike.description,
    rentAmount: rentAmount != null ? Number(rentAmount) : bike.rentAmount,
    status: status ?? bike.status,
    startTime: startTime ? new Date(startTime) : bike.startTime,
    endTime: endTime ? new Date(endTime) : bike.endTime,
    categoryId: category ? category.id : bike.categoryId
  };
  return bikeRepo.updateBike(id, data);
}

export async function deleteBike(id: number, currentUser: any) {
  const bike = await bikeRepo.findBikeById(id);
  if (!bike) throw new Error('not_found');
  const currentRole2 = currentUser.userRoles && currentUser.userRoles.length ? currentUser.userRoles[0].role : null;
  if (currentUser.id !== bike.ownerId && currentRole2 && (currentRole2.code !== 'ADMIN' && currentRole2.name !== 'ADMIN')) throw new Error('forbidden');
  return bikeRepo.deleteBike(id);
}
