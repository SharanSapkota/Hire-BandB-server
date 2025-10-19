import prisma from '../prisma';

export class BikeRepository {
  constructor(private db = prisma) {}

  async findAllBikes() {
    return this.db.bike.findMany({ include: { category: true, owner: { select: { id: true, firstName: true, lastName: true, emails: { where: { isPrimary: true }, select: { email: true } } } } } });
  }

  async findBikeById(id: number) {
    return this.db.bike.findUnique({ where: { id }, include: { category: true, owner: { select: { id: true, firstName: true, lastName: true, emails: { where: { isPrimary: true }, select: { email: true } } } } } });
  }

  async createBike(data: any) {
    return this.db.bike.create({ data });
  }

  async updateBike(id: number, data: any) {
    return this.db.bike.update({ where: { id }, data });
  }

  async deleteBike(id: number) {
    return this.db.bike.delete({ where: { id } });
  }
}

