import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/app/_common/components/PageHeader";
import {
  canEditUserProfile,
  canManageUsers,
  canViewEvaluations,
  canWriteEvaluations,
} from "@/app/_common/service/access-control";
import { useAuth } from "@/app/_common/hooks/useAuth";
import { subscribeMockDb, users } from "@/app/_common/service/mock-db";
import { userService } from "@/app/user/_service/user.service";
import { UserForm } from "@/app/user/_components/UserForm";
import { EvaluationList } from "@/app/user/_components/EvaluationList";
import { SkillEditor } from "@/app/user/_components/SkillEditor";
import type { UserEvaluation } from "@/app/user/_types/user.types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function UserEditPage() {
  const navigate = useNavigate();
  const params = useParams();
  const { user: currentUser } = useAuth();
  const [revision, setRevision] = useState(0);
  const [evaluations, setEvaluations] = useState<UserEvaluation[]>([]);
  const user = useMemo(() => users.find((item) => item.id === Number(params.id)), [params.id, revision]);
  const showEvaluations = canViewEvaluations(currentUser);
  const allowWriteEvaluations = canWriteEvaluations(currentUser, user?.id);
  const allowManageSkills = canManageUsers(currentUser);

  useEffect(() => {
    const userId = Number(params.id);

    const sync = async () => {
      setRevision((current) => current + 1);
      setEvaluations(await userService.getEvaluations(userId));
    };

    void sync();
    return subscribeMockDb(() => {
      void sync();
    });
  }, [params.id]);

  if (!user) return <div>사용자를 찾을 수 없습니다.</div>;
  if (!canEditUserProfile(currentUser, user.id)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>접근 권한이 없습니다</CardTitle>
          <CardDescription>일반 구성원은 본인 프로필만 수정할 수 있습니다.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          권한이 필요한 경우 관리자에게 요청해주세요.
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <PageHeader title={`${user.name} 수정`} />
      <UserForm
        initialValues={{
          name: user.name,
          email: user.email,
          role: user.role,
          departmentId: user.departmentId,
          teamIds: user.teamIds,
          primaryTeamId: user.primaryTeamId,
          position: user.position,
          title: user.title,
          phone: user.phone,
          employmentStatus: user.employmentStatus,
          joinDate: user.joinDate,
          profileImage: user.profileImage,
        }}
        submitLabel="수정 저장"
        onSubmit={async (values) => {
          await userService.update(user.id, values);
          navigate("/user");
        }}
      >
        {allowManageSkills || showEvaluations ? (
          <div className="grid gap-8 xl:grid-cols-2">
            {allowManageSkills ? (
              <section className="space-y-4">
                <div>
                  <h3 className="text-[18px] font-semibold tracking-[-0.04em] text-foreground">
                    스킬 설정
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    본부장/사업부장은 스킬을 추가하고 Lv.1~5로 조정할 수 있습니다.
                  </p>
                </div>
                <SkillEditor
                  skills={user.skills}
                  canManage
                  onSaveSkill={async (skill) => {
                    await userService.upsertSkill(user.id, skill);
                  }}
                />
              </section>
            ) : null}

            {showEvaluations ? (
              <EvaluationList
                evaluations={evaluations}
                canWrite={allowWriteEvaluations}
                embedded
                onCreate={async (content) => {
                  if (!currentUser) return;
                  await userService.addEvaluation(user.id, currentUser.id, content);
                }}
                onUpdate={async (evaluationId, content) => {
                  if (!currentUser) return;
                  await userService.updateEvaluation(evaluationId, content);
                }}
              />
            ) : null}
          </div>
        ) : null}
      </UserForm>
    </>
  );
}
