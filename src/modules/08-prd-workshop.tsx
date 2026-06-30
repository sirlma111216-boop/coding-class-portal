import { useMemo } from "react";
import { Download, Copy, CheckCheck, RotateCcw, FileText } from "lucide-react";
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
  PrivacyNote,
  Warning,
} from "@/components/module-ui";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useState } from "react";

const m = moduleByNumber(8)!;

type Step2 = "yes" | "no" | "unsure" | "";
type PRD = {
  // step 1 - imported/edited
  studentStuck: string;
  repeatTime: string;
  feedbackGap: string;
  whoWhen: string;
  // step 2
  reduceRepeat: Step2;
  patternAnalysis: Step2;
  draftFast: Step2;
  teacherFinal: Step2;
  simplerWay: Step2;
  // step 3
  appName: string;
  oneLine: string;
  primaryUser: string;
  problem: string;
  usage: string;
  feature1: string;
  feature2: string;
  feature3: string;
  feature4?: string;
  input: string;
  process: string;
  output: string;
  screens: string;
  wontDo: string;
  privacy: string;
  success: string;
};

const empty: PRD = {
  studentStuck: "", repeatTime: "", feedbackGap: "", whoWhen: "",
  reduceRepeat: "", patternAnalysis: "", draftFast: "", teacherFinal: "", simplerWay: "",
  appName: "", oneLine: "", primaryUser: "", problem: "", usage: "",
  feature1: "", feature2: "", feature3: "", feature4: "",
  input: "", process: "", output: "", screens: "", wontDo: "", privacy: "", success: "",
};

function buildMarkdown(p: PRD): string {
  return `# PRD — ${p.appName || "(앱 이름 미정)"}

## 개요
- 한 줄 개요: ${p.oneLine}
- 주요 사용자: ${p.primaryUser}
- 해결할 교육 문제: ${p.problem}
- 사용 상황: ${p.usage}

## 핵심 기능 (최대 3개 권장)
1. ${p.feature1}
2. ${p.feature2}
3. ${p.feature3}${p.feature4 ? `\n4. ${p.feature4}  ← 첫 버전 이후로 미루기 권장` : ""}

## 입력 / 처리 / 출력
- 입력: ${p.input}
- 처리: ${p.process}
- 출력: ${p.output}

## 화면 구성
${p.screens}

## 하지 않을 기능
${p.wontDo}

## 개인정보·윤리 제한
${p.privacy}

## 성공 기준
${p.success}
`;
}

function buildLovablePrompt(p: PRD): string {
  return `다음 PRD에 따라 한국어 웹앱을 만들어줘.

[역할과 맥락]
당신은 한국 ${p.primaryUser || "교사"}를 돕는 교사용 웹앱 제작 보조자다.

[사용자]
${p.primaryUser}

[해결할 문제]
${p.problem}

[사용 상황]
${p.usage}

[입력]
${p.input}

[처리]
${p.process}

[출력]
${p.output}

[화면]
${p.screens}

[핵심 기능 — 다음 3개로 한정]
1. ${p.feature1}
2. ${p.feature2}
3. ${p.feature3}

[제약]
- 학생 실명·개인정보 입력 금지
- ${p.privacy}
- 첫 버전에서는 ${p.wontDo || "추가 기능을 만들지 마"}

[성공 기준]
${p.success}

먼저 화면 구성과 기능 흐름을 한국어로 설명한 다음 구현해줘. 모바일에서도 사용하기 편해야 해.`;
}

export default function Mod08() {
  const [prd, setPrd] = useLocalStorage<PRD>("vibecoding:mod08:prd", empty);
  const [showMd, setShowMd] = useState(false);
  const [copied, setCopied] = useState<"md" | "prompt" | null>(null);

  // Pull from mod02
  const [mod02] = useLocalStorage<{ repeatTime: string; studentStuck: string; toolGap: string }>(
    "vibecoding:mod02:bottleneck",
    { repeatTime: "", studentStuck: "", toolGap: "" },
  );

  const importMod2 = () => {
    setPrd({
      ...prd,
      repeatTime: prd.repeatTime || mod02.repeatTime,
      studentStuck: prd.studentStuck || mod02.studentStuck,
      feedbackGap: prd.feedbackGap || mod02.toolGap,
    });
  };

  const update = <K extends keyof PRD>(k: K, v: PRD[K]) => setPrd({ ...prd, [k]: v });

  const md = useMemo(() => buildMarkdown(prd), [prd]);
  const lovablePrompt = useMemo(() => buildLovablePrompt(prd), [prd]);

  const copy = async (txt: string, kind: "md" | "prompt") => {
    try {
      await navigator.clipboard.writeText(txt);
      setCopied(kind);
      setTimeout(() => setCopied(null), 1800);
    } catch {}
  };

  const downloadMd = () => {
    const safe = (prd.appName || "PRD").replace(/[^\w가-힣\-_]/g, "_");
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${safe}-PRD.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetAll = () => {
    if (confirm("PRD 워크시트를 초기화합니다. 계속할까요?")) setPrd(empty);
  };

  const hasFeature4 = !!prd.feature4 && prd.feature4.trim().length > 0;

  return (
    <article className="max-w-4xl mx-auto px-5 sm:px-8 py-10">
      <ModuleHeader module={m} />

      <LearningObjectives
        items={[
          "PRD의 목적과 핵심 요소를 설명할 수 있다.",
          "수업의 병목을 하나의 문제 문장으로 정의할 수 있다.",
          "핵심 기능을 3개 이하로 제한할 수 있다.",
          "완성한 PRD를 Markdown으로 복사하거나 저장할 수 있다.",
        ]}
      />

      <KeyMessage>앱부터 만들면 망합니다. 문제 정의가 먼저입니다.</KeyMessage>

      <Section title="PRD란?">
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            ["P", "Product / 제품"],
            ["R", "Requirements / 요구사항"],
            ["D", "Document / 문서"],
          ].map(([k, v]) => (
            <div key={k} className="bg-surface-card rounded-lg p-6 text-center">
              <div className="serif text-6xl text-coral leading-none mb-2">{k}</div>
              <p className="text-sm text-body-strong">{v}</p>
            </div>
          ))}
        </div>
      </Section>

      <PracticePanel title="PRD 빌더 (자동 저장)">
        <PrivacyNote>학생 실명·개인정보는 입력하지 마세요. 이 워크시트는 브라우저에만 저장됩니다.</PrivacyNote>

        {/* STEP 1 */}
        <h3 className="serif text-xl mt-6 mb-3">Step 1. 수업의 병목 찾기</h3>
        <button
          onClick={importMod2}
          className="text-xs px-3 py-1.5 rounded-md bg-surface-card hover:bg-surface-cream-strong mb-3"
        >
          Module 2 답변 불러오기
        </button>
        <div className="space-y-3">
          {[
            ["studentStuck", "학생들이 반복해서 어려워하는 지점은 무엇인가요?"],
            ["repeatTime", "교사가 반복적으로 많은 시간을 쓰는 일은 무엇인가요?"],
            ["feedbackGap", "피드백이나 평가에서 아쉬운 점은 무엇인가요?"],
            ["whoWhen", "이 문제는 언제, 누구에게, 얼마나 자주 생기나요?"],
          ].map(([k, l]) => (
            <Field key={k} label={l} value={prd[k as keyof PRD] as string} onChange={(v) => update(k as keyof PRD, v as never)} rows={2} />
          ))}
        </div>

        {/* STEP 2 */}
        <h3 className="serif text-xl mt-8 mb-3">Step 2. AI가 정말 필요한가?</h3>
        {[
          ["reduceRepeat", "반복 작업을 줄일 수 있는가?"],
          ["patternAnalysis", "텍스트·이미지·데이터의 패턴을 분석하는가?"],
          ["draftFast", "여러 초안을 빠르게 만드는 데 도움이 되는가?"],
          ["teacherFinal", "최종 판단은 교사가 할 수 있는가?"],
          ["simplerWay", "AI 없이 더 간단히 해결할 방법은 없는가?"],
        ].map(([k, l]) => {
          const v = prd[k as keyof PRD] as Step2;
          return (
            <div key={k} className="flex items-center justify-between gap-3 py-2 border-b border-hairline-soft">
              <span className="text-sm text-body-strong flex-1">{l}</span>
              <div className="flex gap-1">
                {(["yes", "no", "unsure"] as Step2[]).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => update(k as keyof PRD, opt as never)}
                    className={`text-xs px-3 py-1 rounded-md border ${
                      v === opt ? "bg-coral text-white border-coral" : "border-hairline hover:bg-surface-card"
                    }`}
                  >
                    {opt === "yes" ? "예" : opt === "no" ? "아니오" : "모르겠음"}
                  </button>
                ))}
              </div>
            </div>
          );
        })}

        {/* STEP 3 */}
        <h3 className="serif text-xl mt-8 mb-3">Step 3. PRD 핵심 요소</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="앱 이름" value={prd.appName} onChange={(v) => update("appName", v)} />
          <Field label="한 줄 개요" value={prd.oneLine} onChange={(v) => update("oneLine", v)} />
          <Field label="주요 사용자" value={prd.primaryUser} onChange={(v) => update("primaryUser", v)} />
          <Field label="사용 상황" value={prd.usage} onChange={(v) => update("usage", v)} />
        </div>
        <Field label="해결할 교육 문제" value={prd.problem} onChange={(v) => update("problem", v)} rows={2} />

        <div className="mt-4 grid sm:grid-cols-2 gap-3">
          <Field label="핵심 기능 1" value={prd.feature1} onChange={(v) => update("feature1", v)} />
          <Field label="핵심 기능 2" value={prd.feature2} onChange={(v) => update("feature2", v)} />
          <Field label="핵심 기능 3" value={prd.feature3} onChange={(v) => update("feature3", v)} />
          <Field label="핵심 기능 4 (가급적 비우기)" value={prd.feature4 || ""} onChange={(v) => update("feature4", v)} />
        </div>
        {hasFeature4 && (
          <Warning>
            첫 프로토타입의 핵심 기능은 3개 이하가 좋습니다. 나머지는 이후 버전으로 옮겨 보세요.
          </Warning>
        )}

        <div className="mt-4 grid sm:grid-cols-3 gap-3">
          <Field label="입력 데이터" value={prd.input} onChange={(v) => update("input", v)} rows={2} />
          <Field label="처리 방식" value={prd.process} onChange={(v) => update("process", v)} rows={2} />
          <Field label="출력 결과" value={prd.output} onChange={(v) => update("output", v)} rows={2} />
        </div>
        <Field label="필요한 화면" value={prd.screens} onChange={(v) => update("screens", v)} rows={2} />
        <Field label="하지 않을 기능" value={prd.wontDo} onChange={(v) => update("wontDo", v)} rows={2} />
        <Field label="개인정보·윤리 제한" value={prd.privacy} onChange={(v) => update("privacy", v)} rows={2} />
        <Field label="성공 기준" value={prd.success} onChange={(v) => update("success", v)} rows={2} />

        <div className="flex flex-wrap gap-2 mt-6">
          <button onClick={() => setShowMd((v) => !v)} className="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-md bg-ink text-canvas hover:bg-ink/90">
            <FileText className="w-3.5 h-3.5" /> {showMd ? "Markdown 닫기" : "Markdown 미리보기"}
          </button>
          <button onClick={() => copy(md, "md")} className="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-md bg-coral text-white hover:bg-coral-active">
            {copied === "md" ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied === "md" ? "복사됨" : "Markdown 복사"}
          </button>
          <button onClick={downloadMd} className="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-md border border-hairline hover:bg-surface-card">
            <Download className="w-3.5 h-3.5" /> .md 다운로드
          </button>
          <button onClick={() => copy(lovablePrompt, "prompt")} className="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-md border border-coral text-coral hover:bg-coral/5">
            {copied === "prompt" ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied === "prompt" ? "복사됨" : "러버블 첫 프롬프트로 변환"}
          </button>
          <button onClick={resetAll} className="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-md text-error border border-error/30 hover:bg-error/5">
            <RotateCcw className="w-3.5 h-3.5" /> 초기화
          </button>
        </div>

        {showMd && (
          <pre className="mt-4 p-4 bg-surface-dark text-on-dark rounded-md text-xs overflow-x-auto whitespace-pre-wrap font-mono">
            {md}
          </pre>
        )}
      </PracticePanel>

      <InstructorTip>
        “하지 않을 기능”을 쓰지 못한 참가자가 가장 많이 헤맵니다. 이 칸을 채우게
        도와주는 것이 PRD 워크숍의 핵심입니다.
      </InstructorTip>

      <CompletionChecklist
        storageKey="vibecoding:mod08:check"
        items={[
          "PRD의 P·R·D 의미를 설명할 수 있다.",
          "내 수업 문제를 한 문장으로 정의했다.",
          "핵심 기능을 3개 이하로 줄였다.",
          "PRD를 Markdown 또는 러버블 프롬프트로 변환했다.",
        ]}
      />

      <ModuleNavigation module={m} />
    </article>
  );
}

function Field({
  label,
  value,
  onChange,
  rows = 1,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <label className="block mb-2">
      <span className="block text-xs font-medium text-ink mb-1">{label}</span>
      {rows > 1 ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          className="w-full px-3 py-2 rounded-md border border-hairline bg-canvas focus:border-coral outline-none text-sm"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 rounded-md border border-hairline bg-canvas focus:border-coral outline-none text-sm"
        />
      )}
    </label>
  );
}
