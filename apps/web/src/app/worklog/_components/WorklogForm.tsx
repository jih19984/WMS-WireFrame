import { useMemo, useState } from "react";
import { useAuth } from "@/app/_common/hooks/useAuth";
import { worklogs, teams, users } from "@/app/_common/service/mock-db";
import type { WorklogFormValues } from "@/app/worklog/_types/worklog.types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getImportanceLabel, getWorklogStatusLabel } from "@/lib/utils";

function hasCircularDependency(
  worklogId: number,
  dependencyIds: number[],
  pool: typeof worklogs,
) {
  const adjacency = new Map<number, number[]>();
  pool.forEach((worklog) => adjacency.set(worklog.id, worklog.dependencyIds));
  adjacency.set(worklogId, dependencyIds);

  const visited = new Set<number>();
  const stack = new Set<number>();

  const dfs = (nodeId: number): boolean => {
    if (stack.has(nodeId)) return true;
    if (visited.has(nodeId)) return false;

    visited.add(nodeId);
    stack.add(nodeId);

    for (const nextId of adjacency.get(nodeId) ?? []) {
      if (dfs(nextId)) return true;
    }

    stack.delete(nodeId);
    return false;
  };

  return dfs(worklogId);
}

export function WorklogForm({
  initialValues,
  onSubmit,
  submitLabel,
  currentWorklogId,
}: {
  initialValues?: WorklogFormValues;
  onSubmit: (values: WorklogFormValues) => Promise<void> | void;
  submitLabel: string;
  currentWorklogId?: number;
}) {
  const { user } = useAuth();
  const [values, setValues] = useState<WorklogFormValues>(
    initialValues ?? {
      title: "",
      requestContent: "",
      workContent: "",
      status: "PENDING",
      importance: "NORMAL",
      actualHours: 1,
      instructionDate: "2026-04-13",
      dueDate: "2026-04-16",
      teamId: user?.primaryTeamId ?? 11,
      authorId: user?.id ?? 7,
      dependencyIds: [],
      attachmentNames: [],
      aiRegenerate: true,
    },
  );
  const [submitError, setSubmitError] = useState("");

  const teamOptions = useMemo(
    () => teams.map((team) => ({ label: team.name, value: String(team.id) })),
    [],
  );
  const authorOptions = useMemo(
    () =>
      users.map((member) => ({
        label: `${member.name} / ${member.title}`,
        value: String(member.id),
      })),
    [],
  );
  const dependencyCandidates = useMemo(
    () =>
      worklogs.filter(
        (worklog) => !worklog.isDeleted && worklog.id !== currentWorklogId,
      ),
    [currentWorklogId],
  );

  const incompleteDependencies = dependencyCandidates.filter(
    (worklog) =>
      values.dependencyIds.includes(worklog.id) && worklog.status !== "DONE",
  );
  const circularDependencyDetected =
    currentWorklogId !== undefined &&
    hasCircularDependency(currentWorklogId, values.dependencyIds, worklogs);

  const toggleDependency = (dependencyId: number, checked: boolean) => {
    const nextDependencyIds = checked
      ? Array.from(new Set([...values.dependencyIds, dependencyId]))
      : values.dependencyIds.filter((item) => item !== dependencyId);

    setValues({ ...values, dependencyIds: nextDependencyIds });
  };

  return (
    <form
      className="grid gap-5"
      onSubmit={async (event) => {
        event.preventDefault();

        if (circularDependencyDetected) {
          setSubmitError(
            "순환 의존성이 감지되었습니다. 현재 업무를 다시 참조하는 연결을 해제해주세요.",
          );
          return;
        }

        setSubmitError("");
        await onSubmit(values);
      }}
    >
      <Field label="제목">
        <Input
          value={values.title}
          onChange={(event) => setValues({ ...values, title: event.target.value })}
        />
      </Field>

      <Field label="요청/지시 내용">
        <Textarea
          value={values.requestContent}
          onChange={(event) =>
            setValues({ ...values, requestContent: event.target.value })
          }
        />
      </Field>

      <Field label="업무 내용">
        <Textarea
          value={values.workContent}
          onChange={(event) =>
            setValues({ ...values, workContent: event.target.value })
          }
        />
      </Field>

      <div className="grid gap-4 md:grid-cols-3">
        <Field label="상태">
          <Select
            value={values.status}
            options={[
              { label: getWorklogStatusLabel("PENDING"), value: "PENDING" },
              { label: getWorklogStatusLabel("IN_PROGRESS"), value: "IN_PROGRESS" },
              { label: getWorklogStatusLabel("DONE"), value: "DONE" },
              { label: getWorklogStatusLabel("ON_HOLD"), value: "ON_HOLD" },
              { label: getWorklogStatusLabel("CANCELLED"), value: "CANCELLED" },
            ]}
            onChange={(event) =>
              setValues({
                ...values,
                status: event.target.value as WorklogFormValues["status"],
              })
            }
          />
        </Field>
        <Field label="중요도">
          <Select
            value={values.importance}
            options={[
              { label: getImportanceLabel("URGENT"), value: "URGENT" },
              { label: getImportanceLabel("HIGH"), value: "HIGH" },
              { label: getImportanceLabel("NORMAL"), value: "NORMAL" },
              { label: getImportanceLabel("LOW"), value: "LOW" },
            ]}
            onChange={(event) =>
              setValues({
                ...values,
                importance: event.target.value as WorklogFormValues["importance"],
              })
            }
          />
        </Field>
        <Field label="실제 업무시간">
          <Input
            type="number"
            min={0}
            step={0.5}
            value={values.actualHours}
            onChange={(event) =>
              setValues({ ...values, actualHours: Number(event.target.value) })
            }
          />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="팀">
          <Select
            value={String(values.teamId)}
            options={teamOptions}
            onChange={(event) =>
              setValues({ ...values, teamId: Number(event.target.value) })
            }
          />
        </Field>
        <Field label="작성자">
          <Select
            value={String(values.authorId)}
            options={authorOptions}
            onChange={(event) =>
              setValues({ ...values, authorId: Number(event.target.value) })
            }
          />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="지시일">
          <Input
            type="date"
            value={values.instructionDate}
            onChange={(event) =>
              setValues({ ...values, instructionDate: event.target.value })
            }
          />
        </Field>
        <Field label="마감일">
          <Input
            type="date"
            value={values.dueDate}
            onChange={(event) =>
              setValues({ ...values, dueDate: event.target.value })
            }
          />
        </Field>
      </div>

      <Field label="선행 업무">
        <div className="grid gap-2 rounded-2xl border border-dashed border-border bg-muted/20 p-4">
          {dependencyCandidates.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              연결할 선행 업무가 없습니다.
            </p>
          ) : (
            dependencyCandidates.map((dependency) => (
              <label
                key={dependency.id}
                className="flex items-start gap-3 rounded-xl bg-background px-3 py-3 text-sm"
              >
                <Checkbox
                  checked={values.dependencyIds.includes(dependency.id)}
                  onChange={(event) =>
                    toggleDependency(dependency.id, event.target.checked)
                  }
                />
                <span className="space-y-1">
                  <span className="block font-medium">{dependency.title}</span>
                  <span className="block text-xs text-muted-foreground">
                    현재 상태: {getWorklogStatusLabel(dependency.status)}
                  </span>
                </span>
              </label>
            ))
          )}
        </div>
        {incompleteDependencies.length > 0 && values.status === "IN_PROGRESS" ? (
          <p className="text-xs text-warning-foreground">
            선행 업무가 아직 완료되지 않았습니다. 현재 와이어프레임에서는 경고만 하고
            저장은 허용합니다.
          </p>
        ) : null}
        {circularDependencyDetected ? (
          <p className="text-xs text-destructive">
            순환 의존성이 감지되었습니다. A → B → C → A 형태의 연결은 저장되지
            않습니다.
          </p>
        ) : null}
      </Field>

      <Field label="첨부 파일 (mock)">
        <Textarea
          value={values.attachmentNames.join("\n")}
          onChange={(event) =>
            setValues({
              ...values,
              attachmentNames: event.target.value
                .split("\n")
                .map((item) => item.trim())
                .filter(Boolean),
            })
          }
          placeholder="파일명을 줄바꿈으로 입력하세요. 예) requirements-v2.pdf"
        />
      </Field>

      <Field label="AI 처리 옵션">
        <label className="flex items-center gap-3 rounded-xl border border-dashed border-border bg-muted/20 px-4 py-3 text-sm">
          <Checkbox
            checked={values.aiRegenerate}
            onChange={(event) =>
              setValues({ ...values, aiRegenerate: event.target.checked })
            }
          />
          <span>
            저장 후 AI 요약/태그/임베딩 재생성 mock 상태를 시작합니다.
          </span>
        </label>
      </Field>

      {submitError ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {submitError}
        </div>
      ) : null}

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
