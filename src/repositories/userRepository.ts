import prisma from '../prisma';

export async function findUserByEmail(email: string) {
  // email is stored in UserEmail
  const userList = await prisma.user.findFirst({ where: { emails: { some: { email } } }, include: { userRoles: { include: { role: true } }, UserType: true, emails: true } });
  return userList;
}

export async function findUserByPhone(phone: string) {
  // phone is stored in UserPhone
  const userList = await prisma.user.findFirst({ where: { phones: { some: { phone } } }, include: { userRoles: { include: { role: true } }, UserType: true, phones: true } });
  return userList;
}

export async function createUser(data: any) {
  try {
    const result = await prisma.$transaction(async (transaction: any) => {
      const roleCode = data?.roleCode ?? 'RENTER';
      const role = await transaction.role.findUnique({
        where: { code: roleCode },
      });

      if (!role) {
        throw new Error('role_not_found');
      }

      const user = await transaction.user.create({
        data: {
          firstName: data?.firstName,
          secondName: data?.middleName,
          lastName: data?.lastName,
          password: data?.password,
          age: data?.age,
          isActive: true,
          emails: data?.email
            ? {
                create: {
                  email: data.email,
                  isPrimary: true,
                },
              }
            : undefined,
          phones: data?.phone
            ? {
                create: {
                  phone: data.phone,
                  isPrimary: true,
                },
              }
            : undefined,
          details: {
            create: {
              address1: data?.address1,
              address2: data?.address2,
              city: data?.city,
              state: data?.state,
              country: data?.country,
              postalCode: data?.postalCode,
              placeId: data?.placeId,
            },
          },
          userRoles: {
            create: {
              roleId: role.id,
            },
          },
        },
        include: {
          userRoles: { include: { role: true } },
          emails: true,
        },
      });

      return user;
    }, {
      timeout: 10000,
    });
    return result;
  } catch (error) {
    console.error('Create user error:', error);
    throw error;
  }
}

export async function createUserDetail(userId: number, data: any, transaction: any) {
  return transaction.userDetail.create({ data: { ...data, userId } });
}

export async function createUserEmail(userId: number, data: { email: string; isPrimary: boolean }, transaction: any) {
  return transaction.userEmail.create({ data: { ...data, userId } });
}

export async function createUserPhone(userId: number, data: { phone: string; isPrimary: boolean }, transaction: any) {
  return transaction.userPhone.create({ data: { ...data, userId } });
}

export async function createUserSecurity(userId: number, data: { password: string }, transaction: any) {
  return transaction.userSecurity.create({ data: { ...data, userId } });
}

export async function createUserPaymentMode(data: { type: string, name: string, isVerified: boolean, userId: number }) {
  return prisma.userPaymentMode.create({ data: { ...data, isActive: true } });
}

export async function getUserPaymentModeByCustomerId(customerId: string) {
  return prisma.userPaymentMode.findFirst({ where: { customerId } });
}

export async function updateUserPaymentMode(id: string, data: { isVerified: boolean }) {
  return prisma.userPaymentMode.update({ where: { id }, data: { ...data } });
}

export async function findUserById(id: number) {
  return prisma.user.findUnique({ where: { id }, include: { userRoles: { include: { role: true } }, paymentModes: true, emails: true, phones: true, details: true, bikes: true, bookings: true, ownerBookings: true, reviewsGiven: true, reviewsReceived: true, locations: true, productAssigned: true } });
}
