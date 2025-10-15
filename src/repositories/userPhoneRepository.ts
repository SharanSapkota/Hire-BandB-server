import prisma from '../prisma';

export function findPhonesByUser(userId: number) {
  return prisma.userPhone.findMany({ where: { userId } });
}

export function createPhone(data: any) {
  return prisma.userPhone.create({ data });
}

export function updatePhone(id: bigint | number, data: any) {
  return prisma.userPhone.update({ where: { id: BigInt(Number(id)) }, data });
}

export function deletePhone(id: bigint | number) {
  return prisma.userPhone.delete({ where: { id: BigInt(Number(id)) } });
}
