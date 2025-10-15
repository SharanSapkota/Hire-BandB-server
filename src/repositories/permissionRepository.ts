import prisma from '../prisma';

export function findAllPermissions() {
  return prisma.permission.findMany();
}

export function findPermissionById(id: number) {
  return prisma.permission.findUnique({ where: { id } });
}

export function createPermission(data: any) {
  return prisma.permission.create({ data });
}

export function updatePermission(id: number, data: any) {
  return prisma.permission.update({ where: { id }, data });
}

export function deletePermission(id: number) {
  return prisma.permission.delete({ where: { id } });
}
