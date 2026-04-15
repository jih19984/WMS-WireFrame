import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/app/_common/components/PageHeader";
import { RoleGate } from "@/app/_common/components/RoleGate";
import { departments } from "@/app/_common/service/mock-db";
import { departmentService } from "@/app/department/_service/department.service";
import { DepartmentForm } from "@/app/department/_components/DepartmentForm";

export default function DepartmentEditPage() {
  const navigate = useNavigate();
  const params = useParams();
  const department = useMemo(
    () => departments.find((item) => item.id === Number(params.id)),
    [params.id]
  );

  if (!department) return <div>대상을 찾을 수 없습니다.</div>;

  return (
    <RoleGate allow={["DIRECTOR"]}>
      <PageHeader title={`${department.name} 수정`} />
      <DepartmentForm
        initialValues={{
          name: department.name,
          description: department.description,
          leaderId: department.leaderId,
        }}
        submitLabel="수정 저장"
        onSubmit={async (values) => {
          await departmentService.update(department.id, values);
          navigate("/department");
        }}
      />
    </RoleGate>
  );
}
