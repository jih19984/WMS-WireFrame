import { Bell, ChevronRight, Moon, Plus, Search, Sun, UserPlus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/app/_common/hooks/useAuth";
import {
  canManageDepartments,
  canManageTeams,
  canManageUsers,
} from "@/app/_common/service/access-control";
import { useNotification } from "@/app/notification/_hooks/useNotification";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatDateTime } from "@/lib/utils";

const pageTitleMap: Record<string, string> = {
  "/": "대시보드",
  "/department": "부서 관리",
  "/department/create": "부서 등록",
  "/team": "팀 관리",
  "/team/create": "팀 등록",
  "/user": "사용자 관리",
  "/user/create": "사용자 등록",
  "/worklog": "업무일지 및 파일",
  "/search": "시맨틱 검색",
  "/notification": "알림",
  "/tag": "태그",
  "/profile": "프로필 설정",
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
  const { recentNotifications, unreadCount, markAllRead, markRead } = useNotification();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isDark, setIsDark] = useState(true);
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
    const nextDark = !root.classList.contains("dark");
    root.classList.toggle("dark", nextDark);
    window.localStorage.setItem("ax-wms-theme", nextDark ? "dark" : "light");
    setIsDark(nextDark);
  };

  const pageTitle =
    pageTitleMap[location.pathname] ??
    Object.entries(pageTitleMap).find(([path]) =>
      location.pathname.startsWith(path) && path !== "/",
    )?.[1] ??
    "AX-WMS";

  const managementAction =
    location.pathname === "/department" && canManageDepartments(user)
      ? { label: "부서 등록", href: "/department/create" }
      : location.pathname === "/team" && canManageTeams(user)
        ? { label: "팀 등록", href: "/team/create" }
        : location.pathname === "/user" && canManageUsers(user)
          ? { label: "사용자 등록", href: "/user/create" }
          : null;

  return (
    <header className="workspace-topbar sticky top-0 z-50 flex w-full items-center gap-4 border-b border-white/8 px-5 py-4 shadow-[0_16px_60px_-32px_rgba(0,0,0,0.9)] backdrop-blur-xl lg:px-8">
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/42">
          ibank AX 사업본부
        </p>
        <div className="mt-1 flex items-center gap-2">
          <h2 className="truncate text-[1.15rem] font-bold tracking-[-0.04em] text-white">
            {pageTitle}
          </h2>
        </div>
      </div>

      <button
        type="button"
        onClick={() => navigate("/search")}
        className="hidden h-10 min-w-[16rem] items-center gap-3 rounded-lg border border-white/10 bg-white/7 px-4 text-left text-sm text-white/64 transition-all hover:border-white/16 hover:bg-white/10 hover:text-white xl:flex"
      >
        <Search className="size-4 shrink-0" />
        <span className="truncate">업무 파일을 검색하세요</span>
        <span className="ml-auto rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-[11px] text-white/40">
          /
        </span>
      </button>

      <div className="flex items-center gap-2">
        {managementAction ? (
          <Button
            variant="outline"
            className="hidden h-10 border-white/10 bg-white/6 text-white hover:bg-white/12 lg:inline-flex"
            onClick={() => navigate(managementAction.href)}
          >
            <Plus className="size-4" />
            {managementAction.label}
          </Button>
        ) : null}

        <button
          type="button"
          onClick={toggleTheme}
          className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/72 transition-all hover:border-white/16 hover:bg-white/10 hover:text-white"
          title="테마 전환"
        >
          {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </button>

        {user ? (
          <div className="relative" ref={notificationRef}>
            <button
              type="button"
              onClick={() => setShowNotifications((prev) => !prev)}
              className="group flex h-10 items-center gap-2.5 rounded-lg border border-white/10 bg-white/5 px-3 transition-all hover:border-white/16 hover:bg-white/10"
            >
              <div className="relative flex items-center justify-center text-white/72 transition-colors group-hover:text-white">
                <Bell className="size-4" />
                {unreadCount > 0 ? (
                  <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-primary" />
                ) : null}
              </div>
              <div className="hidden text-left md:block">
                <p className="text-[13px] font-medium tracking-tight text-white/88">
                  {unreadCount > 0 ? `${unreadCount} 알림` : "알림 센터"}
                </p>
              </div>
            </button>

            {showNotifications ? (
              <div className="absolute right-0 top-[calc(100%+12px)] z-50 w-[360px] rounded-xl border border-white/10 bg-[linear-gradient(180deg,#372640_0%,#2d2736_100%)] p-3 shadow-[var(--shadow-panel-strong)]">
                <div className="flex items-center justify-between gap-3 px-3 py-2">
                  <div>
                    <p className="text-sm font-semibold tracking-[-0.03em] text-foreground">
                      최근 알림
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      중요한 업무 흐름만 빠르게 확인할 수 있습니다.
                    </p>
                  </div>
                  <Badge variant={unreadCount > 0 ? "warning" : "outline"}>
                    {unreadCount} unread
                  </Badge>
                </div>

                <div className="workspace-list px-1 py-2">
                  {recentNotifications.length > 0 ? (
                    recentNotifications.map((notification) => (
                      <button
                        key={notification.id}
                        type="button"
                        className="workspace-panel-soft group rounded-lg p-4 text-left transition-all hover:border-white/12 hover:bg-white/6"
                        onClick={async () => {
                          await markRead(notification.id);
                          setShowNotifications(false);
                          navigate(notification.deepLink);
                        }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  notification.isRead
                                    ? "outline"
                                    : notification.type === "URGENT"
                                      ? "destructive"
                                      : notification.type === "DEADLINE"
                                        ? "warning"
                                        : "default"
                                }
                              >
                                {notificationTypeLabelMap[notification.type]}
                              </Badge>
                              {!notification.isRead ? (
                                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
                                  new
                                </span>
                              ) : null}
                            </div>
                            <div>
                              <p className="text-sm font-semibold tracking-[-0.02em] text-foreground">
                                {notification.title}
                              </p>
                              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                {notification.content}
                              </p>
                            </div>
                            <p className="text-[11px] text-muted-foreground">
                              {formatDateTime(notification.createdAt)}
                            </p>
                          </div>

                          <span
                            className={cn(
                              "flex size-8 shrink-0 items-center justify-center rounded-xl border border-transparent text-muted-foreground transition-all",
                              "group-hover:border-white/10 group-hover:bg-white/5 group-hover:text-foreground",
                            )}
                          >
                            <ChevronRight className="size-4" />
                          </span>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="workspace-empty rounded-lg px-5 py-10 text-center text-sm">
                      새로운 알림이 없습니다.
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 border-t border-white/8 px-2 pt-3">
                  <Button
                    variant="ghost"
                    className="flex-1 justify-center"
                    onClick={async () => {
                      await markAllRead();
                    }}
                  >
                    <X className="size-4" />
                    전체 읽음 처리
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 justify-center border-white/10 bg-white/5 text-white hover:bg-white/10"
                    onClick={() => {
                      setShowNotifications(false);
                      navigate("/notification");
                    }}
                  >
                    전체 보기
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </header>
  );
}
