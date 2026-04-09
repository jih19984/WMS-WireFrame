import { files } from "@/app/_common/service/mock-db";
import { Badge } from "@/components/ui/badge";

export function FileAttachment({ fileIds }: { fileIds: number[] }) {
  const attached = files.filter((file) => fileIds.includes(file.id));

  return (
    <div className="space-y-3">
      {attached.map((file) => (
        <div key={file.id} className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-medium">{file.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{file.aiSummary}</p>
            </div>
            <Badge variant={file.aiStatus === "DONE" ? "success" : file.aiStatus === "FAILED" ? "destructive" : "secondary"}>
              {file.aiStatus}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}
