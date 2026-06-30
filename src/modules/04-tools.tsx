import { useMemo, useState } from "react";
import { moduleByNumber } from "@/data/course";
import {
  ModuleHeader,
  Section,
  LearningObjectives,
  KeyMessage,
  InstructorTip,
  CompletionChecklist,
  ModuleNavigation,
  PracticePanel,
} from "@/components/module-ui";

const m = moduleByNumber(4)!;

type Difficulty = "쉬움" | "보통" | "도전";
type Tool = {
  name: string;
  group: "beginner" | "code";
  oneLine: string;
  goodFor: string;
  difficulty: Difficulty;
  output: string;
  caution: string;
  tags: Filter[];
};

type Filter =
  | "빠른 수업 자료"
  | "작동하는 웹앱"
  | "생성형 AI 기능"
  | "코드 직접 수정"
  | "배포와 운영";

const tools: Tool[] = [
  {
    name: "Canva Code",
    group: "beginner",
    oneLine: "디자인 도구에서 작은 인터랙티브 컴포넌트를 만든다.",
    goodFor: "수업 자료에 끼우는 미니 위젯",
    difficulty: "쉬움",
    output: "임베드 가능한 위젯",
    caution: "복잡한 데이터 흐름은 어렵다.",
    tags: ["빠른 수업 자료"],
  },
  {
    name: "Claude Artifacts",
    group: "beginner",
    oneLine: "대화 안에서 작동하는 작은 앱과 시각화를 즉시 만든다.",
    goodFor: "단일 화면 시뮬레이션, 빠른 프로토타입",
    difficulty: "쉬움",
    output: "단일 페이지 앱",
    caution: "대화 세션을 벗어나면 배포 흐름이 약하다.",
    tags: ["빠른 수업 자료", "생성형 AI 기능"],
  },
  {
    name: "Google AI Studio",
    group: "beginner",
    oneLine: "Gemini 모델로 프롬프트와 도구를 시험한다.",
    goodFor: "AI 기능 설계 실험",
    difficulty: "보통",
    output: "프롬프트·간단한 앱",
    caution: "프로덕션 앱은 다른 도구와 결합해야 한다.",
    tags: ["생성형 AI 기능"],
  },
  {
    name: "Lovable",
    group: "beginner",
    oneLine: "대화로 풀스택 웹앱을 만들고 배포까지 한다.",
    goodFor: "교사용 도구, 평가 피드백 앱, 프로토타입 전반",
    difficulty: "쉬움",
    output: "배포 가능한 풀스택 웹앱",
    caution: "복잡한 보안·권한은 사람이 검토해야 한다.",
    tags: ["작동하는 웹앱", "배포와 운영", "생성형 AI 기능"],
  },
  {
    name: "Replit Agent",
    group: "beginner",
    oneLine: "브라우저 IDE에서 에이전트가 코드 작업을 수행한다.",
    goodFor: "간단한 스크립트, 학습용 미니앱",
    difficulty: "보통",
    output: "스크립트·웹앱",
    caution: "결과 코드 품질은 검토 필요.",
    tags: ["작동하는 웹앱", "코드 직접 수정"],
  },
  {
    name: "Antigravity",
    group: "code",
    oneLine: "에이전트형 코드 워크스페이스.",
    goodFor: "더 큰 코드 단위 자동화",
    difficulty: "도전",
    output: "코드 변경 세트",
    caution: "개발자 워크플로우에 익숙해야 한다.",
    tags: ["코드 직접 수정"],
  },
  {
    name: "Codex",
    group: "code",
    oneLine: "OpenAI 기반 코딩 에이전트.",
    goodFor: "리팩터링, 기능 추가",
    difficulty: "도전",
    output: "코드 변경",
    caution: "사용 정책·요금 변경 가능.",
    tags: ["코드 직접 수정"],
  },
  {
    name: "Cursor",
    group: "code",
    oneLine: "AI 기능이 통합된 코드 에디터.",
    goodFor: "기존 프로젝트에 AI 보조 추가",
    difficulty: "도전",
    output: "코드 편집",
    caution: "에디터 학습이 필요.",
    tags: ["코드 직접 수정"],
  },
  {
    name: "Claude Code",
    group: "code",
    oneLine: "터미널 기반 에이전트.",
    goodFor: "코드 검토, 자동화",
    difficulty: "도전",
    output: "코드 변경",
    caution: "CLI 사용 경험이 필요.",
    tags: ["코드 직접 수정"],
  },
];

const allTags: Filter[] = [
  "빠른 수업 자료",
  "작동하는 웹앱",
  "생성형 AI 기능",
  "코드 직접 수정",
  "배포와 운영",
];

export default function Mod04() {
  const [active, setActive] = useState<Filter | "전체">("전체");

  const filtered = useMemo(
    () =>
      active === "전체" ? tools : tools.filter((t) => t.tags.includes(active)),
    [active],
  );

  // Selector
  const [goal, setGoal] = useState<string>("");
  const [exp, setExp] = useState<string>("");
  const [deploy, setDeploy] = useState<string>("");

  const recommend = (): { name: string; why: string }[] => {
    const recs: { name: string; why: string }[] = [];
    if (goal === "수업자료") recs.push({ name: "Claude Artifacts", why: "단일 화면 미니 앱·시뮬레이션을 가장 빠르게 만듭니다." });
    if (goal === "웹앱") recs.push({ name: "Lovable", why: "PRD → 화면 → 기능 → 배포 흐름을 한 도구에서 끝낼 수 있습니다." });
    if (goal === "AI기능") recs.push({ name: "Google AI Studio", why: "AI 모델 동작과 프롬프트를 빠르게 검증할 수 있습니다." });
    if (exp === "초급" && goal === "웹앱") recs.push({ name: "Lovable", why: "초급자가 풀스택 흐름을 가장 빠르게 경험합니다." });
    if (exp === "코드경험") recs.push({ name: "Cursor", why: "기존 코드를 직접 다루며 AI 보조를 받습니다." });
    if (deploy === "필요") recs.push({ name: "Lovable", why: "배포·공유 URL이 한 번에 만들어집니다." });
    return Array.from(new Map(recs.map((r) => [r.name, r])).values()).slice(0, 2);
  };

  return (
    <article className="max-w-5xl mx-auto px-5 sm:px-8 py-10">
      <ModuleHeader module={m} />

      <LearningObjectives
        items={[
          "입문형 도구와 코드 중심 도구를 구분할 수 있다.",
          "제작 목적에 맞는 도구를 선택할 수 있다.",
          "하나의 도구에 종속되지 않고 작업 흐름을 이해할 수 있다.",
        ]}
      />

      <KeyMessage>
        도구의 순위가 아니라, 내가 만들 결과에 맞는 도구를 고르는 것이 먼저입니다.
      </KeyMessage>

      <Section title="필터로 좁혀 보기">
        <div className="flex flex-wrap gap-2 mb-6">
          {(["전체", ...allTags] as const).map((f) => (
            <button
              key={f}
              onClick={() => setActive(f as Filter | "전체")}
              className={`text-sm px-3 py-1.5 rounded-pill ${
                active === f
                  ? "bg-coral text-white"
                  : "bg-surface-card text-ink hover:bg-surface-cream-strong"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((t) => (
            <div
              key={t.name}
              className="bg-canvas border border-hairline rounded-lg p-5 hover:border-coral/40 transition-colors"
            >
              <div className="flex items-baseline justify-between mb-2">
                <h3 className="serif text-xl">{t.name}</h3>
                <span
                  className={`text-[10px] uppercase tracking-widest font-medium px-2 py-0.5 rounded-pill ${
                    t.group === "beginner" ? "bg-coral/10 text-coral" : "bg-ink text-canvas"
                  }`}
                >
                  {t.group === "beginner" ? "입문" : "코드"}
                </span>
              </div>
              <p className="text-sm text-body mb-3 leading-relaxed">{t.oneLine}</p>
              <dl className="text-xs space-y-1.5 text-body">
                <div><dt className="inline text-muted-text">잘 맞는 작업 · </dt><dd className="inline">{t.goodFor}</dd></div>
                <div><dt className="inline text-muted-text">난이도 · </dt><dd className="inline">{t.difficulty}</dd></div>
                <div><dt className="inline text-muted-text">결과물 · </dt><dd className="inline">{t.output}</dd></div>
                <div><dt className="inline text-muted-text">주의 · </dt><dd className="inline">{t.caution}</dd></div>
              </dl>
            </div>
          ))}
        </div>
      </Section>

      <div className="bg-coral/5 border-l-4 border-coral rounded-r-lg p-6 my-8">
        <p className="text-body-strong leading-relaxed">
          오늘은 여러 도구 중 <strong>러버블</strong>을 이용해 “처음부터 끝까지
          완성하는 경험”에 집중합니다.
        </p>
      </div>

      <PracticePanel title="직접 해보기 — 도구 선택 도우미">
        <div className="grid sm:grid-cols-3 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-ink block mb-1.5">만들고 싶은 것</span>
            <select value={goal} onChange={(e) => setGoal(e.target.value)} className="w-full px-3 py-2 rounded-md border border-hairline bg-canvas text-sm">
              <option value="">선택</option>
              <option value="수업자료">수업 자료 위젯</option>
              <option value="웹앱">작동하는 웹앱</option>
              <option value="AI기능">AI 기능 실험</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-ink block mb-1.5">현재 수준</span>
            <select value={exp} onChange={(e) => setExp(e.target.value)} className="w-full px-3 py-2 rounded-md border border-hairline bg-canvas text-sm">
              <option value="">선택</option>
              <option value="초급">코딩 거의 처음</option>
              <option value="중급">앱 한두 번 만들어 봄</option>
              <option value="코드경험">코드 직접 다뤄 봄</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-ink block mb-1.5">배포·공유</span>
            <select value={deploy} onChange={(e) => setDeploy(e.target.value)} className="w-full px-3 py-2 rounded-md border border-hairline bg-canvas text-sm">
              <option value="">선택</option>
              <option value="필요">공유 링크 필요</option>
              <option value="불필요">우선 내가 써 보기</option>
            </select>
          </label>
        </div>

        {recommend().length > 0 && (
          <div className="mt-6 space-y-2">
            <p className="text-xs uppercase tracking-widest text-muted-text font-medium">추천</p>
            {recommend().map((r) => (
              <div key={r.name} className="p-4 bg-surface-card rounded-lg">
                <p className="font-semibold text-ink mb-0.5">{r.name}</p>
                <p className="text-sm text-body">{r.why}</p>
              </div>
            ))}
          </div>
        )}
      </PracticePanel>

      <InstructorTip>
        하나의 도구를 “좋다/나쁘다”로 단정하지 않습니다. 같은 도구도 목적이 다르면
        선택이 달라진다는 점을 강조합니다.
      </InstructorTip>

      <CompletionChecklist
        storageKey="vibecoding:mod04:check"
        items={[
          "입문형 도구와 코드 중심 도구를 구분할 수 있다.",
          "내가 만들 결과에 맞춰 한두 가지 도구를 고를 수 있다.",
          "도구를 선택하는 기준 세 가지를 말할 수 있다.",
        ]}
      />

      <ModuleNavigation module={m} />
    </article>
  );
}
