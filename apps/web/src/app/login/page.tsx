import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { users } from "@/app/_common/service/mock-db";
import { useAuth } from "@/app/_common/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8rem] top-[-10rem] h-64 w-64 rounded-full bg-[#2563eb]/24 blur-[120px]" />
        <div className="absolute right-[-6rem] bottom-[-8rem] h-64 w-64 rounded-full bg-[#60a5fa]/12 blur-[140px]" />
      </div>
      <div className="relative z-10 w-full max-w-[400px] px-6">
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="mb-8 flex size-12 items-center justify-center rounded-xl bg-primary text-xl font-bold text-primary-foreground shadow-[var(--shadow-panel)]">
            AX
          </div>
          <h1 className="mb-3 text-[28px] font-[800] tracking-[-0.04em] text-foreground">
            AX-WMS 업무관리
          </h1>
          <p className="text-[15px] text-muted-foreground">
            계정 정보를 입력해 로그인하세요.
          </p>
        </div>

        <div className="space-y-4">
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@work-email.com"
              className="h-12 bg-white/5 text-[15px]"
            />
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="비밀번호"
              className="h-12 bg-white/5 text-[15px]"
            />

            {error ? (
              <div className="rounded-lg border border-destructive/30 bg-destructive/12 px-4 py-3 text-[14px] leading-6 text-[#ffc7d4]">
                {error}
              </div>
            ) : null}

            <Button type="submit" className="h-12 w-full text-[15px] font-semibold text-white transition-all hover:brightness-110">
              로그인
            </Button>
          </form>
          
          <div className="mt-8 text-center text-[13px] text-muted-foreground">
            이미 AX-WMS를 사용하고 있나요? <br />
            <button type="button" className="mt-1 font-semibold text-primary hover:underline">
              기존 워크스페이스에 로그인
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 right-6 z-50 w-[240px] rounded-xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-md">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-white/50">
            임시 테스트 계정
          </span>
        </div>
        <div className="space-y-1.5">
          {samples.map((sample) => (
            <button
              key={sample.id}
              type="button"
              className="flex w-full items-center justify-between rounded-lg border border-white/5 bg-white/5 px-3 py-2 text-left transition-all hover:border-white/10 hover:bg-white/10"
              onClick={() => {
                setEmail(sample.email);
                setPassword(sample.password ?? "password123");
                setError("");
              }}
            >
              <span className="text-[13px] font-medium text-foreground">{sample.name}</span>
              <span className="text-[10px] text-muted-foreground">{getRoleLabel(sample.role)}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
