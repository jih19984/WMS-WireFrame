import { useMemo, useState } from "react";
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
  const controlClassName = "border-black/80 dark:border-white/80";
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
      className="registration-surface grid gap-4"
      onSubmit={async (event) => {
        event.preventDefault();
        await onSubmit(values);
      }}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <label className="text-sm font-medium">팀명</label>
          <Input className={controlClassName} value={values.name} onChange={(event) => setValues({ ...values, name: event.target.value })} />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium">상태</label>
          <Select
            className={controlClassName}
            options={[
              { label: "ACTIVE", value: "ACTIVE" },
              { label: "INACTIVE", value: "INACTIVE" },
            ]}
            value={values.status}
            onChange={(event) => setValues({ ...values, status: event.target.value as TeamFormValues["status"] })}
          />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <label className="text-sm font-medium">소속 부서</label>
          <Select className={controlClassName} value={String(values.departmentId)} options={departmentOptions} onChange={(event) => setValues({ ...values, departmentId: Number(event.target.value) })} />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium">팀리더</label>
          <Select className={controlClassName} value={String(values.leaderId)} options={leaderOptions} onChange={(event) => setValues({ ...values, leaderId: Number(event.target.value) })} />
        </div>
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium">팀 설명</label>
        <Textarea className={controlClassName} value={values.description} onChange={(event) => setValues({ ...values, description: event.target.value })} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <label className="text-sm font-medium">시작일</label>
          <Input className={controlClassName} type="date" value={values.startDate} onChange={(event) => setValues({ ...values, startDate: event.target.value })} />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium">종료 예정일</label>
          <Input className={controlClassName} type="date" value={values.endDate} onChange={(event) => setValues({ ...values, endDate: event.target.value })} />
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
