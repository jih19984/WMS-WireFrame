import { Link } from "react-router-dom";
import { PageHeader } from "@/app/_common/components/PageHeader";
import { useWorklog } from "@/app/worklog/_hooks/useWorklog";
import { WorklogList } from "@/app/worklog/_components/WorklogList";
import { Button } from "@/components/ui/button";

export default function WorklogPage() {
  const { worklogs } = useWorklog();

  return (
    <>
      <PageHeader
        title="업무일지"
        description="상태, 중요도, 팀 기준으로 업무를 확인하고 상세로 이동할 수 있습니다."
        actions={
          <Button>
            <Link to="/worklog/create">업무 등록</Link>
          </Button>
        }
      />
      <WorklogList worklogs={worklogs} />
    </>
  );
}
