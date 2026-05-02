import { useMemo, useState } from "react";
import { Network, UserPlus, X } from "lucide-react";
import {
  RegistrationField,
  RegistrationFormPanel,
} from "@/app/_common/components/RegistrationFormPanel";
import { useAuth } from "@/app/_common/hooks/useAuth";
import { departments, users } from "@/app/_common/service/mock-db";
import type { TeamFormValues } from "@/app/team/_types/team.types";
import { Badge } from "@/components/ui/badge";
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
import { Textarea } from "@/components/ui/textarea";
import { getRoleLabel } from "@/lib/utils";

const positionFilterOptions = [
  "과장",
  "대리",
  "부장",
  "사원",
  "상무",
  "이사",
  "차장",
].map((position) => ({ label: position, value: position }));

export function TeamForm({
  initialValues,
  onSubmit,
  submitLabel,
}: {
  initialValues?: TeamFormValues;
  onSubmit: (values: TeamFormValues) => Promise<void> | void;
  submitLabel: string;
}) {
  const { user } = useAuth();
  const controlClassName = "h-14 rounded-2xl px-4 text-base";
  const textareaClassName = "min-h-[180px] rounded-2xl px-4 py-3 text-base";
  const administratorOptions = useMemo(
    () =>
      users
        .filter((member) => member.role === "DIRECTOR" || member.role === "DEPT_HEAD")
        .map((member) => ({
          label: `${member.name} / ${getRoleLabel(member.role)}`,
          value: String(member.id),
        })),
    [],
  );
  const defaultAdminId =
    user?.role === "DIRECTOR" || user?.role === "DEPT_HEAD"
      ? user.id
      : Number(administratorOptions[0]?.value ?? 0);
  const [values, setValues] = useState<TeamFormValues>(
    initialValues ?? {
      name: "",
      departmentId: 3,
      leaderId: 0,
      adminId: defaultAdminId,
      description: "",
      members: [],
      memberRoles: [],
      status: "ACTIVE",
      startDate: "2026-04-10",
      endDate: "2026-07-31",
    },
  );
  const [isMemberDialogOpen, setIsMemberDialogOpen] = useState(false);
  const [draftMemberIds, setDraftMemberIds] = useState<number[]>(values.members);
  const [memberSearch, setMemberSearch] = useState("");
  const [memberDepartmentFilter, setMemberDepartmentFilter] = useState("all");
  const [memberPositionFilter, setMemberPositionFilter] = useState("all");

  const memberDepartmentOptions = useMemo(
    () => departments.map((department) => ({ label: department.name, value: String(department.id) })),
    [],
  );
  const selectedMembers = useMemo(
    () => users.filter((user) => values.members.includes(user.id)),
    [values.members],
  );
  const selectedMemberOptions = useMemo(
    () =>
      selectedMembers.map((member) => ({
        label: `${member.name} / ${member.position}`,
        value: String(member.id),
      })),
    [selectedMembers],
  );
  const teamLeaderOptions = useMemo(
    () => [{ label: "팀장을 선택하세요", value: "0" }, ...selectedMemberOptions],
    [selectedMemberOptions],
  );
  const draftMembers = useMemo(
    () => users.filter((user) => draftMemberIds.includes(user.id)),
    [draftMemberIds],
  );
  const filteredCandidateUsers = useMemo(() => {
    const normalizedSearch = memberSearch.trim().toLowerCase();

    return users.filter((user) => {
      const departmentMatch =
        memberDepartmentFilter === "all" ||
        String(user.departmentId) === memberDepartmentFilter;
      const positionMatch =
        memberPositionFilter === "all" || user.position === memberPositionFilter;
      const queryMatch =
        !normalizedSearch || user.name.toLowerCase().includes(normalizedSearch);

      return departmentMatch && positionMatch && queryMatch;
    });
  }, [memberDepartmentFilter, memberPositionFilter, memberSearch]);

  const openMemberDialog = () => {
    setDraftMemberIds(values.members);
    setIsMemberDialogOpen(true);
  };

  const addDraftMember = (memberId: number) => {
    setDraftMemberIds((current) =>
      current.includes(memberId) ? current : [...current, memberId],
    );
  };

  const removeDraftMember = (memberId: number) => {
    setDraftMemberIds((current) => current.filter((id) => id !== memberId));
  };

  const getMemberTeamRole = (memberId: number) =>
    values.memberRoles.find((item) => item.userId === memberId)?.role ?? "";

  const updateMemberTeamRole = (memberId: number, role: string) => {
    setValues((current) => {
      const hasRole = current.memberRoles.some((item) => item.userId === memberId);

      return {
        ...current,
        memberRoles: hasRole
          ? current.memberRoles.map((item) =>
              item.userId === memberId ? { ...item, role } : item,
            )
          : [...current.memberRoles, { userId: memberId, role }],
      };
    });
  };

  const removeSelectedMember = (memberId: number) => {
    setValues((current) => {
      const nextMembers = current.members.filter((id) => id !== memberId);

      return {
        ...current,
        leaderId: current.leaderId === memberId ? 0 : current.leaderId,
        members: nextMembers,
        memberRoles: current.memberRoles.filter((item) => item.userId !== memberId),
      };
    });
  };

  const saveDraftMembers = () => {
    setValues((current) => {
      return {
        ...current,
        leaderId: draftMemberIds.includes(current.leaderId) ? current.leaderId : 0,
        members: draftMemberIds,
        memberRoles: draftMemberIds.map((userId) => ({
          userId,
          role: current.memberRoles.find((item) => item.userId === userId)?.role ?? "",
        })),
      };
    });
    setIsMemberDialogOpen(false);
  };

  return (
    <>
      <form
        className="registration-surface w-full max-w-[1480px] pb-10"
        onSubmit={async (event) => {
          event.preventDefault();
          await onSubmit(values);
        }}
      >
        <RegistrationFormPanel
          eyebrow="TEAM WORKFLOW"
          title="팀 정보 및 운영 설정"
          icon={<Network className="size-4" />}
          className="min-h-[720px]"
        >
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1.25fr)_minmax(420px,0.9fr)]">
            <div className="space-y-5">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                기본 정보
              </p>
              <RegistrationField label="팀명">
                <Input
                  className={controlClassName}
                  placeholder="팀명을 입력하세요"
                  value={values.name}
                  onChange={(event) => setValues({ ...values, name: event.target.value })}
                />
              </RegistrationField>
              <RegistrationField label="팀 설명">
                <Textarea
                  className={textareaClassName}
                  placeholder="팀의 목적과 운영 범위를 작성하세요"
                  value={values.description}
                  onChange={(event) =>
                    setValues({ ...values, description: event.target.value })
                  }
                />
              </RegistrationField>
              <RegistrationField label="사용자 추가">
                <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-[15px] font-semibold text-foreground">
                        팀 구성원
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        부서가 다른 사용자도 같은 팀에 추가할 수 있습니다.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      className="h-11 rounded-2xl px-5 font-semibold"
                      onClick={openMemberDialog}
                    >
                      <UserPlus className="size-4" />
                      사용자 검색/추가
                    </Button>
                  </div>

                  {selectedMembers.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {selectedMembers.map((member) => (
                        <Badge
                          key={member.id}
                          variant="outline"
                          className="gap-2 rounded-full px-3 py-1.5 text-[12px]"
                        >
                          {member.name}
                          <button
                            type="button"
                            className="rounded-full text-muted-foreground transition-colors hover:text-foreground"
                            aria-label={`${member.name} 제거`}
                            onClick={() => removeSelectedMember(member.id)}
                          >
                            <X className="size-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-4 rounded-2xl border border-dashed border-border/70 bg-background/40 px-4 py-5 text-sm text-muted-foreground">
                      아직 등록된 팀 구성원이 없습니다. 사용자 검색/추가에서 구성원을 선택해주세요.
                    </div>
                  )}
                </div>
              </RegistrationField>
              <RegistrationField label="팀 역할 설정">
                <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
                  <div className="space-y-1">
                    <p className="text-[15px] font-semibold text-foreground">
                      팀 운영 책임과 팀 내 역할
                    </p>
                    <p className="text-sm text-muted-foreground">
                      팀장과 관리자를 지정하고, 팀원마다 이 팀에서 맡는 역할을 직접 입력하세요.
                    </p>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-foreground">팀 관리자</p>
                      <Select
                        className="h-12 rounded-2xl px-4"
                        value={String(values.adminId)}
                        options={administratorOptions}
                        onChange={(event) =>
                          setValues({ ...values, adminId: Number(event.target.value) })
                        }
                      />
                      <p className="text-xs leading-5 text-muted-foreground">
                        본부장 또는 사업부장만 팀 관리자로 지정할 수 있습니다.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-foreground">팀장</p>
                      <Select
                        className="h-12 rounded-2xl px-4"
                        value={String(values.leaderId)}
                        options={teamLeaderOptions}
                        disabled={selectedMembers.length === 0}
                        onChange={(event) =>
                          setValues({ ...values, leaderId: Number(event.target.value) })
                        }
                      />
                      <p className="text-xs leading-5 text-muted-foreground">
                        팀장은 추가된 팀 구성원 중에서 지정합니다.
                      </p>
                    </div>
                  </div>

                  {selectedMembers.length > 0 ? (
                    <div className="mt-5 space-y-3">
                      {selectedMembers.map((member) => (
                        <div
                          key={member.id}
                          className="rounded-2xl border border-border/70 bg-background/55 p-4"
                        >
                          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="font-semibold text-foreground">{member.name}</p>
                                {values.leaderId === member.id ? (
                                  <Badge variant="default">팀장</Badge>
                                ) : null}
                                <Badge variant="outline">{member.position}</Badge>
                              </div>
                              <p className="mt-1 truncate text-sm text-muted-foreground">
                                {member.title}
                              </p>
                            </div>
                            <Input
                              className="h-11 rounded-2xl px-4 lg:w-[360px]"
                              placeholder="예: 데이터 분석, API 개발, QA 담당"
                              value={getMemberTeamRole(member.id)}
                              onChange={(event) =>
                                updateMemberTeamRole(member.id, event.target.value)
                              }
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-5 rounded-2xl border border-dashed border-border/70 bg-background/40 px-4 py-5 text-sm text-muted-foreground">
                      팀 구성원을 먼저 추가하면 팀장 지정과 팀원별 역할 입력이 활성화됩니다.
                    </div>
                  )}
                </div>
              </RegistrationField>
            </div>
            <div className="space-y-5 xl:border-l xl:border-border/70 xl:pl-8">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                운영 설정
              </p>
              <RegistrationField label="상태">
                <Select
                  className={controlClassName}
                  options={[
                    { label: "ACTIVE", value: "ACTIVE" },
                    { label: "INACTIVE", value: "INACTIVE" },
                  ]}
                  value={values.status}
                  onChange={(event) =>
                    setValues({
                      ...values,
                      status: event.target.value as TeamFormValues["status"],
                    })
                  }
                />
              </RegistrationField>
              <RegistrationField label="일정">
                <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center xl:grid-cols-1">
                  <Input
                    className={controlClassName}
                    type="date"
                    value={values.startDate}
                    onChange={(event) =>
                      setValues({ ...values, startDate: event.target.value })
                    }
                  />
                  <span className="hidden text-sm text-muted-foreground sm:block xl:hidden">
                    ~
                  </span>
                  <Input
                    className={controlClassName}
                    type="date"
                    value={values.endDate}
                    onChange={(event) =>
                      setValues({ ...values, endDate: event.target.value })
                    }
                  />
                </div>
              </RegistrationField>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              size="lg"
              className="h-12 min-w-[168px] rounded-2xl px-7 font-semibold shadow-[0_14px_40px_-20px_rgba(59,130,246,0.8)]"
            >
              {submitLabel}
            </Button>
          </div>
        </RegistrationFormPanel>
      </form>

      <Dialog open={isMemberDialogOpen} onOpenChange={setIsMemberDialogOpen}>
        <DialogContent className="max-h-[92vh] max-w-[920px] overflow-hidden rounded-[28px] p-0">
          <div className="dashboard-scrollbar max-h-[92vh] overflow-auto p-6">
            <DialogHeader>
              <DialogTitle className="text-[22px] tracking-[-0.04em]">
                사용자 검색/추가
              </DialogTitle>
              <DialogDescription>
                부서와 직급 기준으로 사용자를 좁힌 뒤, 이름으로 필요한 구성원을 검색하세요.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-3 md:grid-cols-[minmax(0,1.2fr)_220px_220px]">
              <Input
                className="h-12 rounded-2xl px-4"
                placeholder="이름으로 검색"
                value={memberSearch}
                onChange={(event) => setMemberSearch(event.target.value)}
              />
              <Select
                className="h-12 rounded-2xl px-4"
                value={memberDepartmentFilter}
                options={[
                  { label: "전체 부서", value: "all" },
                  ...memberDepartmentOptions,
                ]}
                onChange={(event) => setMemberDepartmentFilter(event.target.value)}
                aria-label="사용자 부서 필터"
              />
              <Select
                className="h-12 rounded-2xl px-4"
                value={memberPositionFilter}
                options={[
                  { label: "전체 직급", value: "all" },
                  ...positionFilterOptions,
                ]}
                onChange={(event) => setMemberPositionFilter(event.target.value)}
                aria-label="사용자 직급 필터"
              />
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
              <div className="dashboard-scrollbar max-h-[360px] space-y-3 overflow-auto rounded-2xl border border-border/70 bg-muted/12 p-3">
                {filteredCandidateUsers.length > 0 ? (
                  filteredCandidateUsers.map((candidate) => {
                    const department = departments.find(
                      (item) => item.id === candidate.departmentId,
                    );
                    const isSelected = draftMemberIds.includes(candidate.id);

                    return (
                      <div
                        key={candidate.id}
                        className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-background/65 p-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold text-foreground">{candidate.name}</p>
                            <Badge variant="outline">{getRoleLabel(candidate.role)}</Badge>
                            <Badge variant="secondary">{candidate.position}</Badge>
                          </div>
                          <p className="mt-1 truncate text-sm text-muted-foreground">
                            {department?.name ?? "부서 미지정"} · {candidate.title}
                          </p>
                          <p className="mt-1 truncate text-xs text-muted-foreground">
                            {candidate.email}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant={isSelected ? "secondary" : "default"}
                          className="h-10 rounded-2xl px-4"
                          disabled={isSelected}
                          onClick={() => addDraftMember(candidate.id)}
                        >
                          {isSelected ? "추가됨" : "추가"}
                        </Button>
                      </div>
                    );
                  })
                ) : (
                  <div className="rounded-2xl border border-dashed border-border/70 px-4 py-10 text-center text-sm text-muted-foreground">
                    조건에 맞는 사용자가 없습니다.
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-border/70 bg-muted/16 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-foreground">추가된 사용자</p>
                  <Badge variant="outline">{draftMembers.length}명</Badge>
                </div>
                {draftMembers.length > 0 ? (
                  <div className="mt-3 flex flex-col gap-2">
                    {draftMembers.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-background/70 px-3 py-2"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{member.name}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {member.title}
                          </p>
                        </div>
                        <button
                          type="button"
                          className="flex size-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          aria-label={`${member.name} 제거`}
                          onClick={() => removeDraftMember(member.id)}
                        >
                          <X className="size-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-3 rounded-xl border border-dashed border-border/70 px-3 py-8 text-center text-sm text-muted-foreground">
                    추가 버튼을 누르면 여기에 이름이 쌓입니다.
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-2xl px-5"
                onClick={() => setIsMemberDialogOpen(false)}
              >
                취소
              </Button>
              <Button
                type="button"
                className="h-11 rounded-2xl px-6 font-semibold"
                onClick={saveDraftMembers}
              >
                저장하기
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
