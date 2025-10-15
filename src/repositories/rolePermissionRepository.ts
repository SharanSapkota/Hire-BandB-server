import prisma from '../prisma';

export function findAllRolePermissions() {
  return prisma.rolePermission.findMany({ include: { permission: true, role: true } });
}

export function findRolePermissionById(id: number) {
  return prisma.rolePermission.findUnique({ where: { id }, include: { permission: true, role: true } });
}

export function createRolePermission(data: any) {
  return prisma.rolePermission.create({ data, include: { permission: true, role: true } });
}

export function updateRolePermission(id: number, data: any) {
  return prisma.rolePermission.update({ where: { id }, data, include: { permission: true, role: true } });
}

export function deleteRolePermission(id: number) {
  return prisma.rolePermission.delete({ where: { id } });
}
