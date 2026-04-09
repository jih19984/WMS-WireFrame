import { useEffect, useState } from "react";
import { notificationService } from "@/app/notification/_service/notification.service";
import type { NotificationItem } from "@/app/notification/_types/notification.types";

export function useNotification() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    notificationService.list().then(setNotifications);
  }, []);

  return { notifications };
}
