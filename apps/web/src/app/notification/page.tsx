import { PageHeader } from "@/app/_common/components/PageHeader";
import { useNotification } from "@/app/notification/_hooks/useNotification";
import { NotificationList } from "@/app/notification/_components/NotificationList";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotificationPage() {
  const { notifications, unreadCount, markAllRead, markRead } = useNotification();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="알림"
        actions={
          <Button type="button" variant="outline" onClick={markAllRead}>
            전체 읽음 처리
          </Button>
        }
      />
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[20px] font-semibold tracking-[-0.04em] text-foreground">전체 알림 내역</h2>
          <p className="text-sm text-muted-foreground">미확인 {unreadCount}건</p>
        </div>
        <Card>
          <CardContent className="grid gap-3 p-5 md:grid-cols-3">
            <div className="rounded-xl border border-border/70 bg-muted/35 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Unread</p>
              <p className="mt-2 text-2xl font-semibold">{unreadCount}</p>
            </div>
            <div className="rounded-xl border border-border/70 bg-muted/35 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Read</p>
              <p className="mt-2 text-2xl font-semibold">{notifications.length - unreadCount}</p>
            </div>
            <div className="rounded-xl border border-border/70 bg-muted/35 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Total</p>
              <p className="mt-2 text-2xl font-semibold">{notifications.length}</p>
            </div>
          </CardContent>
        </Card>
        <NotificationList notifications={notifications} onRead={markRead} />
      </div>
    </div>
  );
}
