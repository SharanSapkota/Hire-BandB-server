import prisma from '../prisma';

export function findNotificationsForUser(userId: number) {
  return prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
}

export function findNotificationById(id: number) {
  return prisma.notification.findUnique({ where: { id } });
}

export function createNotification(data: any) {
  return prisma.notification.create({ data });
}

export function markAsRead(id: number) {
  return prisma.notification.update({ where: { id }, data: { read: true } });
}
