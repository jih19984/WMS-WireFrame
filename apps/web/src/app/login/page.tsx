import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ShieldCheck } from "lucide-react";
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
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    const result = login(email);
    if (!result) {
      setError("등록되지 않은 계정입니다. 샘플 계정을 선택해 로그인해보세요.");
      return;
    }
    navigate("/");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-background">
      <div className="w-full max-w-[980px] space-y-8 lg:grid lg:grid-cols-[1.05fr_420px] lg:items-start lg:gap-10 lg:space-y-0">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="clay-swatch-matcha flex size-16 items-center justify-center rounded-[24px] border border-black/10 text-xl font-bold font-sans shadow-[var(--shadow-clay)] lg:size-20 lg:text-2xl">
            AX
          </div>
          <div className="space-y-2">
            <h1 className="text-[32px] font-[600] tracking-[-0.64px]">AX-WMS 로그인</h1>
            <p className="text-[15px] leading-[1.6] text-muted-foreground">
              AI 기반 업무관리 시스템 프로토타입
            </p>
          </div>
          <Card className="hidden w-full rounded-[28px] border-dashed shadow-[var(--shadow-clay)] lg:block">
            <CardContent className="space-y-6 p-8 text-left">
              <div className="space-y-2">
                <Badge variant="outline" className="border-[#dad4c8] bg-white">
                  Wireframe Scope
                </Badge>
                <h2 className="text-2xl font-semibold tracking-[-0.04em]">
                  역할별 범위와 AI 처리 상태를 화면 중심으로 검토합니다.
                </h2>
                <p className="text-sm leading-6 text-muted-foreground">
                  실제 JWT, 파일 업로드, 시맨틱 검색 엔진은 붙이지 않고 mock 데이터로 권한 범위와 핵심 UX만 검증하는 단계입니다.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {samples.map((sample) => (
                  <div key={sample.id} className="rounded-2xl border border-dashed border-border bg-muted/20 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      {getRoleLabel(sample.role)}
                    </p>
                    <p className="mt-2 font-semibold">{sample.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {sample.title} / {sample.email}
                    </p>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-4 text-sm text-muted-foreground">
                샘플 계정은 본부장, 사업부장, 팀리더, 일반 구성원 4개 역할을 대표합니다. 비밀번호는 와이어프레임 확인용으로 고정되어 있습니다.
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-dashed shadow-[var(--shadow-clay)] rounded-[24px]">
          <CardContent className="p-8 space-y-6">
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[14px] font-[600] text-foreground">이메일</label>
                <Input 
                  value={email} 
                  onChange={(event) => setEmail(event.target.value)} 
                  placeholder="name@company.com" 
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[14px] font-[600] text-foreground">비밀번호</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  className="bg-background"
                />
              </div>
              
              {error && (
                <div className="rounded-[8px] bg-[#ffe1e4] px-4 py-3 text-[14px] leading-relaxed text-[#8b2430] border border-[#ec8f96]">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full h-[48px] text-[16px] mt-2">
                로그인 <ArrowRight className="size-4 ml-1" />
              </Button>
            </form>

            <div className="rounded-[16px] border border-dashed border-border bg-muted/20 p-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 text-foreground">
                <ShieldCheck className="size-4" />
                <span className="font-medium">현재 단계 안내</span>
              </div>
              <p className="mt-2 leading-6">
                이 로그인은 역할 기반 화면 범위 검증용입니다. 실제 인증 대신 이메일 매칭으로 진입하며, 권한별 대시보드와 목록 범위를 확인하는 데 목적이 있습니다.
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-dashed border-[#dad4c8]" />
              </div>
              <div className="relative flex justify-center text-[12px] uppercase tracking-[1.08px]">
                <span className="bg-white px-3 text-[#9f9b93] font-[600]">Test Accounts</span>
              </div>
            </div>

            <div className="space-y-2">
              {samples.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  className="flex w-full items-center justify-between rounded-[12px] border border-transparent bg-[#f5f1e8] px-4 py-3 text-left transition-colors hover:border-[#dad4c8] hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#146ef5]"
                  onClick={() => {
                    setEmail(sample.email);
                    setPassword("password123");
                    setError("");
                  }}
                >
                  <p className="text-[14px] font-[500] text-[#55534e]">{sample.name} <span className="text-muted-foreground ml-1">({sample.email})</span></p>
                  <Badge variant="outline" className="border-none bg-white">
                    {getRoleLabel(sample.role)}
                  </Badge>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
