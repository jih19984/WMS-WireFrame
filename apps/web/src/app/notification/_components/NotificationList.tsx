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
  return (
    <div className="space-y-3">
      {notifications.map((notification) => (
        <Card key={notification.id}>
          <CardContent className="flex items-start justify-between gap-4 p-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant={notification.isRead ? "outline" : "default"}>{notificationTypeLabelMap[notification.type]}</Badge>
                {!notification.isRead ? <Badge variant="secondary">읽지 않음</Badge> : null}
              </div>
              <p className="font-medium">{notification.title}</p>
              <p className="text-sm text-muted-foreground">{notification.content}</p>
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
            <div className="flex flex-col items-end gap-2">
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
