import type { FileItem } from "@/app/file/_types/file.types";
import { FileCard } from "@/app/file/_components/FileCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function FileList({
  files,
  title,
  description,
  onDelete,
  totalCount,
}: {
  files: FileItem[];
  title: string;
  description: string;
  onDelete: (file: FileItem) => void;
  totalCount?: number;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>{title}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
          <Badge variant="outline">{totalCount ?? files.length}건</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {files.length === 0 ? (
          <div className="workspace-empty rounded-xl px-6 py-10 text-center text-sm">
            조건에 맞는 파일이 없습니다.
          </div>
        ) : (
          files.map((file) => <FileCard key={file.id} file={file} onDelete={onDelete} />)
        )}
      </CardContent>
    </Card>
  );
}
