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
        description="긴급 업무, 마감, 의존성, 부하 알림을 사용자 기준으로 모아봅니다."
        actions={
          <Button type="button" variant="outline" onClick={markAllRead}>
            전체 읽음 처리
          </Button>
        }
      />
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[20px] font-semibold tracking-[-0.04em]">전체 알림 내역</h2>
          <p className="text-sm text-muted-foreground">미확인 {unreadCount}건</p>
        </div>
        <Card className="rounded-xl shadow-sm">
          <CardContent className="grid gap-3 p-5 md:grid-cols-3">
            <div className="rounded-xl bg-muted/20 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Unread</p>
              <p className="mt-2 text-2xl font-semibold">{unreadCount}</p>
            </div>
            <div className="rounded-xl bg-muted/20 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Read</p>
              <p className="mt-2 text-2xl font-semibold">{notifications.length - unreadCount}</p>
            </div>
            <div className="rounded-xl bg-muted/20 p-4">
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
