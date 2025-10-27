import prisma from '../prisma';

export class BikeRepository {
  constructor(private db = prisma) {}

  async findAllBikes(query: any) {
    // return this.db.bike.findMany({ include: {bikeImages: true, bikeAddress: true, category: true, owner: { select: { id: true, firstName: true, lastName: true, emails: { where: { isPrimary: true }, select: { email: true } } } } } });
    return this.db.bike.findMany(query);

  }

  async findBikeById(id: number) {
    return this.db.bike.findUnique({ where: { id }, include: {bikeImages: true, bikeAddress: true, category: true, owner: { select: { id: true, firstName: true, lastName: true, emails: { where: { isPrimary: true }, select: { email: true } } } } } });
  }

  async createBike(data: any, transaction: any) {
    return transaction.bike.create({ data });
  }

  createBikeImages(data: any, transaction: any) {
    return transaction.bikeImages.createMany({ data });
  }

  createBikeAddress(data: any, transaction: any) {
    return transaction.bikeAddress.create({ data });
  }

  async updateBike(id: number, data: any) {
    return this.db.bike.update({ where: { id }, data });
  }

  async deleteBike(id: number) {
    return this.db.bike.delete({ where: { id } });
  }
}

