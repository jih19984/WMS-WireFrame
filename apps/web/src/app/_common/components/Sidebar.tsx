import {
  Bell,
  Building2,
  ChevronDown,
  Files,
  FolderOpen,
  LayoutDashboard,
  Tags,
} from "lucide-react";
import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { cn, getRoleLabel } from "@/lib/utils";
import { useAuth } from "@/app/_common/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
      { label: "사용자 관리", href: "/user" },
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
  const { user } = useAuth();
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
    <aside className="workspace-sidebar relative z-20 flex h-full w-[17.5rem] shrink-0 flex-col overflow-hidden border-r border-sidebar-border text-sidebar-foreground">
      <div className="flex-1 overflow-y-auto px-3 py-6">
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
                      ? "bg-white/12 text-white shadow-[var(--shadow-panel)]"
                      : "text-white/68 hover:bg-white/6 hover:text-white"
                  )
                }
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-white/6 text-white/72 transition-colors group-hover:text-white">
                  <item.icon className="size-4" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-semibold tracking-[-0.02em]">{item.label}</p>
                </div>
              </NavLink>
            )
          ))}
        </div>
      </div>

      <div className="border-t border-white/8 px-4 py-4">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            cn(
              "group flex min-w-0 items-center gap-3 rounded-xl px-3 py-3 transition-all",
              isActive
                ? "bg-white/12 text-white shadow-[var(--shadow-panel)]"
                : "text-white/70 hover:bg-white/6 hover:text-white",
            )
          }
        >
          <Avatar className="size-11 shrink-0 border-0 bg-white/12">
            <AvatarImage src={user?.profileImage} alt={user?.name} />
            <AvatarFallback className="bg-white/12 font-bold text-white">
              {user?.name?.slice(0, 1) ?? "U"}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-semibold text-white">
              {user?.name ?? "내 계정"}
            </p>
            <p className="truncate text-[12px] text-white/52">
              {user ? getRoleLabel(user.role) : ""}
            </p>
          </div>
        </NavLink>
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
            ? "bg-white/12 text-white shadow-[var(--shadow-panel)]"
            : isOpen
              ? "bg-white/5 text-white/78"
              : "text-white/68 hover:bg-white/6 hover:text-white"
        )}
      >
        <div className="flex items-center gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-white/6 text-white/72 transition-colors group-hover:text-white">
            <item.icon className="size-4" />
          </div>
          <p className="truncate text-[14px] font-semibold tracking-[-0.02em]">{item.label}</p>
        </div>
        <ChevronDown
          className={cn(
            "size-4 text-white/40 transition-transform duration-300 ease-out",
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
                      "relative flex items-center rounded-md px-3 py-2 text-[13px] font-medium transition-all before:absolute before:-left-3 before:top-1/2 before:h-1 before:w-1 before:-translate-y-1/2 before:rounded-full",
                      isSubActive
                        ? "bg-white/10 text-white before:bg-white"
                        : "text-white/50 hover:bg-white/5 hover:text-white before:bg-transparent",
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
                          ? "bg-white/10 text-white before:bg-white"
                          : "text-white/45 hover:bg-white/5 hover:text-white before:bg-transparent",
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
