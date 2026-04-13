import { Link } from "react-router-dom";
import { PageHeader } from "@/app/_common/components/PageHeader";
import { canCreateWorklog } from "@/app/_common/service/access-control";
import { useAuth } from "@/app/_common/hooks/useAuth";
import { useWorklog } from "@/app/worklog/_hooks/useWorklog";
import { WorklogList } from "@/app/worklog/_components/WorklogList";
import { Button } from "@/components/ui/button";

export default function WorklogPage() {
  const { user } = useAuth();
  const { worklogs } = useWorklog();
  const canCreate = canCreateWorklog(user);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="업무일지"
        description="역할별 가시 범위에 맞는 업무일지와 상태, 중요도, AI 처리 상태를 확인합니다."
      />
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[20px] font-semibold tracking-[-0.04em]">전체 업무 목록</h2>
          {canCreate ? (
            <Button asChild variant="outline" className="h-9">
              <Link to="/worklog/create">업무 등록</Link>
            </Button>
          ) : null}
        </div>
        <WorklogList worklogs={worklogs} />
      </div>
    </div>
  );
}
