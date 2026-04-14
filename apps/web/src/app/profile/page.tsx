import { useEffect, useMemo, useState, type ComponentType, type ReactNode } from "react";
import {
  BadgeCheck,
  Building2,
  CalendarDays,
  KeyRound,
  Mail,
  Phone,
  Save,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { PageHeader } from "@/app/_common/components/PageHeader";
import { useAuth } from "@/app/_common/hooks/useAuth";
import { departments, teams } from "@/app/_common/service/mock-db";
import { userService } from "@/app/user/_service/user.service";
import type { UserProfile } from "@/app/user/_types/user.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
        title="프로필 설정"
        description="내 계정에서 직접 바꿀 수 있는 항목과, 관리자 기준으로 관리되는 인사 정보를 한 번에 확인합니다."
        actions={
          <Button
            variant="outline"
            className="border-white/10 bg-white/5 text-white hover:bg-white/10"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            로그아웃
          </Button>
        }
      />

      <section className="grid gap-5 xl:grid-cols-[1.05fr_1fr]">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>내 계정</CardTitle>
            <CardDescription>
              기본 프로필과 권한 상태를 먼저 확인할 수 있습니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col gap-5 rounded-[24px] border border-white/8 bg-white/[0.03] p-5 md:flex-row md:items-center">
              <Avatar className="size-20 border border-white/10 bg-white/10">
                <AvatarImage src={profileImage || profile.profileImage} alt={profile.name} />
                <AvatarFallback className="bg-white/10 text-xl font-bold text-white">
                  {profile.name.slice(0, 1)}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[24px] font-bold tracking-[-0.05em] text-white">
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
                <p className="mt-2 text-sm text-white/58">{profile.email}</p>
                <p className="mt-3 text-sm leading-6 text-white/70">
                  주 소속 팀은 <span className="font-semibold text-white">{primaryTeamName}</span>이며,
                  대시보드와 알림 기준으로 함께 사용됩니다.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <ReadOnlyInfo icon={Mail} label="이메일" value={profile.email} />
              <ReadOnlyInfo icon={CalendarDays} label="입사일" value={formatDate(profile.joinDate)} />
              <ReadOnlyInfo icon={Building2} label="소속 부서" value={departmentName} />
              <ReadOnlyInfo icon={Users} label="주 소속 팀" value={primaryTeamName} />
              <ReadOnlyInfo icon={Users} label="소속 팀 목록" value={teamNames} />
              <ReadOnlyInfo icon={BadgeCheck} label="직급 / 직책" value={`${profile.position} · ${profile.title}`} />
              <ReadOnlyInfo icon={ShieldCheck} label="권한 역할" value={getRoleLabel(profile.role)} />
              <ReadOnlyInfo icon={BadgeCheck} label="상태" value={getEmploymentStatusLabel(profile.employmentStatus)} />
            </div>

            <div className="rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-3 text-sm leading-6 text-white/58">
              인사 정보와 권한 항목은 관리자 권한 기준으로 관리되며, 실제 수정은 사용자 관리 화면에서 진행됩니다.
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-5">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle>직접 수정 가능한 항목</CardTitle>
              <CardDescription>
                프로필 이미지와 연락처는 내 계정 편의를 위해 직접 수정할 수 있습니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FieldGroup
                label="프로필 이미지 URL"
                description="시스템 안에서 나를 식별할 프로필 이미지를 연결합니다."
              >
                <Input
                  value={profileImage}
                  onChange={(event) => setProfileImage(event.target.value)}
                  placeholder="https://example.com/avatar.png"
                />
              </FieldGroup>

              <FieldGroup
                label="연락처"
                description="비상 연락이나 개인 확인에 사용하는 번호입니다."
              >
                <Input
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="010-0000-0000"
                />
              </FieldGroup>

              <FieldGroup
                label="주 소속 팀"
                description="현재 소속된 팀 안에서 대시보드와 알림 기준이 되는 대표 팀을 선택합니다."
              >
                <Select
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
              </FieldGroup>

              {profileFeedback ? (
                <InlineFeedback type={profileFeedback.type} message={profileFeedback.message} />
              ) : null}

              <div className="flex justify-end">
                <Button onClick={handleSaveProfile} disabled={isSavingProfile}>
                  <Save className="size-4" />
                  {isSavingProfile ? "저장 중..." : "프로필 저장"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle>비밀번호 변경</CardTitle>
              <CardDescription>
                로그인 보안을 위해 주기적으로 비밀번호를 변경할 수 있습니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FieldGroup label="현재 비밀번호">
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  placeholder="현재 비밀번호 입력"
                />
              </FieldGroup>

              <div className="grid gap-4 md:grid-cols-2">
                <FieldGroup label="새 비밀번호">
                  <Input
                    type="password"
                    value={nextPassword}
                    onChange={(event) => setNextPassword(event.target.value)}
                    placeholder="8자 이상 입력"
                  />
                </FieldGroup>

                <FieldGroup label="새 비밀번호 확인">
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="한 번 더 입력"
                  />
                </FieldGroup>
              </div>

              {passwordFeedback ? (
                <InlineFeedback type={passwordFeedback.type} message={passwordFeedback.message} />
              ) : null}

              <div className="flex justify-end">
                <Button variant="outline" onClick={handleChangePassword} disabled={isSavingPassword}>
                  <KeyRound className="size-4" />
                  {isSavingPassword ? "변경 중..." : "비밀번호 변경"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

function FieldGroup({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="space-y-1">
        <p className="text-sm font-semibold tracking-[-0.02em] text-white/88">{label}</p>
        {description ? (
          <p className="text-xs leading-5 text-white/48">{description}</p>
        ) : null}
      </div>
      {children}
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
    <div className="rounded-[20px] border border-white/8 bg-white/[0.03] p-4">
      <div className="flex items-center gap-2 text-white/40">
        <Icon className="size-4" />
        <p className="text-xs font-semibold uppercase tracking-[0.16em]">{label}</p>
      </div>
      <p className="mt-3 text-sm font-medium leading-6 text-white/88">{value}</p>
    </div>
  );
}

function InlineFeedback({ type, message }: Feedback) {
  return (
    <div
      className={
        type === "success"
          ? "rounded-xl border border-emerald-400/18 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100"
          : "rounded-xl border border-rose-400/18 bg-rose-400/10 px-4 py-3 text-sm text-rose-100"
      }
    >
      {message}
    </div>
  );
}
