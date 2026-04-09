import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/app/_common/components/PageHeader";
import { teams } from "@/app/_common/service/mock-db";
import { teamService } from "@/app/team/_service/team.service";
import { TeamForm } from "@/app/team/_components/TeamForm";
import { Card, CardContent } from "@/components/ui/card";

export default function TeamEditPage() {
  const navigate = useNavigate();
  const params = useParams();
  const team = useMemo(() => teams.find((item) => item.id === Number(params.id)), [params.id]);

  if (!team) return <div>팀 정보를 찾을 수 없습니다.</div>;

  return (
    <>
      <PageHeader title={`${team.name} 수정`} description="팀 상태, 기간, 설명을 업데이트합니다." />
      <Card>
        <CardContent className="pt-5">
          <TeamForm
            initialValues={{
              name: team.name,
              departmentId: team.departmentId,
              leaderId: team.leaderId,
              description: team.description,
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
        </CardContent>
      </Card>
    </>
  );
}
