import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/app/_common/components/PageHeader";
import { RoleGate } from "@/app/_common/components/RoleGate";
import { userService } from "@/app/user/_service/user.service";
import { UserForm } from "@/app/user/_components/UserForm";

export default function UserCreatePage() {
  const navigate = useNavigate();

  return (
    <RoleGate allow={["DIRECTOR", "DEPT_HEAD"]}>
      <PageHeader title="사용자 등록" />
      <UserForm
        submitLabel="사용자 생성"
        onSubmit={async (values) => {
          await userService.create(values);
          navigate("/user");
        }}
      />
    </RoleGate>
  );
}
