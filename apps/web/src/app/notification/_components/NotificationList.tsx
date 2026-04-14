import { Link } from "react-router-dom";
import type { NotificationItem } from "@/app/notification/_types/notification.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  onRead,
}: {
  notifications: NotificationItem[];
  onRead: (id: number) => Promise<void>;
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
        <Card key={notification.id}>
          <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant={notification.isRead ? "outline" : "default"}>{notificationTypeLabelMap[notification.type]}</Badge>
                {!notification.isRead ? <Badge variant="secondary">읽지 않음</Badge> : null}
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
            <div className="flex flex-row gap-2 lg:flex-col lg:items-end">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={async () => {
                  await onRead(notification.id);
                }}
              >
                {notification.isRead ? "읽음 유지" : "읽음 처리"}
              </Button>
              <Link to={notification.deepLink} className="text-sm font-medium text-primary">
                관련 화면 이동
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
