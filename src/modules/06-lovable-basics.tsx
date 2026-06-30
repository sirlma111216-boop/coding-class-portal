import { useMemo, useState } from "react";
import { moduleByNumber } from "@/data/course";
import {
  ModuleHeader,
  Section,
  LearningObjectives,
  KeyMessage,
  ConceptCard,
  CopyBlock,
  InstructorTip,
  CompletionChecklist,
  ModuleNavigation,
  PracticePanel,
  Warning,
} from "@/components/module-ui";
import lovableInterface from "@/assets/lovable-interface-annotated.png.asset.json";
import lovableDashboard from "@/assets/lovable-dashboard-annotated.png.asset.json";

const m = moduleByNumber(6)!;

  { id: "title", title: "프로젝트 제목", description: "현재 작업 중인 프로젝트 이름과 상태를 보여줍니다.", left: 0.3, top: 0.5, width: 9.5, height: 4, color: "#8b5cf6" },
  { id: "preview-mode", title: "Preview 모드", description: "편집 결과를 미리보기 상태로 확인합니다.", left: 50.8, top: 0.5, width: 3, height: 3.2, color: "#f97316" },
  { id: "page", title: "페이지 선택", description: "현재 보고 있는 페이지를 선택하거나 바꿉니다.", left: 73.5, top: 0.5, width: 9, height: 3.2, color: "#eab308" },
  { id: "share", title: "Share", description: "프로젝트를 다른 사람과 공유합니다.", left: 93.5, top: 0.5, width: 3.2, height: 3.2, color: "#ec4899" },
  { id: "publish", title: "Publish", description: "완성한 앱을 공유 가능한 웹앱으로 배포합니다.", left: 96.9, top: 0.5, width: 3, height: 3.2, color: "#3b82f6" },
  { id: "chat", title: "채팅 / Agent 작업 영역", description: "대화로 앱을 만들고 수정하는 공간입니다.", left: 10.2, top: 4.5, width: 39.5, height: 82, color: "#10b981" },
  { id: "prompt", title: "프롬프트 입력창", description: "요구사항을 입력해 다음 작업을 지시합니다.", left: 10.2, top: 88, width: 39.5, height: 11, color: "#3b82f6" },
  { id: "preview", title: "Preview", description: "실제 화면이 어떻게 보이는지 즉시 확인합니다.", left: 50, top: 4.5, width: 49.7, height: 89, color: "#ef4444" },
  { id: "visual-edits", title: "Visual edits", description: "화면 요소를 직접 선택해 수정할 때 사용합니다.", left: 72.5, top: 95, width: 8, height: 4.5, color: "#8b5cf6" },
];

const dashboardHotspots: Hotspot[] = [
  { id: "workspace", title: "워크스페이스 선택", description: "현재 작업 중인 워크스페이스를 선택합니다.", left: 0.3, top: 4, width: 10, height: 3.7, color: "#f97316" },
  { id: "search", title: "Search", description: "프로젝트나 필요한 항목을 빠르게 찾습니다.", left: 0.3, top: 10.8, width: 10, height: 2.8, color: "#3b82f6" },
  { id: "resources", title: "Resources", description: "가이드와 참고 자료를 확인합니다.", left: 0.3, top: 13.9, width: 10, height: 2.8, color: "#ec4899" },
  { id: "connectors", title: "Connectors", description: "외부 서비스나 도구를 연결합니다.", left: 0.3, top: 16.8, width: 10, height: 2.8, color: "#06b6d4" },
  { id: "dashboard", title: "프로젝트 대시보드", description: "새 프로젝트를 만들고 기존 작업으로 돌아오는 시작 화면입니다.", left: 10.7, top: 0, width: 89, height: 60, color: "#3b82f6" },
  { id: "new-input", title: "새 프로젝트 생성 입력창", description: "무엇을 만들지 입력하면 러버블이 프로젝트 생성을 시작합니다.", left: 42, top: 20.5, width: 27, height: 9, color: "#3b82f6" },
  { id: "build", title: "Build", description: "입력한 요구사항으로 새 프로젝트 생성을 실행합니다.", left: 61.5, top: 24, width: 3.5, height: 4.5, color: "#22c55e" },
  { id: "filter", title: "프로젝트 필터 탭", description: "프로젝트를 조건에 따라 필터링하여 볼 수 있습니다.", left: 12.5, top: 63, width: 22, height: 5.5, color: "#3b82f6" },
  { id: "list", title: "프로젝트 목록", description: "이전에 만들었던 프로젝트를 열고 이어서 작업합니다.", left: 12.5, top: 69.5, width: 80, height: 22, color: "#ec4899" },
  { id: "published", title: "Published 표시", description: "이미 배포된 프로젝트임을 보여줍니다.", left: 30.7, top: 84.5, width: 3.8, height: 3, color: "#eab308" },
];



const pipeline = [
  "문제 정의",
  "PRD와 첫 프롬프트",
  "프로토타입 확인",
  "기능별 수정",
  "테스트와 디버깅",
  "배포와 공유",
];

const tips = [
  "첫 요청에 대상, 문제, 입력, 출력, 핵심 기능을 쓴다.",
  "한 번에 한 기능씩 추가한다.",
  "이미 잘 되는 부분은 `변경하지 말 것`이라고 적는다.",
  "실제 버튼 문구와 예시 데이터를 준다.",
  "오류가 나면 화면 캡처와 재현 순서를 함께 준다.",
  "큰 수정 전에는 현재 버전을 확인한다.",
  "디자인 수정과 기능 수정을 분리한다.",
  "구현 후에는 반드시 사용자 흐름을 직접 테스트한다.",
];

const checklist = [
  { key: "audience", label: "대상" },
  { key: "context", label: "수업 맥락" },
  { key: "problem", label: "해결할 문제" },
  { key: "input", label: "입력" },
  { key: "process", label: "처리" },
  { key: "output", label: "출력" },
  { key: "constraint", label: "제한 조건" },
];

export default function Mod06() {
  const [filled, setFilled] = useState<Record<string, boolean>>({});
  const filledCount = Object.values(filled).filter(Boolean).length;
  const readiness = Math.round((filledCount / checklist.length) * 100);

  const promptText = useMemo(() => {
    const lines: string[] = ["나쁜 프롬프트: 형성평가 앱 만들어줘.", "", "수정된 프롬프트:"];
    if (filled.audience) lines.push("- 대상: 중학교 1학년 과학 교사");
    if (filled.context) lines.push("- 수업 맥락: 산과 염기 단원 형성평가 직후");
    if (filled.problem) lines.push("- 문제: 학생 개별 피드백 작성 시간이 부족");
    if (filled.input) lines.push("- 입력: 정답률, 주요 오답 유형, 학생 수준");
    if (filled.process) lines.push("- 처리: 규칙 기반 피드백 문장 조합");
    if (filled.output) lines.push("- 출력: 격려·잘한 점·개선할 점 3문장 피드백");
    if (filled.constraint) lines.push("- 제한: 학생 실명 입력 금지, 모바일 친화");
    return lines.join("\n");
  }, [filled]);

  return (
    <article className="max-w-4xl mx-auto px-5 sm:px-8 py-10">
      <ModuleHeader module={m} />

      <LearningObjectives
        items={[
          "러버블의 기본 제작 흐름을 설명할 수 있다.",
          "프롬프트 수정과 시각적 수정의 차이를 이해할 수 있다.",
          "버전 기록, 프로젝트 지식, 미리보기, 테스트를 활용할 수 있다.",
        ]}
      />

      <KeyMessage>
        모든 메뉴를 외우지 마세요. 흐름을 외우면 메뉴는 따라옵니다.
      </KeyMessage>

      <Section title="기능 영역 한눈에">
        <Warning>인터페이스 명칭과 위치는 시간에 따라 바뀔 수 있습니다. 흐름과 역할만 익혀 두세요.</Warning>
        <div className="mt-4 space-y-8">
          <InteractiveImageHotspots
            sectionId="lovable-dashboard-hotspot-section"
            sectionTitle="러버블 대시보드"
            sectionDescription="새 프로젝트를 만들고, 기존 작업으로 돌아오는 시작 화면입니다."
            imageSrc={lovableDashboard.url}
            imageAlt="러버블 대시보드 화면"
            hotspots={dashboardHotspots}
          />
          <InteractiveImageHotspots
            sectionId="lovable-interface-hotspot-section"
            sectionTitle="러버블 작업 인터페이스"
            sectionDescription="대화로 앱을 만들고, 결과를 즉시 미리보기 하는 화면입니다."
            imageSrc={lovableInterface.url}
            imageAlt="러버블 작업 인터페이스 화면"
            hotspots={interfaceHotspots}
          />
        </div>
      </Section>


      <Section title="6단계 제작 파이프라인">
        <ol className="grid sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {pipeline.map((s, i) => (
            <li key={s} className="bg-surface-soft rounded-lg p-4 text-center">
              <div className="serif text-3xl text-coral leading-none mb-2">
                {String(i + 1).padStart(2, "0")}
              </div>
              <p className="text-sm text-body-strong">{s}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="초보자를 위한 8가지 사용 팁">
        <ol className="space-y-2">
          {tips.map((t, i) => (
            <li key={i} className="flex gap-3 p-3 bg-canvas border border-hairline rounded-md">
              <span className="shrink-0 w-7 h-7 rounded-full bg-ink text-canvas text-xs font-medium inline-flex items-center justify-center">
                {i + 1}
              </span>
              <span className="text-body-strong leading-relaxed">{t}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="프롬프트 비교">
        <div className="grid md:grid-cols-2 gap-4">
          <ConceptCard title="❌ 나쁜 예" tone="soft">
            <p className="font-mono text-sm">형성평가 앱 만들어줘.</p>
          </ConceptCard>
          <ConceptCard title="✓ 좋은 예">
            <p className="text-sm leading-relaxed">
              중학교 1학년 과학 교사가 산과 염기 단원 형성평가 후 학생 개별
              피드백을 작성하는 웹앱을 만들어줘. 교사는 정답률, 주요 오답 유형,
              학생 수준을 입력한다. 앱은 격려 1문장, 잘한 점 1문장, 개선할 점
              1문장으로 총 3문장 피드백을 출력한다. 학생 실명은 입력하지 않는다.
            </p>
          </ConceptCard>
        </div>
      </Section>

      <PracticePanel title="직접 해보기 — 프롬프트 준비도 측정">
        <p className="text-sm text-body mb-4">
          필요한 요소를 체크하면 좋은 프롬프트로 즉시 변환됩니다. (실제 AI를
          호출하지 않습니다 — 규칙 기반 데모입니다.)
        </p>
        <div className="grid sm:grid-cols-2 gap-2 mb-4">
          {checklist.map((c) => (
            <label key={c.key} className="flex items-center gap-2 p-2 rounded-md hover:bg-surface-card cursor-pointer">
              <input
                type="checkbox"
                checked={!!filled[c.key]}
                onChange={(e) => setFilled({ ...filled, [c.key]: e.target.checked })}
                className="accent-coral"
              />
              <span className="text-sm">{c.label}</span>
            </label>
          ))}
        </div>
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 h-2 bg-hairline rounded-full overflow-hidden">
            <div className="h-full bg-coral transition-all" style={{ width: `${readiness}%` }} />
          </div>
          <span className="serif text-xl text-coral">{readiness}%</span>
        </div>
        <CopyBlock label="프롬프트 미리보기" text={promptText} />
      </PracticePanel>

      <InstructorTip>
        “디자인 수정과 기능 수정을 분리한다”와 “큰 수정 전 버전 확인”은 실습 중
        실제 문제 상황과 함께 짚어 주세요.
      </InstructorTip>

      <CompletionChecklist
        storageKey="vibecoding:mod06:check"
        items={[
          "러버블 6단계 파이프라인을 순서대로 말할 수 있다.",
          "좋은 프롬프트의 7가지 요소를 들 수 있다.",
          "버전 기록과 시각적 수정이 언제 유용한지 안다.",
        ]}
      />

      <ModuleNavigation module={m} />
    </article>
  );
}
