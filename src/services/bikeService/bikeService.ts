import {BikeRepository} from '../../repositories/bikeRepository';
import prisma from '../../prisma';
import { bikeAddressCreateDto, bikeCreateDto, bikeImagesCreateDto } from './mapper';

export class BikeService {
  constructor(private repo: BikeRepository) {
    this.repo = repo;
  }

  async listBikes() {
    return this.repo.findAllBikes();
  }

  async getBike(id: number) {
    return this.repo.findBikeById(id);
  }

  async createBike(payload: any) {
        const result = await prisma.$transaction(async (transaction: any) => {
            const bikeMapper = bikeCreateDto(payload);
            const createdBike = await this.repo.createBike(bikeMapper, transaction);
            const addressMapper = bikeAddressCreateDto(payload, createdBike.id);
            const createdAddress = await this.repo.createBikeAddress(addressMapper, transaction);
            const imagesMapper = bikeImagesCreateDto(payload, createdBike.id);
            const createdImages = await this.repo.createBikeImages(imagesMapper, transaction);

            return {...createdBike, images: createdImages, address: createdAddress };
        });

    return result
  }

  async updateBike(id: number, payload: any, currentUser: any) {
    const bike = await this.repo.findBikeById(id);
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
    return this.repo.updateBike(id, data);
  }

  async deleteBike(id: number, currentUser: any) {
    const bike = await this.repo.findBikeById(id);
    if (!bike) throw new Error('not_found');
    const currentRole2 = currentUser.userRoles && currentUser.userRoles.length ? currentUser.userRoles[0].role : null;
    if (currentUser.id !== bike.ownerId && currentRole2 && (currentRole2.code !== 'ADMIN' && currentRole2.name !== 'ADMIN')) throw new Error('forbidden');
    return this.repo.deleteBike(id);
  }
}

