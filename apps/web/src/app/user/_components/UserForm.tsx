import { useMemo, useState } from "react";
import { departments, teams } from "@/app/_common/service/mock-db";
import type { UserFormValues } from "@/app/user/_types/user.types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { getEmploymentStatusLabel, getRoleLabel } from "@/lib/utils";

export function UserForm({
  initialValues,
  onSubmit,
  submitLabel,
}: {
  initialValues?: UserFormValues;
  onSubmit: (values: UserFormValues) => Promise<void> | void;
  submitLabel: string;
}) {
  const [values, setValues] = useState<UserFormValues>(
    initialValues ?? {
      name: "",
      email: "",
      role: "MEMBER",
      departmentId: 3,
      teamIds: [11],
      primaryTeamId: 11,
      position: "대리",
      title: "개발자",
      phone: "010-0000-0000",
      employmentStatus: "ACTIVE",
      joinDate: "2026-04-01",
      profileImage: "https://i.pravatar.cc/150?u=new-user",
    }
  );

  const departmentOptions = useMemo(() => departments.map((department) => ({ label: department.name, value: String(department.id) })), []);
  const teamOptions = useMemo(
    () =>
      teams
        .filter((team) => team.departmentId === values.departmentId)
        .map((team) => ({ label: team.name, value: String(team.id) })),
    [values.departmentId]
  );

  const toggleTeam = (teamId: number, checked: boolean) => {
    const nextTeamIds = checked
      ? Array.from(new Set([...values.teamIds, teamId]))
      : values.teamIds.filter((item) => item !== teamId);
    setValues({
      ...values,
      teamIds: nextTeamIds,
      primaryTeamId: nextTeamIds.includes(values.primaryTeamId)
        ? values.primaryTeamId
        : nextTeamIds[0] ?? 0,
    });
  };

  return (
    <form
      className="flex max-w-3xl flex-col"
      onSubmit={async (event) => {
        event.preventDefault();
        await onSubmit(values);
      }}
    >
      <Field label="기본 정보" description="사용자의 이름, 이메일 주소, 프로필 이미지를 입력합니다.">
        <div className="flex w-full items-center gap-4">
          <Input placeholder="이름" value={values.name} onChange={(event) => setValues({ ...values, name: event.target.value })} />
          <Input placeholder="이메일" value={values.email} onChange={(event) => setValues({ ...values, email: event.target.value })} />
          <Input placeholder="프로필 URL (opt)" value={values.profileImage} onChange={(event) => setValues({ ...values, profileImage: event.target.value })} />
        </div>
      </Field>

      <Field label="직무 및 권한" description="직급, 직책과 시스템 접근 권한 등급을 지정합니다.">
        <div className="flex w-full items-center gap-4">
          <Input placeholder="직급 (예: 대리)" value={values.position} onChange={(event) => setValues({ ...values, position: event.target.value })} />
          <Input placeholder="직책 (예: 개발자)" value={values.title} onChange={(event) => setValues({ ...values, title: event.target.value })} />
          <Select
            value={values.role}
            options={[
              { label: getRoleLabel("DIRECTOR"), value: "DIRECTOR" },
              { label: getRoleLabel("DEPT_HEAD"), value: "DEPT_HEAD" },
              { label: getRoleLabel("TEAM_LEAD"), value: "TEAM_LEAD" },
              { label: getRoleLabel("MEMBER"), value: "MEMBER" },
            ]}
            onChange={(event) => setValues({ ...values, role: event.target.value as UserFormValues["role"] })}
          />
        </div>
      </Field>

      <Field label="소속 부서 및 팀" description="해당 사용자가 주로 활동할 부서와 팀을 지정하세요.">
        <div className="flex w-full items-center gap-4">
          <Select
            value={String(values.departmentId)}
            options={departmentOptions}
            onChange={(event) => {
              const departmentId = Number(event.target.value);
              const nextTeams = teams.filter((team) => team.departmentId === departmentId);
              const nextTeamIds = nextTeams.slice(0, 1).map((team) => team.id);
              setValues({
                ...values,
                departmentId,
                teamIds: nextTeamIds,
                primaryTeamId: nextTeamIds[0] ?? 0,
              });
            }}
          />
          <Select
            value={String(values.primaryTeamId)}
            options={teamOptions}
            onChange={(event) => setValues({ ...values, primaryTeamId: Number(event.target.value) })}
          />
        </div>
      </Field>

      <Field label="복수 팀 소속" description="대시보드와 알림 기본값은 주 소속 팀 기준이지만 여러 팀에 동시 소속될 수 있습니다.">
        <div className="grid gap-2 rounded-xl border border-white/10 bg-white/5 p-4 md:grid-cols-2">
          {teamOptions.map((team) => (
            <label key={team.value} className="flex items-center gap-3 rounded-xl bg-background px-3 py-2 text-sm transition-all hover:bg-white/5">
              <Checkbox
                checked={values.teamIds.includes(Number(team.value))}
                onChange={(event) => toggleTeam(Number(team.value), event.target.checked)}
              />
              <span>{team.label}</span>
            </label>
          ))}
        </div>
      </Field>

      <Field label="인사 정보" description="사용자의 연락처와 재직 상태, 입사일을 관리합니다.">
        <div className="flex w-full items-center gap-4">
          <Input placeholder="연락처" value={values.phone} onChange={(event) => setValues({ ...values, phone: event.target.value })} />
          <Select
            value={values.employmentStatus}
            options={[
              { label: getEmploymentStatusLabel("ACTIVE"), value: "ACTIVE" },
              { label: getEmploymentStatusLabel("LEAVE"), value: "LEAVE" },
              { label: getEmploymentStatusLabel("INACTIVE"), value: "INACTIVE" },
            ]}
            onChange={(event) =>
              setValues({
                ...values,
                employmentStatus: event.target.value as UserFormValues["employmentStatus"],
              })
            }
          />
          <Input
            type="date"
            value={values.joinDate}
            onChange={(event) => setValues({ ...values, joinDate: event.target.value })}
          />
        </div>
      </Field>
      <div className="mt-8">
        <Button type="submit" size="lg" className="w-full sm:w-auto font-semibold">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

function Field({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 border-b border-white/5 py-6 last:border-0">
      <div className="space-y-1">
        <label className="text-[15px] font-[600] text-foreground">{label}</label>
        {description ? <p className="text-[13px] text-muted-foreground">{description}</p> : null}
      </div>
      <div>
        {children}
      </div>
    </div>
  );
}
