import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Copy, CheckCheck, ExternalLink, Search } from "lucide-react";

type Category =
  | "전체"
  | "첫 프로젝트"
  | "PRD"
  | "오류 수정"
  | "백엔드"
  | "생성형 API"
  | "테스트"
  | "디지털 윤리";

const cats: Category[] = [
  "전체", "첫 프로젝트", "PRD", "오류 수정", "백엔드", "생성형 API", "테스트", "디지털 윤리",
];

type Resource = {
  id: string;
  title: string;
  when: string;
  category: Exclude<Category, "전체">;
  body: string;
  moduleSlug?: string;
  moduleLabel?: string;
};

const resources: Resource[] = [
  {
    id: "first-prompt",
    title: "AI 형성평가 피드백 도우미 — 첫 프롬프트",
    when: "러버블에서 첫 프로젝트를 만들 때",
    category: "첫 프로젝트",
    moduleSlug: "07-first-project",
    moduleLabel: "Module 7",
    body: `중학교 교사가 형성평가 후 학생에게 개별 피드백을 작성할 수 있는 한국어 웹앱을 만들어줘.

앱 이름은 "AI 형성평가 피드백 도우미"야.

사용자는 교사이고, 학생 실명이나 개인정보는 입력하지 않아.

교사가 입력할 항목:
1. 학교급 2. 교과 3. 학년 4. 단원 5. 학생 답변 6. 학생 수준 7. 강조할 점

출력 결과:
- 격려 1문장 / 잘한 점 1문장 / 보완할 점 1문장 / 다음 학습 행동 1문장

핵심 기능 4개만: 입력, 피드백 생성, 결과 복사, 다시 작성.

처음에는 실제 AI API 없이, 예시 규칙으로 작동하는 프로토타입을 만들어줘.`,
  },
  {
    id: "rev-usability",
    title: "수정 프롬프트 — 사용성",
    when: "입력 화면을 가다듬을 때",
    category: "첫 프로젝트",
    moduleSlug: "07-first-project",
    moduleLabel: "Module 7",
    body: `현재 기능은 유지하고 입력 화면의 사용성을 개선해줘. 필수 항목을 명확히 표시하고, 각 입력창에 교사가 이해하기 쉬운 예시를 넣어줘. 결과 생성 전에는 입력 내용을 확인할 수 있게 해줘. 다른 페이지와 기능은 변경하지 마.`,
  },
  {
    id: "rev-quality",
    title: "수정 프롬프트 — 결과 품질",
    when: "피드백 문장을 다듬을 때",
    category: "첫 프로젝트",
    moduleSlug: "07-first-project",
    moduleLabel: "Module 7",
    body: `현재 결과 카드의 구조를 유지하면서 피드백을 '격려, 잘한 점, 보완할 점, 다음 행동' 네 영역으로 구분해줘. 비난·단정 표현 금지, 관찰 가능한 행동 중심.`,
  },
  {
    id: "rev-test",
    title: "수정 프롬프트 — 테스트",
    when: "마무리 점검을 시킬 때",
    category: "테스트",
    moduleSlug: "07-first-project",
    moduleLabel: "Module 7",
    body: `새 기능을 추가하지 말고 현재 앱의 핵심 사용자 흐름을 테스트해줘. 빈 입력, 매우 긴 입력, 모바일 화면, 결과 복사, 다시 작성을 확인하고 발견한 문제만 수정해줘.`,
  },
  {
    id: "error-template",
    title: "구조화된 오류 요청 템플릿",
    when: "버그를 정확히 묘사하고 싶을 때",
    category: "오류 수정",
    moduleSlug: "07-first-project",
    moduleLabel: "Module 7",
    body: `현재 문제:
재현 순서:
기대한 결과:
실제 결과:
오류 메시지:
변경하면 안 되는 부분:
이 문제의 원인을 먼저 설명하고, 가장 작은 수정으로 해결한 뒤 다시 테스트해줘.`,
  },
  {
    id: "prd-skeleton",
    title: "PRD 7요소 스켈레톤",
    when: "처음 PRD를 쓸 때",
    category: "PRD",
    moduleSlug: "08-prd-workshop",
    moduleLabel: "Module 8",
    body: `# PRD
- 앱 이름:
- 한 줄 개요:
- 주요 사용자:
- 해결할 교육 문제:
- 사용 상황:
- 핵심 기능 (최대 3): 1) 2) 3)
- 입력 / 처리 / 출력:
- 화면 구성:
- 하지 않을 기능:
- 개인정보·윤리 제한:
- 성공 기준:`,
  },
  {
    id: "backend-check",
    title: "백엔드가 필요한가? 6문항 체크",
    when: "프로젝트 초반에 빠르게 판단할 때",
    category: "백엔드",
    moduleSlug: "09-backend",
    moduleLabel: "Module 9",
    body: `1. 앱을 닫아도 기록이 남아야 하나요?
2. 여러 기기에서 같은 기록을 봐야 하나요?
3. 교사와 학생의 권한이 달라야 하나요?
4. 파일을 업로드해야 하나요?
5. API 키처럼 숨겨야 하는 정보가 있나요?
6. 여러 사용자가 같은 데이터를 사용하나요?

'예'가 0개 → 프론트엔드만 / 1~2개 (혼자만 저장) → localStorage / 그 외 → 백엔드 연결`,
  },
  {
    id: "ai-secure-prompt",
    title: "생성형 AI 보안·구현 프롬프트",
    when: "AI 기능을 안전하게 연결할 때",
    category: "생성형 API",
    moduleSlug: "10-generative-api",
    moduleLabel: "Module 10",
    body: `현재 앱에 생성형 AI 피드백 기능을 추가해줘.

보안: API 키는 서버 secret에만 두고 서버 함수에서 호출. 브라우저·localStorage에 절대 노출 금지.

AI 역할: 입력을 분석해 JSON {encouragement, strength, improvement, nextAction} 반환. 학생 단정 금지.

앱 동작: 로딩 표시, 실패 시 한국어 오류 + 다시 시도, JSON 검증, 모의 응답을 대체 흐름으로 유지.

먼저 구현 계획과 필요한 secret 이름을 설명한 뒤 구현하고, 정상/실패 흐름을 모두 테스트해줘.`,
  },
  {
    id: "ai-design-six",
    title: "좋은 AI 기능 설계 6요소",
    when: "AI 기능을 설계 단계에서 점검할 때",
    category: "생성형 API",
    moduleSlug: "10-generative-api",
    moduleLabel: "Module 10",
    body: `1. 입력이 분명한가?
2. AI의 역할이 한정되어 있는가?
3. 출력 형식이 고정되어 있는가?
4. 개인정보를 막는가?
5. 실패 시 대체 흐름이 있는가?
6. 최종 검토자가 교사인가?`,
  },
  {
    id: "test-cases",
    title: "공통 테스트 케이스",
    when: "공유 전 마지막 점검",
    category: "테스트",
    moduleSlug: "11-classroom-project",
    moduleLabel: "Module 11",
    body: `- 정상 입력
- 빈 입력
- 예상보다 긴 입력
- 모바일 화면
- 잘못된 입력
- AI/API 실패 또는 네트워크 실패`,
  },
  {
    id: "ethics-10",
    title: "공개 전 10문항 점검",
    when: "공유 링크를 만들기 직전",
    category: "디지털 윤리",
    moduleSlug: "12-digital-ethics",
    moduleLabel: "Module 12",
    body: `1. 학생 실명·민감정보 미요구
2. 필요 이상 데이터 미저장
3. API 키 비노출
4. 사용자 권한 확인
5. AI 결과 교사 검토
6. 실패·오류 상황 테스트
7. 저작권·출처 확인
8. 모바일·키보드 사용 확인
9. 학습 목표·기능 연결
10. 외부 공유 범위 확인`,
  },
];

const docs = [
  ["Lovable 시작하기", "https://docs.lovable.dev/"],
  ["프롬프트 작성 모범 사례", "https://docs.lovable.dev/prompting"],
  ["Project knowledge", "https://docs.lovable.dev/features/knowledge"],
  ["GitHub 연결", "https://docs.lovable.dev/integrations/git"],
  ["Lovable Cloud / 백엔드", "https://docs.lovable.dev/features/cloud"],
  ["AI 통합과 secret 관리", "https://docs.lovable.dev/features/ai"],
  ["테스트", "https://docs.lovable.dev/features/testing"],
  ["배포(Publish)", "https://docs.lovable.dev/features/publishing"],
];

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "자료실 — 내 수업에 코딩 한 스푼" },
      { name: "description", content: "연수에서 사용한 모든 복사 가능한 프롬프트, 체크리스트, 공식 문서 링크 모음." },
      { property: "og:title", content: "자료실" },
      { property: "og:description", content: "프롬프트·체크리스트·공식 문서 모음" },
    ],
  }),
  component: ResourcesPage,
});

function ResourcesPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<Category>("전체");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      resources.filter(
        (r) =>
          (cat === "전체" || r.category === cat) &&
          (q.trim() === "" ||
            r.title.toLowerCase().includes(q.toLowerCase()) ||
            r.body.toLowerCase().includes(q.toLowerCase())),
      ),
    [q, cat],
  );

  const copy = async (r: Resource) => {
    try {
      await navigator.clipboard.writeText(r.body);
      setCopiedId(r.id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch {}
  };

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10 sm:py-16">
      <p className="text-xs uppercase tracking-widest text-muted-text font-medium mb-3 spike">
        자료실
      </p>
      <h1 className="serif text-5xl mb-3">언제든 다시 꺼내 쓰세요</h1>
      <p className="text-body max-w-2xl mb-8">
        연수에서 사용한 모든 복사 가능한 프롬프트와 체크리스트, 그리고 공식 문서
        링크를 모았습니다.
      </p>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-text" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="자료 검색"
            className="w-full pl-9 pr-3 py-2 rounded-md border border-hairline bg-canvas outline-none focus:border-coral text-sm"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mb-8">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`text-sm px-3 py-1.5 rounded-md ${
              cat === c
                ? "bg-surface-cream-strong text-ink font-medium"
                : "text-muted-text hover:bg-surface-card"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-muted-text bg-surface-soft rounded-lg p-10">
          해당하는 자료가 없습니다.
        </p>
      ) : (
        <ul className="grid md:grid-cols-2 gap-4 mb-16">
          {filtered.map((r) => (
            <li key={r.id} className="bg-canvas border border-hairline rounded-lg p-5 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] uppercase tracking-widest font-medium text-coral">
                  {r.category}
                </span>
                {r.moduleSlug && r.moduleLabel && (
                  <Link
                    to="/modules/$slug"
                    params={{ slug: r.moduleSlug }}
                    className="text-xs text-muted-text hover:text-ink"
                  >
                    {r.moduleLabel} →
                  </Link>
                )}
              </div>
              <h3 className="serif text-xl mb-1">{r.title}</h3>
              <p className="text-xs text-muted-text mb-3">언제: {r.when}</p>
              <pre className="bg-surface-dark text-on-dark rounded-md p-3 text-xs leading-relaxed whitespace-pre-wrap font-mono overflow-x-auto flex-1 mb-3 max-h-48">
                {r.body}
              </pre>
              <button
                onClick={() => copy(r)}
                className="self-start inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-md bg-coral text-white hover:bg-coral-active"
              >
                {copiedId === r.id ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedId === r.id ? "복사됨" : "복사하기"}
              </button>
            </li>
          ))}
        </ul>
      )}

      <section className="bg-surface-dark text-on-dark rounded-lg p-8">
        <p className="text-xs uppercase tracking-widest opacity-70 font-medium mb-3">
          공식 문서에서 다시 확인하기
        </p>
        <h2 className="serif text-3xl mb-4 text-on-dark">최신 정보는 항상 공식 문서</h2>
        <p className="text-on-dark-soft text-sm mb-6">
          서비스의 기능·화면·요금은 변경될 수 있으므로 실제 사용 전 공식 문서를
          확인하세요.
        </p>
        <ul className="grid sm:grid-cols-2 gap-2">
          {docs.map(([t, href]) => (
            <li key={href}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-2 px-4 py-3 rounded-md bg-surface-dark-elevated hover:bg-white/10 transition-colors"
              >
                <span className="text-on-dark text-sm">{t}</span>
                <ExternalLink className="w-3.5 h-3.5 text-on-dark-soft" />
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
