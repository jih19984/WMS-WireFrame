import {
  Bell,
  Building2,
  ChevronDown,
  Files,
  FolderOpen,
  LayoutDashboard,
  LogOut,
  Tags,
} from "lucide-react";
import { Suspense, lazy, useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { cn, getRoleLabel } from "@/lib/utils";
import { useAuth } from "@/app/_common/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import pikachuBadge from "@/assets/lanyard/pikachu.jpeg";

const SidebarLanyard = lazy(async () => {
  const module = await import("@/components/lanyard/SidebarLanyard");
  return { default: module.SidebarLanyard };
});

const navItems = [
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
      { label: "업무 검색", href: "/worklog", exact: true },
      { label: "업무 등록", href: "/worklog/create" },
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
      { label: "부서 관리", href: "/department", roles: ["DIRECTOR", "DEPT_HEAD"] },
      { label: "팀 관리", href: "/team", roles: ["TEAM_LEAD", "MEMBER", "DIRECTOR", "DEPT_HEAD"] },
      { label: "사용자 관리", href: "/user", roles: ["DIRECTOR", "DEPT_HEAD"] },
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
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  // Filter items based on roles
  const filteredNavItems = navItems.map(item => {
    if (item.submenus) {
      const filteredSubmenus = item.submenus.filter(sub => {
        const submenuRoles = "roles" in sub ? sub.roles : undefined;
        if (!submenuRoles) return true;
        if (!user) return false;
        return submenuRoles.includes(user.role);
      });
      return { ...item, submenus: filteredSubmenus };
    }
    return item;
  }).filter(item => item.submenus ? item.submenus.length > 0 : true);

  useEffect(() => {
    const activeGroup = filteredNavItems.find(item => 
      item.submenus?.some((sub: any) => location.pathname === sub.href || location.pathname.startsWith(sub.href + "/"))
    );
    if (activeGroup) {
      setOpenGroup(activeGroup.label);
    } else {
      setOpenGroup(null);
    }
  }, [location.pathname]);

  return (
    <aside className="workspace-sidebar relative z-20 flex h-full w-[17.5rem] shrink-0 flex-col overflow-hidden border-r border-white/10 text-white">
      <div className="flex flex-1 flex-col overflow-y-auto px-3 py-6">
        <div className="flex flex-col gap-2">
          {filteredNavItems.map((item) => (
            item.submenus ? (
              <CollapsibleSidebarItem 
                key={item.label} 
                item={item} 
                isOpen={openGroup === item.label} 
                currentPath={location.pathname}
                onToggle={() => {
                  const firstSubmenu = item.submenus[0];
                  setOpenGroup(item.label);
                  if (firstSubmenu) {
                    navigate(firstSubmenu.href);
                  }
                }}
              />
            ) : (
              <NavLink
                key={item.href}
                to={item.href!}
                end={item.exact}
                onClick={() => setOpenGroup(null)}
                className={({ isActive }) =>
                  cn(
                    "group relative flex items-center gap-3 rounded-xl px-3 py-3 transition-all",
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-white/68 hover:bg-white/8 hover:text-white"
                  )
                }
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/6 text-white/58 transition-colors group-hover:text-white">
                  <item.icon className="size-4" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-semibold tracking-[-0.02em]">{item.label}</p>
                </div>
              </NavLink>
            )
          ))}
        </div>

        <div className="mt-auto px-2 pb-2 pt-6">
          <Suspense
            fallback={
              <div className="h-[23rem] rounded-[1.75rem] bg-white/[0.03] ring-1 ring-white/6" />
            }
          >
            <SidebarLanyard
              badgeImage={pikachuBadge}
              profileImage={user?.profileImage}
              roleLabel={user ? getRoleLabel(user.role) : "내 계정"}
              userName={user?.name}
            />
          </Suspense>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-4">
        <div className="flex items-center gap-2">
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              cn(
                "group flex min-w-0 flex-1 items-center gap-3 rounded-xl px-3 py-3 transition-all",
                isActive
                  ? "bg-white/10 text-white"
                  : "text-white/72 hover:bg-white/8 hover:text-white",
              )
            }
          >
            <Avatar className="size-11 shrink-0 border-white/10 bg-white/8">
              <AvatarImage src={user?.profileImage} alt={user?.name} />
              <AvatarFallback className="bg-white/8 font-bold text-white">
                {user?.name?.slice(0, 1) ?? "U"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-semibold text-white">
                {user?.name ?? "내 계정"}
              </p>
              <p className="truncate text-[13px] text-white/62">
                {user ? getRoleLabel(user.role) : ""}
              </p>
            </div>
          </NavLink>

          {user ? (
            <button
              type="button"
              aria-label="로그아웃"
              className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-rose-500/25 bg-rose-500/12 text-rose-400 transition-all hover:bg-rose-500/20 hover:text-rose-300"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              <LogOut className="size-4" />
            </button>
          ) : null}
        </div>
      </div>
    </aside>
  );
}

function CollapsibleSidebarItem({
  item,
  isOpen,
  currentPath,
  onToggle,
}: {
  item: any;
  isOpen: boolean;
  currentPath: string;
  onToggle: () => void;
}) {
  const matchingSubmenus = item.submenus.filter(
    (sub: any) => currentPath === sub.href || currentPath.startsWith(sub.href + "/"),
  );
  const isActiveGroup = matchingSubmenus.length > 0;
  const strongestMatchLength = matchingSubmenus.reduce(
    (max: number, sub: any) => Math.max(max, sub.href.length),
    0,
  );

  return (
    <div className="flex flex-col">
      <button
        onClick={onToggle}
        className={cn(
          "group relative flex items-center justify-between gap-3 rounded-xl px-3 py-3 transition-all",
          isActiveGroup
            ? "bg-white/10 text-white"
            : isOpen
              ? "bg-white/8 text-white"
              : "text-white/68 hover:bg-white/8 hover:text-white"
        )}
      >
        <div className="flex items-center gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/6 text-white/58 transition-colors group-hover:text-white">
            <item.icon className="size-4" />
          </div>
          <p className="truncate text-[15px] font-semibold tracking-[-0.02em]">{item.label}</p>
        </div>
        <ChevronDown
          className={cn(
            "size-4 text-white/56 transition-transform duration-300 ease-out",
            isOpen && "rotate-180",
          )}
        />
      </button>

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
            {item.submenus.map((sub: any) => {
              const nestedChild = getNestedCreateSubmenu(sub.href, currentPath);
              const isNestedChildActive = nestedChild
                ? currentPath === nestedChild.href || currentPath.startsWith(nestedChild.href + "/")
                : false;
              const isSubActive =
                !isNestedChildActive &&
                (currentPath === sub.href ||
                  (!sub.exact && currentPath.startsWith(sub.href + "/"))) &&
                sub.href.length === strongestMatchLength;

              return (
                <div key={sub.href} className="flex flex-col gap-1">
                  <NavLink
                    to={sub.href}
                    end={sub.exact}
                    className={cn(
                      "relative flex items-center rounded-md px-3 py-2 text-[14px] font-medium transition-all before:absolute before:-left-3 before:top-1/2 before:h-1 before:w-1 before:-translate-y-1/2 before:rounded-full",
                      isSubActive
                        ? "bg-white/10 text-white before:bg-white"
                        : "text-white/64 hover:bg-white/8 hover:text-white before:bg-transparent",
                    )}
                  >
                    {sub.label}
                  </NavLink>

                  {nestedChild ? (
                    <NavLink
                      to={nestedChild.href}
                      className={cn(
                        "relative ml-4 flex items-center rounded-md px-3 py-2 text-[13px] font-medium transition-all before:absolute before:-left-3 before:top-1/2 before:h-1 before:w-1 before:-translate-y-1/2 before:rounded-full",
                        isNestedChildActive
                          ? "bg-white/10 text-white before:bg-white"
                          : "text-white/64 hover:bg-white/8 hover:text-white before:bg-transparent",
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
