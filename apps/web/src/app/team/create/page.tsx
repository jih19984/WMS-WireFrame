import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/app/_common/components/PageHeader";
import { RoleGate } from "@/app/_common/components/RoleGate";
import { teamService } from "@/app/team/_service/team.service";
import { TeamForm } from "@/app/team/_components/TeamForm";
import { Card, CardContent } from "@/components/ui/card";

export default function TeamCreatePage() {
  const navigate = useNavigate();

  return (
    <RoleGate allow={["DIRECTOR", "DEPT_HEAD"]}>
      <PageHeader title="팀 등록" description="프로젝트 단위 팀을 생성하고 책임자를 지정합니다." />
      <Card>
        <CardContent className="pt-5">
          <TeamForm
            submitLabel="팀 생성"
            onSubmit={async (values) => {
              await teamService.create(values);
              navigate("/team");
            }}
          />
        </CardContent>
      </Card>
    </RoleGate>
  );
}
