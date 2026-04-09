import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { PageHeader } from "@/app/_common/components/PageHeader";
import { useAuth } from "@/app/_common/hooks/useAuth";
import { users } from "@/app/_common/service/mock-db";
import { userService } from "@/app/user/_service/user.service";
import { UserDetail } from "@/app/user/_components/UserDetail";
import type { UserEvaluation } from "@/app/user/_types/user.types";

export default function UserDetailPage() {
  const params = useParams();
  const { user: currentUser } = useAuth();
  const [evaluations, setEvaluations] = useState<UserEvaluation[]>([]);
  const user = useMemo(() => users.find((item) => item.id === Number(params.id)), [params.id]);
  const showEvaluations = currentUser?.role === "DIRECTOR" || currentUser?.role === "DEPT_HEAD";

  useEffect(() => {
    if (!user) return;
    userService.getEvaluations(user.id).then(setEvaluations);
  }, [user]);

  if (!user) return <div>사용자를 찾을 수 없습니다.</div>;

  return (
    <>
      <PageHeader title={`${user.name} 상세`} description="프로필, 스킬, 관리자 평가를 확인합니다." />
      <UserDetail user={user} evaluations={evaluations} showEvaluations={showEvaluations} />
    </>
  );
}
