import { Navigate, Outlet, useLocation } from "react-router-dom";
import { GNB } from "@/app/_common/components/GNB";
import { Sidebar } from "@/app/_common/components/Sidebar";
import { useAuth } from "@/app/_common/hooks/useAuth";

export default function AppLayout() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="relative flex h-full overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-12rem] top-[-10rem] h-80 w-80 rounded-full bg-[#2563eb]/20 blur-[120px]" />
        <div className="absolute left-[18%] top-[4%] h-72 w-72 rounded-full bg-[#1e3a8a]/22 blur-[140px]" />
        <div className="absolute right-[-10rem] top-[-5rem] h-72 w-72 rounded-full bg-[#3b82f6]/14 blur-[120px]" />
      </div>
      <Sidebar />
      <div className="workspace-main relative z-10 flex min-w-0 flex-1 flex-col overflow-hidden">
        <GNB />
        <main className="flex-1 overflow-auto px-5 py-5 lg:px-8 lg:py-6">
          <div
            key={location.pathname}
            className="route-content-enter flex min-h-full flex-col gap-5"
          >
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
