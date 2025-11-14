import { promises as fsPromises } from 'fs';
import path from 'path';
import { BikeRepository } from '../../repositories/bikeRepository';
import prisma from '../../prisma';
import { bikeAddressCreateDto, bikeCreateDto, bikeImagesCreateDto } from './mapper';
import { BikeQueryBuilder } from '../../queryBuilder/bikeQuery';
import { QueryBuilder } from '../../queryBuilder/query';
import { MEDIA_ROOT } from '../../middleware/upload';
import * as bookingService from '../bookingService';
import { BOOKING_STATUS } from '../../constants/bikeConstants';
export class BikeService {
  constructor(private repo: BikeRepository) {
    this.repo = repo;
  }

  async listBikesByAddress(query: { lat: number, lng: number, city?: string, state?: string, country?: string }) {
    const queryBuilder = new BikeQueryBuilder(query)
    const listBikeByAddressQuery = queryBuilder.listBikeByAddress();
    
    return await this.repo.findAllBikes(listBikeByAddressQuery);
  }

  async listBikes(query: any) {
    const queryBuilder = new BikeQueryBuilder(query)
    const listBikeQuery = queryBuilder.listBike({bikeAdress: true, bikeImages: true, bikeCategory: true})
    return this.repo.findAllBikes(listBikeQuery);
  }

  async getBike(id: number, currentUser: any) {
    const myBike: any = await this.repo.findBikeById(id);
    const myBikeBookings = await bookingService.bookingsByBikeId(id, currentUser.id);
    const myBooking = myBikeBookings.find((booking: any) => booking.status === BOOKING_STATUS.PENDING && booking.bikeId === id);
    myBike.myBooking = myBooking ? true : false;
    return {
      ...myBike,
      bookings: myBikeBookings,
    };
  }

  async createBike(payload: any) {
    try {
      const result = await prisma.$transaction(
        async (transaction: any) => {
          let categoryId = payload.categoryId ?? null;
          if (!categoryId && payload.categoryName) {
            const category = await prisma.category.upsert({
              where: { name: payload.categoryName },
              update: {},
              create: { name: payload.categoryName },
            });
            categoryId = category.id;
          }

          const bikeMapper = bikeCreateDto({ ...payload, categoryId });
          const createdBike = await this.repo.createBike(bikeMapper, transaction);

          const addressMapper = bikeAddressCreateDto(payload, createdBike.id);
          await this.repo.createBikeAddress(addressMapper, transaction);

          const imagesMapper = bikeImagesCreateDto(payload, createdBike.id);
          if (imagesMapper.length > 0) {
            await this.repo.createBikeImages(imagesMapper, transaction);
          }

          return createdBike;
        },
        { timeout: 20000 }
      );

      return this.repo.findBikeById(result.id);
    } catch (error) {
      throw error;
    }
  }

  async updateBike(id: number, payload: any, currentUser: any) {
    const bike: any = await this.repo.findBikeById(id);
    if (!bike) throw new Error('not_found');
    const currentRole = currentUser.userRoles && currentUser.userRoles.length ? currentUser.userRoles[0].role : null;
    if (currentUser.id !== bike.ownerId && currentRole && (currentRole.code !== 'ADMIN' && currentRole.name !== 'ADMIN')) throw new Error('forbidden');
    const pricePerHour = payload.pricePerHour != null ? Number(payload.pricePerHour) : null;
    const pricePerDay = payload.pricePerDay != null ? Number(payload.pricePerDay) : null;
    const rentAmount =
      payload.rentAmount != null
        ? Number(payload.rentAmount)
        : pricePerHour != null
        ? pricePerHour
        : bike.rentAmount;

    let categoryId = bike.categoryId;
    if (payload.categoryName) {
      const category = await prisma.category.upsert({
        where: { name: payload.categoryName },
        update: {},
        create: { name: payload.categoryName },
      });
      categoryId = category.id;
    }

    const keepImages = Array.isArray(payload.existingImages)
      ? payload.existingImages
      : bike.bikeImages.map((img: any) => img.imageUrl);
    const newImages = Array.isArray(payload.bikeImages) ? payload.bikeImages : [];
    const imagesToRemove = bike.bikeImages
      .map((img: any) => img.imageUrl)
      .filter((url: string) => !keepImages.includes(url));

    await prisma.$transaction(
      async (transaction: any) => {
        await transaction.bike.update({
          where: { id },
          data: {
            name: payload.name ?? bike.name,
            description: payload.description ?? bike.description,
            rentAmount,
            pricePerHour: pricePerHour != null ? pricePerHour : bike?.pricePerHour,
            pricePerDay: pricePerDay != null ? pricePerDay : bike?.pricePerDay,
            status: payload.status ?? bike.status,
            startTime: payload.startTime ? new Date(payload.startTime) : bike.startTime,
            endTime: payload.endTime ? new Date(payload.endTime) : bike.endTime,
            categoryId,
          },
        });

        if (payload.address) {
          const addressDto = bikeAddressCreateDto(payload, id);
          const { bikeId: _ignored, ...addressUpdate } = addressDto;
          if (bike.bikeAddress && bike.bikeAddress.length > 0) {
            await transaction.bikeAddress.update({
              where: { id: bike.bikeAddress[0].id },
              data: addressUpdate,
            });
          } else {
            await transaction.bikeAddress.create({ data: addressDto });
          }
        }

        if (imagesToRemove.length > 0) {
          await transaction.bikeImages.deleteMany({
            where: { bikeId: id, imageUrl: { in: imagesToRemove } },
          });
        }

        if (newImages.length > 0) {
          const imagesMapper = bikeImagesCreateDto({ bikeImages: newImages }, id);
          if (imagesMapper.length > 0) {
            await transaction.bikeImages.createMany({ data: imagesMapper });
          }
        }
      },
      { timeout: 20000 }
    );

    await Promise.all(imagesToRemove.map((imageUrl: string) => deleteLocalImage(imageUrl)));

    return this.repo.findBikeById(id);
  }

  async deleteBike(id: number, currentUser: any) {
    const bike = await this.repo.findBikeById(id);
    if (!bike) throw new Error('not_found');
    const currentRole2 = currentUser.userRoles && currentUser.userRoles.length ? currentUser.userRoles[0].role : null;
    if (currentUser.id !== bike.ownerId && currentRole2 && (currentRole2.code !== 'ADMIN' && currentRole2.name !== 'ADMIN')) throw new Error('forbidden');
    return this.repo.deleteBike(id);
  }
}

const deleteLocalImage = async (imageUrl: string) => {
  const filename = path.basename(imageUrl || '');
  if (!filename) return;
  const filePath = path.join(MEDIA_ROOT, filename);
  try {
    await fsPromises.unlink(filePath);
  } catch (err: any) {
    if (err?.code !== 'ENOENT') {
      console.error(`Failed to delete image file ${filePath}`, err);
    }
  }
};

