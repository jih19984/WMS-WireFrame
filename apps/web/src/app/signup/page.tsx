import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, UploadCloud } from "lucide-react";
import { departments } from "@/app/_common/service/mock-db";
import { userService } from "@/app/user/_service/user.service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

const EMPTY_FORM = {
  departmentId: String(departments[0]?.id ?? 1),
  name: "",
  email: "",
  password: "",
  passwordConfirm: "",
  position: "",
  joinDate: "2026-04-20",
  profileImage: "https://i.pravatar.cc/150?u=new-signup-user",
  phone: "",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

type SignupFieldKey = keyof typeof EMPTY_FORM;
type SignupFieldErrors = Partial<Record<SignupFieldKey, string>>;

export default function SignupPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [values, setValues] = useState(EMPTY_FORM);
  const [profileFileName, setProfileFileName] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<SignupFieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const departmentOptions = departments.map((department) => ({
    label: department.name,
    value: String(department.id),
  }));

  const updateValue = (key: keyof typeof values, value: string) => {
    setValues((previous) => ({
      ...previous,
      [key]: value,
    }));
    setErrors([]);
    setFieldErrors((previous) => {
      if (!previous[key]) return previous;
      const next = { ...previous };
      delete next[key];
      return next;
    });
  };

  const handleProfileImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors(["이미지 파일만 업로드할 수 있습니다."]);
      setFieldErrors((previous) => ({
        ...previous,
        profileImage: "이미지 파일만 업로드할 수 있습니다.",
      }));
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const nextValue = typeof reader.result === "string" ? reader.result : "";
      if (!nextValue) {
        setErrors(["이미지를 읽는 중 문제가 발생했습니다."]);
        setFieldErrors((previous) => ({
          ...previous,
          profileImage: "이미지를 읽는 중 문제가 발생했습니다.",
        }));
        return;
      }

      setValues((previous) => ({
        ...previous,
        profileImage: nextValue,
      }));
      setProfileFileName(file.name);
      setErrors([]);
      setFieldErrors((previous) => {
        if (!previous.profileImage) return previous;
        const next = { ...previous };
        delete next.profileImage;
        return next;
      });
      event.target.value = "";
    };
    reader.onerror = () => {
      setErrors(["이미지를 읽는 중 문제가 발생했습니다."]);
      setFieldErrors((previous) => ({
        ...previous,
        profileImage: "이미지를 읽는 중 문제가 발생했습니다.",
      }));
      event.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors: string[] = [];
    const nextFieldErrors: SignupFieldErrors = {};

    if (!values.name.trim()) {
      nextErrors.push("이름을 입력해주세요.");
      nextFieldErrors.name = "이름을 입력해주세요.";
    }

    if (!values.email.trim()) {
      nextErrors.push("이메일을 입력해주세요.");
      nextFieldErrors.email = "이메일을 입력해주세요.";
    }

    if (values.email.trim() && !EMAIL_REGEX.test(values.email.trim())) {
      nextErrors.push("올바른 이메일 형식으로 입력해주세요.");
      nextFieldErrors.email = "올바른 이메일 형식으로 입력해주세요.";
    }

    if (!values.password) {
      nextErrors.push("비밀번호를 입력해주세요.");
      nextFieldErrors.password = "비밀번호를 입력해주세요.";
    }

    if (values.password && !PASSWORD_REGEX.test(values.password)) {
      nextErrors.push("비밀번호는 8자 이상이며 영어, 숫자, 특수문자를 모두 포함해야 합니다.");
      nextFieldErrors.password =
        "비밀번호는 8자 이상이며 영어, 숫자, 특수문자를 모두 포함해야 합니다.";
    }

    if (!values.passwordConfirm) {
      nextErrors.push("비밀번호 확인을 입력해주세요.");
      nextFieldErrors.passwordConfirm = "비밀번호 확인을 입력해주세요.";
    }

    if (
      values.password &&
      values.passwordConfirm &&
      values.password !== values.passwordConfirm
    ) {
      nextErrors.push("비밀번호 확인이 일치하지 않습니다.");
      nextFieldErrors.passwordConfirm = "비밀번호 확인이 일치하지 않습니다.";
    }

    if (!values.position.trim()) {
      nextErrors.push("직위를 입력해주세요.");
      nextFieldErrors.position = "직위를 입력해주세요.";
    }

    if (!values.joinDate) {
      nextErrors.push("입사일을 입력해주세요.");
      nextFieldErrors.joinDate = "입사일을 입력해주세요.";
    }

    if (!values.phone.trim()) {
      nextErrors.push("연락처를 입력해주세요.");
      nextFieldErrors.phone = "연락처를 입력해주세요.";
    }

    if (nextErrors.length > 0) {
      setErrors(nextErrors);
      setFieldErrors(nextFieldErrors);
      return;
    }

    setSubmitting(true);
    setErrors([]);
    setFieldErrors({});

    const result = await userService.signup({
      departmentId: Number(values.departmentId),
      name: values.name,
      email: values.email,
      password: values.password,
      position: values.position,
      joinDate: values.joinDate,
      profileImage: values.profileImage,
      phone: values.phone,
    });

    setSubmitting(false);

    if (!result.ok) {
      setErrors([result.message]);
      return;
    }

    navigate("/login", {
      replace: true,
      state: {
        registeredEmail: result.user.email,
        signupMessage: "회원가입이 완료되었습니다. 생성한 계정으로 로그인해주세요.",
      },
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#060b16] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(61,90,196,0.24),transparent_30%),linear-gradient(180deg,#0d1730_0%,#091121_48%,#050914_100%)]" />
        <div className="absolute left-[-8rem] top-[-10rem] h-80 w-80 rounded-full bg-[#4063d8]/18 blur-[140px]" />
        <div className="absolute right-[-6rem] bottom-[-8rem] h-80 w-80 rounded-full bg-[#27408f]/22 blur-[160px]" />
      </div>

      <div className="absolute left-8 top-8 z-20 md:left-12 md:top-10">
        <Badge
          variant="outline"
          className="border-white/10 bg-white/6 px-3 py-1 text-[12px] font-semibold tracking-[-0.01em] text-[#9fb2de] backdrop-blur-sm"
        >
          ibank AX 사업본부
        </Badge>
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-[1160px]">
          <div className="mx-auto max-w-[720px] text-center">
            <h1 className="text-[34px] font-semibold tracking-[-0.05em] text-[#edf3ff] md:text-[42px]">
              회원가입
            </h1>
            <p className="mt-4 text-[14px] leading-7 text-[#91a3c9] md:text-[15px]">
              AX-WMS에서 사용할 기본 계정 정보를 입력하세요.
            </p>
          </div>

          <div className="mx-auto mt-10 w-full max-w-[800px] rounded-[28px] border border-white/8 bg-white/6 p-5 shadow-[0_28px_80px_-36px_rgba(0,0,0,0.7)] backdrop-blur-md md:p-8">
            <form noValidate onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="부서">
                  <Select
                    value={values.departmentId}
                    options={departmentOptions}
                    className={getFieldInputClassName(fieldErrors.departmentId, "h-14 px-4 text-[15px] text-white")}
                    onChange={(event) => updateValue("departmentId", event.target.value)}
                  />
                </Field>
                <Field label="이름" error={fieldErrors.name}>
                  <Input
                    value={values.name}
                    onChange={(event) => updateValue("name", event.target.value)}
                    placeholder="홍길동"
                    className={getFieldInputClassName(fieldErrors.name, "h-14 text-[15px] text-white placeholder:text-[#7f91ba]")}
                  />
                </Field>
                <Field label="이메일" error={fieldErrors.email}>
                  <Input
                    type="email"
                    value={values.email}
                    onChange={(event) => updateValue("email", event.target.value)}
                    placeholder="name@work-email.com"
                    className={getFieldInputClassName(fieldErrors.email, "h-14 text-[15px] text-white placeholder:text-[#7f91ba]")}
                  />
                </Field>
                <Field label="비밀번호" error={fieldErrors.password}>
                  <Input
                    type="password"
                    value={values.password}
                    onChange={(event) => updateValue("password", event.target.value)}
                    placeholder="8자 이상, 영어/숫자/특수문자 포함"
                    className={getFieldInputClassName(fieldErrors.password, "h-14 text-[15px] text-white placeholder:text-[#7f91ba]")}
                  />
                </Field>
                <Field label="직위" error={fieldErrors.position}>
                  <Input
                    value={values.position}
                    onChange={(event) => updateValue("position", event.target.value)}
                    placeholder="예: 대리"
                    className={getFieldInputClassName(fieldErrors.position, "h-14 text-[15px] text-white placeholder:text-[#7f91ba]")}
                  />
                </Field>
                <Field label="비밀번호 확인" error={fieldErrors.passwordConfirm}>
                  <Input
                    type="password"
                    value={values.passwordConfirm}
                    onChange={(event) => updateValue("passwordConfirm", event.target.value)}
                    placeholder="비밀번호를 한 번 더 입력하세요"
                    className={getFieldInputClassName(fieldErrors.passwordConfirm, "h-14 text-[15px] text-white placeholder:text-[#7f91ba]")}
                  />
                </Field>
                <Field label="입사일" error={fieldErrors.joinDate}>
                  <Input
                    type="date"
                    value={values.joinDate}
                    onChange={(event) => updateValue("joinDate", event.target.value)}
                    className={getFieldInputClassName(fieldErrors.joinDate, "h-14 text-[15px] text-white")}
                  />
                </Field>
                <Field label="연락처" error={fieldErrors.phone}>
                  <Input
                    value={values.phone}
                    onChange={(event) => updateValue("phone", event.target.value)}
                    placeholder="010-0000-0000"
                    className={getFieldInputClassName(fieldErrors.phone, "h-14 text-[15px] text-white placeholder:text-[#7f91ba]")}
                  />
                </Field>
              </div>

              <Field label="프로필 이미지" error={fieldErrors.profileImage}>
                <div className="flex flex-col gap-4 rounded-[22px] border border-white/8 bg-white/[0.045] p-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="size-20 border border-white/10 bg-white/8">
                      <AvatarImage src={values.profileImage} alt={values.name || "새 프로필 이미지"} />
                      <AvatarFallback className="bg-white/6 text-xl font-semibold text-[#dce6fb]">
                        {(values.name || "U").slice(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1.5">
                      <p className="text-[15px] font-semibold tracking-[-0.02em] text-[#edf3ff]">
                        프로필 사진 업로드
                      </p>
                      <p className="text-[13px] leading-6 text-[#91a3c9]">
                        JPG, PNG, WEBP 이미지를 업로드할 수 있습니다.
                      </p>
                      <p className="text-[12px] text-[#b8c6e4]">
                        {profileFileName || "선택된 파일 없음"}
                      </p>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 rounded-xl border-white/10 bg-white/4 px-5 text-white hover:bg-white/8"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <UploadCloud className="size-4" />
                    이미지 선택
                  </Button>
                </div>
              </Field>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                className="hidden"
                onChange={handleProfileImageChange}
              />

              {errors.length > 0 ? (
                <ul className="grid gap-2">
                  {errors.map((message) => (
                    <li
                      key={message}
                      className="rounded-lg border border-[#7e3044] bg-[#461927] px-4 py-3 text-[14px] leading-6 text-[#ffb4c4]"
                    >
                      {message}
                    </li>
                  ))}
                </ul>
              ) : null}

              <div className="grid gap-3 pt-1 md:grid-cols-2">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="h-14 rounded-xl border-0 bg-[#3553b6] text-[15px] font-semibold text-white shadow-[0_18px_36px_-20px_rgba(53,83,182,0.65)] transition-all hover:bg-[#2d4699]"
                >
                  {submitting ? "가입 처리 중..." : "회원가입"}
                </Button>
                <Button
                  asChild
                  type="button"
                  variant="outline"
                  className="h-14 rounded-xl border-white/10 bg-white/4 text-[15px] font-semibold text-white transition-all hover:bg-white/8"
                >
                  <Link to="/login">로그인으로 돌아가기</Link>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <label
          className={
            error
              ? "text-[12px] font-semibold tracking-[0.02em] text-[#ffb4c4]"
              : "text-[12px] font-semibold tracking-[0.02em] text-[#c3d0ea]"
          }
        >
          {label}
        </label>
        {error ? <AlertCircle className="size-3.5 text-[#ff8ea8]" /> : null}
      </div>
      <div>{children}</div>
    </div>
  );
}

function getFieldInputClassName(error: string | undefined, baseClassName: string) {
  return [
    "rounded-xl",
    error
      ? "border-[#a93b56] bg-[#3a1622] ring-1 ring-[#a93b56]/55"
      : "border-white/8 bg-white/6",
    baseClassName,
  ].join(" ");
}
