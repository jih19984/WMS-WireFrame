import {
  Bell,
  Building2,
  FileArchive,
  Files,
  LayoutDashboard,
  Search,
  Tags,
  Users,
  UsersRound,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { cn, getRoleLabel } from "@/lib/utils";
import { useAuth } from "@/app/_common/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navItems = [
  {
    href: "/",
    label: "대시보드",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/department",
    label: "조직 관리",
    icon: Building2,
    roles: ["DIRECTOR", "DEPT_HEAD"],
  },
  {
    href: "/team",
    label: "팀 관리",
    icon: UsersRound,
    roles: ["TEAM_LEAD", "MEMBER"],
  },
  {
    href: "/user",
    label: "사용자",
    icon: Users,
  },
  {
    href: "/worklog",
    label: "업무일지",
    icon: Files,
  },
  {
    href: "/search",
    label: "시맨틱 검색",
    icon: Search,
  },
  {
    href: "/file",
    label: "파일 관리",
    icon: FileArchive,
  },
  {
    href: "/notification",
    label: "알림",
    icon: Bell,
  },
  {
    href: "/tag",
    label: "태그 관리",
    icon: Tags,
  },
];

export function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const filteredNavItems = navItems.filter((item) => {
    if (!item.roles) return true;
    if (!user) return false;
    return item.roles.includes(user.role);
  });

  return (
    <aside className="relative z-10 flex h-full w-[17rem] shrink-0 flex-col overflow-hidden border-r bg-card text-card-foreground">
      <div className="px-6 py-7">
        {user && (
          <div className="flex items-center gap-3">
            <Avatar className="size-11 border shadow-sm">
              <AvatarImage src={user.profileImage} alt={user.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-[600]">{user.name.slice(0, 1)}</AvatarFallback>
            </Avatar>
            <div className="space-y-0.5">
              <p className="text-[17px] font-[600] tracking-[-0.02em]">{user.name}</p>
              <p className="text-[13px] text-muted-foreground font-medium tracking-tight">{getRoleLabel(user.role)}</p>
            </div>
          </div>
        )}
      </div>
      <nav className="flex flex-1 flex-col gap-1.5 px-4 pb-5 overflow-y-auto">
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.exact}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-4 py-3 text-[0.95rem] font-medium transition-all duration-150",
                isActive
                  ? "bg-accent text-accent-foreground font-[600] shadow-sm border border-border/50"
                  : "border border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )
            }
          >
            <item.icon className="size-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto px-4 py-4 pb-6">
        <button
          onClick={() => { logout(); navigate("/login"); }}
          className="flex w-full items-center gap-3 rounded-md px-4 py-3 text-[0.95rem] font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="size-4" />
          로그아웃
        </button>
      </div>
    </aside>
  );
}
