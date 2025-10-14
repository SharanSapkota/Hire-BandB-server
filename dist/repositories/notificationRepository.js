"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findNotificationsForUser = findNotificationsForUser;
exports.findNotificationById = findNotificationById;
exports.createNotification = createNotification;
exports.markAsRead = markAsRead;
const prisma_1 = __importDefault(require("../prisma"));
function findNotificationsForUser(userId) {
    return prisma_1.default.notification.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
}
function findNotificationById(id) {
    return prisma_1.default.notification.findUnique({ where: { id } });
}
function createNotification(data) {
    return prisma_1.default.notification.create({ data });
}
function markAsRead(id) {
    return prisma_1.default.notification.update({ where: { id }, data: { read: true } });
}
