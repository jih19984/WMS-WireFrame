import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PageHeader } from "@/app/_common/components/PageHeader";
import {
  canEditUserProfile,
  canViewEvaluations,
} from "@/app/_common/service/access-control";
import { useAuth } from "@/app/_common/hooks/useAuth";
import { subscribeMockDb, users } from "@/app/_common/service/mock-db";
import { userService } from "@/app/user/_service/user.service";
import { UserDetail } from "@/app/user/_components/UserDetail";
import type { UserEvaluation } from "@/app/user/_types/user.types";
import { Button } from "@/components/ui/button";

export default function UserDetailPage() {
  const params = useParams();
  const { user: currentUser } = useAuth();
  const [evaluations, setEvaluations] = useState<UserEvaluation[]>([]);
  const user = useMemo(() => users.find((item) => item.id === Number(params.id)), [params.id]);
  const showEvaluations = canViewEvaluations(currentUser);
  const allowEditProfile = canEditUserProfile(currentUser, user?.id);

  useEffect(() => {
    if (!user) return;
    const sync = async () => {
      setEvaluations(await userService.getEvaluations(user.id));
    };
    void sync();
    return subscribeMockDb(() => {
      void sync();
    });
  }, [user]);

  if (!user) return <div>사용자를 찾을 수 없습니다.</div>;

  return (
    <>
      <PageHeader
        title={`${user.name} 상세`}
        description="프로필, 스킬, 관리자 평가를 확인합니다."
        actions={
          allowEditProfile ? (
            <Button asChild variant="outline">
              <Link to={`/user/edit/${user.id}`}>프로필 수정</Link>
            </Button>
          ) : undefined
        }
      />
      <UserDetail
        user={user}
        evaluations={evaluations}
        showEvaluations={showEvaluations}
      />
    </>
  );
}
