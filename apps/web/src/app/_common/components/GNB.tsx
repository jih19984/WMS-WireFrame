import {
  Bell,
  CheckCheck,
  ChevronRight,
  Moon,
  Settings2,
  Sun,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/app/_common/hooks/useAuth";
import { resolveBreadcrumbs } from "@/app/_common/service/breadcrumbs";
import {
  dashboardViewChangedEvent,
  defaultDashboardScopeValue,
  getAvailableDashboardViewModes,
  getDefaultDashboardScopeForMode,
  getDashboardScopeOptions,
  getDashboardViewModeDescription,
  getDashboardViewModeLabel,
  getDashboardVisibleTeamIds,
  normalizeDashboardViewPreference,
  readStoredDashboardViewPreference,
  type DashboardViewPreference,
  type DashboardScopeValue,
  type DashboardViewMode,
  writeStoredDashboardViewPreference,
} from "@/app/_common/service/dashboard-view-preference";
import { useDepartment } from "@/app/department/_hooks/useDepartment";
import { useNotification } from "@/app/notification/_hooks/useNotification";
import { resolveNotificationDeepLink } from "@/app/notification/_utils/resolveNotificationDeepLink";
import { useTeam } from "@/app/team/_hooks/useTeam";
import { useWorklog } from "@/app/worklog/_hooks/useWorklog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select } from "@/components/ui/select";
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
  const { teams } = useTeam();
  const { departments } = useDepartment();
  const { worklogs } = useWorklog();
  const { notifications, markRead } = useNotification();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showScopeSettings, setShowScopeSettings] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [dashboardPreference, setDashboardPreference] = useState(
    () => readStoredDashboardViewPreference(),
  );
  const [draftViewMode, setDraftViewMode] = useState<DashboardViewMode>(
    () => dashboardPreference.mode,
  );
  const [draftScope, setDraftScope] = useState<DashboardScopeValue>(
    () => dashboardPreference.scope,
  );
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

  useEffect(() => {
    const handleDashboardViewChange = (event: Event) => {
      setDashboardPreference(
        (event as CustomEvent<DashboardViewPreference>).detail,
      );
    };

    window.addEventListener(dashboardViewChangedEvent, handleDashboardViewChange);
    return () =>
      window.removeEventListener(
        dashboardViewChangedEvent,
        handleDashboardViewChange,
      );
  }, []);

  const toggleTheme = () => {
    const root = window.document.documentElement;
    const nextDark = !root.classList.contains("dark");
    root.classList.toggle("dark", nextDark);
    window.localStorage.setItem("ax-wms-theme", nextDark ? "dark" : "light");
    setIsDark(nextDark);
  };

  const breadcrumbs = resolveBreadcrumbs(location.pathname);
  const normalizedDashboardPreference = user
    ? normalizeDashboardViewPreference(
        dashboardPreference,
        user,
        teams,
        departments,
      )
    : null;
  const availableDashboardModes = user
    ? getAvailableDashboardViewModes(user, teams)
    : [];
  const activeScopeOptions =
    user && normalizedDashboardPreference
      ? getDashboardScopeOptions(
          normalizedDashboardPreference.mode,
          user,
          teams,
          departments,
        )
      : [];
  const activeScopeLabel =
    activeScopeOptions.find(
      (option) => option.value === normalizedDashboardPreference?.scope,
    )?.label ?? "내 업무";
  const scopeButtonLabel = normalizedDashboardPreference
    ? normalizedDashboardPreference.mode === "PERSONAL"
      ? activeScopeLabel
      : `${getDashboardViewModeLabel(normalizedDashboardPreference.mode)} · ${activeScopeLabel}`
    : "대시보드 기준";
  const visibleDashboardTeamIds =
    user && normalizedDashboardPreference
      ? getDashboardVisibleTeamIds(normalizedDashboardPreference, user, teams)
      : [];
  const draftScopeOptions = user
    ? getDashboardScopeOptions(draftViewMode, user, teams, departments)
    : [];
  const normalizedDraftScope = draftScopeOptions.some(
    (option) => option.value === draftScope,
  )
    ? draftScope
    : user
      ? getDefaultDashboardScopeForMode(draftViewMode, user, teams)
      : defaultDashboardScopeValue;
  const showScopeSelector =
    draftScopeOptions.length > 1 ||
    (draftViewMode === "PERSONAL" && draftScopeOptions.length > 0);
  const scopedNotifications = notifications.filter((notification) => {
    if (!normalizedDashboardPreference) return true;
    if (!notification.referenceId) return true;

    const referenceWorklog = worklogs.find(
      (worklog) => worklog.id === notification.referenceId,
    );
    if (!referenceWorklog) return true;
    if (normalizedDashboardPreference.mode === "PERSONAL") return true;

    return visibleDashboardTeamIds.includes(referenceWorklog.teamId);
  });
  const scopedUnreadCount = scopedNotifications.filter(
    (notification) => !notification.isRead,
  ).length;
  const recentScopedNotifications = scopedNotifications.slice(0, 3);

  useEffect(() => {
    if (!user) return;

    const normalizedPreference = normalizeDashboardViewPreference(
      dashboardPreference,
      user,
      teams,
      departments,
    );

    if (
      normalizedPreference.mode === dashboardPreference.mode &&
      normalizedPreference.scope === dashboardPreference.scope
    ) {
      return;
    }

    setDashboardPreference(normalizedPreference);
    writeStoredDashboardViewPreference(normalizedPreference);
  }, [
    dashboardPreference,
    departments,
    teams,
    user,
  ]);

  useEffect(() => {
    if (!showScopeSettings || !normalizedDashboardPreference) return;

    setDraftViewMode(normalizedDashboardPreference.mode);
    setDraftScope(normalizedDashboardPreference.scope);
  }, [
    normalizedDashboardPreference?.mode,
    normalizedDashboardPreference?.scope,
    showScopeSettings,
  ]);

  const saveScopeSettings = () => {
    if (!user) return;

    const nextPreference = normalizeDashboardViewPreference(
      {
        mode: draftViewMode,
        scope: normalizedDraftScope,
      },
      user,
      teams,
      departments,
    );

    setDashboardPreference(nextPreference);
    writeStoredDashboardViewPreference(nextPreference);
    setShowScopeSettings(false);
  };

  return (
    <header className="workspace-topbar sticky top-0 z-50 flex w-full items-center gap-4 border-b border-slate-200/80 px-4 py-4 text-slate-900 shadow-[0_16px_48px_-36px_rgba(15,23,42,0.18)] dark:border-white/10 dark:text-white dark:shadow-[0_16px_60px_-32px_rgba(0,0,0,0.55)] md:px-8">
      <div className="min-w-0 flex-1">
        <div className="inline-flex items-center rounded border border-slate-200/80 bg-slate-100/70 px-2 py-0.5 text-[8px] font-medium uppercase tracking-[0.13em] text-slate-500 dark:border-white/10 dark:bg-black/10 dark:text-white/65">
          IBANK AX 사업본부
        </div>
        <nav
          aria-label="breadcrumb"
          className="mt-2 flex flex-wrap items-center gap-1.5 text-[1.05rem] font-semibold tracking-[-0.04em] text-slate-900 dark:text-white"
        >
          {breadcrumbs.map((item, index) => {
            const isCurrent = index === breadcrumbs.length - 1;

            return (
              <div key={`${location.pathname}-${index}`} className="flex items-center gap-1.5">
                {index > 0 ? (
                  <ChevronRight className="size-4 text-slate-400 dark:text-white/42" />
                ) : null}
                {item.href && !isCurrent ? (
                  <Link
                    to={item.href}
                    className="text-slate-500 transition-colors hover:text-slate-900 dark:text-white/52 dark:hover:text-white"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className={
                      isCurrent
                        ? "text-slate-900 dark:text-white"
                        : "text-slate-500 dark:text-white/52"
                    }
                  >
                    {item.label}
                  </span>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="h-10 w-10 border-slate-200/80 bg-slate-100/80 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900 dark:border-white/12 dark:bg-black/10 dark:text-white/75 dark:hover:bg-black/18 dark:hover:text-white"
          title="테마 전환"
        >
          {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>

        {user && availableDashboardModes.length > 0 ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowScopeSettings(true)}
            className="inline-flex h-10 border-slate-200/80 bg-slate-100/80 px-3 text-slate-700 hover:bg-slate-200/70 hover:text-slate-900 dark:border-white/12 dark:bg-black/10 dark:text-white/82 dark:hover:bg-black/18 dark:hover:text-white"
            title={scopeButtonLabel}
          >
            <Settings2 className="size-4" />
            <span className="hidden max-w-[180px] truncate xl:inline">
              대시보드 기준
            </span>
          </Button>
        ) : null}

        {user ? (
          <div className="relative" ref={notificationRef}>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowNotifications((prev) => !prev)}
              className="group h-10 border-slate-200/80 bg-slate-100/80 px-3 text-slate-700 hover:bg-slate-200/70 hover:text-slate-900 dark:border-white/12 dark:bg-black/10 dark:text-white/80 dark:hover:bg-black/18"
            >
              <div className="relative flex items-center justify-center text-slate-600 transition-colors group-hover:text-slate-900 dark:text-white/72 dark:group-hover:text-white">
                <Bell className="size-4" />
                {scopedUnreadCount > 0 ? (
                  <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-primary" />
                ) : null}
              </div>
              <div className="hidden text-left md:block">
                <p className="text-[13px] font-medium tracking-tight text-slate-700 dark:text-white/88">
                  {scopedUnreadCount > 0 ? `${scopedUnreadCount} 알림` : "알림 센터"}
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
                      {scopeButtonLabel} 기준 · 미읽음 {scopedUnreadCount}건
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 text-white/62 hover:bg-white/10 hover:text-white"
                    aria-label="현재 기준 알림 읽음 처리"
                    disabled={scopedUnreadCount === 0}
                    onClick={async () => {
                      await Promise.all(
                        scopedNotifications
                          .filter((notification) => !notification.isRead)
                          .map((notification) => markRead(notification.id)),
                      );
                    }}
                  >
                    <CheckCheck className="size-4" />
                  </Button>
                </div>

                <div className="divide-y divide-white/12">
                  {recentScopedNotifications.length > 0 ? (
                    recentScopedNotifications.map((notification) => (
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
                      현재 기준에 맞는 알림이 없습니다.
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

      <Dialog open={showScopeSettings} onOpenChange={setShowScopeSettings}>
        <DialogContent className="w-[min(92vw,560px)] border-white/14 bg-[#071227] text-white shadow-[0_28px_90px_-30px_rgba(0,0,0,0.9)]">
          <DialogHeader>
            <DialogTitle className="text-white">대시보드 보기 기준</DialogTitle>
            <DialogDescription className="text-white/62">
              권한과 팀 역할에 따라 관리자, 팀 운영자, 내 업무 관점을 전환합니다.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/50">
                View
              </p>
              {availableDashboardModes.map((mode) => (
                <button
                  key={mode}
                  type="button"
                  className={cn(
                    "w-full rounded-2xl border px-4 py-4 text-left transition-colors",
                    draftViewMode === mode
                      ? "border-primary/70 bg-primary/18"
                      : "border-white/12 bg-white/5 hover:bg-white/8",
                  )}
                  onClick={() => {
                    setDraftViewMode(mode);
                    setDraftScope(
                      user
                        ? getDefaultDashboardScopeForMode(mode, user, teams)
                        : defaultDashboardScopeValue,
                    );
                  }}
                >
                  <span className="block text-sm font-semibold text-white">
                    {getDashboardViewModeLabel(mode)}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-white/58">
                    {getDashboardViewModeDescription(mode)}
                  </span>
                </button>
              ))}
            </div>

            {showScopeSelector ? (
              <div className="rounded-2xl border border-white/12 bg-black/10 p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/50">
                  Scope
                </p>
                <Select
                  className="h-11 rounded-xl border-white/12 bg-black/10 px-3 text-sm font-medium text-white/85 shadow-none focus-visible:border-white/18 focus-visible:ring-white/15"
                  value={normalizedDraftScope}
                  options={draftScopeOptions}
                  disabled={draftScopeOptions.length === 1}
                  onChange={(event) =>
                    setDraftScope(event.target.value as DashboardScopeValue)
                  }
                  aria-label="대시보드 상세 범위"
                />
              </div>
            ) : null}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="border-white/12 bg-white/6 text-white hover:bg-white/10"
              onClick={() => setShowScopeSettings(false)}
            >
              취소
            </Button>
            <Button type="button" onClick={saveScopeSettings}>
              저장
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}
