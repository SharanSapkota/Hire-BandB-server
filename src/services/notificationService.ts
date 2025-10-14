import * as notifRepo from '../repositories/notificationRepository';

export async function listNotifications(userId: number) {
  return notifRepo.findNotificationsForUser(userId);
}

export async function getNotification(id: number) {
  return notifRepo.findNotificationById(id);
}

export async function createNotification(payload: any) {
  return notifRepo.createNotification(payload);
}

export async function markNotificationRead(id: number) {
  return notifRepo.markAsRead(id);
}
