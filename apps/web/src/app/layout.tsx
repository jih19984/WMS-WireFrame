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
    <div className="flex h-full overflow-hidden bg-background text-foreground">
      <Sidebar />
      <div className="relative z-10 flex min-w-0 flex-1 flex-col overflow-hidden">
        <GNB />
        <main className="workspace-main flex-1 overflow-auto px-4 py-6 md:px-8">
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
