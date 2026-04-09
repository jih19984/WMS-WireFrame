import { Link } from "react-router-dom";
import { PageHeader } from "@/app/_common/components/PageHeader";
import { useTeam } from "@/app/team/_hooks/useTeam";
import { TeamList } from "@/app/team/_components/TeamList";
import { Button } from "@/components/ui/button";

export default function TeamPage() {
  const { teams } = useTeam();

  return (
    <>
      <PageHeader
        title="팀 관리"
        description="프로젝트 단위 팀과 멤버 구성을 점검하고 수정할 수 있습니다."
        actions={
          <Button>
            <Link to="/team/create">팀 등록</Link>
          </Button>
        }
      />
      <TeamList teams={teams} />
    </>
  );
}
