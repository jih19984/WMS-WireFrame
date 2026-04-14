import type { FileItem } from "@/app/file/_types/file.types";
import { FileCard } from "@/app/file/_components/FileCard";

export function FileList({
  files,
  selectedIds,
  onToggleSelect,
}: {
  files: FileItem[];
  selectedIds: number[];
  onToggleSelect: (fileId: number, checked: boolean) => void;
}) {
  return (
    <div className="workspace-list worklog-divider-top gap-0">
      {files.length === 0 ? (
        <div className="workspace-empty rounded-xl px-6 py-10 text-center text-sm">
          조건에 맞는 파일이 없습니다.
        </div>
      ) : (
        files.map((file) => (
          <FileCard
            key={file.id}
            file={file}
            selected={selectedIds.includes(file.id)}
            onToggleSelect={onToggleSelect}
          />
        ))
      )}
    </div>
  );
}
