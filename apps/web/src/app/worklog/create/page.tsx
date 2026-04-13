import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/app/_common/components/PageHeader";
import { worklogService } from "@/app/worklog/_service/worklog.service";
import { WorklogForm } from "@/app/worklog/_components/WorklogForm";
import { Card, CardContent } from "@/components/ui/card";

export default function WorklogCreatePage() {
  const navigate = useNavigate();

  return (
    <>
      <PageHeader title="업무 등록" description="저장 시 AI 파이프라인 mock 상태가 함께 시작됩니다." />
      <Card>
        <CardContent className="pt-5">
          <WorklogForm
            submitLabel="업무 생성"
            currentWorklogId={undefined}
            onSubmit={async (values) => {
              const created = await worklogService.create(values);
              navigate(`/worklog/detail/${created.id}`);
            }}
          />
        </CardContent>
      </Card>
    </>
  );
}
