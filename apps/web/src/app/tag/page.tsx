import { PageHeader } from "@/app/_common/components/PageHeader";
import { LegendHelpDialog } from "@/app/_common/components/LegendHelpDialog";
import { useAuth } from "@/app/_common/hooks/useAuth";
import { canManageTags } from "@/app/_common/service/access-control";
import { TagManager } from "@/app/tag/_components/TagManager";
import { TagStateBadge } from "@/app/tag/_components/TagStateBadge";

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
          <LegendHelpDialog
            title="태그 아이콘 안내"
            description="태그 카드에서 보이는 상태 아이콘 의미를 확인할 수 있습니다."
            buttonLabel="태그 아이콘 안내 열기"
            align="end"
            sections={[
              {
                title: "태그 상태",
                content: [
                  <TagStateBadge key="ACTIVE" state="ACTIVE" />,
                  <TagStateBadge key="REVIEW" state="REVIEW" />,
                  <TagStateBadge key="MERGE_CANDIDATE" state="MERGE_CANDIDATE" />,
                ],
              },
            ]}
            className="h-10 w-10"
          />
        </div>
        <TagManager canManage={canManageTags(user)} />
      </div>
    </div>
  );
}
