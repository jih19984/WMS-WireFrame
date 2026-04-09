import type { UserEvaluation } from "@/app/user/_types/user.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function EvaluationList({ evaluations }: { evaluations: UserEvaluation[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>관리자 평가</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
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
