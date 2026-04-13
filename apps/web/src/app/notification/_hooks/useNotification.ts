import { useEffect, useState } from "react";
import { getVisibleNotifications } from "@/app/_common/service/access-control";
import { useAuth } from "@/app/_common/hooks/useAuth";
import { subscribeMockDb } from "@/app/_common/service/mock-db";
import { notificationService } from "@/app/notification/_service/notification.service";
import type { NotificationItem } from "@/app/notification/_types/notification.types";

export function useNotification() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    const sync = async () => {
      const items = await notificationService.list();
      setNotifications(getVisibleNotifications(user, items));
    };

    void sync();
    return subscribeMockDb(() => {
      void sync();
    });
  }, [user]);

  const unreadCount = notifications.filter((notification) => !notification.isRead).length;

  return {
    notifications,
    unreadCount,
    recentNotifications: notifications.slice(0, 3),
    markRead: async (id: number) => {
      await notificationService.markRead(id);
    },
    markAllRead: async () => {
      if (!user) return;
      await notificationService.markAllRead(user.id);
    },
  };
}
