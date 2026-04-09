import { useMemo, useState } from "react";
import { departments, teams } from "@/app/_common/service/mock-db";
import type { UserFormValues } from "@/app/user/_types/user.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

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
      primaryTeamId: 11,
      position: "대리",
      title: "개발자",
      phone: "010-0000-0000",
    }
  );

  const departmentOptions = useMemo(() => departments.map((department) => ({ label: department.name, value: String(department.id) })), []);
  const teamOptions = useMemo(() => teams.map((team) => ({ label: team.name, value: String(team.id) })), []);

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
              { label: "DIRECTOR", value: "DIRECTOR" },
              { label: "DEPT_HEAD", value: "DEPT_HEAD" },
              { label: "TEAM_LEAD", value: "TEAM_LEAD" },
              { label: "MEMBER", value: "MEMBER" },
            ]}
            onChange={(event) => setValues({ ...values, role: event.target.value as UserFormValues["role"] })}
          />
        </Field>
        <Field label="부서">
          <Select value={String(values.departmentId)} options={departmentOptions} onChange={(event) => setValues({ ...values, departmentId: Number(event.target.value) })} />
        </Field>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="주 소속 팀">
          <Select value={String(values.primaryTeamId)} options={teamOptions} onChange={(event) => setValues({ ...values, primaryTeamId: Number(event.target.value) })} />
        </Field>
        <Field label="직급">
          <Input value={values.position} onChange={(event) => setValues({ ...values, position: event.target.value })} />
        </Field>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="직책">
          <Input value={values.title} onChange={(event) => setValues({ ...values, title: event.target.value })} />
        </Field>
        <Field label="연락처">
          <Input value={values.phone} onChange={(event) => setValues({ ...values, phone: event.target.value })} />
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
