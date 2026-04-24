import { useMemo, useState } from "react";
import { Network } from "lucide-react";
import {
  RegistrationField,
  RegistrationFormPanel,
} from "@/app/_common/components/RegistrationFormPanel";
import { departments, users } from "@/app/_common/service/mock-db";
import type { TeamFormValues } from "@/app/team/_types/team.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function TeamForm({
  initialValues,
  onSubmit,
  submitLabel,
}: {
  initialValues?: TeamFormValues;
  onSubmit: (values: TeamFormValues) => Promise<void> | void;
  submitLabel: string;
}) {
  const controlClassName = "h-14 rounded-2xl px-4 text-base";
  const textareaClassName = "min-h-[180px] rounded-2xl px-4 py-3 text-base";
  const [values, setValues] = useState<TeamFormValues>(
    initialValues ?? {
      name: "",
      departmentId: 3,
      leaderId: 6,
      description: "",
      status: "ACTIVE",
      startDate: "2026-04-10",
      endDate: "2026-07-31",
    }
  );

  const departmentOptions = useMemo(
    () => departments.map((department) => ({ label: department.name, value: String(department.id) })),
    []
  );
  const leaderOptions = useMemo(
    () =>
      users
        .filter((user) => user.role === "TEAM_LEAD" || user.role === "DEPT_HEAD")
        .map((user) => ({ label: `${user.name} / ${user.title}`, value: String(user.id) })),
    []
  );

  return (
    <form
      className="registration-surface w-full max-w-[1480px] pb-10"
      onSubmit={async (event) => {
        event.preventDefault();
        await onSubmit(values);
      }}
    >
      <RegistrationFormPanel
        eyebrow="TEAM WORKFLOW"
        title="팀 정보 및 운영 설정"
        icon={<Network className="size-4" />}
        className="min-h-[720px]"
      >
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.25fr)_minmax(420px,0.9fr)]">
          <div className="space-y-5">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              기본 정보
            </p>
            <RegistrationField label="팀명">
              <Input
                className={controlClassName}
                placeholder="팀명을 입력하세요."
                value={values.name}
                onChange={(event) => setValues({ ...values, name: event.target.value })}
              />
            </RegistrationField>
            <RegistrationField label="팀 설명">
              <Textarea
                className={textareaClassName}
                placeholder="팀의 목적과 운영 범위를 작성하세요."
                value={values.description}
                onChange={(event) =>
                  setValues({ ...values, description: event.target.value })
                }
              />
            </RegistrationField>
          </div>
          <div className="space-y-5 xl:border-l xl:border-border/70 xl:pl-8">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              운영 설정
            </p>
            <RegistrationField label="상태">
              <Select
                className={controlClassName}
                options={[
                  { label: "ACTIVE", value: "ACTIVE" },
                  { label: "INACTIVE", value: "INACTIVE" },
                ]}
                value={values.status}
                onChange={(event) =>
                  setValues({
                    ...values,
                    status: event.target.value as TeamFormValues["status"],
                  })
                }
              />
            </RegistrationField>
            <RegistrationField label="소속 부서 및 팀리더">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                <Select
                  className={controlClassName}
                  value={String(values.departmentId)}
                  options={departmentOptions}
                  onChange={(event) =>
                    setValues({ ...values, departmentId: Number(event.target.value) })
                  }
                />
                <Select
                  className={controlClassName}
                  value={String(values.leaderId)}
                  options={leaderOptions}
                  onChange={(event) =>
                    setValues({ ...values, leaderId: Number(event.target.value) })
                  }
                />
              </div>
            </RegistrationField>
            <RegistrationField label="일정">
              <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center xl:grid-cols-1">
                <Input
                  className={controlClassName}
                  type="date"
                  value={values.startDate}
                  onChange={(event) =>
                    setValues({ ...values, startDate: event.target.value })
                  }
                />
                <span className="hidden text-sm text-muted-foreground sm:block xl:hidden">
                  ~
                </span>
                <Input
                  className={controlClassName}
                  type="date"
                  value={values.endDate}
                  onChange={(event) =>
                    setValues({ ...values, endDate: event.target.value })
                  }
                />
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
