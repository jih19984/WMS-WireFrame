import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/app/_common/components/PageHeader";
import { users } from "@/app/_common/service/mock-db";
import { userService } from "@/app/user/_service/user.service";
import { UserForm } from "@/app/user/_components/UserForm";
import { Card, CardContent } from "@/components/ui/card";

export default function UserEditPage() {
  const navigate = useNavigate();
  const params = useParams();
  const user = useMemo(() => users.find((item) => item.id === Number(params.id)), [params.id]);

  if (!user) return <div>사용자를 찾을 수 없습니다.</div>;

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
              primaryTeamId: user.primaryTeamId,
              position: user.position,
              title: user.title,
              phone: user.phone,
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
