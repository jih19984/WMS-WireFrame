import { type ReactNode, useMemo, useState } from "react";
import { UserRound } from "lucide-react";
import {
  RegistrationField,
  RegistrationFormPanel,
} from "@/app/_common/components/RegistrationFormPanel";
import { departments, teams } from "@/app/_common/service/mock-db";
import type { UserFormValues } from "@/app/user/_types/user.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { getEmploymentStatusLabel } from "@/lib/utils";

const titleRoleMap = {
  본부장: "DIRECTOR",
  사업부장: "DEPT_HEAD",
  팀장: "TEAM_LEAD",
  팀원: "MEMBER",
} as const satisfies Record<string, UserFormValues["role"]>;

const titleOptions = Object.keys(titleRoleMap).map((title) => ({
  label: title,
  value: title,
}));

const basePositionOptions = ["과장", "대리", "부장", "사원", "상무", "이사", "차장"].map((position) => ({
  label: position,
  value: position,
}));

type UserTitle = keyof typeof titleRoleMap;

const roleTitleMap: Record<UserFormValues["role"], UserTitle> = {
  DIRECTOR: "본부장",
  DEPT_HEAD: "사업부장",
  TEAM_LEAD: "팀장",
  MEMBER: "팀원",
};

function isUserTitle(value: string): value is UserTitle {
  return Object.prototype.hasOwnProperty.call(titleRoleMap, value);
}

function getTitleFromRole(role: UserFormValues["role"]): UserTitle {
  return roleTitleMap[role];
}

export function UserForm({
  initialValues,
  onSubmit,
  submitLabel,
  children,
}: {
  initialValues?: UserFormValues;
  onSubmit: (values: UserFormValues) => Promise<void> | void;
  submitLabel: string;
  children?: ReactNode;
}) {
  const controlClassName = "h-14 rounded-2xl px-4 text-base";
  const [values, setValues] = useState<UserFormValues>(() => {
    const baseValues =
      initialValues ?? {
      name: "",
      email: "",
      role: "MEMBER",
      departmentId: 3,
      teamIds: [11],
      primaryTeamId: 11,
      position: "대리",
      title: "팀원",
      phone: "010-0000-0000",
      employmentStatus: "ACTIVE",
      joinDate: "2026-04-01",
      profileImage: "https://i.pravatar.cc/150?u=new-user",
    };
    const normalizedTitle = isUserTitle(baseValues.title)
      ? baseValues.title
      : getTitleFromRole(baseValues.role);

    return {
      ...baseValues,
      title: normalizedTitle,
      role: titleRoleMap[normalizedTitle],
    };
  });

  const departmentOptions = useMemo(() => departments.map((department) => ({ label: department.name, value: String(department.id) })), []);
  const positionOptions = useMemo(() => {
    const hasCurrentPosition = basePositionOptions.some(
      (option) => option.value === values.position,
    );

    if (hasCurrentPosition || !values.position.trim()) {
      return basePositionOptions;
    }

    return [
      ...basePositionOptions,
      { label: `${values.position} (기존값)`, value: values.position },
    ];
  }, [values.position]);
  const assignedTeamOptions = useMemo(() => {
    const assignedTeamIds = Array.from(
      new Set([values.primaryTeamId, ...values.teamIds].filter((teamId) => teamId > 0)),
    );

    return assignedTeamIds
      .map((teamId) => teams.find((team) => team.id === teamId))
      .filter((team): team is (typeof teams)[number] => Boolean(team))
      .map((team) => ({ label: team.name, value: String(team.id) }));
  }, [values.primaryTeamId, values.teamIds]);

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
        title="사용자 정보 및 직책 설정"
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
                직무
              </p>
              <div className="grid gap-4 lg:grid-cols-2">
                <RegistrationField label="직급">
                  <Select
                    className={controlClassName}
                    value={values.position}
                    options={positionOptions}
                    onChange={(event) =>
                      setValues({ ...values, position: event.target.value })
                    }
                  />
                </RegistrationField>
                <RegistrationField label="직책">
                  <Select
                    className={controlClassName}
                    value={values.title}
                    options={titleOptions}
                    onChange={(event) => {
                      const title = event.target.value as UserTitle;
                      setValues({
                        ...values,
                        title,
                        role: titleRoleMap[title],
                      });
                    }}
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
            <RegistrationField label="소속 부서 및 주소속팀">
              <div className="grid gap-4">
                <Select
                  className={controlClassName}
                  value={String(values.departmentId)}
                  options={departmentOptions}
                  onChange={(event) => {
                    const departmentId = Number(event.target.value);
                    setValues({
                      ...values,
                      departmentId,
                    });
                  }}
                />
                <Select
                  className={controlClassName}
                  value={String(values.primaryTeamId)}
                  disabled={assignedTeamOptions.length === 0}
                  options={
                    assignedTeamOptions.length > 0
                      ? assignedTeamOptions
                      : [{ label: "소속 팀 없음", value: "0" }]
                  }
                  onChange={(event) =>
                    setValues({
                      ...values,
                      primaryTeamId: Number(event.target.value),
                    })
                  }
                />
                <p className="rounded-2xl border border-border/70 bg-muted/25 px-4 py-3 text-sm leading-6 text-muted-foreground">
                  팀 추가와 삭제는 팀 관리 탭에서만 변경합니다. 여기서는 이미 소속된 팀 중 주소속팀만 선택할 수 있습니다.
                </p>
              </div>
            </RegistrationField>
          </div>
        </div>

        {children ? (
          <div className="border-t border-border/70 pt-8">
            {children}
          </div>
        ) : null}

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
