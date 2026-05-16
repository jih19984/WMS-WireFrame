import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import {
  canCreateWorklog,
  getVisibleTeams,
  getVisibleUsers,
} from "@/app/_common/service/access-control";
import { PageHeader } from "@/app/_common/components/PageHeader";
import { Pagination } from "@/app/_common/components/Pagination";
import { LegendHelpDialog } from "@/app/_common/components/LegendHelpDialog";
import { usePagination } from "@/app/_common/hooks/usePagination";
import { useAuth } from "@/app/_common/hooks/useAuth";
import { tags, teams, users } from "@/app/_common/service/mock-db";
import { ImportanceBadge } from "@/app/worklog/_components/ImportanceBadge";
import { StatusBadge } from "@/app/worklog/_components/StatusBadge";
import { useWorklog } from "@/app/worklog/_hooks/useWorklog";
import { WorklogList } from "@/app/worklog/_components/WorklogList";
import type { Worklog } from "@/app/worklog/_types/worklog.types";
import {
  worklogImportanceLegendOrder,
  worklogStatusLegendOrder,
} from "@/app/worklog/_components/worklog-badge-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  cn,
  formatDate,
  getImportanceLabel,
  getWorklogStatusLabel,
} from "@/lib/utils";

const DEFAULT_FILTERS = {
  teamStatus: "all",
  teamId: "all",
  status: "all",
  importance: "all",
  authorId: "all",
  tagId: "all",
  period: "ALL" as const,
};

const aiPromptExamples = [
  "지난주 완료된 장애 대응 업무 보여줘",
  "AI 평가셋 관련 업무 요약해줘",
  "박서진 담당 진행 업무 찾아줘",
  "마감 임박 업무만 우선순위로 정리해줘",
];

type AiMessage = {
  id: number;
  role: "user" | "assistant";
  content: string;
  isLoading?: boolean;
};

export default function WorklogPage() {
  const { user } = useAuth();
  const { worklogs } = useWorklog();
  const canCreate = canCreateWorklog(user);
  const [query, setQuery] = useState("");
  const [draftQuery, setDraftQuery] = useState("");
  const [aiMode, setAiMode] = useState(false);
  const [aiDraftQuery, setAiDraftQuery] = useState("");
  const [aiMessages, setAiMessages] = useState<AiMessage[]>([]);
  const [aiResultWorklogIds, setAiResultWorklogIds] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const aiResponseTimersRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const aiLoadingIntervalsRef = useRef<Array<ReturnType<typeof setInterval>>>([]);
  const visibleTeams = getVisibleTeams(user, teams);
  const visibleUsers = getVisibleUsers(user, users);
  const activeFilterCount = Object.values(filters).filter(
    (value) => value !== "all" && value !== "ALL",
  ).length;

  const filteredWorklogs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const now = new Date("2026-04-13T23:59:59");

    return worklogs.filter((worklog) => {
      const queryMatch =
        !normalizedQuery || worklog.title.toLowerCase().includes(normalizedQuery);
      const worklogTeam = teams.find((team) => team.id === worklog.teamId);
      const teamStatusMatch =
        filters.teamStatus === "all" || worklogTeam?.status === filters.teamStatus;
      const teamMatch =
        filters.teamId === "all" || String(worklog.teamId) === filters.teamId;
      const statusMatch =
        filters.status === "all" || worklog.status === filters.status;
      const importanceMatch =
        filters.importance === "all" || worklog.importance === filters.importance;
      const authorMatch =
        filters.authorId === "all" || String(worklog.authorId) === filters.authorId;
      const tagMatch =
        filters.tagId === "all" || worklog.tagIds.includes(Number(filters.tagId));
      const diffDays = Math.floor(
        (now.getTime() - new Date(worklog.createdAt).getTime()) /
          (1000 * 60 * 60 * 24),
      );
      const periodMatch =
        filters.period === "ALL" ||
        (filters.period === "7D" && diffDays <= 7) ||
        (filters.period === "30D" && diffDays <= 30) ||
        (filters.period === "90D" && diffDays <= 90);

      return (
        queryMatch &&
        teamStatusMatch &&
        teamMatch &&
        statusMatch &&
        importanceMatch &&
        authorMatch &&
        tagMatch &&
        periodMatch
      );
    });
  }, [filters, query, worklogs]);
  const worklogPagination = usePagination(filteredWorklogs, 4);
  const aiResultWorklogs = useMemo(() => {
    const resultIdSet = new Set(aiResultWorklogIds);
    return worklogs.filter((worklog) => resultIdSet.has(worklog.id));
  }, [aiResultWorklogIds, worklogs]);
  const hasAiConversation = aiMessages.length > 0;

  useEffect(() => {
    return () => {
      aiResponseTimersRef.current.forEach((timer) => clearTimeout(timer));
      aiLoadingIntervalsRef.current.forEach((interval) => clearInterval(interval));
    };
  }, []);

  const submitAiQuestion = (question: string) => {
    const normalizedQuestion = question.trim();
    if (!normalizedQuestion) return;

    const results = resolveAiModeResults(normalizedQuestion, filteredWorklogs);
    const nextMessageId = Date.now();
    const loadingMessageId = nextMessageId + 1;
    let loadingStep = 0;
    setAiMessages((prev) => [
      ...prev,
      {
        id: nextMessageId,
        role: "user",
        content: normalizedQuestion,
      },
      {
        id: loadingMessageId,
        role: "assistant",
        content: ".",
        isLoading: true,
      },
    ]);
    setAiResultWorklogIds([]);
    setAiDraftQuery("");

    const loadingInterval = setInterval(() => {
      loadingStep = (loadingStep + 1) % 3;
      const loadingText = ".".repeat(loadingStep + 1);

      setAiMessages((prev) =>
        prev.map((message) =>
          message.id === loadingMessageId && message.isLoading
            ? { ...message, content: loadingText }
            : message,
        ),
      );
    }, 500);

    const timer = setTimeout(() => {
      clearInterval(loadingInterval);
      aiLoadingIntervalsRef.current = aiLoadingIntervalsRef.current.filter(
        (item) => item !== loadingInterval,
      );
      setAiMessages((prev) =>
        prev.map((message) =>
          message.id === loadingMessageId
            ? {
                ...message,
                content:
                  results.length > 0
                    ? `관련 업무일지 ${results.length}건을 찾았습니다. 오른쪽 카드에서 업무 상세로 바로 이동할 수 있습니다.`
                    : "현재 조건에서 바로 연결할 업무일지를 찾지 못했습니다. 담당자, 상태, 기간을 조금 더 구체적으로 입력해보세요.",
                isLoading: false,
              }
            : message,
        ),
      );
      setAiResultWorklogIds(results.map((worklog) => worklog.id));
      aiResponseTimersRef.current = aiResponseTimersRef.current.filter(
        (item) => item !== timer,
      );
    }, 3000);

    aiResponseTimersRef.current.push(timer);
    aiLoadingIntervalsRef.current.push(loadingInterval);
  };

  return (
    <div className={cn("flex flex-col gap-6", aiMode && "worklog-ai-mode")}>
      <PageHeader title="업무 검색" />
      <div
        className={cn(
          "space-y-4",
          aiMode && !hasAiConversation && "min-h-[calc(100vh-12rem)]",
        )}
      >
        <div
          className={cn(
            "transition-all duration-500 ease-out",
            aiMode && "pointer-events-none -translate-y-2 opacity-0",
          )}
        >
          <h2 className="text-[20px] font-semibold tracking-[-0.04em] text-foreground">
            업무 탐색
          </h2>
        </div>

        {(!aiMode || !hasAiConversation) ? (
          <div
            className={cn(
              "flex flex-col gap-4 transition-all duration-500 ease-out",
              aiMode && "mx-auto w-full max-w-5xl gap-6 px-0 py-0",
              aiMode && "mt-[18vh] ai-search-lift",
            )}
          >
            {aiMode ? (
              <div className="text-center transition-all duration-500 ease-out">
                <p className="text-[clamp(1.7rem,4vw,3.15rem)] font-bold leading-tight tracking-[-0.04em] text-foreground">
                  안녕하세요, 어떤 업무일지를 찾으려고 하시나요?
                </p>
                <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                  현재 대화 안에서만 문맥을 유지합니다. 업무명, 담당자, 상태,
                  마감 조건을 자연스럽게 입력해보세요.
                </p>
              </div>
            ) : null}

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={aiMode ? aiDraftQuery : draftQuery}
                onChange={(event) => {
                  if (aiMode) {
                    setAiDraftQuery(event.target.value);
                    return;
                  }
                  setDraftQuery(event.target.value);
                }}
                onKeyDown={(event) => {
                  if (event.key !== "Enter") return;
                  if (aiMode) {
                    submitAiQuestion(aiDraftQuery);
                    return;
                  }
                  setQuery(draftQuery);
                }}
                className={cn(
                  "h-12 rounded-2xl pl-11 transition-all duration-500",
                  aiMode &&
                    "h-16 border-border/70 bg-card/90 pr-4 text-[16px] shadow-[0_18px_70px_-42px_rgba(15,23,42,0.65),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur",
                  !aiMode && "pr-32",
                )}
                placeholder={
                  aiMode
                    ? "어떤 업무를 찾고 싶으신가요?"
                    : "업무 제목으로 검색하세요"
                }
              />
              {!aiMode ? (
                <Button
                  type="button"
                  variant="secondary"
                  className="ai-mode-trigger absolute right-2 top-1/2 h-9 -translate-y-1/2 rounded-xl px-3 text-sm font-semibold"
                  onClick={() => {
                    setAiMode(true);
                    setShowFilters(false);
                    setAiDraftQuery(draftQuery);
                  }}
                >
                  <Sparkles className="size-4" />
                  AI 모드
                </Button>
              ) : null}
            </div>

            <div
              className={cn(
                "flex items-center gap-2 transition-all duration-300",
                aiMode && "hidden",
              )}
            >
              <Button
                variant="outline"
                className="h-10 min-w-[92px] px-4"
                onClick={() => setShowFilters((prev) => !prev)}
              >
                <SlidersHorizontal className="size-4" />
                필터
                {activeFilterCount > 0 ? (
                  <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground">
                    {activeFilterCount}
                  </span>
                ) : null}
                <ChevronDown
                  className={cn(
                    "ml-1 size-4 transition-transform duration-300 ease-out",
                    showFilters && "rotate-180",
                  )}
                />
              </Button>
            </div>

          </div>

          <div
            className={cn(
              "grid transition-[grid-template-rows,opacity,margin] duration-300 ease-out",
              showFilters && !aiMode
                ? "mt-0 grid-rows-[1fr] overflow-visible opacity-100"
                : "mt-[-4px] grid-rows-[0fr] overflow-hidden opacity-0",
            )}
          >
            <div className={showFilters ? "overflow-visible" : "overflow-hidden"}>
              <FilterPanel
                filters={filters}
                setFilters={setFilters}
                setQuery={setQuery}
                setDraftQuery={setDraftQuery}
                visibleTeams={visibleTeams}
                visibleUsers={visibleUsers}
              />
            </div>
          </div>

            {aiMode ? (
              <div className="grid gap-2 pt-1 sm:grid-cols-2">
                {aiPromptExamples.map((example) => (
                  <button
                    key={example}
                    type="button"
                    className="rounded-2xl border border-border/70 bg-muted/35 px-4 py-3 text-left text-sm font-medium text-foreground transition-all duration-200 hover:border-primary/35 hover:bg-primary/8 hover:text-primary"
                    onClick={() => {
                      setAiDraftQuery(example);
                      submitAiQuestion(example);
                    }}
                  >
                    {example}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        {aiMode ? (
          <AiConversationWorkspace
            messages={aiMessages}
            resultWorklogs={aiResultWorklogs}
            composerValue={aiDraftQuery}
            onComposerChange={setAiDraftQuery}
            onComposerSubmit={() => submitAiQuestion(aiDraftQuery)}
          />
        ) : null}

        <div
          className={cn(
            "pt-2 transition-all duration-500 ease-out",
            aiMode && "pointer-events-none max-h-0 -translate-y-3 overflow-hidden opacity-0",
          )}
        >
          <div className="pb-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">
                  표시 중인 업무{" "}
                  <span className="ml-1 font-semibold text-foreground">
                    {filteredWorklogs.length}건
                  </span>
                </p>
                <LegendHelpDialog
                  title="업무 아이콘 안내"
                  description="업무 카드에서 보이는 상태와 중요도 아이콘 의미를 빠르게 확인할 수 있습니다."
                  buttonLabel="업무 아이콘 안내 열기"
                  sections={[
                    {
                      title: "상태",
                      content: worklogStatusLegendOrder.map((status) => (
                        <StatusBadge key={status} status={status} />
                      )),
                    },
                    {
                      title: "중요도",
                      content: worklogImportanceLegendOrder.map((importance) => (
                        <ImportanceBadge key={importance} importance={importance} />
                      )),
                    },
                  ]}
                  className="h-8 w-8"
                />
              </div>
              {canCreate ? (
                <Button asChild variant="default" className="h-10 min-w-32 px-6 text-sm font-semibold">
                  <Link to="/worklog/create">업무 등록</Link>
                </Button>
              ) : null}
            </div>
          </div>
          <WorklogList worklogs={worklogPagination.items} />
          <div className="pt-6">
            <Pagination
              page={worklogPagination.page}
              totalPages={worklogPagination.totalPages}
              onPageChange={worklogPagination.setPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterPanel({
  filters,
  setFilters,
  setQuery,
  setDraftQuery,
  visibleTeams,
  visibleUsers,
}: {
  filters: typeof DEFAULT_FILTERS;
  setFilters: React.Dispatch<React.SetStateAction<typeof DEFAULT_FILTERS>>;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  setDraftQuery: React.Dispatch<React.SetStateAction<string>>;
  visibleTeams: typeof teams;
  visibleUsers: typeof users;
}) {
  return (
    <div className="space-y-4 pt-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
          Worklog Filters
        </p>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          aria-label="필터 초기화"
          onClick={() => {
            setQuery("");
            setDraftQuery("");
            setFilters(DEFAULT_FILTERS);
          }}
        >
          <RefreshCw className="size-4" />
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <FilterField label="팀 상태">
          <Select
            value={filters.teamStatus}
            options={[
              { label: "전체", value: "all" },
              { label: "활성", value: "ACTIVE" },
              { label: "비활성", value: "INACTIVE" },
            ]}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, teamStatus: event.target.value }))
            }
          />
        </FilterField>
        <FilterField label="팀">
          <Select
            value={filters.teamId}
            options={[
              { label: "전체 팀", value: "all" },
              ...visibleTeams.map((team) => ({
                label: team.name,
                value: String(team.id),
              })),
            ]}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, teamId: event.target.value }))
            }
          />
        </FilterField>
        <FilterField label="업무 상태">
          <Select
            value={filters.status}
            options={[
              { label: "전체 상태", value: "all" },
              ...worklogStatusLegendOrder.map((status) => ({
                label: getWorklogStatusLabel(status),
                value: status,
              })),
            ]}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, status: event.target.value }))
            }
          />
        </FilterField>
        <FilterField label="중요도">
          <Select
            value={filters.importance}
            options={[
              { label: "전체 중요도", value: "all" },
              { label: getImportanceLabel("URGENT"), value: "URGENT" },
              { label: getImportanceLabel("HIGH"), value: "HIGH" },
              { label: getImportanceLabel("NORMAL"), value: "NORMAL" },
              { label: getImportanceLabel("LOW"), value: "LOW" },
            ]}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, importance: event.target.value }))
            }
          />
        </FilterField>
        <FilterField label="작성자">
          <Select
            value={filters.authorId}
            options={[
              { label: "전체 작성자", value: "all" },
              ...visibleUsers.map((member) => ({
                label: member.name,
                value: String(member.id),
              })),
            ]}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, authorId: event.target.value }))
            }
          />
        </FilterField>
        <FilterField label="태그">
          <Select
            value={filters.tagId}
            options={[
              { label: "전체 태그", value: "all" },
              ...tags.map((tag) => ({
                label: `#${tag.name}`,
                value: String(tag.id),
              })),
            ]}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, tagId: event.target.value }))
            }
          />
        </FilterField>
        <FilterField label="기간">
          <Select
            value={filters.period}
            options={[
              { label: "전체 기간", value: "ALL" },
              { label: "최근 7일", value: "7D" },
              { label: "최근 30일", value: "30D" },
              { label: "최근 90일", value: "90D" },
            ]}
            onChange={(event) =>
              setFilters((prev) => ({
                ...prev,
                period: event.target.value as typeof DEFAULT_FILTERS.period,
              }))
            }
          />
        </FilterField>
      </div>
    </div>
  );
}

function FilterField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
      {children}
    </div>
  );
}

function AiConversationWorkspace({
  messages,
  resultWorklogs,
  composerValue,
  onComposerChange,
  onComposerSubmit,
}: {
  messages: AiMessage[];
  resultWorklogs: Worklog[];
  composerValue: string;
  onComposerChange: (value: string) => void;
  onComposerSubmit: () => void;
}) {
  if (messages.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto grid w-full max-w-[88rem] gap-6 pt-6 xl:h-[calc(100vh-10.5rem)] xl:min-h-[36rem] xl:grid-cols-[minmax(0,61rem)_minmax(320px,400px)] xl:items-stretch xl:overflow-hidden">
      <div className="flex min-h-0 min-w-0 flex-col">
        <div className="flex min-h-[28rem] flex-1 flex-col gap-5 overflow-y-auto px-1 pb-52 pr-2 xl:min-h-0">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.role === "user" ? "justify-end" : "justify-start",
              )}
            >
            <div
              className={cn(
                "rounded-[24px] px-5 py-4 text-sm leading-6",
                message.role === "user"
                  ? "max-w-[min(28rem,74%)] bg-primary text-primary-foreground"
                  : "max-w-[min(44rem,80%)] border border-border/60 bg-card/78 text-foreground backdrop-blur",
                message.isLoading && "min-w-16 animate-pulse text-center text-lg",
              )}
            >
              {message.content}
              </div>
            </div>
          ))}
        </div>

        <AiBottomComposer
          value={composerValue}
          onChange={onComposerChange}
          onSubmit={onComposerSubmit}
        />
      </div>

      <aside className="flex min-h-0 flex-col rounded-[28px] border border-border/70 bg-card/72 p-5 backdrop-blur">
        <div className="mb-4 flex shrink-0 items-center justify-between gap-3 px-1">
          <div>
            <p className="text-sm font-semibold text-foreground">AI 추천 업무일지</p>
            <p className="mt-1 text-xs text-muted-foreground">
              현재 질문과 화면 필터를 함께 반영한 결과입니다.
            </p>
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {resultWorklogs.length}건
          </span>
        </div>

        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
          {resultWorklogs.length > 0 ? (
            resultWorklogs.map((worklog) => (
              <AiResultCard key={worklog.id} worklog={worklog} />
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-border/80 px-4 py-8 text-center text-sm text-muted-foreground">
              조건에 맞는 업무 카드가 없습니다.
            </div>
          )}
        </div>
      </aside>
    </section>
  );
}

function AiBottomComposer({
  value,
  onChange,
  onSubmit,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}) {
  return (
    <div className="fixed bottom-6 left-1/2 z-40 w-[calc(100vw-2rem)] max-w-[61rem] -translate-x-1/2 xl:left-[calc(50%-13.25rem)]">
      <div className="ai-bottom-composer w-full rounded-[28px] border border-border/80 bg-card/95 p-4 backdrop-blur-xl">
        <div className="relative min-w-0">
          <textarea
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key !== "Enter" || event.shiftKey) return;
              event.preventDefault();
              onSubmit();
            }}
            className="min-h-[5.75rem] w-full resize-none rounded-[22px] border border-transparent bg-transparent px-1 py-1 text-[16px] leading-7 text-foreground outline-none placeholder:text-muted-foreground"
            placeholder="업무일지에 대해 이어서 물어보세요"
          />
          <div className="mt-2 flex items-center gap-2 text-muted-foreground">
            <p className="text-xs">Enter로 전송 · Shift+Enter로 줄바꿈</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AiResultCard({ worklog }: { worklog: Worklog }) {
  const author = users.find((member) => member.id === worklog.authorId);
  const team = teams.find((item) => item.id === worklog.teamId);

  return (
    <Link
      to={`/worklog/detail/${worklog.id}`}
      className="block rounded-2xl border border-border/70 bg-muted/25 p-4 transition-all duration-200 hover:border-primary/35 hover:bg-primary/8"
    >
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge status={worklog.status} />
        <ImportanceBadge importance={worklog.importance} />
      </div>
      <p className="mt-3 line-clamp-2 text-sm font-semibold leading-6 text-foreground">
        {worklog.title}
      </p>
      <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">
        {worklog.aiSummary}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <span>{team?.name ?? "팀 미지정"}</span>
        <span>{author?.name ?? "작성자 미지정"}</span>
        <span>마감 {formatDate(worklog.dueDate)}</span>
      </div>
    </Link>
  );
}

function resolveAiModeResults(question: string, source: Worklog[]) {
  const normalizedQuestion = question.toLowerCase();
  const tokens = normalizedQuestion
    .split(/[\s,./·]+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 2);

  const statusHints = [
    { words: ["진행", "진행중", "진행 중"], status: "IN_PROGRESS" },
    { words: ["완료", "끝난"], status: "DONE" },
    { words: ["대기"], status: "PENDING" },
  ] as const;
  const hintedStatus = statusHints.find((hint) =>
    hint.words.some((word) => normalizedQuestion.includes(word)),
  )?.status;

  return source
    .map((worklog) => {
      const author = users.find((member) => member.id === worklog.authorId);
      const team = teams.find((item) => item.id === worklog.teamId);
      const searchable = [
        worklog.title,
        worklog.requestContent,
        worklog.workContent,
        worklog.aiSummary,
        author?.name,
        team?.name,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const tokenScore = tokens.reduce(
        (score, token) => score + (searchable.includes(token) ? 2 : 0),
        0,
      );
      const statusScore = hintedStatus && worklog.status === hintedStatus ? 2 : 0;
      const dueScore =
        normalizedQuestion.includes("마감") || normalizedQuestion.includes("임박")
          ? Math.max(0, 5 - Math.abs(new Date(worklog.dueDate).getDate() - 13))
          : 0;

      return {
        worklog,
        score: tokenScore + statusScore + dueScore,
      };
    })
    .filter((item) => item.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, 5)
    .map((item) => item.worklog);
}
