import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, KeyRound } from "lucide-react";
import { users } from "@/app/_common/service/mock-db";
import { useAuth } from "@/app/_common/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("director@ax-wms.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");

  const samples = useMemo(
    () => users.filter((user) => ["DIRECTOR", "DEPT_HEAD", "TEAM_LEAD", "MEMBER"].includes(user.role)),
    []
  );

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
    <div className="flex min-h-full items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.12),_transparent_40%),linear-gradient(to_bottom,_#ffffff,_#f8fafc)] p-6">
      <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="hidden overflow-hidden lg:block">
          <CardContent className="flex h-full flex-col justify-between gap-8 bg-gradient-to-br from-indigo-50 via-white to-slate-100 p-10">
            <div className="space-y-5">
              <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
                <Building2 className="size-7" />
              </div>
              <div className="space-y-3">
                <Badge>AX-WMS Prototype</Badge>
                <h1 className="max-w-lg text-4xl font-semibold tracking-tight">
                  디자인 토큰과 shadcn/ui를 반영한 업무관리 프로토타입
                </h1>
                <p className="max-w-xl text-base leading-7 text-muted-foreground">
                  조직 관리, 업무일지, 시맨틱 검색, 파일/알림/태그 관리 흐름을 한 번에 점검할 수 있는
                  프론트엔드 시연 버전입니다.
                </p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                ["조직 가시성", "부서/팀/사용자 구조를 역할 기준으로 관리"],
                ["업무 흐름", "상태 전이, 의존성, AI 요약을 한 화면에 확인"],
                ["시맨틱 검색", "자연어 검색 + SQL 필터 조합 시뮬레이션"],
                ["AI 보조", "요약/태그/파일 처리 상태를 mock 데이터로 시연"],
              ].map(([title, body]) => (
                <div key={title} className="rounded-xl border border-border/70 bg-white/80 p-4 shadow-sm">
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mx-auto w-full max-w-lg shadow-lg">
          <CardHeader className="space-y-3 text-left">
            <div className="inline-flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Building2 className="size-5" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-2xl">로그인</CardTitle>
              <CardDescription>샘플 계정을 선택하거나 이메일을 직접 입력해 시연을 시작하세요.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">이메일</label>
                <Input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@company.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">비밀번호</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="password"
                />
              </div>
              {error ? <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p> : null}
              <Button type="submit" className="w-full">
                로그인
              </Button>
            </form>

            <Card className="border-dashed bg-muted/40 shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <KeyRound className="size-4 text-muted-foreground" />
                  샘플 계정
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {samples.map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    className="flex w-full items-center justify-between rounded-lg border border-transparent bg-card px-3 py-2 text-left transition-colors hover:border-border hover:bg-white"
                    onClick={() => {
                      setEmail(sample.email);
                      setPassword("password123");
                      setError("");
                    }}
                  >
                    <div>
                      <p className="text-sm font-medium">{sample.name}</p>
                      <p className="text-xs text-muted-foreground">{sample.email}</p>
                    </div>
                    <Badge variant={sample.role === "DIRECTOR" ? "default" : sample.role === "DEPT_HEAD" ? "secondary" : "outline"}>
                      {sample.role}
                    </Badge>
                  </button>
                ))}
              </CardContent>
            </Card>
          </CardContent>
          <CardFooter className="border-t border-border pt-4 text-xs leading-5 text-muted-foreground">
            Google AI Studio로 내보내기 전 검증용 React 프로토타입입니다.
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
