import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { PageHeader } from "@/app/_common/components/PageHeader";
import { teams } from "@/app/_common/service/mock-db";
import { TeamDetail } from "@/app/team/_components/TeamDetail";

export default function TeamDetailPage() {
  const params = useParams();
  const team = useMemo(() => teams.find((item) => item.id === Number(params.id)), [params.id]);

  if (!team) return <div>팀 정보를 찾을 수 없습니다.</div>;

  return (
    <>
      <PageHeader title={team.name} description="팀 멤버와 업무 현황을 탭으로 확인합니다." />
      <TeamDetail team={team} />
    </>
  );
}
