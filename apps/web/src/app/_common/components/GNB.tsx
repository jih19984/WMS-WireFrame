import { Bell, ChevronRight, Moon, Plus, Search, Sun, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/app/_common/hooks/useAuth";
import { resolveBreadcrumbs } from "@/app/_common/service/breadcrumbs";
import {
  canManageDepartments,
  canManageTeams,
  canManageUsers,
} from "@/app/_common/service/access-control";
import { useNotification } from "@/app/notification/_hooks/useNotification";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatDateTime } from "@/lib/utils";

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

  const breadcrumbs = resolveBreadcrumbs(location.pathname);

  const managementAction =
    location.pathname === "/department" && canManageDepartments(user)
      ? { label: "부서 등록", href: "/department/create" }
      : location.pathname === "/team" && canManageTeams(user)
        ? { label: "팀 등록", href: "/team/create" }
        : location.pathname === "/user" && canManageUsers(user)
          ? { label: "사용자 등록", href: "/user/create" }
          : null;

  return (
    <header className="dark workspace-topbar sticky top-0 z-50 flex w-full items-center gap-4 border-b border-white/10 px-5 py-4 shadow-[0_16px_60px_-32px_rgba(0,0,0,0.55)] lg:px-8">
      <div className="min-w-0 flex-1">
        <div className="inline-flex items-center rounded-md border border-white/10 bg-black/10 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white/65">
          ibank AX 사업본부
        </div>
        <nav
          aria-label="breadcrumb"
          className="mt-2 flex flex-wrap items-center gap-1.5 text-[1.05rem] font-semibold tracking-[-0.04em] text-white"
        >
          {breadcrumbs.map((item, index) => {
            const isCurrent = index === breadcrumbs.length - 1;

            return (
              <div key={`${location.pathname}-${index}`} className="flex items-center gap-1.5">
                {index > 0 ? <ChevronRight className="size-4 text-white/42" /> : null}
                {item.href && !isCurrent ? (
                  <Link
                    to={item.href}
                    className="text-white/68 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className={isCurrent ? "text-white" : "text-white/68"}>
                    {item.label}
                  </span>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      <button
        type="button"
        onClick={() => navigate("/worklog")}
        className="hidden h-10 min-w-[16rem] items-center gap-3 rounded-lg border border-white/12 bg-black/10 px-4 text-left text-sm text-white/70 shadow-sm transition-all hover:bg-black/18 hover:text-white xl:flex"
      >
        <Search className="size-4 shrink-0" />
        <span className="truncate">업무 검색으로 이동</span>
        <span className="ml-auto rounded-md border border-white/10 bg-black/18 px-2 py-1 text-[11px] text-white/45">
          /
        </span>
      </button>

      <div className="flex items-center gap-2">
        {managementAction ? (
          <Button
            variant="outline"
            className="hidden h-10 border-white/12 bg-black/10 text-white hover:bg-black/18 lg:inline-flex"
            onClick={() => navigate(managementAction.href)}
          >
            <Plus className="size-4" />
            {managementAction.label}
          </Button>
        ) : null}

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="border-white/12 bg-black/10 text-white/75 hover:bg-black/18 hover:text-white"
          title="테마 전환"
        >
          {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>

        {user ? (
          <div className="relative" ref={notificationRef}>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowNotifications((prev) => !prev)}
              className="group h-10 border-white/12 bg-black/10 px-3 text-white/80 hover:bg-black/18"
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
            </Button>

            {showNotifications ? (
              <div className="absolute right-0 top-[calc(100%+12px)] z-50 w-[360px] rounded-2xl border border-border/80 bg-popover p-3 text-popover-foreground shadow-2xl">
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
                        className="workspace-panel-soft group rounded-xl p-4 text-left transition-all hover:border-border hover:bg-accent/50"
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
                              "group-hover:border-border group-hover:bg-accent/50 group-hover:text-foreground",
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

                <div className="flex items-center gap-2 border-t border-border/70 px-2 pt-3">
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
                    className="flex-1 justify-center"
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
