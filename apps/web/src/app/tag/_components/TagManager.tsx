import { useState } from "react";
import { useTag } from "@/app/tag/_hooks/useTag";
import { tagService } from "@/app/tag/_service/tag.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export function TagManager() {
  const { tags, refresh } = useTag();
  const [name, setName] = useState("");
  const [category, setCategory] = useState<"AI" | "업무" | "기술" | "부서">("업무");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>태그 생성</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-[1fr_180px_auto]">
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
            onClick={async () => {
              if (!name) return;
              await tagService.create(name, category);
              setName("");
              await refresh();
            }}
          >
            추가
          </Button>
        </CardContent>
      </Card>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {tags.map((tag) => (
          <Card key={tag.id}>
            <CardContent className="space-y-2 p-4">
              <p className="font-medium">#{tag.name}</p>
              <p className="text-sm text-muted-foreground">{tag.category} / {tag.usageCount}회 사용</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
