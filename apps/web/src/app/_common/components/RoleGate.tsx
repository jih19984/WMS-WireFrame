import type { ReactNode } from "react";
import type { UserRole } from "@/app/_common/types/api.types";
import { useAuth } from "@/app/_common/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function RoleGate({
  allow,
  children,
  fallback,
}: {
  allow: UserRole[];
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { user } = useAuth();

  if (!user || !allow.includes(user.role)) {
    return (
      <>
        {fallback ?? (
          <Card>
            <CardHeader>
              <CardTitle>접근 권한이 없습니다</CardTitle>
              <CardDescription>현재 역할로는 이 화면을 사용할 수 없습니다.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              권한이 필요한 경우 관리자에게 요청해주세요.
            </CardContent>
          </Card>
        )}
      </>
    );
  }

  return <>{children}</>;
}
