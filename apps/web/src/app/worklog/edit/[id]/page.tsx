import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/app/_common/components/PageHeader";
import { files, subscribeMockDb, worklogs } from "@/app/_common/service/mock-db";
import { worklogService } from "@/app/worklog/_service/worklog.service";
import { WorklogForm } from "@/app/worklog/_components/WorklogForm";

export default function WorklogEditPage() {
  const navigate = useNavigate();
  const params = useParams();
  const [worklog, setWorklog] = useState(
    () => worklogs.find((item) => item.id === Number(params.id)),
  );

  useEffect(() => {
    const sync = () => {
      setWorklog(worklogs.find((item) => item.id === Number(params.id)));
    };

    sync();
    return subscribeMockDb(sync);
  }, [params.id]);

  if (!worklog) return <div>업무를 찾을 수 없습니다.</div>;

  return (
    <>
      <PageHeader title={`${worklog.title} 수정`} />
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
          dependencyIds: worklog.dependencyIds,
          attachmentNames: files
            .filter((file) => worklog.fileIds.includes(file.id) && !file.isDeleted)
            .map((file) => file.originalName),
          tagIds: worklog.tagIds,
          aiSummary: worklog.aiSummary,
          aiSummaryEdited: worklog.aiSummaryEdited,
          aiRegenerateRequested: false,
        }}
        currentWorklogId={worklog.id}
        submitLabel="수정 저장"
        onSubmit={async (values) => {
          await worklogService.update(worklog.id, values);
          navigate(`/worklog/detail/${worklog.id}`);
        }}
      />
    </>
  );
}
