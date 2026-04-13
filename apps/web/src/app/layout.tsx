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
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-5rem] top-[-4rem] size-72 rounded-full bg-[#f8cc65]/45 blur-3xl" />
        <div className="absolute right-[-4rem] top-[8%] size-80 rounded-full bg-[#3bd3fd]/24 blur-3xl" />
        <div className="absolute bottom-[-7rem] left-[22%] size-96 rounded-full bg-[#c1b0ff]/28 blur-3xl" />
        <div className="absolute bottom-14 right-[8%] size-28 rounded-[38%_62%_57%_43%/42%_39%_61%_58%] border border-dashed border-border bg-white/40" />
      </div>
      <Sidebar />
      <div className="relative z-10 flex flex-1 flex-col min-w-0 overflow-hidden bg-background">
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
