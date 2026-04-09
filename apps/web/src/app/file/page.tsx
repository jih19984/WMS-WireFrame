import { useMemo, useState } from "react";
import { PageHeader } from "@/app/_common/components/PageHeader";
import { ConfirmDialog } from "@/app/_common/components/ConfirmDialog";
import { useFile } from "@/app/file/_hooks/useFile";
import { FileFilters } from "@/app/file/_components/FileFilters";
import { FileList } from "@/app/file/_components/FileList";
import type { FileFiltersValue, FileItem } from "@/app/file/_types/file.types";
import { Card, CardContent } from "@/components/ui/card";

export default function FilePage() {
  const { files, deleteFile } = useFile();
  const [filters, setFilters] = useState<FileFiltersValue>({
    type: "ALL",
    period: "ALL",
    summaryKeyword: "",
  });
  const [deleteTarget, setDeleteTarget] = useState<FileItem | null>(null);

  const fileTypes = useMemo(
    () => Array.from(new Set(files.map((file) => file.type))).sort(),
    [files]
  );

  const filteredFiles = useMemo(() => {
    const now = new Date("2026-04-09T23:59:59");
    return files.filter((file) => {
      const matchesType = filters.type === "ALL" || file.type === filters.type;
      const matchesKeyword =
        !filters.summaryKeyword ||
        file.aiSummary.toLowerCase().includes(filters.summaryKeyword.toLowerCase()) ||
        file.name.toLowerCase().includes(filters.summaryKeyword.toLowerCase());
      const uploadedAt = new Date(file.uploadedAt);
      const diffDays = Math.floor((now.getTime() - uploadedAt.getTime()) / (1000 * 60 * 60 * 24));
      const matchesPeriod =
        filters.period === "ALL" ||
        (filters.period === "7D" && diffDays <= 7) ||
        (filters.period === "30D" && diffDays <= 30) ||
        (filters.period === "90D" && diffDays <= 90);
      return matchesType && matchesKeyword && matchesPeriod;
    });
  }, [files, filters]);

  const processingFiles = filteredFiles.filter((file) => file.aiStatus === "PENDING" || file.aiStatus === "PROCESSING");
  const completedFiles = filteredFiles.filter((file) => file.aiStatus === "DONE");
  const failedFiles = filteredFiles.filter((file) => file.aiStatus === "FAILED");

  return (
    <>
      <PageHeader
        title="파일 관리"
        description="파일명, 파일 형식, 업로드일, 파일 크기, AI 요약 상태와 미리보기, 소속 업무 링크를 기준으로 파일을 관리합니다."
      />
      <Card>
        <CardContent className="grid gap-4 p-5">
          <FileFilters value={filters} onChange={setFilters} fileTypes={fileTypes} />
          <p className="text-xs leading-5 text-muted-foreground">
            파일 삭제는 mock 기준으로 소프트 삭제 처리되며, 운영 기준으로는 Object Storage 파일과 벡터 임베딩도 함께 정리되는 흐름입니다.
          </p>
        </CardContent>
      </Card>
      <div className="space-y-6">
        <FileList
          files={processingFiles}
          title="AI 요약 생성중 파일"
          description="현재 OCR, 요약, 임베딩 파이프라인이 처리 중인 파일입니다."
          onDelete={setDeleteTarget}
        />
        <FileList
          files={completedFiles}
          title="AI 요약 완료 파일"
          description="요약이 생성되어 바로 미리보기를 확인할 수 있는 파일입니다."
          onDelete={setDeleteTarget}
        />
        {failedFiles.length > 0 ? (
          <FileList
            files={failedFiles}
            title="AI 처리 실패 파일"
            description="재시도 또는 수동 확인이 필요한 파일입니다."
            onDelete={setDeleteTarget}
          />
        ) : null}
      </div>
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="파일을 삭제할까요?"
        description="소프트 삭제 처리되며, 운영 기준으로는 Object Storage 파일과 벡터 임베딩도 함께 삭제되는 흐름입니다."
        confirmText="삭제"
        tone="destructive"
        onConfirm={async () => {
          if (!deleteTarget) return;
          await deleteFile(deleteTarget.id);
          setDeleteTarget(null);
        }}
      >
        {deleteTarget ? (
          <div className="rounded-lg bg-muted/40 px-4 py-3 text-sm">
            <p className="font-medium">{deleteTarget.name}</p>
            <p className="mt-1 text-muted-foreground">{deleteTarget.type} / {deleteTarget.size}</p>
          </div>
        ) : null}
      </ConfirmDialog>
    </>
  );
}
