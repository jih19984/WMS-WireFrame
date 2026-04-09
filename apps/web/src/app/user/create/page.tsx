import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/app/_common/components/PageHeader";
import { userService } from "@/app/user/_service/user.service";
import { UserForm } from "@/app/user/_components/UserForm";
import { Card, CardContent } from "@/components/ui/card";

export default function UserCreatePage() {
  const navigate = useNavigate();

  return (
    <>
      <PageHeader title="사용자 등록" description="신규 구성원 계정을 추가합니다." />
      <Card>
        <CardContent className="pt-5">
          <UserForm
            submitLabel="사용자 생성"
            onSubmit={async (values) => {
              await userService.create(values);
              navigate("/user");
            }}
          />
        </CardContent>
      </Card>
    </>
  );
}
