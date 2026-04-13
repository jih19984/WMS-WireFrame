import { Badge } from "@/components/ui/badge";

export function SkillEditor({
  skills,
}: {
  skills: { name: string; level: number; selfRated: boolean }[];
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {skills.map((skill) => (
        <div key={skill.name} className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="font-medium">{skill.name}</p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Lv.{skill.level}</Badge>
              <Badge variant={skill.selfRated ? "outline" : "success"}>
                {skill.selfRated ? "자가 평가" : "관리자 조정"}
              </Badge>
            </div>
          </div>
          <div className="mt-3 h-2 rounded-full bg-muted">
            <div className="h-2 rounded-full bg-primary" style={{ width: `${skill.level * 20}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
