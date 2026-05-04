import { type ChangeEvent, type ReactNode, useMemo, useRef, useState } from "react";
import { UploadCloud, UserRound } from "lucide-react";
import {
  RegistrationField,
  RegistrationFormPanel,
} from "@/app/_common/components/RegistrationFormPanel";
import { departments } from "@/app/_common/service/mock-db";
import type { UserFormValues } from "@/app/user/_types/user.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { getEmploymentStatusLabel } from "@/lib/utils";

const titleRoleMap = {
  본부장: "DIRECTOR",
  사업부장: "DEPT_HEAD",
  팀장: "TEAM_LEAD",
  팀원: "MEMBER",
} as const satisfies Record<string, UserFormValues["role"]>;

const titleOptions = Object.keys(titleRoleMap).map((title) => ({
  label: title,
  value: title,
}));

const basePositionOptions = ["과장", "대리", "부장", "사원", "상무", "이사", "차장"].map((position) => ({
  label: position,
  value: position,
}));

type UserTitle = keyof typeof titleRoleMap;

const roleTitleMap: Record<UserFormValues["role"], UserTitle> = {
  DIRECTOR: "본부장",
  DEPT_HEAD: "사업부장",
  TEAM_LEAD: "팀장",
  MEMBER: "팀원",
};

function isUserTitle(value: string): value is UserTitle {
  return Object.prototype.hasOwnProperty.call(titleRoleMap, value);
}

function getTitleFromRole(role: UserFormValues["role"]): UserTitle {
  return roleTitleMap[role];
}

export function UserForm({
  initialValues,
  onSubmit,
  submitLabel,
  children,
  embedded = false,
}: {
  initialValues?: UserFormValues;
  onSubmit: (values: UserFormValues) => Promise<void> | void;
  submitLabel: string;
  children?: ReactNode;
  embedded?: boolean;
}) {
  const controlClassName = "h-14 rounded-2xl px-4 text-base";
  const selectControlClassName = "h-14 rounded-2xl px-4 pr-11 text-base";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileFileName, setProfileFileName] = useState("선택된 파일 없음");
  const [profileUploadError, setProfileUploadError] = useState("");
  const [values, setValues] = useState<UserFormValues>(() => {
    const baseValues =
      initialValues ?? {
      name: "",
      email: "",
      role: "MEMBER",
      departmentId: 3,
      teamIds: [11],
      primaryTeamId: 11,
      position: "대리",
      title: "팀원",
      phone: "010-0000-0000",
      employmentStatus: "ACTIVE",
      joinDate: "2026-04-01",
      profileImage: "https://i.pravatar.cc/150?u=new-user",
    };
    const normalizedTitle = isUserTitle(baseValues.title)
      ? baseValues.title
      : getTitleFromRole(baseValues.role);

    return {
      ...baseValues,
      title: normalizedTitle,
      role: titleRoleMap[normalizedTitle],
    };
  });

  const departmentOptions = useMemo(() => departments.map((department) => ({ label: department.name, value: String(department.id) })), []);
  const positionOptions = useMemo(() => {
    const hasCurrentPosition = basePositionOptions.some(
      (option) => option.value === values.position,
    );

    if (hasCurrentPosition || !values.position.trim()) {
      return basePositionOptions;
    }

    return [
      ...basePositionOptions,
      { label: `${values.position} (기존값)`, value: values.position },
    ];
  }, [values.position]);

  const handleProfileImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setProfileUploadError("이미지 파일만 업로드할 수 있습니다.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const nextValue = typeof reader.result === "string" ? reader.result : "";

      if (!nextValue) {
        setProfileUploadError("이미지를 읽는 중 문제가 발생했습니다.");
        return;
      }

      setValues((previous) => ({
        ...previous,
        profileImage: nextValue,
      }));
      setProfileFileName(file.name);
      setProfileUploadError("");
      event.target.value = "";
    };
    reader.onerror = () => {
      setProfileUploadError("이미지를 읽는 중 문제가 발생했습니다.");
      event.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  const formContent = (
    <>
        <div className="space-y-7">
          <section className="space-y-5">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              기본 정보
            </p>
            <div className="grid gap-4 lg:grid-cols-3">
              <RegistrationField label="이름">
                <Input
                  className={controlClassName}
                  placeholder="사용자 이름을 입력하세요."
                  value={values.name}
                  onChange={(event) =>
                    setValues({ ...values, name: event.target.value })
                  }
                />
              </RegistrationField>
              <RegistrationField label="이메일">
                <Input
                  className={controlClassName}
                  placeholder="이메일 주소를 입력하세요."
                  value={values.email}
                  onChange={(event) =>
                    setValues({ ...values, email: event.target.value })
                  }
                />
              </RegistrationField>
              <RegistrationField label="프로필 이미지">
                <div>
                  <button
                    type="button"
                    className="flex h-14 w-full items-center justify-between gap-3 rounded-2xl border border-input bg-background/70 px-4 pr-5 text-left text-base text-foreground shadow-sm outline-none transition-all hover:bg-muted/35 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <Avatar className="size-9 border border-border/70 bg-muted/50">
                        <AvatarImage
                          src={values.profileImage}
                          alt={values.name || "프로필 이미지"}
                        />
                        <AvatarFallback>
                          {(values.name || "U").slice(0, 1)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="min-w-0">
                        <span className="block truncate text-[15px] font-semibold text-foreground">
                          이미지 선택
                        </span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {profileFileName}
                        </span>
                      </span>
                    </span>
                    <UploadCloud className="size-4 shrink-0 text-primary" />
                  </button>
                  {profileUploadError ? (
                    <p className="mt-2 text-xs text-destructive">
                      {profileUploadError}
                    </p>
                  ) : null}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    className="hidden"
                    onChange={handleProfileImageChange}
                  />
                </div>
              </RegistrationField>
            </div>
          </section>

          <section className="space-y-5 border-t border-border/70 pt-6">
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="space-y-5">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  조직 배치
                </p>
                <RegistrationField label="소속 부서">
                  <Select
                    className={selectControlClassName}
                    value={String(values.departmentId)}
                    options={departmentOptions}
                    onChange={(event) => {
                      setValues({
                        ...values,
                        departmentId: Number(event.target.value),
                      });
                    }}
                  />
                </RegistrationField>
              </div>
              <div className="space-y-5">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  직무
                </p>
                <RegistrationField label="직급">
                  <Select
                    className={selectControlClassName}
                    value={values.position}
                    options={positionOptions}
                    onChange={(event) =>
                      setValues({ ...values, position: event.target.value })
                    }
                  />
                </RegistrationField>
              </div>
              <div className="space-y-5">
                <p className="invisible text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  직무
                </p>
                <RegistrationField label="직책">
                  <Select
                    className={selectControlClassName}
                    value={values.title}
                    options={titleOptions}
                    onChange={(event) => {
                      const title = event.target.value as UserTitle;
                      setValues({
                        ...values,
                        title,
                        role: titleRoleMap[title],
                      });
                    }}
                  />
                </RegistrationField>
              </div>
            </div>
          </section>

          <section className="space-y-5 border-t border-border/70 pt-6">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              인사 정보
            </p>
            <div className="grid gap-4 lg:grid-cols-3">
              <RegistrationField label="연락처">
                <Input
                  className={controlClassName}
                  placeholder="연락처를 입력하세요."
                  value={values.phone}
                  onChange={(event) =>
                    setValues({ ...values, phone: event.target.value })
                  }
                />
              </RegistrationField>
              <RegistrationField label="상태">
                <Select
                  className={selectControlClassName}
                  value={values.employmentStatus}
                  options={[
                    { label: getEmploymentStatusLabel("ACTIVE"), value: "ACTIVE" },
                    { label: getEmploymentStatusLabel("LEAVE"), value: "LEAVE" },
                    {
                      label: getEmploymentStatusLabel("INACTIVE"),
                      value: "INACTIVE",
                    },
                  ]}
                  onChange={(event) =>
                    setValues({
                      ...values,
                      employmentStatus:
                        event.target.value as UserFormValues["employmentStatus"],
                    })
                  }
                />
              </RegistrationField>
              <RegistrationField label="입사일">
                <Input
                  className={controlClassName}
                  type="date"
                  value={values.joinDate}
                  onChange={(event) =>
                    setValues({ ...values, joinDate: event.target.value })
                  }
                />
              </RegistrationField>
            </div>
          </section>
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
    </>
  );

  return (
    <form
      className={embedded ? "w-full" : "registration-surface w-full max-w-none pb-10"}
      onSubmit={async (event) => {
        event.preventDefault();
        await onSubmit(values);
      }}
    >
      {embedded ? (
        formContent
      ) : (
        <RegistrationFormPanel
          eyebrow="USER PROFILE"
          title="사용자 정보 및 직책 설정"
          icon={<UserRound className="size-4" />}
          className="min-h-[720px]"
        >
          {formContent}
      </RegistrationFormPanel>
      )}

      {children ? <div className="pt-6">{children}</div> : null}
    </form>
  );
}
