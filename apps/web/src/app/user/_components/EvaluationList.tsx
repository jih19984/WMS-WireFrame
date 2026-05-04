import { useState } from "react";
import { departments, users } from "@/app/_common/service/mock-db";
import type { UserEvaluation } from "@/app/user/_types/user.types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { formatDateTime } from "@/lib/utils";

export function EvaluationList({
  evaluations,
  canWrite = false,
  onCreate,
  onUpdate,
  embedded = false,
}: {
  evaluations: UserEvaluation[];
  canWrite?: boolean;
  onCreate?: (content: string) => Promise<void>;
  onUpdate?: (evaluationId: number, content: string) => Promise<void>;
  embedded?: boolean;
}) {
  const [draft, setDraft] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [detailEvaluation, setDetailEvaluation] = useState<UserEvaluation | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState("");

  const startEdit = (evaluation: UserEvaluation) => {
    setDetailEvaluation(null);
    setEditingId(evaluation.id);
    setEditDraft(evaluation.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditDraft("");
  };

  const createEvaluation = async () => {
    const content = draft.trim();
    if (!content || !onCreate) return;

    await onCreate(content);
    setDraft("");
    setIsCreateDialogOpen(false);
  };

  const updateEvaluation = async () => {
    const content = editDraft.trim();
    if (!content || !onUpdate || editingId === null) return;

    await onUpdate(editingId, content);
    cancelEdit();
  };

  const getEvaluatorName = (evaluatorId: number) =>
    users.find((user) => user.id === evaluatorId)?.name ?? "알 수 없음";

  const getEvaluatorDepartmentName = (evaluatorId: number) => {
    const evaluator = users.find((user) => user.id === evaluatorId);
    if (!evaluator) return "소속 부서 없음";

    return (
      departments.find((department) => department.id === evaluator.departmentId)?.name ??
      "소속 부서 없음"
    );
  };

  const editingEvaluation =
    evaluations.find((evaluation) => evaluation.id === editingId) ?? null;

  const content = (
    <div className="space-y-4">
      {evaluations.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-muted/20 p-5 text-sm text-muted-foreground">
          등록된 평가가 없습니다.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border/70 bg-card/80 shadow-[0_16px_48px_-36px_rgba(15,23,42,0.45)]">
          <div className="overflow-x-auto">
            <div className="min-w-[980px]">
            <div className="border-b border-border/70 bg-muted/25 px-6">
              <div className="grid grid-cols-4 gap-4 py-3 text-center text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                <span>평가일</span>
                <span>평가자</span>
                <span>소속 부서</span>
                <span>액션</span>
              </div>
            </div>
            <div className="divide-y divide-border/60">
              {evaluations.map((evaluation) => {
                const evaluatorName = getEvaluatorName(evaluation.evaluatorId);
                const evaluatorDepartmentName = getEvaluatorDepartmentName(
                  evaluation.evaluatorId,
                );
                const evaluationDate = evaluation.updatedAt ?? evaluation.createdAt;

                return (
                  <div
                    key={evaluation.id}
                    className="px-6 transition-colors hover:bg-muted/20"
                  >
                    <div className="grid grid-cols-4 items-center gap-4 py-4">
                      <p className="text-center text-[15px] font-semibold tracking-[-0.03em] text-foreground">
                        {formatDateTime(evaluationDate)}
                      </p>
                      <p className="min-w-0 truncate text-center text-sm font-semibold text-foreground">
                        {evaluatorName}
                      </p>
                      <p className="min-w-0 truncate text-center text-sm text-muted-foreground">
                        {evaluatorDepartmentName}
                      </p>
                      <div className="flex justify-center">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setDetailEvaluation(evaluation)}
                        >
                          상세보기
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            </div>
          </div>
        </div>
      )}
      <Dialog
        open={isCreateDialogOpen}
        onOpenChange={(open) => {
          setIsCreateDialogOpen(open);
          if (!open) setDraft("");
        }}
      >
        <DialogContent className="max-w-3xl p-7">
          <DialogHeader>
            <DialogTitle>평가 등록</DialogTitle>
            <DialogDescription>
              작성된 평가는 대상자 본인에게는 공개되지 않는 관리자 메모로 취급합니다.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 rounded-xl border border-dashed border-border bg-muted/20 p-4">
            <div>
              <p className="text-sm font-medium">평가 메모 작성</p>
              <p className="mt-1 text-xs text-muted-foreground">
                업무 수행 강점, 작업 메모, 보완 포인트를 기록하세요.
              </p>
            </div>
            <Textarea
              className="min-h-44"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="업무 수행 강점, 작업 메모, 보완 포인트를 기록하세요."
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              취소
            </Button>
            <Button type="button" disabled={!draft.trim()} onClick={createEvaluation}>
              평가 저장
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
        open={Boolean(editingEvaluation)}
        onOpenChange={(open) => {
          if (!open) cancelEdit();
        }}
      >
        {editingEvaluation ? (
          <DialogContent className="max-w-3xl p-7">
            <DialogHeader>
              <DialogTitle>평가 수정</DialogTitle>
              <DialogDescription>
                기존 관리자 평가 내용을 수정합니다.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 rounded-xl border border-dashed border-border bg-muted/20 p-4">
              <div>
                <p className="text-sm font-medium">평가 메모 수정</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  기존 내용을 확인하고 필요한 부분만 수정하세요.
                </p>
              </div>
              <Textarea
                className="min-h-44"
                value={editDraft}
                onChange={(event) => setEditDraft(event.target.value)}
                placeholder="관리자 평가 내용을 수정하세요."
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={cancelEdit}>
                취소
              </Button>
              <Button type="button" disabled={!editDraft.trim()} onClick={updateEvaluation}>
                수정 저장
              </Button>
            </DialogFooter>
          </DialogContent>
        ) : null}
      </Dialog>
      <Dialog
        open={Boolean(detailEvaluation)}
        onOpenChange={(open) => {
          if (!open) setDetailEvaluation(null);
        }}
      >
        {detailEvaluation ? (
          <DialogContent className="max-w-3xl p-7">
            <DialogHeader>
              <DialogTitle>평가 상세</DialogTitle>
              <DialogDescription>
                관리자 전용 평가 내용을 읽기 전용으로 확인합니다.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid gap-3 rounded-xl border border-border/70 bg-muted/20 p-4 sm:grid-cols-2">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                    평가일
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {formatDateTime(detailEvaluation.updatedAt ?? detailEvaluation.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                    평가자
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {getEvaluatorName(detailEvaluation.evaluatorId)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {getEvaluatorDepartmentName(detailEvaluation.evaluatorId)}
                  </p>
                </div>
              </div>
              <div className="rounded-xl border border-border/70 bg-card p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  평가 내용
                </p>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-foreground">
                  {detailEvaluation.content}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDetailEvaluation(null)}
              >
                닫기
              </Button>
              {canWrite ? (
                <Button type="button" onClick={() => startEdit(detailEvaluation)}>
                  수정하기
                </Button>
              ) : null}
            </DialogFooter>
          </DialogContent>
        ) : null}
      </Dialog>
    </div>
  );

  if (embedded) {
    return (
      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-[18px] font-semibold tracking-[-0.04em] text-foreground">
              관리자 평가
            </h3>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              관리자 전용 평가 메모를 작성하고 기존 내용을 행별로 수정합니다.
            </p>
          </div>
          {canWrite ? (
            <Button type="button" onClick={() => setIsCreateDialogOpen(true)}>
              평가 등록
            </Button>
          ) : null}
        </div>
        {content}
      </section>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>관리자 평가</CardTitle>
          {canWrite ? (
            <Button type="button" onClick={() => setIsCreateDialogOpen(true)}>
              평가 등록
            </Button>
          ) : null}
        </div>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
}
