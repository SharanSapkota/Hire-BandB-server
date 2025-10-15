import prisma from '../prisma';

export function findAllRoles() {
  return prisma.role.findMany();
}

export function findRoleById(id: bigint | number) {
  return prisma.role.findUnique({ where: { id: BigInt(Number(id)) } });
}

export function createRole(data: any) {
  return prisma.role.create({ data });
}

export function updateRole(id: bigint | number, data: any) {
  return prisma.role.update({ where: { id: BigInt(Number(id)) }, data });
}

export function deleteRole(id: bigint | number) {
  return prisma.role.delete({ where: { id: BigInt(Number(id)) } });
}
