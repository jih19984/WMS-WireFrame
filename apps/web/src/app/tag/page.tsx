import { PageHeader } from "@/app/_common/components/PageHeader";
import { TagManager } from "@/app/tag/_components/TagManager";

export default function TagPage() {
  return (
    <>
      <PageHeader title="태그 관리" description="관리형 태그 풀을 확인하고 mock 신규 태그를 추가할 수 있습니다." />
      <TagManager />
    </>
  );
}
