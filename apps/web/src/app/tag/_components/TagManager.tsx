import { useState } from "react";
import { useTag } from "@/app/tag/_hooks/useTag";
import { TagStateBadge } from "@/app/tag/_components/TagStateBadge";
import { tagService } from "@/app/tag/_service/tag.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

const sourceLabelMap = {
  AI: "AI 생성",
  MANUAL: "수동 생성",
} as const;

export function TagManager({ canManage }: { canManage: boolean }) {
  const { tags, refresh } = useTag();
  const [name, setName] = useState("");
  const [category, setCategory] = useState<"AI" | "업무" | "기술" | "부서">("업무");
  const mergeCandidates = tags.filter((tag) => tag.mergeState === "MERGE_CANDIDATE");
  const reviewTags = tags.filter((tag) => tag.mergeState === "REVIEW");

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl border-dashed">
        <CardContent className="grid gap-4 p-5 md:grid-cols-3">
          <div className="rounded-xl bg-muted/20 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Total Tags</p>
            <p className="mt-2 text-2xl font-semibold">{tags.length}</p>
          </div>
          <div className="rounded-xl bg-muted/20 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Merge Candidates</p>
            <p className="mt-2 text-2xl font-semibold">{mergeCandidates.length}</p>
          </div>
          <div className="rounded-xl bg-muted/20 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Review Queue</p>
            <p className="mt-2 text-2xl font-semibold">{reviewTags.length}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>태그 생성</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <p className="text-sm leading-6 text-muted-foreground">
            관리형 태그 풀은 AI가 유사 태그를 재사용하도록 돕는 기준 목록입니다. 사업부장 이상은 신규 태그를 등록하고 병합 후보를 검토할 수 있으며, 일반 구성원은 조회만 가능합니다.
          </p>
          <div className="grid gap-4 md:grid-cols-[1fr_180px_auto]">
          <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="새 태그 이름" />
          <Select
            value={category}
            options={[
              { label: "AI", value: "AI" },
              { label: "업무", value: "업무" },
              { label: "기술", value: "기술" },
              { label: "부서", value: "부서" },
            ]}
            onChange={(event) => setCategory(event.target.value as typeof category)}
          />
          <Button
            disabled={!canManage}
            onClick={async () => {
              if (!name) return;
              await tagService.create(name, category);
              setName("");
              await refresh();
            }}
          >
            추가
          </Button>
          </div>
          {!canManage ? (
            <div className="rounded-xl border border-dashed border-border bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
              현재 역할은 조회 전용입니다. 태그 생성과 병합 검토는 사업부장 이상 권한에서만 수행합니다.
            </div>
          ) : null}
        </CardContent>
      </Card>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {tags.map((tag) => (
          <Card key={tag.id} className="rounded-2xl">
            <CardContent className="space-y-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">#{tag.name}</p>
                  <p className="text-sm text-muted-foreground">{tag.category} / {tag.usageCount}회 사용</p>
                </div>
                <TagStateBadge state={tag.mergeState} />
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{sourceLabelMap[tag.source]}</Badge>
                {tag.mergeTargetId ? <Badge variant="outline">병합 대상 #{tag.mergeTargetId}</Badge> : null}
              </div>
              <div className="rounded-xl border border-dashed border-border bg-muted/20 p-3 text-sm text-muted-foreground">
                {tag.reuseHint}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
