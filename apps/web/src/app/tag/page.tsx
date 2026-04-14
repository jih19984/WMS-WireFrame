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
