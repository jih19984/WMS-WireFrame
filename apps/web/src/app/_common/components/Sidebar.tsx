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
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "대시보드", icon: LayoutDashboard, exact: true },
  { href: "/department", label: "부서 관리", icon: Building2 },
  { href: "/team", label: "팀 관리", icon: UsersRound },
  { href: "/user", label: "사용자 관리", icon: Users },
  { href: "/worklog", label: "업무일지", icon: Files },
  { href: "/search", label: "시맨틱 검색", icon: Search },
  { href: "/file", label: "파일 관리", icon: FileArchive },
  { href: "/notification", label: "알림", icon: Bell },
  { href: "/tag", label: "태그 관리", icon: Tags }
];

export function Sidebar() {
  return (
    <aside className="glass-panel relative z-10 m-4 mr-0 flex w-64 shrink-0 flex-col overflow-hidden rounded-[24px] border-white/34 bg-sidebar">
      <div className="border-b border-white/28 px-5 py-5">
        <p className="text-lg font-semibold text-sidebar-foreground">AX-WMS</p>
        <p className="text-xs text-muted-foreground">AI 기반 업무관리 시스템</p>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.exact}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "border border-white/40 bg-sidebar-accent text-sidebar-accent-foreground shadow-[0_10px_24px_rgba(79,70,229,0.12)]"
                  : "text-muted-foreground hover:bg-white/36 hover:text-foreground"
              )
            }
          >
            <item.icon className="size-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-white/28 px-5 py-4">
        <div className="glass-input rounded-2xl bg-accent/65 p-4 text-sm text-accent-foreground">
          <p className="font-semibold">AI Assist</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            검색, 요약, 태그 작성 흐름을 시연하기 위한 mock AI 상태를 제공합니다.
          </p>
        </div>
      </div>
    </aside>
  );
}
