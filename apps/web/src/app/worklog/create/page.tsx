import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/app/_common/components/PageHeader";
import { worklogService } from "@/app/worklog/_service/worklog.service";
import { WorklogForm } from "@/app/worklog/_components/WorklogForm";

export default function WorklogCreatePage() {
  const navigate = useNavigate();

  return (
    <>
      <PageHeader title="업무 등록" />
      <WorklogForm
        submitLabel="업무 생성"
        currentWorklogId={undefined}
        onSubmit={async (values) => {
          const created = await worklogService.create(values);
          navigate(`/worklog/detail/${created.id}`);
        }}
      />
    </>
  );
}
