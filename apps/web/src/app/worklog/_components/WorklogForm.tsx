import { useMemo, useState } from "react";
import { teams, users, worklogs } from "@/app/_common/service/mock-db";
import type { WorklogFormValues } from "@/app/worklog/_types/worklog.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function WorklogForm({
  initialValues,
  onSubmit,
  submitLabel,
}: {
  initialValues?: WorklogFormValues;
  onSubmit: (values: WorklogFormValues) => Promise<void> | void;
  submitLabel: string;
}) {
  const [values, setValues] = useState<WorklogFormValues>(
    initialValues ?? {
      title: "",
      requestContent: "",
      workContent: "",
      status: "PENDING",
      importance: "NORMAL",
      actualHours: 1,
      instructionDate: "2026-04-09",
      dueDate: "2026-04-12",
      teamId: 11,
      authorId: 7,
      dependencies: [],
    }
  );

  const teamOptions = useMemo(() => teams.map((team) => ({ label: team.name, value: String(team.id) })), []);
  const authorOptions = useMemo(() => users.map((user) => ({ label: `${user.name} / ${user.title}`, value: String(user.id) })), []);
  const dependencyOptions = useMemo(() => worklogs.map((worklog) => ({ label: worklog.title, value: String(worklog.id) })), []);

  return (
    <form
      className="grid gap-4"
      onSubmit={async (event) => {
        event.preventDefault();
        await onSubmit(values);
      }}
    >
      <Field label="제목">
        <Input value={values.title} onChange={(event) => setValues({ ...values, title: event.target.value })} />
      </Field>
      <Field label="요청/지시 내용">
        <Textarea value={values.requestContent} onChange={(event) => setValues({ ...values, requestContent: event.target.value })} />
      </Field>
      <Field label="업무 내용">
        <Textarea value={values.workContent} onChange={(event) => setValues({ ...values, workContent: event.target.value })} />
      </Field>
      <div className="grid gap-4 md:grid-cols-3">
        <Field label="상태">
          <Select
            value={values.status}
            options={[
              { label: "PENDING", value: "PENDING" },
              { label: "IN_PROGRESS", value: "IN_PROGRESS" },
              { label: "DONE", value: "DONE" },
              { label: "ON_HOLD", value: "ON_HOLD" },
              { label: "CANCELLED", value: "CANCELLED" },
            ]}
            onChange={(event) => setValues({ ...values, status: event.target.value as WorklogFormValues["status"] })}
          />
        </Field>
        <Field label="중요도">
          <Select
            value={values.importance}
            options={[
              { label: "URGENT", value: "URGENT" },
              { label: "HIGH", value: "HIGH" },
              { label: "NORMAL", value: "NORMAL" },
              { label: "LOW", value: "LOW" },
            ]}
            onChange={(event) => setValues({ ...values, importance: event.target.value as WorklogFormValues["importance"] })}
          />
        </Field>
        <Field label="실제 업무시간">
          <Input type="number" value={values.actualHours} onChange={(event) => setValues({ ...values, actualHours: Number(event.target.value) })} />
        </Field>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="팀">
          <Select value={String(values.teamId)} options={teamOptions} onChange={(event) => setValues({ ...values, teamId: Number(event.target.value) })} />
        </Field>
        <Field label="작성자">
          <Select value={String(values.authorId)} options={authorOptions} onChange={(event) => setValues({ ...values, authorId: Number(event.target.value) })} />
        </Field>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="지시일">
          <Input type="date" value={values.instructionDate} onChange={(event) => setValues({ ...values, instructionDate: event.target.value })} />
        </Field>
        <Field label="마감일">
          <Input type="date" value={values.dueDate} onChange={(event) => setValues({ ...values, dueDate: event.target.value })} />
        </Field>
      </div>
      <Field label="선행 업무">
        <Select
          options={[{ label: "없음", value: "0" }, ...dependencyOptions]}
          value={values.dependencies[0] ? String(values.dependencies[0]) : "0"}
          onChange={(event) =>
            setValues({
              ...values,
              dependencies: event.target.value === "0" ? [] : [Number(event.target.value)],
            })
          }
        />
      </Field>
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
