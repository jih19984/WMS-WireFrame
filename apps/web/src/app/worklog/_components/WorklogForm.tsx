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
  const controlClassName = "border-black/80 dark:border-white/80";
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
      className="registration-surface flex max-w-3xl flex-col"
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
      <Field label="제목" description="업무의 제목을 간결하게 작성하세요.">
        <Input
          className={controlClassName}
          value={values.title}
          onChange={(event) => setValues({ ...values, title: event.target.value })}
        />
      </Field>

      <Field label="요청/지시 내용" description="이 업무를 수행해야 하는 목적과 배경을 작성합니다.">
        <Textarea
          value={values.requestContent}
          onChange={(event) =>
            setValues({ ...values, requestContent: event.target.value })
          }
          className={`min-h-[120px] ${controlClassName}`}
        />
      </Field>

      <Field label="업무 내용" description="실제로 수행할 업무의 상세 내용입니다.">
        <Textarea
          value={values.workContent}
          onChange={(event) =>
            setValues({ ...values, workContent: event.target.value })
          }
          className={`min-h-[160px] ${controlClassName}`}
        />
      </Field>

      <Field label="상태 및 중요도" description="현재 업무의 진행 상태와 우선순위를 지정합니다.">
        <div className="flex w-full items-center gap-4">
          <Select
            className={controlClassName}
            value={values.status}
            options={[
              { label: getWorklogStatusLabel("PENDING"), value: "PENDING" },
              { label: getWorklogStatusLabel("IN_PROGRESS"), value: "IN_PROGRESS" },
              { label: getWorklogStatusLabel("DONE"), value: "DONE" },
              { label: getWorklogStatusLabel("ON_HOLD"), value: "ON_HOLD" },
              { label: getWorklogStatusLabel("CANCELLED"), value: "CANCELLED" },
            ]}
            onChange={(event) =>
              setValues({ ...values, status: event.target.value as WorklogFormValues["status"] })
            }
          />
          <Select
            className={controlClassName}
            value={values.importance}
            options={[
              { label: getImportanceLabel("URGENT"), value: "URGENT" },
              { label: getImportanceLabel("HIGH"), value: "HIGH" },
              { label: getImportanceLabel("NORMAL"), value: "NORMAL" },
              { label: getImportanceLabel("LOW"), value: "LOW" },
            ]}
            onChange={(event) =>
              setValues({ ...values, importance: event.target.value as WorklogFormValues["importance"] })
            }
          />
        </div>
      </Field>

      <Field label="담당자 및 시간" description="업무를 담당할 팀, 담당자와 예상/실제 소요 시간을 기록합니다.">
        <div className="flex w-full items-center gap-4">
          <Select
            className={controlClassName}
            value={String(values.teamId)}
            options={teamOptions}
            onChange={(event) => setValues({ ...values, teamId: Number(event.target.value) })}
          />
          <Select
            className={controlClassName}
            value={String(values.authorId)}
            options={authorOptions}
            onChange={(event) => setValues({ ...values, authorId: Number(event.target.value) })}
          />
          <Input
            className={controlClassName}
            type="number"
            min={0}
            step={0.5}
            value={values.actualHours}
            onChange={(event) => setValues({ ...values, actualHours: Number(event.target.value) })}
            placeholder="시간 (예: 1.5)"
          />
        </div>
      </Field>

      <Field label="진행 일정" description="지시일 및 마감일을 지정하세요.">
        <div className="flex w-full items-center gap-4">
          <Input
            className={controlClassName}
            type="date"
            value={values.instructionDate}
            onChange={(event) => setValues({ ...values, instructionDate: event.target.value })}
          />
          <span className="text-muted-foreground">~</span>
          <Input
            className={controlClassName}
            type="date"
            value={values.dueDate}
            onChange={(event) => setValues({ ...values, dueDate: event.target.value })}
          />
        </div>
      </Field>

      <Field label="선행 업무" description="이 업무를 시작하기 전에 완료되어야 하는 업무를 선택하세요.">
        <div className="registration-panel grid gap-2 rounded-xl border border-white/10 bg-white/5 p-4">
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

      <Field label="첨부 파일" description="업무와 관련된 참고 문서를 등록합니다. (임시 모의 기능)">
        <Textarea
          className={controlClassName}
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

      <Field label="AI 처리 옵션" description="저장 시 텍스트 요약, 태그 추출 및 시맨틱 임베딩 작업을 배경에서 시작합니다.">
        <label className="registration-panel flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm transition-all hover:bg-white/10">
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

      <div className="mt-8">
        <Button type="submit" size="lg" className="w-full sm:w-auto font-semibold">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

function Field({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 border-b border-white/5 py-6 last:border-0">
      <div className="space-y-1">
        <label className="text-[15px] font-[600] text-foreground">{label}</label>
        {description ? <p className="text-[13px] text-muted-foreground">{description}</p> : null}
      </div>
      <div>
        {children}
      </div>
    </div>
  );
}
