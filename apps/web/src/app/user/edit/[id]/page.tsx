import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/app/_common/components/PageHeader";
import { canEditUserProfile } from "@/app/_common/service/access-control";
import { useAuth } from "@/app/_common/hooks/useAuth";
import { users } from "@/app/_common/service/mock-db";
import { userService } from "@/app/user/_service/user.service";
import { UserForm } from "@/app/user/_components/UserForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function UserEditPage() {
  const navigate = useNavigate();
  const params = useParams();
  const { user: currentUser } = useAuth();
  const user = useMemo(() => users.find((item) => item.id === Number(params.id)), [params.id]);

  if (!user) return <div>사용자를 찾을 수 없습니다.</div>;
  if (!canEditUserProfile(currentUser, user.id)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>접근 권한이 없습니다</CardTitle>
          <CardDescription>일반 구성원은 본인 프로필만 수정할 수 있습니다.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          권한이 필요한 경우 관리자에게 요청해주세요.
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <PageHeader title={`${user.name} 수정`} description="역할, 소속, 직책 정보를 수정합니다." />
      <Card>
        <CardContent className="pt-5">
          <UserForm
            initialValues={{
              name: user.name,
              email: user.email,
              role: user.role,
              departmentId: user.departmentId,
              teamIds: user.teamIds,
              primaryTeamId: user.primaryTeamId,
              position: user.position,
              title: user.title,
              phone: user.phone,
              employmentStatus: user.employmentStatus,
              joinDate: user.joinDate,
              profileImage: user.profileImage,
            }}
            submitLabel="수정 저장"
            onSubmit={async (values) => {
              await userService.update(user.id, values);
              navigate("/user");
            }}
          />
        </CardContent>
      </Card>
    </>
  );
}
