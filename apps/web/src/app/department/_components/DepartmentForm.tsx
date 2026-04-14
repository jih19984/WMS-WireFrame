import { useMemo, useState } from "react";
import { users } from "@/app/_common/service/mock-db";
import type { DepartmentFormValues } from "@/app/department/_types/department.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function DepartmentForm({
  initialValues,
  onSubmit,
  submitLabel,
}: {
  initialValues?: DepartmentFormValues;
  onSubmit: (values: DepartmentFormValues) => Promise<void> | void;
  submitLabel: string;
}) {
  const controlClassName = "h-12 rounded-xl";
  const textareaClassName = "rounded-xl";
  const [values, setValues] = useState<DepartmentFormValues>(
    initialValues ?? { name: "", description: "", leaderId: users.find((user) => user.role === "DEPT_HEAD")?.id ?? 2 }
  );

  const options = useMemo(
    () =>
      users
        .filter((user) => user.role === "DEPT_HEAD")
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
      <div className="grid gap-2">
        <label className="text-sm font-medium">부서명</label>
        <Input
          className={controlClassName}
          placeholder="부서명을 입력하세요."
          value={values.name}
          onChange={(event) => setValues({ ...values, name: event.target.value })}
        />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium">부서 설명</label>
        <Textarea
          className={textareaClassName}
          placeholder="부서의 역할과 설명을 작성하세요."
          value={values.description}
          onChange={(event) => setValues({ ...values, description: event.target.value })}
        />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium">사업부장</label>
        <Select
          className={controlClassName}
          options={options}
          value={String(values.leaderId)}
          onChange={(event) => setValues({ ...values, leaderId: Number(event.target.value) })}
        />
      </div>
      <div className="flex justify-end">
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
