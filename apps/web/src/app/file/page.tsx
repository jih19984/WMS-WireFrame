import { useMemo, useState } from "react";
import { Files } from "lucide-react";
import { PageHeader } from "@/app/_common/components/PageHeader";
import { Pagination } from "@/app/_common/components/Pagination";
import { ConfirmDialog } from "@/app/_common/components/ConfirmDialog";
import { usePagination } from "@/app/_common/hooks/usePagination";
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
    aiStatus: "ALL",
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
        file.summaryPreview.toLowerCase().includes(filters.summaryKeyword.toLowerCase()) ||
        file.originalName.toLowerCase().includes(filters.summaryKeyword.toLowerCase());
      const matchesAiStatus =
        filters.aiStatus === "ALL" || file.aiStatus === filters.aiStatus;
      const uploadedAt = new Date(file.uploadedAt);
      const diffDays = Math.floor((now.getTime() - uploadedAt.getTime()) / (1000 * 60 * 60 * 24));
      const matchesPeriod =
        filters.period === "ALL" ||
        (filters.period === "7D" && diffDays <= 7) ||
        (filters.period === "30D" && diffDays <= 30) ||
        (filters.period === "90D" && diffDays <= 90);
      return matchesType && matchesKeyword && matchesPeriod && matchesAiStatus;
    });
  }, [files, filters]);

  const processingFiles = filteredFiles.filter((file) => file.aiStatus === "PENDING" || file.aiStatus === "PROCESSING");
  const completedFiles = filteredFiles.filter((file) => file.aiStatus === "DONE");
  const failedFiles = filteredFiles.filter((file) => file.aiStatus === "FAILED");
  const processingPagination = usePagination(processingFiles, 3);
  const completedPagination = usePagination(completedFiles, 3);
  const failedPagination = usePagination(failedFiles, 3);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="파일 관리" />
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[20px] font-semibold tracking-[-0.04em] text-foreground">파일 검색 및 필터</h2>
        </div>
        <Card>
          <CardContent className="grid gap-4 p-5">
            <FileFilters value={filters} onChange={setFilters} fileTypes={fileTypes} />
            <div className="flex items-start gap-3 rounded-xl border border-border/70 bg-muted/35 px-4 py-3 text-xs leading-6 text-muted-foreground">
              <Files className="mt-0.5 size-4 shrink-0 text-primary" />
              <p>
              파일 삭제는 mock 기준으로 소프트 삭제 처리되며, 운영 기준으로는 Object Storage 파일과 벡터 임베딩도 함께 정리되는 흐름입니다.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-6 mt-4">
        <FileList
          files={processingPagination.items}
          title="AI 요약 생성중 파일"
          description="현재 OCR, 요약, 임베딩 파이프라인이 처리 중인 파일입니다."
          onDelete={setDeleteTarget}
          totalCount={processingFiles.length}
        />
        <Pagination
          page={processingPagination.page}
          totalPages={processingPagination.totalPages}
          onPageChange={processingPagination.setPage}
        />
        <FileList
          files={completedPagination.items}
          title="AI 요약 완료 파일"
          description="요약이 생성되어 바로 미리보기를 확인할 수 있는 파일입니다."
          onDelete={setDeleteTarget}
          totalCount={completedFiles.length}
        />
        <Pagination
          page={completedPagination.page}
          totalPages={completedPagination.totalPages}
          onPageChange={completedPagination.setPage}
        />
        {failedFiles.length > 0 ? (
          <>
            <FileList
              files={failedPagination.items}
              title="AI 처리 실패 파일"
              description="재시도 또는 수동 확인이 필요한 파일입니다."
              onDelete={setDeleteTarget}
              totalCount={failedFiles.length}
            />
            <Pagination
              page={failedPagination.page}
              totalPages={failedPagination.totalPages}
              onPageChange={failedPagination.setPage}
            />
          </>
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
            <p className="font-medium">{deleteTarget.originalName}</p>
            <p className="mt-1 text-muted-foreground">{deleteTarget.type} / {deleteTarget.size}</p>
          </div>
        ) : null}
      </ConfirmDialog>
    </div>
  );
}
