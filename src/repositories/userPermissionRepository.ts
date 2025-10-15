import prisma from '../prisma';

export function findAllUserPermissions() {
  return prisma.userPermission.findMany({ include: { permission: true, user: true } });
}

export function findUserPermissionById(id: number) {
  return prisma.userPermission.findUnique({ where: { id }, include: { permission: true, user: true } });
}

export function createUserPermission(data: any) {
  return prisma.userPermission.create({ data, include: { permission: true, user: true } });
}

export function updateUserPermission(id: number, data: any) {
  return prisma.userPermission.update({ where: { id }, data, include: { permission: true, user: true } });
}

export function deleteUserPermission(id: number) {
  return prisma.userPermission.delete({ where: { id } });
}
