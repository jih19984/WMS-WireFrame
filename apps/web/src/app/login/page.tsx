import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { users } from "@/app/_common/service/mock-db";
import { useAuth } from "@/app/_common/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import { getRoleLabel } from "@/lib/utils";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const samples = useMemo(() => {
    const roles = ["DIRECTOR", "DEPT_HEAD", "TEAM_LEAD", "MEMBER"];
    return roles
      .map((role) => users.find((user) => user.role === role))
      .filter((user): user is (typeof users)[number] => Boolean(user));
  }, []);
  const [email, setEmail] = useState(samples[0]?.email ?? "");
  const [password, setPassword] = useState(samples[0]?.password ?? "password123");
  const [error, setError] = useState("");

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    const result = login(email, password);
    if (!result) {
      setError("이메일 또는 비밀번호를 확인해주세요. 샘플 계정은 기본 비밀번호 `password123`을 사용합니다.");
      return;
    }
    navigate("/");
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
        <div className="w-full max-w-[960px]">
          <div className="flex flex-col items-center text-center">
            <h1 className="sr-only">AX-WMS</h1>
            <div className="h-[132px] w-full max-w-[680px] md:h-[176px]">
              <TextHoverEffect
                text="AX-WMS"
                duration={2.4}
                automatic
                textClassName="stroke-[#b9c8ea]"
              />
            </div>
            <div className="mt-10 flex flex-col items-center text-center">
              <h2 className="text-[16px] font-semibold tracking-[-0.03em] text-[#e5edff] md:text-[18px]">
                AI 기반 업무관리 시스템
              </h2>
              <p className="mt-3 max-w-[22rem] text-[13px] leading-6 text-[#90a1c7] md:text-[14px]">
                계정 정보를 입력해 로그인하세요.
              </p>
            </div>
          </div>

          <div className="mx-auto mt-10 w-full max-w-[480px] space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@work-email.com"
                className="h-14 rounded-xl border-white/8 bg-white/6 text-[15px] text-white placeholder:text-[#7f91ba] shadow-[0_14px_34px_-22px_rgba(0,0,0,0.7)] focus-visible:border-[#6c88ff] focus-visible:ring-[#6c88ff]/20 focus-visible:ring-offset-[#060b16]"
              />
              <Input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="비밀번호"
                className="h-14 rounded-xl border-white/8 bg-white/6 text-[15px] text-white placeholder:text-[#7f91ba] shadow-[0_14px_34px_-22px_rgba(0,0,0,0.7)] focus-visible:border-[#6c88ff] focus-visible:ring-[#6c88ff]/20 focus-visible:ring-offset-[#060b16]"
              />

              {error ? (
                <div className="rounded-xl border border-[#6b2235] bg-[#32111a] px-4 py-3 text-[14px] leading-6 text-[#ffb4c4]">
                  {error}
                </div>
              ) : null}

              <Button
                type="submit"
                className="h-14 w-full rounded-xl border-0 bg-[#3553b6] text-[15px] font-semibold text-white shadow-[0_18px_36px_-20px_rgba(53,83,182,0.65)] transition-all hover:bg-[#2d4699]"
              >
                로그인
              </Button>
            </form>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 right-6 z-50 w-[240px] rounded-[24px] border border-white/8 bg-[#0d1526]/78 p-4 shadow-[0_30px_80px_-36px_rgba(0,0,0,0.58)] backdrop-blur-md">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#7384a8]">
            임시 테스트 계정
          </span>
        </div>
        <div className="space-y-1.5">
          {samples.map((sample) => (
            <button
              key={sample.id}
              type="button"
              className="flex w-full items-center justify-between rounded-lg border border-transparent bg-white/4 px-3 py-2 text-left transition-all hover:border-white/8 hover:bg-white/8"
              onClick={() => {
                setEmail(sample.email);
                setPassword(sample.password ?? "password123");
                setError("");
              }}
            >
              <span className="text-[13px] font-medium text-[#f2f6ff]">{sample.name}</span>
              <span className="text-[10px] text-[#8496bf]">{getRoleLabel(sample.role)}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
