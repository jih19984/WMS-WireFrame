import { Link } from "react-router-dom";
import type { NotificationItem } from "@/app/notification/_types/notification.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { formatDateTime } from "@/lib/utils";

const notificationTypeLabelMap: Record<NotificationItem["type"], string> = {
  URGENT: "긴급",
  DEADLINE: "마감",
  OVERDUE: "지연",
  DEPENDENCY: "의존성",
  WORKLOAD: "업무량",
};

export function NotificationList({
  notifications,
}: {
  notifications: NotificationItem[];
}) {
  if (notifications.length === 0) {
    return (
      <div className="workspace-empty rounded-2xl px-6 py-12 text-center text-sm">
        표시할 알림이 없습니다.
      </div>
    );
  }

  return (
    <div className="workspace-list">
      {notifications.map((notification) => (
        <CardSpotlight
          key={notification.id}
          className="rounded-[24px] transition-transform duration-300 hover:-translate-y-1"
        >
          <CardContent className="flex flex-col gap-4 p-5">
            <div className="min-w-0 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <Badge variant={notification.isRead ? "outline" : "default"}>
                  {notificationTypeLabelMap[notification.type]}
                </Badge>
                <Badge variant={notification.isRead ? "outline" : "secondary"}>
                  {notification.isRead ? "읽음" : "미읽음"}
                </Badge>
              </div>
              <p className="text-[18px] font-semibold tracking-[-0.03em] text-foreground">
                {notification.title}
              </p>
              <p className="text-sm leading-7 text-muted-foreground">{notification.content}</p>
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span>{notification.sourceScope}</span>
                <span>•</span>
                <span>{formatDateTime(notification.createdAt)}</span>
                {notification.readAt ? (
                  <>
                    <span>•</span>
                    <span>읽음 {formatDateTime(notification.readAt)}</span>
                  </>
                ) : null}
              </div>
            </div>
            <div className="flex justify-end">
              <Link
                to={notification.deepLink}
                className="inline-flex h-10 items-center rounded-2xl border border-border/70 px-4 text-sm font-medium text-primary transition-colors hover:bg-muted/40"
              >
                관련 화면 이동
              </Link>
            </div>
          </CardContent>
        </CardSpotlight>
      ))}
    </div>
  );
}
