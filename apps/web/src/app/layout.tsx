import { Navigate, Outlet } from "react-router-dom";
import { GNB } from "@/app/_common/components/GNB";
import { Sidebar } from "@/app/_common/components/Sidebar";
import { useAuth } from "@/app/_common/hooks/useAuth";

export default function AppLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="relative flex h-full overflow-hidden bg-transparent text-foreground">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-6rem] top-[-5rem] size-80 rounded-full bg-sky-300/20 blur-3xl" />
        <div className="absolute right-[-4rem] top-[-2rem] size-72 rounded-full bg-indigo-400/18 blur-3xl" />
        <div className="absolute bottom-[-8rem] left-1/3 size-96 rounded-full bg-cyan-200/24 blur-3xl" />
      </div>
      <Sidebar />
      <div className="app-shell-grid relative z-10 flex flex-1 flex-col overflow-hidden">
        <GNB />
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto flex max-w-7xl flex-col gap-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
