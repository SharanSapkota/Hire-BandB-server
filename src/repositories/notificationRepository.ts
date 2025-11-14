import prisma from '../prisma';

export function findNotificationsForUser(userId: number) {
  return prisma.notification.findMany({ where: { userId }, orderBy: 
    { createdAt: 'desc' }, include: { booking: 
      { include: 
        {
          bike: {
            include: 
          { bikeAddress: true }
        }, owner: true, user: true, paymentTransaction: true }} } });
}

export function findNotificationCount(userId: number) {
  return prisma.notification.count({ where: { userId, read: false } });
}

export function findNotificationById(id: number) {
  return prisma.notification.findUnique({ where: { id } });
}

export function updateNotification(bookingId: number, data: any) {
  return prisma.notification.updateMany({ where: { bookingId }, data });
}
export function createNotification(data: any) {
  return prisma.notification.create({ data });
}

export function markAsRead(id: number) {
  return prisma.notification.update({ where: { id }, data: { read: true } });
}
