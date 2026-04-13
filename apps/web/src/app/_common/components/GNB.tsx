import { Bell, ChevronRight, Moon, Sun, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/app/_common/hooks/useAuth";
import { useNotification } from "@/app/notification/_hooks/useNotification";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils";

const pageTitleMap: Record<string, string> = {
  "/": "대시보드",
  "/department": "조직 관리",
  "/team": "팀 관리",
  "/user": "사용자 관리",
  "/worklog": "업무일지",
  "/search": "시맨틱 검색",
  "/file": "파일 관리",
  "/notification": "알림",
  "/tag": "태그 관리",
};

const notificationTypeLabelMap = {
  URGENT: "긴급",
  DEADLINE: "마감",
  OVERDUE: "지연",
  DEPENDENCY: "의존성",
  WORKLOAD: "업무량",
} as const;


export function GNB() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { recentNotifications, unreadCount, markAllRead, markRead } =
    useNotification();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const root = window.document.documentElement;
    root.classList.toggle("dark");
    setIsDark(root.classList.contains("dark"));
  };

  const pageTitle =
    pageTitleMap[location.pathname] ??
    Object.entries(pageTitleMap).find(([path]) =>
      location.pathname.startsWith(path) && path !== "/",
    )?.[1] ??
    "AX-WMS";

  return (
    <header className="sticky top-0 z-50 flex w-full items-center justify-between border-b border-border/60 bg-background/70 px-8 py-4 backdrop-blur-md">
      <div className="space-y-1">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          AX-WMS Wireframe
        </p>
        <h2 className="text-[1.15rem] font-semibold tracking-[-0.03em] text-foreground">
          {pageTitle}
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="flex size-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
          title="다크 모드 전환"
        >
          {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </button>

        {user ? (
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="group flex items-center gap-2.5 rounded-full border border-transparent px-3 py-1.5 transition-colors hover:bg-muted/50"
            >
              {unreadCount > 0 ? (
                <span className="text-[13px] font-[600] text-destructive transition-colors">
                  {unreadCount}개의 새 알림
                </span>
              ) : (
                <span className="text-[13px] font-[500] text-muted-foreground">
                  새 알림 없음
                </span>
              )}
              <div className="relative flex size-8 items-center justify-center rounded-full bg-background shadow-sm border group-hover:border-destructive transition-all">
                <Bell className="size-4 text-muted-foreground group-hover:text-destructive transition-colors" />
                {unreadCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex size-2.5 rounded-full bg-destructive shadow-sm" />
                )}
              </div>
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-[120%] w-[320px] rounded-lg border bg-popover text-popover-foreground p-2 shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="mb-2 px-3 pt-2">
                  <p className="text-[14px] font-[600] tracking-[-0.02em]">최근 알림</p>
                </div>
                <div className="flex flex-col gap-1">
                  {recentNotifications.length > 0 ? (
                    recentNotifications.map((noti) => (
                      <div
                        key={noti.id}
                        className="group relative flex flex-col gap-1.5 rounded-md p-3 transition-colors hover:bg-muted cursor-pointer"
                        onClick={async () => {
                          await markRead(noti.id);
                          setShowNotifications(false);
                          navigate(noti.deepLink);
                        }}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <p className="text-[13.5px] font-[600] tracking-[-0.02em] line-clamp-1">
                            {noti.title}
                          </p>
                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              await markRead(noti.id);
                            }}
                            className="shrink-0 -mt-0.5 -mr-0.5 p-1 rounded-full text-muted-foreground hover:bg-muted-foreground/10 hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <X className="size-3.5" />
                          </button>
                        </div>
                        <p className="text-[13px] text-muted-foreground line-clamp-1 leading-relaxed pr-4">
                          {noti.content}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="py-6 text-center text-[13px] text-muted-foreground">
                      새로운 알림이 없습니다.
                    </div>
                  )}
                </div>
                <div className="mt-2 border-t pt-2 pb-1">
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      navigate("/notification");
                    }}
                    className="flex w-full items-center justify-center gap-1.5 rounded-[10px] py-2 text-[13px] font-[600] tracking-[-0.02em] text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
                  >
                    모든 알림 더보기 <ChevronRight className="size-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </header>
  );
}
