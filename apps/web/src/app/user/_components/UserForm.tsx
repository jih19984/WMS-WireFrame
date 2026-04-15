import { useMemo, useState } from "react";
import { UserRound } from "lucide-react";
import {
  RegistrationField,
  RegistrationFormPanel,
} from "@/app/_common/components/RegistrationFormPanel";
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
  const controlClassName = "h-14 rounded-2xl px-4 text-base";
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
      className="registration-surface w-full max-w-[1480px] pb-10"
      onSubmit={async (event) => {
        event.preventDefault();
        await onSubmit(values);
      }}
    >
      <RegistrationFormPanel
        eyebrow="USER PROFILE"
        title="사용자 정보 및 권한 설정"
        icon={<UserRound className="size-4" />}
        className="min-h-[720px]"
      >
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.25fr)_minmax(420px,0.9fr)]">
          <div className="space-y-7">
            <section className="space-y-5">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                기본 정보
              </p>
              <div className="grid gap-4 lg:grid-cols-2">
                <RegistrationField label="이름">
                  <Input
                    className={controlClassName}
                    placeholder="사용자 이름을 입력하세요."
                    value={values.name}
                    onChange={(event) =>
                      setValues({ ...values, name: event.target.value })
                    }
                  />
                </RegistrationField>
                <RegistrationField label="이메일">
                  <Input
                    className={controlClassName}
                    placeholder="이메일 주소를 입력하세요."
                    value={values.email}
                    onChange={(event) =>
                      setValues({ ...values, email: event.target.value })
                    }
                  />
                </RegistrationField>
              </div>
              <RegistrationField label="프로필 이미지">
                <Input
                  className={controlClassName}
                  placeholder="프로필 이미지 URL을 입력하세요."
                  value={values.profileImage}
                  onChange={(event) =>
                    setValues({ ...values, profileImage: event.target.value })
                  }
                />
              </RegistrationField>
            </section>

            <section className="space-y-5 border-t border-border/70 pt-6">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                직무 및 권한
              </p>
              <div className="grid gap-4 lg:grid-cols-3">
                <RegistrationField label="직급">
                  <Input
                    className={controlClassName}
                    placeholder="직급을 입력하세요. 예: 대리"
                    value={values.position}
                    onChange={(event) =>
                      setValues({ ...values, position: event.target.value })
                    }
                  />
                </RegistrationField>
                <RegistrationField label="직책">
                  <Input
                    className={controlClassName}
                    placeholder="직책을 입력하세요. 예: 개발자"
                    value={values.title}
                    onChange={(event) =>
                      setValues({ ...values, title: event.target.value })
                    }
                  />
                </RegistrationField>
                <RegistrationField label="권한 역할">
                  <Select
                    className={controlClassName}
                    value={values.role}
                    options={[
                      { label: getRoleLabel("DIRECTOR"), value: "DIRECTOR" },
                      { label: getRoleLabel("DEPT_HEAD"), value: "DEPT_HEAD" },
                      { label: getRoleLabel("TEAM_LEAD"), value: "TEAM_LEAD" },
                      { label: getRoleLabel("MEMBER"), value: "MEMBER" },
                    ]}
                    onChange={(event) =>
                      setValues({
                        ...values,
                        role: event.target.value as UserFormValues["role"],
                      })
                    }
                  />
                </RegistrationField>
              </div>
            </section>

            <section className="space-y-5 border-t border-border/70 pt-6">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                인사 정보
              </p>
              <div className="grid gap-4 lg:grid-cols-3">
                <RegistrationField label="연락처">
                  <Input
                    className={controlClassName}
                    placeholder="연락처를 입력하세요."
                    value={values.phone}
                    onChange={(event) =>
                      setValues({ ...values, phone: event.target.value })
                    }
                  />
                </RegistrationField>
                <RegistrationField label="상태">
                  <Select
                    className={controlClassName}
                    value={values.employmentStatus}
                    options={[
                      { label: getEmploymentStatusLabel("ACTIVE"), value: "ACTIVE" },
                      { label: getEmploymentStatusLabel("LEAVE"), value: "LEAVE" },
                      {
                        label: getEmploymentStatusLabel("INACTIVE"),
                        value: "INACTIVE",
                      },
                    ]}
                    onChange={(event) =>
                      setValues({
                        ...values,
                        employmentStatus:
                          event.target.value as UserFormValues["employmentStatus"],
                      })
                    }
                  />
                </RegistrationField>
                <RegistrationField label="입사일">
                  <Input
                    className={controlClassName}
                    type="date"
                    value={values.joinDate}
                    onChange={(event) =>
                      setValues({ ...values, joinDate: event.target.value })
                    }
                  />
                </RegistrationField>
              </div>
            </section>
          </div>

          <div className="space-y-5 xl:border-l xl:border-border/70 xl:pl-8">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              조직 배치
            </p>
            <RegistrationField label="소속 부서 및 주 소속 팀">
              <div className="grid gap-4">
                <Select
                  className={controlClassName}
                  value={String(values.departmentId)}
                  options={departmentOptions}
                  onChange={(event) => {
                    const departmentId = Number(event.target.value);
                    const nextTeams = teams.filter(
                      (team) => team.departmentId === departmentId,
                    );
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
                  className={controlClassName}
                  value={String(values.primaryTeamId)}
                  options={teamOptions}
                  onChange={(event) =>
                    setValues({
                      ...values,
                      primaryTeamId: Number(event.target.value),
                    })
                  }
                />
              </div>
            </RegistrationField>

            <RegistrationField label="복수 팀 소속">
              <div className="registration-panel grid max-h-[360px] gap-2 overflow-auto rounded-2xl border p-4">
                {teamOptions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    선택한 부서에 연결된 팀이 없습니다.
                  </p>
                ) : (
                  teamOptions.map((team) => (
                    <label
                      key={team.value}
                      className="flex items-center gap-3 rounded-2xl border border-border/70 bg-muted/25 px-3 py-3 text-sm transition-all hover:border-primary/35 hover:bg-primary/8"
                    >
                      <Checkbox
                        checked={values.teamIds.includes(Number(team.value))}
                        onChange={(event) =>
                          toggleTeam(Number(team.value), event.target.checked)
                        }
                      />
                      <span className="font-medium text-foreground">{team.label}</span>
                    </label>
                  ))
                )}
              </div>
            </RegistrationField>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            size="lg"
            className="h-12 min-w-[168px] rounded-2xl px-7 font-semibold shadow-[0_14px_40px_-20px_rgba(59,130,246,0.8)]"
          >
            {submitLabel}
          </Button>
        </div>
      </RegistrationFormPanel>
    </form>
  );
}
