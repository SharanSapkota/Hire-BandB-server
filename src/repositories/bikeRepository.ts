import prisma from '../prisma';

export class BikeRepository {
  constructor(private db = prisma) {}

  async findAllBikes(query: any) {
    // return this.db.bike.findMany({ include: {bikeImages: true, bikeAddress: true, category: true, owner: { select: { id: true, firstName: true, lastName: true, emails: { where: { isPrimary: true }, select: { email: true } } } } } });
    return this.db.bike.findMany(query);

  }

  async findBikeById(id: any, query: any = null) {
      if (query) {
        query = query.build();
      } else {
        query = {
          where: { id },
          include: {
            bikeImages: true,
            bikeAddress: true,
            category: true,
            owner: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                emails: {
                  where: { isPrimary: true },
                  select: { email: true },
                },
              },
            },
          },
        };
      }
    
      return await this.db.bike.findUnique(query);
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



// {
//   id: 21,
//   name: 'E-scooter',
//   description: '',
//   rentAmount: 5,
//   pricePerHour: 5,
//   pricePerDay: 5,
//   autoAccept: false,
//   status: 'AVAILABLE',
//   startTime: null,
//   endTime: null,
//   categoryId: 1,
//   ownerId: 14,
//   createdAt: 2025-11-13T08:52:30.336Z,
//   updatedAt: 2025-11-13T08:52:30.336Z,
//   bikeImages: [
//     {
//       id: 12,
//       bikeId: 21,
//       imageUrl: '/media/Gemini_Generated_Image_e8pudne8pudne8pu-1763023948169-65303092.png'
//     }
//   ],
//   bikeAddress: [
//     {
//       id: 16,
//       bikeId: 21,
//       latitude: 65.05664240194115,
//       longitude: 25.45755386352539,
//       address: 'Kaitoväylä 1, 90590 Oulu, Finland',
//       street: '1 Kaitoväylä',
//       city: 'Oulu',
//       state: 'Pohjois-Pohjanmaa',
//       country: 'Finland',
//       postalCode: '90590',
//       placeId: null
//     }
//   ],
//   category: { id: 1, name: 'City' },
//   owner: {
//     id: 14,
//     firstName: 'Ram',
//     lastName: 'Sapkota',
//     emails: [ [Object] ]
//   }
// }