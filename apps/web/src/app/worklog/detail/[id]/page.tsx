import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PageHeader } from "@/app/_common/components/PageHeader";
import {
  canEditWorklog,
  canTransitionWorklog,
} from "@/app/_common/service/access-control";
import { useAuth } from "@/app/_common/hooks/useAuth";
import { subscribeMockDb } from "@/app/_common/service/mock-db";
import { WorklogDetail } from "@/app/worklog/_components/WorklogDetail";
import { worklogService } from "@/app/worklog/_service/worklog.service";
import { Button } from "@/components/ui/button";

export default function WorklogDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const [worklog, setWorklog] = useState<
    Awaited<ReturnType<typeof worklogService.getById>>
  >();
  const [transitionNotice, setTransitionNotice] = useState("");

  useEffect(() => {
    const sync = async () => {
      setWorklog(await worklogService.getById(Number(params.id)));
    };

    void sync();
    return subscribeMockDb(() => {
      void sync();
    });
  }, [params.id]);

  if (!worklog) return <div>업무를 찾을 수 없습니다.</div>;

  return (
    <>
      <PageHeader
        title={worklog.title}
        description="업무 상세, 의존성, 파일, AI 상태를 함께 확인합니다."
        actions={
          canEditWorklog(user, worklog) ? (
            <Button asChild variant="outline">
              <Link to={`/worklog/edit/${worklog.id}`}>업무 수정</Link>
            </Button>
          ) : null
        }
      />
      <WorklogDetail
        worklog={worklog}
        canTransition={canTransitionWorklog(user, worklog)}
        transitionNotice={transitionNotice}
        onTransition={async (nextStatus, reason) => {
          const result = await worklogService.transitionStatus(
            worklog.id,
            nextStatus,
            user?.id ?? worklog.authorId,
            reason,
          );
          setTransitionNotice(result.warning ?? "");
        }}
      />
    </>
  );
}
