import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

type UserSkill = { name: string; level: number; selfRated: boolean };

const levelOptions = [1, 2, 3, 4, 5].map((level) => ({
  label: `Lv.${level}`,
  value: String(level),
}));

export function SkillEditor({
  skills,
  canManage = false,
  onSaveSkill,
}: {
  skills: UserSkill[];
  canManage?: boolean;
  onSaveSkill?: (skill: UserSkill) => Promise<void>;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [skillName, setSkillName] = useState("");
  const [skillLevel, setSkillLevel] = useState("3");
  const [editingSkillName, setEditingSkillName] = useState<string | null>(null);

  const resetDialog = () => {
    setSkillName("");
    setSkillLevel("3");
    setEditingSkillName(null);
  };

  const openCreateDialog = () => {
    resetDialog();
    setIsDialogOpen(true);
  };

  const openEditDialog = (skill: UserSkill) => {
    setEditingSkillName(skill.name);
    setSkillName(skill.name);
    setSkillLevel(String(Math.min(5, Math.max(1, skill.level))));
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    const name = skillName.trim();
    if (!name || !onSaveSkill) return;

    await onSaveSkill({
      name,
      level: Number(skillLevel),
      selfRated: false,
    });
    resetDialog();
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          스킬별 숙련도를 1~5레벨로 확인합니다.
        </p>
        {canManage ? (
          <Button
            type="button"
            size="sm"
            onClick={openCreateDialog}
          >
            <Plus className="size-4" />
            스킬 추가
          </Button>
        ) : null}
      </div>

      {skills.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-muted/20 p-5 text-sm text-muted-foreground">
          등록된 스킬이 없습니다.
        </div>
      ) : (
        <div className="grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {skills.map((skill) => {
            const level = Math.min(5, Math.max(1, skill.level));

            return (
              <div key={skill.name} className="rounded-xl border border-border bg-card px-3.5 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[16px] font-semibold tracking-[-0.03em] text-foreground">
                        {skill.name}
                      </p>
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                        Lv.{level}
                      </span>
                    </div>
                  </div>
                  {canManage ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 shrink-0 px-3"
                      onClick={() => openEditDialog(skill)}
                    >
                      수정
                    </Button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetDialog();
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingSkillName ? "스킬 수정" : "스킬 추가"}</DialogTitle>
            <DialogDescription>
              본부장/사업부장은 구성원의 스킬명과 숙련 레벨을 직접 등록할 수 있습니다.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Skill Name
              </p>
              <Input
                value={skillName}
                onChange={(event) => setSkillName(event.target.value)}
                placeholder="예: React, 데이터 모델링"
                disabled={Boolean(editingSkillName)}
              />
            </div>
            <div className="space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Level
              </p>
              <Select
                value={skillLevel}
                options={levelOptions}
                onChange={(event) => setSkillLevel(event.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              취소
            </Button>
            <Button type="button" onClick={handleSave} disabled={!skillName.trim()}>
              저장
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
