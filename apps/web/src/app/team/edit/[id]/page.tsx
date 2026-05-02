import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/app/_common/components/PageHeader";
import { RoleGate } from "@/app/_common/components/RoleGate";
import { departments, teams, users } from "@/app/_common/service/mock-db";
import { teamService } from "@/app/team/_service/team.service";
import { TeamForm } from "@/app/team/_components/TeamForm";

export default function TeamEditPage() {
  const navigate = useNavigate();
  const params = useParams();
  const team = useMemo(() => teams.find((item) => item.id === Number(params.id)), [params.id]);

  if (!team) return <div>팀 정보를 찾을 수 없습니다.</div>;

  const fallbackAdminId =
    team.adminId ??
    departments.find((department) => department.id === team.departmentId)?.leaderId ??
    users.find((user) => user.role === "DIRECTOR" || user.role === "DEPT_HEAD")?.id ??
    0;

  return (
    <RoleGate allow={["DIRECTOR", "DEPT_HEAD"]}>
      <PageHeader title={`${team.name} 수정`} />
      <TeamForm
        initialValues={{
          name: team.name,
          departmentId: team.departmentId,
          leaderId: team.leaderId,
          adminId: fallbackAdminId,
          description: team.description,
          members: team.members,
          memberRoles:
            team.memberRoles ??
            team.members.map((userId) => ({
              userId,
              role: "",
            })),
          status: team.status,
          startDate: team.startDate,
          endDate: team.endDate,
        }}
        submitLabel="수정 저장"
        onSubmit={async (values) => {
          await teamService.update(team.id, values);
          navigate("/team");
        }}
      />
    </RoleGate>
  );
}
