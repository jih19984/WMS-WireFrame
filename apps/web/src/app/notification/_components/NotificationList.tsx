import { Link } from "react-router-dom";
import type { NotificationItem } from "@/app/notification/_types/notification.types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function NotificationList({ notifications }: { notifications: NotificationItem[] }) {
  return (
    <div className="space-y-3">
      {notifications.map((notification) => (
        <Card key={notification.id}>
          <CardContent className="flex items-start justify-between gap-4 p-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant={notification.isRead ? "outline" : "default"}>{notification.type}</Badge>
                {!notification.isRead ? <Badge variant="secondary">Unread</Badge> : null}
              </div>
              <p className="font-medium">{notification.title}</p>
              <p className="text-sm text-muted-foreground">{notification.content}</p>
            </div>
            {notification.referenceId ? (
              <Link to={`/worklog/detail/${notification.referenceId}`} className="text-sm font-medium text-primary">
                이동
              </Link>
            ) : (
              <span className="text-xs text-muted-foreground">{notification.createdAt}</span>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
