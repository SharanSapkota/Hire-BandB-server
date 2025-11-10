import * as notifRepo from '../repositories/notificationRepository';
import { emitToUser } from '../lib/socket';
import { OWNER_NOTIFICATION_EVENT } from '../socket/socket.constant';

export async function listNotifications(userId: number) {
  return await notifRepo.findNotificationsForUser(userId);
}

export async function listNotificationCount(userId: number) {
  return notifRepo.findNotificationCount(userId);
}

export async function getNotification(id: number) {
  return notifRepo.findNotificationById(id);
}

export async function createNotification(payload: any) {
  const notification = await notifRepo.createNotification(payload);
  if (payload?.userId) {
    emitToUser(payload.userId, OWNER_NOTIFICATION_EVENT, notification);
  }
  return notification;
}

export async function markNotificationRead(id: number) {
  return notifRepo.markAsRead(id);
}
