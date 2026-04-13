import { useState } from "react";
import type { UserEvaluation } from "@/app/user/_types/user.types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export function EvaluationList({
  evaluations,
  canWrite = false,
  onCreate,
}: {
  evaluations: UserEvaluation[];
  canWrite?: boolean;
  onCreate?: (content: string) => Promise<void>;
}) {
  const [draft, setDraft] = useState("");

  return (
    <Card>
      <CardHeader>
        <CardTitle>관리자 평가</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
              placeholder="업무 수행 강점, 협업 메모, 보완 포인트를 기록하세요."
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
          evaluations.map((evaluation) => (
            <div key={evaluation.id} className="rounded-lg bg-muted/40 p-4">
              <p className="text-sm leading-6">{evaluation.content}</p>
              <p className="mt-2 text-xs text-muted-foreground">{evaluation.createdAt}</p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
