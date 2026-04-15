import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PageHeader } from "@/app/_common/components/PageHeader";
import { Pagination } from "@/app/_common/components/Pagination";
import { usePagination } from "@/app/_common/hooks/usePagination";
import { useNotification } from "@/app/notification/_hooks/useNotification";
import { NotificationList } from "@/app/notification/_components/NotificationList";
import { Button } from "@/components/ui/button";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const notificationTypeLabelMap = {
  URGENT: "긴급",
  DEADLINE: "마감",
  OVERDUE: "지연",
  DEPENDENCY: "의존성",
  WORKLOAD: "업무량",
} as const;

const sourceScopeLabelMap = {
  PERSONAL: "개인",
  TEAM: "팀",
  DEPARTMENT: "부서",
} as const;

type NotificationView = "TOTAL" | "UNREAD" | "READ";

export default function NotificationPage() {
  const { notifications, unreadCount, markAllRead } = useNotification();
  const [query, setQuery] = useState("");
  const [activeView, setActiveView] = useState<NotificationView>("TOTAL");

  const filteredNotifications = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return notifications.filter((notification) => {
      const readMatch =
        activeView === "TOTAL" ||
        (activeView === "UNREAD" && !notification.isRead) ||
        (activeView === "READ" && notification.isRead);
      const searchableText = [
        notification.title,
        notification.content,
        notificationTypeLabelMap[notification.type],
        sourceScopeLabelMap[notification.sourceScope],
      ]
        .join(" ")
        .toLowerCase();
      const queryMatch = !normalizedQuery || searchableText.includes(normalizedQuery);

      return readMatch && queryMatch;
    });
  }, [activeView, notifications, query]);

  const notificationPagination = usePagination(filteredNotifications, 4);
  const readCount = notifications.length - unreadCount;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="알림" />
      <div className="space-y-6">
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <h2 className="text-[20px] font-semibold tracking-[-0.04em] text-foreground">알림 현황</h2>
            <Button type="button" variant="outline" onClick={markAllRead} disabled={unreadCount === 0}>
              전체 읽음 처리
            </Button>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <button
              type="button"
              onClick={() => {
                setActiveView("TOTAL");
                notificationPagination.setPage(1);
              }}
              className="text-left"
            >
              <CardSpotlight
                className={cn(
                  "rounded-[24px] p-5 transition-all duration-200",
                  activeView === "TOTAL" && "ring-2 ring-primary/70"
                )}
              >
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Total</p>
                <p className="mt-2 text-2xl font-semibold">{notifications.length}</p>
              </CardSpotlight>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveView("UNREAD");
                notificationPagination.setPage(1);
              }}
              className="text-left"
            >
              <CardSpotlight
                className={cn(
                  "rounded-[24px] p-5 transition-all duration-200",
                  activeView === "UNREAD" && "ring-2 ring-primary/70",
                )}
              >
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Unread</p>
                <p className="mt-2 text-2xl font-semibold">{unreadCount}</p>
              </CardSpotlight>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveView("READ");
                notificationPagination.setPage(1);
              }}
              className="text-left"
            >
              <CardSpotlight
                className={cn(
                  "rounded-[24px] p-5 transition-all duration-200",
                  activeView === "READ" && "ring-2 ring-primary/70",
                )}
              >
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Read</p>
                <p className="mt-2 text-2xl font-semibold">{readCount}</p>
              </CardSpotlight>
            </button>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-[20px] font-semibold tracking-[-0.04em] text-foreground">알림 탐색</h2>
            <p className="text-sm text-muted-foreground">
              표시 중인 알림 <span className="text-lg font-semibold text-foreground">{filteredNotifications.length}건</span>
            </p>
          </div>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                notificationPagination.setPage(1);
              }}
              className="h-12 pl-11"
              placeholder="알림 제목, 내용, 유형으로 검색하세요"
            />
          </div>
          <NotificationList notifications={notificationPagination.items} />
          <Pagination
            page={notificationPagination.page}
            totalPages={notificationPagination.totalPages}
            onPageChange={notificationPagination.setPage}
          />
        </section>
      </div>
    </div>
  );
}
