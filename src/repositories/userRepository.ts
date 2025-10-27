import prisma from '../prisma';

export async function findUserByEmail(email: string) {
  // email is stored in UserEmail
  const userList = await prisma.user.findFirst({ where: { emails: { some: { email } } }, include: { userRoles: { include: { role: true } }, UserType: true, emails: true } });
  return userList;
}

export async function createUser(data: any) {
  try {
  const { email, role, ...rest } = data as any;
  const result = await prisma.$transaction(async (transaction: any) => {

  const user = await transaction.user.create({ 
    data: {
      firstName: data?.firstName,
      lastName: data?.lastName,
      password: data?.password,
      age: data?.age,
      isActive: true,
      emails: {
        create: {
          email: data?.email,
          isPrimary: true
        }
      },
      phones: {
        create: {
          phone: data?.phone,
          isPrimary: true
        }
      },
      details: {
        create: {
          address1: data?.address1,
          address2: data?.address2,
          city: data?.city,
          state: data?.state,
          country: data?.country,
          postalCode: data?.postalCode,
          placeId: data?.placeId
        }
      },
      userRoles: {
        create: {
          roleId: role == 'OWNER' ? 1 : 2,
          // userId: user?.id
        }
      }
    } 
  });
 

  return user;
},{
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

export async function findUserById(id: number) {
  return prisma.user.findUnique({ where: { id }, include: { userRoles: { include: { role: true } }, UserType: true, emails: true } });
}
