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
      className="grid gap-4"
      onSubmit={async (event) => {
        event.preventDefault();
        await onSubmit(values);
      }}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="이름"><Input value={values.name} onChange={(event) => setValues({ ...values, name: event.target.value })} /></Field>
        <Field label="이메일"><Input value={values.email} onChange={(event) => setValues({ ...values, email: event.target.value })} /></Field>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="권한">
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
        </Field>
        <Field label="부서">
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
        </Field>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="주 소속 팀">
          <Select
            value={String(values.primaryTeamId)}
            options={teamOptions}
            onChange={(event) => setValues({ ...values, primaryTeamId: Number(event.target.value) })}
          />
        </Field>
        <Field label="직급">
          <Input value={values.position} onChange={(event) => setValues({ ...values, position: event.target.value })} />
        </Field>
      </div>
      <Field label="복수 팀 소속">
        <div className="grid gap-2 rounded-2xl border border-dashed border-border bg-muted/20 p-4 md:grid-cols-2">
          {teamOptions.map((team) => (
            <label key={team.value} className="flex items-center gap-3 rounded-xl bg-background px-3 py-2 text-sm">
              <Checkbox
                checked={values.teamIds.includes(Number(team.value))}
                onChange={(event) => toggleTeam(Number(team.value), event.target.checked)}
              />
              <span>{team.label}</span>
            </label>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          대시보드와 알림 기본값은 주 소속 팀을 기준으로 잡습니다.
        </p>
      </Field>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="직책">
          <Input value={values.title} onChange={(event) => setValues({ ...values, title: event.target.value })} />
        </Field>
        <Field label="연락처">
          <Input value={values.phone} onChange={(event) => setValues({ ...values, phone: event.target.value })} />
        </Field>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Field label="재직 상태">
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
        </Field>
        <Field label="입사일">
          <Input
            type="date"
            value={values.joinDate}
            onChange={(event) => setValues({ ...values, joinDate: event.target.value })}
          />
        </Field>
        <Field label="프로필 이미지">
          <Input
            value={values.profileImage}
            onChange={(event) => setValues({ ...values, profileImage: event.target.value })}
            placeholder="https://..."
          />
        </Field>
      </div>
      <div className="flex justify-end">
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium">{label}</label>
      {children}
    </div>
  );
}
