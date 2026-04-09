import { Link } from "react-router-dom";
import { PageHeader } from "@/app/_common/components/PageHeader";
import { RoleGate } from "@/app/_common/components/RoleGate";
import { useDepartment } from "@/app/department/_hooks/useDepartment";
import { DepartmentList } from "@/app/department/_components/DepartmentList";
import { Button } from "@/components/ui/button";

export default function DepartmentPage() {
  const { departments } = useDepartment();

  return (
    <RoleGate allow={["DIRECTOR"]}>
      <PageHeader
        title="부서 관리"
        description="본부장 전용 화면입니다. 부서 구조와 책임자를 정리할 수 있습니다."
        actions={
          <Button asChild={false}>
            <Link to="/department/create">부서 등록</Link>
          </Button>
        }
      />
      <DepartmentList departments={departments} />
    </RoleGate>
  );
}
