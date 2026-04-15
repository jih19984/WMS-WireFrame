import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/app/_common/components/PageHeader";
import { RoleGate } from "@/app/_common/components/RoleGate";
import { departmentService } from "@/app/department/_service/department.service";
import { DepartmentForm } from "@/app/department/_components/DepartmentForm";

export default function DepartmentCreatePage() {
  const navigate = useNavigate();

  return (
    <RoleGate allow={["DIRECTOR"]}>
      <PageHeader title="부서 등록" />
      <DepartmentForm
        submitLabel="부서 생성"
        onSubmit={async (values) => {
          await departmentService.create(values);
          navigate("/department");
        }}
      />
    </RoleGate>
  );
}
