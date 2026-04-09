import { notifications } from "@/app/_common/service/mock-db";
import type { NotificationItem } from "@/app/notification/_types/notification.types";

export const notificationService = {
  async list(): Promise<NotificationItem[]> {
    return [...notifications];
  },
};
