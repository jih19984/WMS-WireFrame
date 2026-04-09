import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/app/_common/components/PageHeader";
import { worklogs } from "@/app/_common/service/mock-db";
import { worklogService } from "@/app/worklog/_service/worklog.service";
import { WorklogForm } from "@/app/worklog/_components/WorklogForm";
import { Card, CardContent } from "@/components/ui/card";

export default function WorklogEditPage() {
  const navigate = useNavigate();
  const params = useParams();
  const worklog = useMemo(() => worklogs.find((item) => item.id === Number(params.id)), [params.id]);

  if (!worklog) return <div>업무를 찾을 수 없습니다.</div>;

  return (
    <>
      <PageHeader title={`${worklog.title} 수정`} description="업무 내용 수정 시 AI 재생성 mock 흐름을 가정합니다." />
      <Card>
        <CardContent className="pt-5">
          <WorklogForm
            initialValues={{
              title: worklog.title,
              requestContent: worklog.requestContent,
              workContent: worklog.workContent,
              status: worklog.status,
              importance: worklog.importance,
              actualHours: worklog.actualHours,
              instructionDate: worklog.instructionDate,
              dueDate: worklog.dueDate,
              teamId: worklog.teamId,
              authorId: worklog.authorId,
              dependencies: worklog.dependencies,
            }}
            submitLabel="수정 저장"
            onSubmit={async (values) => {
              await worklogService.update(worklog.id, values);
              navigate(`/worklog/detail/${worklog.id}`);
            }}
          />
        </CardContent>
      </Card>
    </>
  );
}
