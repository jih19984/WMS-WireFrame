import { useEffect, useMemo, useState, type ComponentType } from "react";
import {
  BadgeCheck,
  Building2,
  CalendarDays,
  Image,
  KeyRound,
  LogOut,
  Mail,
  Phone,
  Save,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { PageHeader } from "@/app/_common/components/PageHeader";
import {
  RegistrationField,
  RegistrationFormPanel,
} from "@/app/_common/components/RegistrationFormPanel";
import { useAuth } from "@/app/_common/hooks/useAuth";
import { departments, teams } from "@/app/_common/service/mock-db";
import { userService } from "@/app/user/_service/user.service";
import type { UserProfile } from "@/app/user/_types/user.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  formatDate,
  getEmploymentStatusLabel,
  getRoleLabel,
} from "@/lib/utils";

type Feedback = {
  type: "success" | "error";
  message: string;
};

export default function ProfilePage() {
  const controlClassName = "h-14 rounded-2xl px-4 text-base";
  const navigate = useNavigate();
  const { user, refreshUser, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileImage, setProfileImage] = useState("");
  const [phone, setPhone] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [nextPassword, setNextPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileFeedback, setProfileFeedback] = useState<Feedback | null>(null);
  const [passwordFeedback, setPasswordFeedback] = useState<Feedback | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      if (!user) return;
      const found = await userService.getById(user.id);
      if (!mounted || !found) return;
      setProfile(found);
      setProfileImage(found.profileImage);
      setPhone(found.phone);
    }

    void loadProfile();

    return () => {
      mounted = false;
    };
  }, [user]);

  const departmentName = useMemo(() => {
    if (!profile) return "-";
    return departments.find((department) => department.id === profile.departmentId)?.name ?? "-";
  }, [profile]);

  const primaryTeamName = useMemo(() => {
    if (!profile) return "-";
    return teams.find((team) => team.id === profile.primaryTeamId)?.name ?? "-";
  }, [profile]);

  const teamNames = useMemo(() => {
    if (!profile) return "-";
    const resolvedNames = profile.teamIds
      .map((teamId) => teams.find((team) => team.id === teamId)?.name)
      .filter((name): name is string => Boolean(name));
    return resolvedNames.length > 0 ? resolvedNames.join(", ") : "-";
  }, [profile]);

  const availableTeamOptions = useMemo(() => {
    if (!profile) return [];

    return profile.teamIds
      .map((teamId) => teams.find((team) => team.id === teamId))
      .filter((team): team is (typeof teams)[number] => Boolean(team))
      .map((team) => ({
        label: team.name,
        value: String(team.id),
      }));
  }, [profile]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!profile) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/64">
          프로필 정보를 불러오는 중입니다.
        </div>
      </div>
    );
  }

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    setProfileFeedback(null);

    try {
      const updated = await userService.update(profile.id, {
        name: profile.name,
        email: profile.email,
        role: profile.role,
        departmentId: profile.departmentId,
        teamIds: profile.teamIds,
        primaryTeamId: profile.primaryTeamId,
        position: profile.position,
        title: profile.title,
        phone,
        employmentStatus: profile.employmentStatus,
        joinDate: profile.joinDate,
        profileImage,
      });

      if (!updated) {
        setProfileFeedback({
          type: "error",
          message: "프로필 저장에 실패했습니다. 잠시 후 다시 시도해주세요.",
        });
        return;
      }

      setProfile(updated);
      refreshUser();
      setProfileFeedback({
        type: "success",
        message: "프로필 이미지, 연락처, 주 소속 팀을 저장했습니다.",
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordFeedback(null);

    if (!currentPassword || !nextPassword || !confirmPassword) {
      setPasswordFeedback({
        type: "error",
        message: "현재 비밀번호와 새 비밀번호를 모두 입력해주세요.",
      });
      return;
    }

    if (nextPassword.length < 8) {
      setPasswordFeedback({
        type: "error",
        message: "새 비밀번호는 8자 이상으로 설정해주세요.",
      });
      return;
    }

    if (nextPassword !== confirmPassword) {
      setPasswordFeedback({
        type: "error",
        message: "새 비밀번호 확인 값이 일치하지 않습니다.",
      });
      return;
    }

    setIsSavingPassword(true);

    try {
      const result = await userService.updatePassword(profile.id, currentPassword, nextPassword);
      if (!result.ok) {
        setPasswordFeedback({
          type: "error",
          message: result.message,
        });
        return;
      }

      setCurrentPassword("");
      setNextPassword("");
      setConfirmPassword("");
      setPasswordFeedback({
        type: "success",
        message: "비밀번호를 변경했습니다. 다음 로그인부터 새 비밀번호가 적용됩니다.",
      });
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-10">
      <PageHeader
        title="프로필"
        actions={
          <Button
            variant="outline"
            className="h-11 rounded-2xl px-5"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            <LogOut className="size-4" />
            로그아웃
          </Button>
        }
      />

      <section className="registration-surface w-full max-w-[1480px] pb-10">
        <RegistrationFormPanel
          eyebrow="MY PROFILE"
          title="프로필 정보 및 계정 설정"
          icon={<UserRound className="size-4" />}
          className="min-h-[720px]"
        >
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1.18fr)_minmax(420px,0.9fr)]">
            <div className="space-y-7">
              <section className="flex flex-col gap-5 rounded-[24px] border border-border/70 bg-muted/20 p-5 md:flex-row md:items-center">
                <Avatar className="size-24 border border-border bg-muted">
                  <AvatarImage src={profileImage || profile.profileImage} alt={profile.name} />
                  <AvatarFallback className="bg-muted text-2xl font-bold text-foreground">
                    {profile.name.slice(0, 1)}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[28px] font-bold tracking-[-0.06em] text-foreground">
                      {profile.name}
                    </p>
                    <Badge variant="secondary">{getRoleLabel(profile.role)}</Badge>
                    <Badge
                      variant={
                        profile.employmentStatus === "ACTIVE"
                          ? "success"
                          : profile.employmentStatus === "LEAVE"
                            ? "warning"
                            : "outline"
                      }
                    >
                      {getEmploymentStatusLabel(profile.employmentStatus)}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{profile.email}</p>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    주 소속 팀 <span className="font-semibold text-foreground">{primaryTeamName}</span>
                  </p>
                </div>
              </section>

              <section className="space-y-5">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  직접 수정 가능
                </p>
                <RegistrationField label="프로필 이미지 URL">
                  <div className="relative">
                    <Image className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      className={`${controlClassName} pl-11`}
                      value={profileImage}
                      onChange={(event) => setProfileImage(event.target.value)}
                      placeholder="프로필 이미지 URL을 입력하세요."
                    />
                  </div>
                </RegistrationField>

                <div className="grid gap-4 lg:grid-cols-2">
                  <RegistrationField label="연락처">
                    <div className="relative">
                      <Phone className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        className={`${controlClassName} pl-11`}
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)}
                        placeholder="연락처를 입력하세요."
                      />
                    </div>
                  </RegistrationField>

                  <RegistrationField label="주 소속 팀">
                    <Select
                      className={controlClassName}
                      value={String(profile.primaryTeamId)}
                      options={availableTeamOptions}
                      onChange={(event) => {
                        const nextPrimaryTeamId = Number(event.target.value);
                        setProfile((current) =>
                          current
                            ? {
                                ...current,
                                primaryTeamId: nextPrimaryTeamId,
                              }
                            : current,
                        );
                      }}
                    />
                  </RegistrationField>
                </div>

                {profileFeedback ? (
                  <InlineFeedback type={profileFeedback.type} message={profileFeedback.message} />
                ) : null}

                <div className="flex justify-end pt-1">
                  <Button
                    onClick={handleSaveProfile}
                    disabled={isSavingProfile}
                    className="h-12 min-w-[168px] rounded-2xl px-7 font-semibold shadow-[0_14px_40px_-20px_rgba(59,130,246,0.8)]"
                  >
                    <Save className="size-4" />
                    {isSavingProfile ? "저장 중..." : "프로필 저장"}
                  </Button>
                </div>
              </section>

              <section className="space-y-5 border-t border-border/70 pt-6">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  비밀번호 변경
                </p>
                <RegistrationField label="현재 비밀번호">
                  <Input
                    className={controlClassName}
                    type="password"
                    value={currentPassword}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                    placeholder="현재 비밀번호를 입력하세요."
                  />
                </RegistrationField>

                <div className="grid gap-4 md:grid-cols-2">
                  <RegistrationField label="새 비밀번호">
                    <Input
                      className={controlClassName}
                      type="password"
                      value={nextPassword}
                      onChange={(event) => setNextPassword(event.target.value)}
                      placeholder="8자 이상 입력하세요."
                    />
                  </RegistrationField>

                  <RegistrationField label="새 비밀번호 확인">
                    <Input
                      className={controlClassName}
                      type="password"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      placeholder="새 비밀번호를 한 번 더 입력하세요."
                    />
                  </RegistrationField>
                </div>

                {passwordFeedback ? (
                  <InlineFeedback type={passwordFeedback.type} message={passwordFeedback.message} />
                ) : null}

                <div className="flex justify-end pt-1">
                  <Button
                    variant="outline"
                    onClick={handleChangePassword}
                    disabled={isSavingPassword}
                    className="h-12 min-w-[168px] rounded-2xl px-7 font-semibold"
                  >
                    <KeyRound className="size-4" />
                    {isSavingPassword ? "변경 중..." : "비밀번호 변경"}
                  </Button>
                </div>
              </section>
            </div>

            <aside className="space-y-5 xl:border-l xl:border-border/70 xl:pl-8">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                조회 전용 인사 정보
              </p>
              <div className="grid gap-3">
                <ReadOnlyInfo icon={Mail} label="이메일" value={profile.email} />
                <ReadOnlyInfo icon={CalendarDays} label="입사일" value={formatDate(profile.joinDate)} />
                <ReadOnlyInfo icon={Building2} label="소속 부서" value={departmentName} />
                <ReadOnlyInfo icon={Users} label="주 소속 팀" value={primaryTeamName} />
                <ReadOnlyInfo icon={Users} label="소속 팀 목록" value={teamNames} />
                <ReadOnlyInfo icon={BadgeCheck} label="직급 / 직책" value={`${profile.position} · ${profile.title}`} />
                <ReadOnlyInfo icon={ShieldCheck} label="권한 역할" value={getRoleLabel(profile.role)} />
                <ReadOnlyInfo icon={BadgeCheck} label="상태" value={getEmploymentStatusLabel(profile.employmentStatus)} />
              </div>
            </aside>
          </div>
        </RegistrationFormPanel>
      </section>
    </div>
  );
}

function ReadOnlyInfo({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[20px] border border-border/70 bg-muted/20 p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-4" />
        <p className="text-xs font-semibold uppercase tracking-[0.16em]">{label}</p>
      </div>
      <p className="mt-3 text-sm font-medium leading-6 text-foreground">{value}</p>
    </div>
  );
}

function InlineFeedback({ type, message }: Feedback) {
  return (
    <div
      className={
        type === "success"
          ? "rounded-xl border border-emerald-400/25 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-100"
          : "rounded-xl border border-rose-400/25 bg-rose-400/10 px-4 py-3 text-sm text-rose-600 dark:text-rose-100"
      }
    >
      {message}
    </div>
  );
}
