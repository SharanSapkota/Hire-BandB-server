import prisma from '../prisma';

export async function findUserByEmail(email: string) {
  // email is stored in UserEmail
  return prisma.user.findFirst({ where: { emails: { some: { email } } }, include: { userRoles: { include: { role: true } }, UserType: true, emails: true } });
}

export async function createUser(data: { firstName?: string; lastName?: string; password: string; typeId?: number; email?: string; roleId?: bigint | number }) {
  const { email, roleId, ...rest } = data as any;
  const user = await prisma.user.create({ data: { ...rest, emails: email ? { create: { email, isPrimary: true } } : undefined } });
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

export async function findUserById(id: number) {
  return prisma.user.findUnique({ where: { id }, include: { userRoles: { include: { role: true } }, UserType: true, emails: true } });
}
