import { notifications, notifyMockDb } from "@/app/_common/service/mock-db";
import type { NotificationItem } from "@/app/notification/_types/notification.types";

export const notificationService = {
  async list(): Promise<NotificationItem[]> {
    return [...notifications];
  },
  async markRead(id: number) {
    const target = notifications.find((notification) => notification.id === id);
    if (!target || target.isRead) return target;
    target.isRead = true;
    target.readAt = new Date().toISOString();
    notifyMockDb();
    return target;
  },
  async markAllRead(userId: number) {
    notifications
      .filter((notification) => notification.userId === userId && !notification.isRead)
      .forEach((notification) => {
        notification.isRead = true;
        notification.readAt = new Date().toISOString();
      });
    notifyMockDb();
  },
};
