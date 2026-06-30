import { useState } from "react";
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
  PracticePanel,
} from "@/components/module-ui";
import { Check, X, Wrench } from "lucide-react";

const m = moduleByNumber(5)!;

type Verdict = "fit" | "shrink" | "avoid";
const projects: { text: string; answer: Verdict }[] = [
  { text: "수업 중 토론 역할을 무작위 배정하는 미니 도구", answer: "fit" },
  { text: "학생 실명과 상담 기록을 함께 다루는 통합 시스템", answer: "avoid" },
  { text: "교사 한 명이 만든 형성평가 피드백 도우미", answer: "fit" },
  { text: "전 학년 성적 입력 + 통지표 자동 발송 + 결제 연동", answer: "avoid" },
  { text: "프로젝트 주제 추천 마법사 + 평가 기록 + 학부모 알림", answer: "shrink" },
  { text: "단어 학습 카드 + 자가 점검 게임", answer: "fit" },
];

const labels: Record<Verdict, string> = {
  fit: "러버블 첫 프로젝트로 적합",
  shrink: "범위를 줄여야 함",
  avoid: "피하는 것이 좋음",
};
const rationale: Record<Verdict, string> = {
  fit: "입력 → 처리 → 출력의 단순 흐름과 낮은 위험 — 첫 프로젝트로 좋습니다.",
  shrink: "기능이 많아 오류 가능성이 큽니다. 핵심 하나로 줄여 시작하세요.",
  avoid: "민감 정보·고위험 결정·복잡한 권한이 얽혀 있어 다른 접근이 필요합니다.",
};

export default function Mod05() {
  const [picks, setPicks] = useState<Record<number, Verdict | null>>({});

  return (
    <article className="max-w-4xl mx-auto px-5 sm:px-8 py-10">
      <ModuleHeader module={m} />

      <LearningObjectives
        items={[
          "러버블이 적합한 교육용 프로젝트를 구분할 수 있다.",
          "장점과 한계를 균형 있게 설명할 수 있다.",
          "러버블이 대신해 주지 못하는 교사의 책임을 이해할 수 있다.",
        ]}
      />

      <KeyMessage>
        러버블은 만능 도구가 아닙니다. 명확한 요구사항과 사람의 검증이 함께 가야
        합니다.
      </KeyMessage>

      <Section title="장점과 한계">
        <div className="grid md:grid-cols-2 gap-4">
          <ConceptCard title="장점">
            <ul className="space-y-2 list-disc list-inside">
              <li>자연어로 화면과 기능을 빠르게 만들 수 있다.</li>
              <li>짧은 시간에 실제 작동하는 웹앱을 시험할 수 있다.</li>
              <li>화면, 코드, 데이터 연결, 배포를 한 프로젝트에서 경험한다.</li>
              <li>대화로 수정을 반복할 수 있다.</li>
              <li>GitHub와 연결해 코드를 보관·확장할 수 있다.</li>
              <li>백엔드와 AI 기능을 단계적으로 연결할 수 있다.</li>
            </ul>
          </ConceptCard>
          <ConceptCard title="한계와 주의점" tone="dark">
            <ul className="space-y-2 list-disc list-inside">
              <li>모호한 요청은 모호한 결과를 만든다.</li>
              <li>기능을 한꺼번에 많이 요구하면 오류 가능성이 커진다.</li>
              <li>생성된 코드와 보안 설정은 사람이 검토해야 한다.</li>
              <li>복잡한 앱은 반복 수정과 테스트가 필요하다.</li>
              <li>사용량·기능·인터페이스는 서비스 정책에 따라 변할 수 있다.</li>
              <li>학생 개인정보와 API 키는 자동으로 안전해지지 않는다.</li>
            </ul>
          </ConceptCard>
        </div>
      </Section>

      <Section title="러버블이 잘 맞는 프로젝트 / 피해야 할 프로젝트">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-success/5 border border-success/30 rounded-lg p-5">
            <h4 className="font-semibold text-ink mb-2 flex items-center gap-2">
              <Check className="w-4 h-4 text-success" /> 잘 맞는 프로젝트
            </h4>
            <ul className="space-y-1.5 list-disc list-inside text-sm text-body">
              <li>간단한 입력 → 처리 → 출력 앱</li>
              <li>수업용 시뮬레이션과 퀴즈</li>
              <li>교사용 업무 보조 도구</li>
              <li>형성평가 피드백 도구</li>
              <li>빠르게 검증할 프로토타입</li>
            </ul>
          </div>
          <div className="bg-error/5 border border-error/30 rounded-lg p-5">
            <h4 className="font-semibold text-ink mb-2 flex items-center gap-2">
              <X className="w-4 h-4 text-error" /> 피해야 할 프로젝트
            </h4>
            <ul className="space-y-1.5 list-disc list-inside text-sm text-body">
              <li>민감한 학생 정보를 다루는 고위험 시스템</li>
              <li>결제·성적 확정·상벌처럼 오류 영향이 큰 시스템</li>
              <li>첫 프로젝트부터 역할·권한이 매우 복잡한 서비스</li>
              <li>핵심 목적이 불분명한 기능 모음</li>
            </ul>
          </div>
        </div>
      </Section>

      <PracticePanel title="직접 해보기 — 이 프로젝트, 러버블로 시작해도 될까?">
        <ul className="space-y-3">
          {projects.map((p, i) => {
            const chosen = picks[i];
            return (
              <li key={i} className="p-4 rounded-md bg-canvas border border-hairline">
                <p className="text-body-strong mb-3">{p.text}</p>
                <div className="flex flex-wrap gap-2">
                  {(["fit", "shrink", "avoid"] as Verdict[]).map((v) => (
                    <button
                      key={v}
                      onClick={() => setPicks((s) => ({ ...s, [i]: v }))}
                      className={`text-xs px-3 py-1.5 rounded-md border transition-colors ${
                        chosen === v
                          ? v === p.answer
                            ? "bg-success text-white border-success"
                            : "bg-error text-white border-error"
                          : "border-hairline hover:bg-surface-card"
                      }`}
                    >
                      {labels[v]}
                    </button>
                  ))}
                </div>
                {chosen && (
                  <p className="mt-3 text-sm text-body">
                    <span className="font-semibold text-ink">정답: {labels[p.answer]} — </span>
                    {rationale[p.answer]}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      </PracticePanel>

      <InstructorTip>
        “러버블이 가능하다”는 곧 “해도 된다”가 아닙니다. 교육적 타당성과 책임의
        경계를 함께 이야기하세요.
      </InstructorTip>

      <CompletionChecklist
        storageKey="vibecoding:mod05:check"
        items={[
          "러버블의 장점 3가지를 설명할 수 있다.",
          "한계와 주의점 3가지를 설명할 수 있다.",
          "첫 프로젝트로 적합한 유형과 피할 유형을 구분할 수 있다.",
        ]}
      />

      <ModuleNavigation module={m} />
    </article>
  );
}
