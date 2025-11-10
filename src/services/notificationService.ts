import * as notifRepo from '../repositories/notificationRepository';
import { emitToUser } from '../lib/socket';

export async function listNotifications(userId: number) {
  return notifRepo.findNotificationsForUser(userId);
}

export async function getNotification(id: number) {
  return notifRepo.findNotificationById(id);
}

export async function createNotification(payload: any) {
  const notification = await notifRepo.createNotification(payload);
  if (payload?.userId) {
    emitToUser(payload.userId, 'booking:created', notification);
  }
  return notification;
}

export async function markNotificationRead(id: number) {
  return notifRepo.markAsRead(id);
}
