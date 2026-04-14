import { PageHeader } from "@/app/_common/components/PageHeader";
import { useAuth } from "@/app/_common/hooks/useAuth";
import { canManageTags } from "@/app/_common/service/access-control";
import { TagManager } from "@/app/tag/_components/TagManager";

export default function TagPage() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="태그"
        description="AI가 재사용하는 관리형 태그 풀을 검토하고, 병합 후보와 신규 태그 검토 흐름을 와이어프레임으로 확인합니다."
      />
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[20px] font-semibold tracking-[-0.04em] text-foreground">태그 현황</h2>
        </div>
        <TagManager canManage={canManageTags(user)} />
      </div>
    </div>
  );
}
