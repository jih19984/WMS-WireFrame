import { Badge } from "@/components/ui/badge";

export function SkillEditor({
  skills,
}: {
  skills: { name: string; level: number }[];
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {skills.map((skill) => (
        <div key={skill.name} className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="font-medium">{skill.name}</p>
            <Badge variant="secondary">Lv.{skill.level}</Badge>
          </div>
          <div className="mt-3 h-2 rounded-full bg-muted">
            <div className="h-2 rounded-full bg-primary" style={{ width: `${skill.level * 20}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
