import { Bell, LogOut, Search } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/app/_common/hooks/useAuth";
import { notifications } from "@/app/_common/service/mock-db";

const pageTitleMap: Record<string, string> = {
  "/": "대시보드",
  "/department": "부서 관리",
  "/team": "팀 관리",
  "/user": "사용자 관리",
  "/worklog": "업무일지",
  "/search": "시맨틱 검색",
  "/file": "파일 관리",
  "/notification": "알림",
  "/tag": "태그 관리",
};

export function GNB() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const unreadCount = notifications.filter((notification) => !notification.isRead).length;
  const pathname = Object.keys(pageTitleMap).find((key) => location.pathname.startsWith(key) && key !== "/")
    ?? (location.pathname === "/" ? "/" : "");

  return (
    <header className="glass-panel relative mx-6 mt-4 flex h-16 items-center justify-between rounded-2xl px-6">
      <div>
        <p className="text-lg font-semibold">{pageTitleMap[pathname] ?? "AX-WMS"}</p>
        <p className="text-xs text-muted-foreground">shadcn/ui 스타일 기반 React 프로토타입</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="w-72 pl-9"
            placeholder="업무, 태그, 파일명을 검색하세요"
            onFocus={() => navigate("/search")}
          />
        </div>
        <Button variant="outline" size="icon" onClick={() => navigate("/notification")} className="relative">
          <Bell className="size-4" />
          {unreadCount > 0 ? (
            <Badge className="absolute -right-2 -top-2 px-1.5 py-0 text-[10px]">{unreadCount}</Badge>
          ) : null}
        </Button>
        {user ? (
          <div className="glass-input flex items-center gap-3 rounded-xl px-3 py-2">
            <Avatar className="size-8">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.slice(0, 1)}</AvatarFallback>
            </Avatar>
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.title}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => { logout(); navigate("/login"); }}>
              <LogOut className="size-4" />
            </Button>
          </div>
        ) : (
          <Button asChild>
            <Link to="/login">로그인</Link>
          </Button>
        )}
      </div>
    </header>
  );
}
