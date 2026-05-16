import {
  Bell,
  Building2,
  ChevronDown,
  Files,
  FolderOpen,
  LayoutDashboard,
  LogOut,
  PanelLeftClose,
  Tags,
} from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/app/_common/hooks/useAuth";
import type { AuthUser } from "@/app/_common/store/auth.store";
import {
  getUiState,
  subscribeUi,
  toggleSidebarCollapsed,
} from "@/app/_common/store/ui.store";
import { cn, getRoleLabel } from "@/lib/utils";

type NavSubItem = {
  label: string;
  href: string;
  exact?: boolean;
  roles?: AuthUser["role"][];
};

type NavItem = {
  label: string;
  icon: typeof LayoutDashboard;
  href?: string;
  exact?: boolean;
  submenus?: NavSubItem[];
};

const navItems: NavItem[] = [
  {
    label: "대시보드",
    href: "/",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: "업무일지",
    icon: Files,
    submenus: [
      { label: "업무일지 조회", href: "/worklog", exact: true },
      { label: "업무일지 등록", href: "/worklog/create" },
    ],
  },
  {
    label: "파일",
    href: "/file",
    icon: FolderOpen,
  },
  {
    label: "조직",
    icon: Building2,
    submenus: [
      { label: "부서 관리", href: "/department", exact: true, roles: ["DIRECTOR", "DEPT_HEAD"] },
      { label: "팀 관리", href: "/team", exact: true, roles: ["TEAM_LEAD", "MEMBER", "DIRECTOR", "DEPT_HEAD"] },
      { label: "사용자 관리", href: "/user", exact: true, roles: ["DIRECTOR", "DEPT_HEAD"] },
    ],
  },
  {
    label: "태그",
    href: "/tag",
    icon: Tags,
  },
  {
    label: "알림",
    href: "/notification",
    icon: Bell,
  },
];

export function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    () => getUiState().sidebarCollapsed,
  );

  useEffect(
    () =>
      subscribeUi(() => {
        setSidebarCollapsed(getUiState().sidebarCollapsed);
      }),
    [],
  );

  const visibleNavItems = navItems
    .map((item) => {
      if (!item.submenus) return item;
      const submenus = item.submenus.filter((sub) => {
        const submenuRoles = "roles" in sub ? sub.roles : undefined;
        if (!submenuRoles) return true;
        return user ? submenuRoles.includes(user.role) : false;
      });
      return { ...item, submenus };
    })
    .filter((item) => (item.submenus ? item.submenus.length > 0 : true));

  const activeGroupLabel =
    visibleNavItems.find((item) =>
      item.submenus?.some(
        (sub) =>
          location.pathname === sub.href ||
          location.pathname.startsWith(`${sub.href}/`),
      ),
    )?.label ?? null;
  const displayName = user?.name ?? "사용자";
  const displayTitle = user ? getRoleLabel(user.role) : "프로필";
  const profileInitial = displayName.slice(0, 1);

  return (
    <aside
      className={cn(
        "workspace-sidebar sticky top-0 z-20 hidden h-screen shrink-0 flex-col overflow-hidden border-r border-slate-200/80 text-slate-900 transition-[width,min-width,max-width,flex-basis] duration-300 ease-out dark:border-white/10 dark:text-white md:flex",
        sidebarCollapsed
          ? "w-[4.75rem] min-w-[4.75rem] max-w-[4.75rem] basis-[4.75rem]"
          : "w-[17.5rem] min-w-[17.5rem] max-w-[17.5rem] basis-[17.5rem]",
      )}
    >
      <div className="flex w-[17.5rem] flex-1 flex-col overflow-y-auto px-2 py-5">
        <div
          className={cn(
            "mb-5 grid h-10 shrink-0 items-center transition-all duration-300 ease-out",
            sidebarCollapsed
              ? "w-[3.75rem] grid-cols-[3.75rem]"
              : "w-full grid-cols-[3.75rem_minmax(0,1fr)_2.25rem]",
          )}
        >
          {sidebarCollapsed ? (
            <button
              type="button"
              onClick={toggleSidebarCollapsed}
              className="flex h-10 w-[3.75rem] shrink-0 items-center justify-center"
              aria-label="사이드바 펼치기"
              aria-expanded={false}
              title="사이드바 펼치기"
            >
              <span className="flex size-9 items-center justify-center text-[16px] font-black tracking-[0.02em] text-slate-900 transition-colors hover:text-primary dark:text-white dark:hover:text-white/80">
                IB
              </span>
            </button>
          ) : (
            <NavLink
              to="/"
              className="flex h-10 w-[3.75rem] items-center justify-center"
              title="IBANK"
              aria-label="IBANK"
            >
              <span className="flex size-9 items-center justify-center text-[16px] font-black tracking-[0.02em] text-slate-900 transition-colors hover:text-primary dark:text-white dark:hover:text-white/80">
                IB
              </span>
            </NavLink>
          )}

          {!sidebarCollapsed ? (
            <button
              type="button"
              onClick={toggleSidebarCollapsed}
              className="col-start-3 flex size-9 shrink-0 items-center justify-center justify-self-end rounded-xl text-slate-500 transition-colors hover:bg-slate-200/70 hover:text-slate-900 dark:text-white/62 dark:hover:bg-white/8 dark:hover:text-white"
              aria-label="사이드바 접기"
              aria-expanded
              title="사이드바 접기"
            >
              <PanelLeftClose className="size-5" />
            </button>
          ) : null}
        </div>

        <div
          className={cn(
            "flex flex-col gap-2",
            sidebarCollapsed ? "w-[3.75rem]" : "w-full",
          )}
        >
          {visibleNavItems.map((item) =>
            item.submenus ? (
              <CollapsibleSidebarItem
                key={item.label}
                item={item}
                isOpen={activeGroupLabel === item.label}
                isCollapsed={sidebarCollapsed}
                currentPath={location.pathname}
                onToggle={() => {
                  if ((sidebarCollapsed || activeGroupLabel !== item.label) && item.submenus?.[0]) {
                    navigate(item.submenus[0].href);
                  }
                }}
              />
            ) : (
              <NavLink
                key={item.href}
                to={item.href!}
                end={item.exact}
                title={sidebarCollapsed ? item.label : undefined}
                aria-label={sidebarCollapsed ? item.label : undefined}
                className={({ isActive }) =>
                  cn(
                    "group relative grid h-12 items-center overflow-hidden rounded-xl transition-[background-color,color] duration-200",
                    sidebarCollapsed
                      ? "w-[3.75rem] grid-cols-[3.75rem]"
                      : "w-full grid-cols-[3.75rem_minmax(0,1fr)] text-left",
                    isActive
                      ? "bg-primary/10 text-primary dark:bg-white/10 dark:text-white"
                      : "text-slate-700 hover:bg-slate-200/70 hover:text-slate-950 dark:text-white dark:hover:bg-white/8 dark:hover:text-white",
                  )
                }
              >
                <div className="flex w-[3.75rem] justify-center">
                  <div className="flex size-8 items-center justify-center text-current transition-colors">
                    <item.icon className="size-4" />
                  </div>
                </div>
                {!sidebarCollapsed ? (
                  <div className="min-w-0 overflow-hidden text-left">
                    <p className="truncate text-[14px] font-semibold tracking-[-0.02em]">
                      {item.label}
                    </p>
                  </div>
                ) : null}
              </NavLink>
            ),
          )}
        </div>

        <div className="mt-auto">
          <div className="relative grid w-full grid-cols-[3.75rem_minmax(0,1fr)] items-center">
            <NavLink
              to="/my-page"
              className={cn(
                "col-span-2 grid h-14 w-full min-w-0 grid-cols-[3.75rem_minmax(0,1fr)] items-center rounded-xl text-slate-700 transition-colors hover:bg-slate-200/70 hover:text-slate-950 dark:text-white dark:hover:bg-white/8 dark:hover:text-white",
                sidebarCollapsed ? "pointer-events-auto" : "pr-12",
              )}
              title={sidebarCollapsed ? displayName : undefined}
              aria-label={sidebarCollapsed ? displayName : undefined}
            >
              <div className="flex w-[3.75rem] justify-center">
                <div
                  className="flex size-10 items-center justify-center overflow-hidden rounded-full bg-primary/10 bg-cover bg-center text-sm font-bold text-primary dark:bg-white/10 dark:text-white"
                  style={
                    user?.profileImage
                      ? { backgroundImage: `url(${user.profileImage})` }
                      : undefined
                  }
                >
                  {user?.profileImage ? null : profileInitial}
                </div>
              </div>

              {!sidebarCollapsed ? (
                <div className="min-w-0 overflow-hidden">
                  <p className="truncate text-[14px] font-bold leading-tight text-slate-900 dark:text-white">
                    {displayName}
                  </p>
                  <p className="mt-1 truncate text-[12px] font-semibold text-slate-500 dark:text-white/55">
                    {displayTitle}
                  </p>
                </div>
              ) : null}
            </NavLink>

            {!sidebarCollapsed && user ? (
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="absolute right-0 top-1/2 flex size-10 -translate-y-1/2 shrink-0 items-center justify-center rounded-xl text-rose-600 transition-colors hover:bg-rose-50/90 hover:text-rose-700 dark:text-rose-300/80 dark:hover:bg-white/8 dark:hover:text-rose-200"
                aria-label="로그아웃"
                title="로그아웃"
              >
                <LogOut className="size-5" />
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </aside>
  );
}

function CollapsibleSidebarItem({
  item,
  isOpen,
  isCollapsed,
  currentPath,
  onToggle,
}: {
  item: NavItem;
  isOpen: boolean;
  isCollapsed: boolean;
  currentPath: string;
  onToggle: () => void;
}) {
  const matchingSubmenus =
    item.submenus?.filter(
      (sub) =>
        currentPath === sub.href || currentPath.startsWith(`${sub.href}/`),
    ) ?? [];
  const isActiveGroup = matchingSubmenus.length > 0;
  const strongestMatchLength = matchingSubmenus.reduce(
    (max, sub) => Math.max(max, sub.href.length),
    0,
  );

  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={onToggle}
        title={isCollapsed ? item.label : undefined}
        aria-label={isCollapsed ? item.label : undefined}
        className={cn(
          "group relative grid h-12 items-center overflow-hidden rounded-xl transition-[background-color,color] duration-200",
          isCollapsed
            ? "w-[3.75rem] grid-cols-[3.75rem]"
            : "w-full grid-cols-[3.75rem_minmax(0,1fr)_2.25rem] text-left",
          isActiveGroup
            ? "bg-primary/10 text-primary dark:bg-white/10 dark:text-white"
            : isOpen
              ? "bg-primary/5 text-slate-900 dark:bg-white/8 dark:text-white"
              : "text-slate-700 hover:bg-slate-200/70 hover:text-slate-950 dark:text-white dark:hover:bg-white/8 dark:hover:text-white",
        )}
      >
        <div className="flex w-[3.75rem] justify-center">
          <div className="flex size-8 items-center justify-center text-current transition-colors">
            <item.icon className="size-4" />
          </div>
        </div>
        {!isCollapsed ? (
          <div className="min-w-0 overflow-hidden text-left">
            <p className="truncate text-[14px] font-semibold tracking-[-0.02em]">
              {item.label}
            </p>
          </div>
        ) : null}
        {!isCollapsed ? (
          <ChevronDown
            className={cn(
              "size-4 justify-self-center text-current opacity-70 transition-transform duration-300 ease-out",
              isOpen && "rotate-180",
            )}
          />
        ) : null}
      </button>

      {!isCollapsed ? (
        <div
          className={cn(
            "grid overflow-hidden transition-[grid-template-rows,opacity,margin] duration-300 ease-out",
            isOpen
              ? "mt-2 grid-rows-[1fr] opacity-100"
              : "mt-0 grid-rows-[0fr] opacity-0",
          )}
        >
          <div className="overflow-hidden">
            <div className="flex flex-col gap-1 px-3 pb-1 pl-[3.25rem] pt-0.5">
              {item.submenus?.map((sub) => {
                const nestedChild = getNestedCreateSubmenu(sub.href, currentPath);
                const isNestedChildActive = nestedChild
                  ? currentPath === nestedChild.href ||
                    currentPath.startsWith(`${nestedChild.href}/`)
                  : false;
                const isSubActive =
                  !isNestedChildActive &&
                  (currentPath === sub.href ||
                    currentPath.startsWith(`${sub.href}/`)) &&
                  sub.href.length === strongestMatchLength;

                return (
                  <div key={sub.href} className="flex flex-col gap-1">
                    <NavLink
                      to={sub.href}
                      className={cn(
                        "relative flex items-center rounded-md px-3 py-2 text-[13px] font-medium transition-all before:absolute before:-left-3 before:top-1/2 before:h-1 before:w-1 before:-translate-y-1/2 before:rounded-full",
                        isSubActive
                          ? "bg-primary/10 text-primary before:bg-primary dark:bg-white/10 dark:text-white dark:before:bg-white"
                          : "text-slate-600 hover:bg-slate-200/70 hover:text-slate-900 before:bg-transparent dark:text-white dark:hover:bg-white/8 dark:hover:text-white",
                      )}
                    >
                      {sub.label}
                    </NavLink>

                    {nestedChild ? (
                      <NavLink
                        to={nestedChild.href}
                        className={cn(
                          "relative ml-4 flex items-center rounded-md px-3 py-2 text-[12px] font-medium transition-all before:absolute before:-left-3 before:top-1/2 before:h-1 before:w-1 before:-translate-y-1/2 before:rounded-full",
                          isNestedChildActive
                            ? "bg-primary/10 text-primary before:bg-primary dark:bg-white/10 dark:text-white dark:before:bg-white"
                            : "text-slate-600 hover:bg-slate-200/70 hover:text-slate-900 before:bg-transparent dark:text-white dark:hover:bg-white/8 dark:hover:text-white",
                        )}
                      >
                        {nestedChild.label}
                      </NavLink>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function getNestedCreateSubmenu(href: string, currentPath: string) {
  if (href === "/department" && currentPath.startsWith("/department/create")) {
    return { label: "부서 등록", href: "/department/create" };
  }

  if (href === "/team" && currentPath.startsWith("/team/create")) {
    return { label: "팀 등록", href: "/team/create" };
  }

  if (href === "/user" && currentPath.startsWith("/user/create")) {
    return { label: "사용자 등록", href: "/user/create" };
  }

  return null;
}
