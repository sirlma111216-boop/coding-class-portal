import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { moduleByNumber } from "@/data/course";
import {
  ModuleHeader,
  Section,
  LearningObjectives,
  KeyMessage,
  ConceptCard,
  InstructorTip,
  CompletionChecklist,
  ModuleNavigation,
} from "@/components/module-ui";

const m = moduleByNumber(3)!;

type Term = { term: string; category: "ui" | "data" | "ship"; desc: string };

const terms: Term[] = [
  { term: "Frontend(프론트엔드)", category: "ui", desc: "사용자가 직접 보는 화면과 상호작용." },
  { term: "UI", category: "ui", desc: "버튼, 카드, 입력창처럼 사용자가 보는 구성 요소." },
  { term: "UX", category: "ui", desc: "사용자가 앱을 이용하며 겪는 전체 경험." },
  { term: "HTML", category: "ui", desc: "웹페이지의 뼈대와 구조." },
  { term: "CSS", category: "ui", desc: "색, 글꼴, 간격, 배치 같은 옷과 스타일." },
  { term: "Component", category: "ui", desc: "여러 화면에서 재사용하는 버튼·카드 같은 조각." },
  { term: "Responsive", category: "ui", desc: "휴대전화, 태블릿, PC에 맞게 화면이 변하는 것." },
  { term: "Backend(백엔드)", category: "data", desc: "화면 뒤에서 데이터와 규칙을 처리하는 부분." },
  { term: "Database(데이터베이스)", category: "data", desc: "앱이 정보를 기억하는 창고." },
  { term: "Authentication(인증)", category: "data", desc: "사용자가 누구인지 확인하는 로그인 기능." },
  { term: "API", category: "data", desc: "서로 다른 프로그램이 요청과 응답을 주고받는 연결 통로." },
  { term: "Secret / API Key", category: "data", desc: "외부 서비스를 사용할 때 필요한 비밀 열쇠." },
  { term: "Edge Function / Server Function", category: "data", desc: "비밀 키를 숨긴 채 서버에서 실행하는 기능." },
  { term: "Prompt", category: "ship", desc: "AI에게 주는 제작 지시." },
  { term: "PRD", category: "ship", desc: "만들 제품의 목적, 대상, 기능, 화면을 정리한 설계 문서." },
  { term: "MVP", category: "ship", desc: "가장 중요한 문제 하나를 해결하는 최소 기능 제품." },
  { term: "Debugging", category: "ship", desc: "오류 원인을 찾고 고치는 과정." },
  { term: "IDE", category: "ship", desc: "화면과 메뉴를 보며 코드를 다루는 작업 공간." },
  { term: "CLI", category: "ship", desc: "명령어를 입력해 작업하는 방식." },
  { term: "Repository", category: "ship", desc: "코드와 변경 기록을 보관하는 저장소." },
  { term: "GitHub", category: "ship", desc: "코드 저장·협업·버전 관리를 돕는 서비스." },
  { term: "Deploy / Publish", category: "ship", desc: "다른 사람이 접속할 수 있도록 앱을 인터넷에 올리는 것." },
  { term: "Domain", category: "ship", desc: "사용자가 입력하는 웹 주소." },
];

const categories: { id: "all" | "ui" | "data" | "ship"; label: string }[] = [
  { id: "all", label: "전체" },
  { id: "ui", label: "화면과 구조" },
  { id: "data", label: "기능과 기억" },
  { id: "ship", label: "제작과 배포" },
];

export default function Mod03() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<"all" | "ui" | "data" | "ship">("all");

  const filtered = useMemo(
    () =>
      terms.filter(
        (t) =>
          (cat === "all" || t.category === cat) &&
          (q.trim() === "" ||
            t.term.toLowerCase().includes(q.toLowerCase()) ||
            t.desc.toLowerCase().includes(q.toLowerCase())),
      ),
    [q, cat],
  );

  return (
    <article className="max-w-4xl mx-auto px-5 sm:px-8 py-10">
      <ModuleHeader module={m} />

      <LearningObjectives
        items={[
          "프론트엔드, 백엔드, 데이터베이스, API의 역할을 구분할 수 있다.",
          "HTML과 CSS의 차이를 설명할 수 있다.",
          "IDE, CLI, 배포, 도메인 같은 기본 용어를 이해할 수 있다.",
        ]}
      />

      <KeyMessage>
        용어는 외우는 것이 아니라, AI와 대화할 때 길을 잃지 않기 위한 지도입니다.
      </KeyMessage>

      <Section title="네 가지 비유로 한 번에">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            ["HTML", "뼈대", "🦴"],
            ["CSS", "옷", "👕"],
            ["Database", "기억의 창고", "📦"],
            ["API", "번역기·연결 통로", "🔌"],
          ].map(([t, d, e]) => (
            <ConceptCard key={t} title={`${t} = ${d}`}>
              <div className="text-4xl mb-1">{e}</div>
            </ConceptCard>
          ))}
        </div>
      </Section>

      <Section title="용어 사전" eyebrow="검색과 분류">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-text" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="용어 또는 설명으로 검색"
              className="w-full pl-9 pr-3 py-2 rounded-md border border-hairline bg-canvas outline-none focus:border-coral text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-1">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setCat(c.id)}
                className={`text-sm px-3 py-1.5 rounded-md ${
                  cat === c.id
                    ? "bg-surface-cream-strong text-ink font-medium"
                    : "text-muted-text hover:bg-surface-card"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="text-sm text-muted-text p-6 text-center bg-surface-soft rounded-lg">
            검색 결과가 없습니다.
          </p>
        ) : (
          <ul className="divide-y divide-hairline border border-hairline rounded-lg overflow-hidden">
            {filtered.map((t) => (
              <li key={t.term} className="p-4 bg-canvas">
                <div className="flex items-baseline justify-between gap-3 flex-wrap">
                  <span className="font-semibold text-ink">{t.term}</span>
                  <span className="text-[11px] uppercase tracking-widest text-muted-text">
                    {categories.find((c) => c.id === t.category)?.label}
                  </span>
                </div>
                <p className="text-sm text-body mt-1">{t.desc}</p>
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={() => window.print()}
          className="mt-4 text-sm text-coral hover:text-coral-active font-medium no-print"
        >
          용어 카드 인쇄하기 →
        </button>
      </Section>

      <InstructorTip>
        “HTML/CSS”, “API”, “PRD” 세 단어만 끝까지 가져가게 합니다. 이후 모듈에서
        반복적으로 쓰입니다.
      </InstructorTip>

      <CompletionChecklist
        storageKey="vibecoding:mod03:check"
        items={[
          "프론트엔드와 백엔드의 차이를 설명할 수 있다.",
          "API가 무엇인지 비유로 말할 수 있다.",
          "MVP와 PRD의 의미를 구분할 수 있다.",
        ]}
      />

      <ModuleNavigation module={m} />
    </article>
  );
}
