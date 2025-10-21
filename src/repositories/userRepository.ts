import prisma from '../prisma';

export async function findUserByEmail(email: string) {
  // email is stored in UserEmail
  const userList = await prisma.user.findFirst({ where: { emails: { some: { email } } }, include: { userRoles: { include: { role: true } }, UserType: true, emails: true } });
  return userList;
}

export async function createUser(data: any) {
  const { email, roleId, typeId, ...rest } = data as any;
  const user = await prisma.user.create({ 
    data: { 
      ...rest, 
      userTypeId: typeId,
      emails: email ? { create: { email, isPrimary: true } } : undefined 
    } 
  });

  await createUserDetail(user.id, { address1: data.address1, address2: data.address2, city: data.city, state: data.state, country: data.country });
  await createUserEmail(user.id, { email: email as string, isPrimary: true });
  await createUserPhone(user.id, { number: data.phone, isPrimary: true });
  await createUserSecurity(user.id, { password: data.password });
  // await createUserIdentity(user.id, { identity: data.identity });
  if (roleId) {
    // create mapping in UserRole
    try {
      await prisma.userRole.create({ data: { userId: user.id, roleId: BigInt(roleId as any) } });
    } catch (e) {
      // swallow mapping error to not break user creation if role mapping fails
      console.warn('Failed to create user role mapping', e);
    }
  }
  return user;
}

export async function createUserDetail(userId: number, data: { address1?: string; address2?: string; city?: string; state?: string; country?: number }) {
  return prisma.userDetail.create({ data: { ...data, userId } });
}

export async function createUserEmail(userId: number, data: { email: string; isPrimary: boolean }) {
  return prisma.userEmail.create({ data: { ...data, userId } });
}

export async function createUserPhone(userId: number, data: { number: string; isPrimary: boolean }) {
  return prisma.userPhone.create({ data: { ...data, userId } });
}

export async function createUserSecurity(userId: number, data: { password: string }) {
  return prisma.userSecurity.create({ data: { ...data, userId } });
}

export async function findUserById(id: number) {
  return prisma.user.findUnique({ where: { id }, include: { userRoles: { include: { role: true } }, UserType: true, emails: true } });
}
