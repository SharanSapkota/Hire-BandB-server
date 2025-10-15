import prisma from '../prisma';

export function listIdentificationServices() {
  return prisma.identificationService.findMany();
}

export function createIdentificationService(data: any) {
  return prisma.identificationService.create({ data });
}

export function createUserIdentity(data: any) {
  return prisma.userIdentity.create({ data });
}

export function listUserIdentities(userId: number) {
  return prisma.userIdentity.findMany({ where: { userId } });
}
