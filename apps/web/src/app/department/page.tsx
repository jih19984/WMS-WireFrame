import { useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/app/_common/components/PageHeader";
import { RoleGate } from "@/app/_common/components/RoleGate";
import { useAuth } from "@/app/_common/hooks/useAuth";
import {
  canManageDepartments,
  canManageTeams,
  canManageUsers,
} from "@/app/_common/service/access-control";
import { useDepartment } from "@/app/department/_hooks/useDepartment";
import { useTeam } from "@/app/team/_hooks/useTeam";
import { useUser } from "@/app/user/_hooks/useUser";
import { DepartmentList } from "@/app/department/_components/DepartmentList";
import { TeamList } from "@/app/team/_components/TeamList";
import { UserList } from "@/app/user/_components/UserList";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DepartmentPage() {
  const { user } = useAuth();
  const { departments } = useDepartment();
  const { teams } = useTeam();
  const { users } = useUser();
  
  const isDirector = user?.role === "DIRECTOR";
  const [activeTab, setActiveTab] = useState(isDirector ? "department" : "team");
  const canManageDepartment = canManageDepartments(user);
  const canManageTeam = canManageTeams(user);
  const canManageUser = canManageUsers(user);

  if (!user) return null;

  const visibleTeams = isDirector ? teams : teams.filter(t => t.departmentId === user.departmentId);
  const visibleUsers = isDirector ? users : users.filter(u => u.departmentId === user.departmentId);

  return (
    <RoleGate allow={["DIRECTOR", "DEPT_HEAD"]}>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="조직 관리"
          description="부서, 팀, 사용자 구조를 역할 범위에 맞춰 확인하고 관리 정책을 와이어프레임으로 검토합니다."
        />

        <Card className="rounded-2xl border-dashed">
          <CardContent className="grid gap-4 p-5 md:grid-cols-3">
            <div className="rounded-xl bg-muted/20 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Scope</p>
              <p className="mt-2 text-lg font-semibold">
                {isDirector ? "본부 전체" : "소속 부서"}
              </p>
            </div>
            <div className="rounded-xl bg-muted/20 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Teams</p>
              <p className="mt-2 text-lg font-semibold">{visibleTeams.length}개</p>
            </div>
            <div className="rounded-xl bg-muted/20 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Users</p>
              <p className="mt-2 text-lg font-semibold">{visibleUsers.length}명</p>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="h-14 p-1.5 bg-muted border border-border rounded-xl mb-6">
            {isDirector && (
              <TabsTrigger value="department" className="h-full px-6 text-[15px] rounded-lg">
                부서 관리
              </TabsTrigger>
            )}
            <TabsTrigger value="team" className="h-full px-6 text-[15px] rounded-lg">
              팀 관리
            </TabsTrigger>
            <TabsTrigger value="user" className="h-full px-6 text-[15px] rounded-lg">
              사용자 관리
            </TabsTrigger>
          </TabsList>

          {isDirector && (
            <TabsContent value="department">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-[20px] font-semibold tracking-[-0.04em]">부서 목록</h2>
                  {canManageDepartment ? (
                    <Button asChild variant="outline" className="h-9">
                      <Link to="/department/create">부서 등록</Link>
                    </Button>
                  ) : null}
                </div>
                <p className="text-sm text-muted-foreground">
                  부서 생성과 삭제 정책은 본부장 전용입니다. 삭제 제약은 현재 화면에서 정책 안내 문구로 표현합니다.
                </p>
                <DepartmentList departments={departments} readOnly={!canManageDepartment} />
              </div>
            </TabsContent>
          )}

          <TabsContent value="team">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-[20px] font-semibold tracking-[-0.04em]">{isDirector ? "전체 팀 목록" : "부서 내 팀 목록"}</h2>
                {canManageTeam ? (
                  <Button asChild variant="outline" className="h-9">
                    <Link to="/team/create">팀 등록</Link>
                  </Button>
                ) : null}
              </div>
              <p className="text-sm text-muted-foreground">
                팀은 프로젝트 단위 논리 그룹입니다. 사업부장 이상은 생성과 수정, 팀리더 이하 역할은 조회 중심으로 사용합니다.
              </p>
              <TeamList teams={visibleTeams} />
            </div>
          </TabsContent>

          <TabsContent value="user">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-[20px] font-semibold tracking-[-0.04em]">{isDirector ? "전체 사용자 목록" : "부서 내 사용자 목록"}</h2>
                {canManageUser ? (
                  <Button asChild variant="outline" className="h-9">
                    <Link to="/user/create">사용자 등록</Link>
                  </Button>
                ) : null}
              </div>
              <p className="text-sm text-muted-foreground">
                복수 팀 소속, 주 소속 팀, 재직 상태, 스킬과 관리자 평가 흐름까지 현재 와이어프레임에서 확인할 수 있습니다.
              </p>
              <UserList users={visibleUsers} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </RoleGate>
  );
}
