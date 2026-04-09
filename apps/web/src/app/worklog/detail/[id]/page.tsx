import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { PageHeader } from "@/app/_common/components/PageHeader";
import { worklogs } from "@/app/_common/service/mock-db";
import { WorklogDetail } from "@/app/worklog/_components/WorklogDetail";

export default function WorklogDetailPage() {
  const params = useParams();
  const worklog = useMemo(() => worklogs.find((item) => item.id === Number(params.id)), [params.id]);

  if (!worklog) return <div>업무를 찾을 수 없습니다.</div>;

  return (
    <>
      <PageHeader title={worklog.title} description="업무 상세, 의존성, 파일, AI 상태를 함께 확인합니다." />
      <WorklogDetail worklog={worklog} />
    </>
  );
}
