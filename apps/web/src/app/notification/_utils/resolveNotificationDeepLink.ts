import type { NotificationItem } from "@/app/notification/_types/notification.types";

export function resolveNotificationDeepLink(notification: NotificationItem) {
  if (
    notification.referenceId &&
    (notification.deepLink === "/" || notification.deepLink === "/worklog")
  ) {
    return `/worklog/detail/${notification.referenceId}`;
  }

  return notification.deepLink;
}
