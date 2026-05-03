import { useState } from "react";
import type { UserEvaluation } from "@/app/user/_types/user.types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

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
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState("");

  const startEdit = (evaluation: UserEvaluation) => {
    setEditingId(evaluation.id);
    setEditDraft(evaluation.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditDraft("");
  };

  const content = (
    <div className="space-y-4">
        {canWrite ? (
          <div className="space-y-3 rounded-xl border border-dashed border-border bg-muted/20 p-4">
            <div>
              <p className="text-sm font-medium">평가 메모 작성</p>
              <p className="mt-1 text-xs text-muted-foreground">
                작성된 평가는 대상자 본인에게는 공개되지 않는 관리자 메모로 취급합니다.
              </p>
            </div>
            <Textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="업무 수행 강점, 작업 메모, 보완 포인트를 기록하세요."
            />
            <div className="flex justify-end">
              <Button
                type="button"
                onClick={async () => {
                  if (!draft.trim() || !onCreate) return;
                  await onCreate(draft.trim());
                  setDraft("");
                }}
              >
                평가 저장
              </Button>
            </div>
          </div>
        ) : null}
        {evaluations.length === 0 ? (
          <p className="text-sm text-muted-foreground">등록된 평가가 없습니다.</p>
        ) : (
          evaluations.map((evaluation) => {
            const isEditing = editingId === evaluation.id;

            return (
              <div key={evaluation.id} className="rounded-lg bg-muted/40 p-4">
                {isEditing ? (
                  <div className="space-y-3">
                    <Textarea
                      value={editDraft}
                      onChange={(event) => setEditDraft(event.target.value)}
                      placeholder="관리자 평가 내용을 수정하세요."
                    />
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" size="sm" onClick={cancelEdit}>
                        취소
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        disabled={!editDraft.trim()}
                        onClick={async () => {
                          if (!editDraft.trim() || !onUpdate) return;
                          await onUpdate(evaluation.id, editDraft.trim());
                          cancelEdit();
                        }}
                      >
                        수정 저장
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm leading-6">{evaluation.content}</p>
                      {canWrite ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="shrink-0"
                          onClick={() => startEdit(evaluation)}
                        >
                          수정
                        </Button>
                      ) : null}
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {evaluation.updatedAt
                        ? `${evaluation.updatedAt} 수정됨`
                        : evaluation.createdAt}
                    </p>
                  </>
                )}
              </div>
            );
          })
        )}
    </div>
  );

  if (embedded) {
    return (
      <section className="space-y-4">
        <div>
          <h3 className="text-[18px] font-semibold tracking-[-0.04em] text-foreground">
            관리자 평가
          </h3>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            관리자 전용 평가 메모를 작성하고 기존 내용을 수정합니다.
          </p>
        </div>
        {content}
      </section>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>관리자 평가</CardTitle>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
}
