import { Bell, CheckCheck, ChevronRight, Moon, Plus, Sun } from "lucide-react";
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
import { resolveNotificationDeepLink } from "@/app/notification/_utils/resolveNotificationDeepLink";
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
    <header className="workspace-topbar sticky top-0 z-50 flex w-full items-center gap-4 border-b border-white/10 px-5 py-4 shadow-[0_16px_60px_-32px_rgba(0,0,0,0.55)] lg:px-8">
      <div className="min-w-0 flex-1">
        <div className="inline-flex items-center rounded border border-white/10 bg-black/10 px-2 py-0.5 text-[8px] font-medium uppercase tracking-[0.13em] text-white/65">
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
              <div className="absolute right-0 top-[calc(100%+12px)] z-50 w-[380px] overflow-hidden rounded-2xl border border-white/14 bg-[#071227] text-white shadow-[0_24px_80px_-28px_rgba(0,0,0,0.85)]">
                <div className="flex items-center justify-between gap-3 border-b border-white/12 px-4 py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold tracking-[-0.03em] text-white">
                      알림 센터
                    </p>
                    <p className="mt-0.5 text-xs text-white/55">
                      미읽음 {unreadCount}건
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 text-white/62 hover:bg-white/10 hover:text-white"
                    aria-label="전체 읽음 처리"
                    disabled={unreadCount === 0}
                    onClick={async () => {
                      await markAllRead();
                    }}
                  >
                    <CheckCheck className="size-4" />
                  </Button>
                </div>

                <div className="divide-y divide-white/12">
                  {recentNotifications.length > 0 ? (
                    recentNotifications.map((notification) => (
                      <button
                        key={notification.id}
                        type="button"
                        className="group flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-white/8"
                        onClick={async () => {
                          await markRead(notification.id);
                          setShowNotifications(false);
                          navigate(resolveNotificationDeepLink(notification));
                        }}
                      >
                        <div className="min-w-0 flex-1 space-y-2">
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
                              className="border-white/12"
                            >
                              {notificationTypeLabelMap[notification.type]}
                            </Badge>
                            <Badge
                              variant={notification.isRead ? "outline" : "secondary"}
                              className="border-white/12"
                            >
                              {notification.isRead ? "읽음" : "미읽음"}
                            </Badge>
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold tracking-[-0.02em] text-white">
                              {notification.title}
                            </p>
                            <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/62">
                              {notification.content}
                            </p>
                          </div>
                          <p className="text-[11px] text-white/45">
                            {formatDateTime(notification.createdAt)}
                          </p>
                        </div>
                        <span className="mt-6 flex size-8 shrink-0 items-center justify-center rounded-xl text-white/35 transition-all group-hover:bg-white/10 group-hover:text-white">
                          <ChevronRight className="size-4" />
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="px-5 py-10 text-center text-sm text-white/60">
                      새로운 알림이 없습니다.
                    </div>
                  )}
                </div>

                <div className="border-t border-white/12 p-3">
                  <Button
                    variant="outline"
                    className="h-10 w-full justify-center border-white/12 bg-white/6 text-white hover:bg-white/10"
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
