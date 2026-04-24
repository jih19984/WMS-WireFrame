import { useMemo, useState } from "react";
import { Building2 } from "lucide-react";
import {
  RegistrationField,
  RegistrationFormPanel,
} from "@/app/_common/components/RegistrationFormPanel";
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
  const controlClassName = "h-14 rounded-2xl px-4 text-base";
  const textareaClassName = "min-h-[180px] rounded-2xl px-4 py-3 text-base";
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
      className="registration-surface w-full max-w-[1480px] pb-10"
      onSubmit={async (event) => {
        event.preventDefault();
        await onSubmit(values);
      }}
    >
      <RegistrationFormPanel
        eyebrow="DEPARTMENT PROFILE"
        title="부서 정보"
        icon={<Building2 className="size-4" />}
        className="min-h-[720px]"
      >
        <div className="grid gap-5">
          <RegistrationField label="부서명">
            <Input
              className={controlClassName}
              placeholder="부서명을 입력하세요."
              value={values.name}
              onChange={(event) => setValues({ ...values, name: event.target.value })}
            />
          </RegistrationField>
          <RegistrationField label="부서 설명">
            <Textarea
              className={textareaClassName}
              placeholder="부서의 역할과 설명을 작성하세요."
              value={values.description}
              onChange={(event) =>
                setValues({ ...values, description: event.target.value })
              }
            />
          </RegistrationField>
          <RegistrationField label="사업부장">
            <Select
              className={controlClassName}
              options={options}
              value={String(values.leaderId)}
              onChange={(event) =>
                setValues({ ...values, leaderId: Number(event.target.value) })
              }
            />
          </RegistrationField>
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
