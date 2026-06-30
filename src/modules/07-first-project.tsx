import { moduleByNumber } from "@/data/course";
import {
  ModuleHeader,
  Section,
  LearningObjectives,
  KeyMessage,
  CopyBlock,
  InstructorTip,
  CompletionChecklist,
  ModuleNavigation,
} from "@/components/module-ui";
import { useLocalStorage } from "@/hooks/use-local-storage";

const m = moduleByNumber(7)!;

const STARTER = `중학교 교사가 형성평가 후 학생에게 개별 피드백을 작성할 수 있는 한국어 웹앱을 만들어줘.

앱 이름은 "AI 형성평가 피드백 도우미"야.

사용자는 교사이고, 학생 실명이나 개인정보는 입력하지 않아.

교사가 입력할 항목:
1. 학교급: 초등 / 중등 / 고등
2. 교과
3. 학년
4. 단원 또는 학습 주제
5. 학생의 답변 또는 관찰 내용
6. 학생 수준: 도움이 필요함 / 기본 도달 / 충분히 도달
7. 피드백에서 강조할 점

출력 결과:
- 따뜻한 격려 1문장
- 잘한 점 1문장
- 보완할 점 1문장
- 다음 학습 행동 1문장

핵심 기능은 입력, 피드백 생성, 결과 복사, 다시 작성의 4개만 구현해줘.

처음에는 실제 AI API를 연결하지 말고, 예시 규칙을 이용해 작동하는 프로토타입을 만들어줘.

모든 문구는 한국어로 작성하고, 교사가 수업 중 빠르게 사용할 수 있도록 한 화면의 단순한 구조로 만들어줘. 모바일에서도 사용하기 편해야 해.`;

const REV1 = `현재 기능은 유지하고 입력 화면의 사용성을 개선해줘. 필수 항목을 명확히 표시하고, 각 입력창에 교사가 이해하기 쉬운 예시를 넣어줘. 결과 생성 전에는 입력 내용을 확인할 수 있게 해줘. 다른 페이지와 기능은 변경하지 마.`;

const REV2 = `현재 결과 카드의 구조를 유지하면서 피드백을 '격려, 잘한 점, 보완할 점, 다음 행동' 네 영역으로 구분해줘. 비난하거나 학생을 단정하는 표현은 피하고, 관찰 가능한 행동을 중심으로 쓰도록 안내 문구를 추가해줘.`;

const REV3 = `새 기능을 추가하지 말고 현재 앱의 핵심 사용자 흐름을 테스트해줘. 빈 입력, 매우 긴 입력, 모바일 화면, 결과 복사, 다시 작성 기능을 확인하고 발견한 문제만 수정해줘. 잘 작동하는 디자인은 변경하지 마.`;

const ERROR_TEMPLATE = `현재 문제:
재현 순서:
기대한 결과:
실제 결과:
오류 메시지:
변경하면 안 되는 부분:
이 문제의 원인을 먼저 설명하고, 가장 작은 수정으로 해결한 뒤 다시 테스트해줘.`;

const timeline = [
  ["문제와 사용자 확인", "5분"],
  ["첫 프롬프트 붙여넣기", "10분"],
  ["입력과 결과 화면 확인", "10분"],
  ["기능 하나씩 개선", "15분"],
  ["AI 기능 연결 또는 모의 응답 구성", "10분"],
  ["테스트와 공유", "10분"],
];

const checks = [
  "첫 화면이 열리는가?",
  "필수 입력이 분명한가?",
  "결과가 4개 영역으로 나오는가?",
  "복사 버튼이 작동하는가?",
  "다시 작성할 수 있는가?",
  "모바일에서 가로 스크롤이 생기지 않는가?",
  "학생 실명을 요구하지 않는가?",
];

export default function Mod07() {
  const [stage, setStage] = useLocalStorage<boolean[]>("vibecoding:mod07:stages", timeline.map(() => false));
  const [liveChecks, setLiveChecks] = useLocalStorage<boolean[]>("vibecoding:mod07:checks", checks.map(() => false));

  return (
    <article className="max-w-4xl mx-auto px-5 sm:px-8 py-10">
      <ModuleHeader module={m} />

      <LearningObjectives
        items={[
          "러버블에서 첫 프로젝트를 생성할 수 있다.",
          "요구사항이 담긴 첫 프롬프트를 작성할 수 있다.",
          "기능을 작은 단계로 나누어 수정할 수 있다.",
          "완성된 앱을 테스트하고 공유할 수 있다.",
        ]}
      />

      <KeyMessage>오늘의 목표는 기능 욕심이 아니라 완성 경험입니다.</KeyMessage>

      <Section title="60분 워크숍 타임라인">
        <ol className="space-y-2">
          {timeline.map(([t, d], i) => (
            <li key={t} className="flex items-center gap-3 p-3 bg-surface-soft rounded-md">
              <input
                type="checkbox"
                checked={stage[i]}
                onChange={() => setStage(stage.map((v, idx) => (idx === i ? !v : v)))}
                className="accent-coral w-4 h-4"
              />
              <span className="serif text-2xl text-coral leading-none w-8">{i + 1}</span>
              <span className="flex-1 text-body-strong">{t}</span>
              <span className="text-xs text-muted-text">{d}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="첫 프롬프트">
        <p className="text-sm text-body mb-3">전체 복사해서 새 러버블 프로젝트의 첫 메시지로 사용하세요.</p>
        <CopyBlock label="첫 프롬프트" text={STARTER} />
      </Section>

      <Section title="단계적 개선 프롬프트">
        <h3 className="serif text-xl mb-2 mt-2">① 사용성 개선</h3>
        <CopyBlock label="수정 프롬프트 1" text={REV1} />
        <h3 className="serif text-xl mb-2 mt-6">② 결과 품질 개선</h3>
        <CopyBlock label="수정 프롬프트 2" text={REV2} />
        <h3 className="serif text-xl mb-2 mt-6">③ 테스트</h3>
        <CopyBlock label="수정 프롬프트 3" text={REV3} />
      </Section>

      <Section title="라이브 체크리스트">
        <ul className="space-y-2">
          {checks.map((t, i) => (
            <li key={t}>
              <label className="flex items-center gap-3 p-3 rounded-md hover:bg-surface-soft cursor-pointer">
                <input
                  type="checkbox"
                  checked={liveChecks[i]}
                  onChange={() => setLiveChecks(liveChecks.map((v, idx) => (idx === i ? !v : v)))}
                  className="accent-coral w-4 h-4"
                />
                <span className={liveChecks[i] ? "text-muted-text line-through" : "text-body-strong"}>
                  {t}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="막혔을 때 — 구조화된 오류 요청">
        <CopyBlock label="오류 요청 템플릿" text={ERROR_TEMPLATE} />
      </Section>

      <InstructorTip>
        한 명이라도 “결과 화면까지 도달”하면 분위기가 바뀝니다. 첫 30분 안에
        프로토타입이 켜지도록 시간 배분에 집중하세요.
      </InstructorTip>

      <CompletionChecklist
        storageKey="vibecoding:mod07:final"
        items={[
          "첫 프롬프트로 프로토타입이 만들어졌다.",
          "수정 프롬프트 1·2·3 중 최소 두 번을 적용했다.",
          "테스트 7문항 체크리스트를 통과했다.",
          "공유 가능한 링크를 만들었거나, 만들 준비가 끝났다.",
        ]}
      />

      <ModuleNavigation module={m} />
    </article>
  );
}
