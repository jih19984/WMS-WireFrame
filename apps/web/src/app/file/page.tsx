import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  Download,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";
import { PageHeader } from "@/app/_common/components/PageHeader";
import { Pagination } from "@/app/_common/components/Pagination";
import { ConfirmDialog } from "@/app/_common/components/ConfirmDialog";
import { LegendHelpDialog } from "@/app/_common/components/LegendHelpDialog";
import { usePagination } from "@/app/_common/hooks/usePagination";
import { useFile } from "@/app/file/_hooks/useFile";
import { FileAiStatusBadge } from "@/app/file/_components/FileAiStatusBadge";
import { FileFilters } from "@/app/file/_components/FileFilters";
import { FileList } from "@/app/file/_components/FileList";
import { fileAiStatusLegendOrder } from "@/app/file/_components/file-ai-badge-config";
import type { FileFiltersValue, FileItem } from "@/app/file/_types/file.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function FilePage() {
  const { files, deleteFile } = useFile();
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FileFiltersValue>({
    type: "ALL",
    period: "ALL",
    aiStatus: "ALL",
  });
  const [deleteTarget, setDeleteTarget] = useState<FileItem | null>(null);
  const [selectedFileIds, setSelectedFileIds] = useState<number[]>([]);
  const activeFilterCount = Object.values(filters).filter(
    (value) => value !== "ALL",
  ).length;

  const fileTypes = useMemo(
    () => Array.from(new Set(files.map((file) => file.type))).sort(),
    [files]
  );

  const filteredFiles = useMemo(() => {
    const now = new Date("2026-04-09T23:59:59");
    const normalizedQuery = query.trim().toLowerCase();
    return files.filter((file) => {
      const matchesType = filters.type === "ALL" || file.type === filters.type;
      const matchesKeyword =
        !normalizedQuery ||
        file.summaryPreview.toLowerCase().includes(normalizedQuery) ||
        file.originalName.toLowerCase().includes(normalizedQuery);
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
  }, [files, filters, query]);
  const filePagination = usePagination(filteredFiles, 6);
  const pageFileIds = filePagination.items.map((file) => file.id);
  const selectedFiles = filteredFiles.filter((file) => selectedFileIds.includes(file.id));
  const isAllCurrentPageSelected =
    pageFileIds.length > 0 && pageFileIds.every((id) => selectedFileIds.includes(id));

  useEffect(() => {
    const visibleIds = new Set(filteredFiles.map((file) => file.id));
    setSelectedFileIds((current) => current.filter((id) => visibleIds.has(id)));
  }, [filteredFiles]);

  const handleToggleSelect = (fileId: number, checked: boolean) => {
    setSelectedFileIds((current) =>
      checked ? Array.from(new Set([...current, fileId])) : current.filter((id) => id !== fileId),
    );
  };

  const handleToggleSelectAllCurrentPage = (checked: boolean) => {
    setSelectedFileIds((current) => {
      if (checked) {
        return Array.from(new Set([...current, ...pageFileIds]));
      }
      return current.filter((id) => !pageFileIds.includes(id));
    });
  };

  const handleBulkDownload = () => {
    selectedFiles.forEach((file) => {
      const blob = new Blob(
        [
          `파일명: ${file.originalName}\n형식: ${file.type}\n크기: ${file.size}\n업로드일: ${file.uploadedAt}\nAI 상태: ${file.aiStatus}\n요약: ${file.summaryPreview}\n`,
        ],
        { type: "text/plain;charset=utf-8" },
      );
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = file.originalName;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    });
  };

  const handleBulkDelete = async () => {
    for (const fileId of selectedFileIds) {
      await deleteFile(fileId);
    }
    setSelectedFileIds([]);
    setDeleteTarget(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="파일" />
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[20px] font-semibold tracking-[-0.04em] text-foreground">파일 탐색</h2>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="h-12 pl-11"
                placeholder="파일명, AI 요약 키워드로 검색하세요"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="h-10"
                onClick={() => setShowFilters((prev) => !prev)}
              >
                <SlidersHorizontal className="size-4" />
                필터
                {activeFilterCount > 0 ? (
                  <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground">
                    {activeFilterCount}
                  </span>
                ) : null}
                <ChevronDown
                  className={cn(
                    "ml-1 size-4 transition-transform duration-300 ease-out",
                    showFilters && "rotate-180",
                  )}
                />
              </Button>
            </div>
          </div>

          <div
            className={cn(
              "grid overflow-hidden transition-[grid-template-rows,opacity,margin] duration-300 ease-out",
              showFilters
                ? "mt-0 grid-rows-[1fr] opacity-100"
                : "mt-[-4px] grid-rows-[0fr] opacity-0",
            )}
          >
            <div className="overflow-hidden">
              <div className="space-y-4 pt-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                    File Filters
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9"
                    aria-label="필터 초기화"
                    onClick={() => {
                      setQuery("");
                      setFilters({
                        type: "ALL",
                        period: "ALL",
                        aiStatus: "ALL",
                      });
                    }}
                  >
                    <RefreshCw className="size-4" />
                  </Button>
                </div>
                <FileFilters value={filters} onChange={setFilters} fileTypes={fileTypes} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-2 space-y-4">
        <div className="worklog-divider-top" />
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium">표시 중인 파일</span>
          <span className="text-lg font-semibold text-foreground">{filteredFiles.length}건</span>
          <label className="ml-4 inline-flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={isAllCurrentPageSelected}
              onChange={(event) => handleToggleSelectAllCurrentPage(event.target.checked)}
              className="size-4 rounded border border-border"
            />
            <span>현재 페이지 전체 선택</span>
          </label>
          {selectedFileIds.length > 0 ? (
            <span className="text-sm font-medium text-foreground">선택 {selectedFileIds.length}건</span>
          ) : null}
          <LegendHelpDialog
            title="AI 상태 안내"
            description="파일 AI 요약 파이프라인 상태를 아이콘과 이름으로 확인할 수 있습니다."
            buttonLabel="AI 상태 도움말"
            className="h-8 w-8"
            sections={[
              {
                title: "AI 상태",
                content: (
                  <>
                    {fileAiStatusLegendOrder.map((status) => (
                      <FileAiStatusBadge key={status} status={status} />
                    ))}
                  </>
                ),
              },
            ]}
          />
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="secondary"
              className="h-11 min-w-28 px-5 text-sm font-semibold"
              type="button"
              disabled={selectedFileIds.length === 0}
              onClick={handleBulkDownload}
            >
              <Download className="size-4" />
              다운로드
            </Button>
            <Button
              variant="default"
              className="h-11 min-w-28 px-5 text-sm font-semibold"
              type="button"
              disabled={selectedFileIds.length === 0}
              onClick={() => setDeleteTarget(selectedFiles[0] ?? null)}
            >
              <Trash2 className="size-4" />
              삭제
            </Button>
          </div>
        </div>
        <FileList
          files={filePagination.items}
          selectedIds={selectedFileIds}
          onToggleSelect={handleToggleSelect}
        />
        <Pagination
          page={filePagination.page}
          totalPages={filePagination.totalPages}
          onPageChange={filePagination.setPage}
        />
      </div>
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="파일을 삭제할까요?"
        description="소프트 삭제 처리되며, 운영 기준으로는 Object Storage 파일과 벡터 임베딩도 함께 삭제되는 흐름입니다."
        confirmText={selectedFileIds.length > 1 ? `선택 ${selectedFileIds.length}건 삭제` : "삭제"}
        tone="destructive"
        onConfirm={handleBulkDelete}
      >
        {deleteTarget ? (
          <div className="rounded-lg bg-muted/40 px-4 py-3 text-sm">
            {selectedFileIds.length > 1 ? (
              <>
                <p className="font-medium">선택한 파일 {selectedFileIds.length}건을 삭제합니다.</p>
                <p className="mt-1 text-muted-foreground">
                  삭제 후에는 파일 목록과 AI 파이프라인 연동 대상에서 제외됩니다.
                </p>
              </>
            ) : (
              <>
                <p className="font-medium">{deleteTarget.originalName}</p>
                <p className="mt-1 text-muted-foreground">{deleteTarget.type} / {deleteTarget.size}</p>
              </>
            )}
          </div>
        ) : null}
      </ConfirmDialog>
    </div>
  );
}
