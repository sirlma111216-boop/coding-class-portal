import { useMemo, useState } from "react";
import { Copy, CheckCheck, Download, Printer } from "lucide-react";
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
} from "@/components/module-ui";
import { useLocalStorage } from "@/hooks/use-local-storage";

const m = moduleByNumber(11)!;

type Project = {
  title: string;
  subject: string;
  problem: string;
  user: string;
  feature1: string;
  feature2: string;
  feature3: string;
  input: string;
  process: string;
  output: string;
  studentChange: string;
  ethical: string;
  testResult: string;
  nextImprovement: string;
  sentence1: string;
  sentence2: string;
  sentence3: string;
};

const empty: Project = {
  title: "", subject: "", problem: "", user: "",
  feature1: "", feature2: "", feature3: "",
  input: "", process: "", output: "",
  studentChange: "", ethical: "", testResult: "", nextImprovement: "",
  sentence1: "", sentence2: "", sentence3: "",
};

const stages = [
  { name: "문제 정의", time: "15분", desc: "내일 수업에서도 다시 생길 가능성이 높은 병목 하나를 정한다." },
  { name: "최소 기능과 PRD", time: "15분", desc: "핵심 기능 3개, 하지 않을 일, 입출력 흐름을 한 줄로 정한다." },
  { name: "러버블 제작", time: "30분", desc: "PRD 기반 첫 프롬프트로 화면·기능을 만든다." },
  { name: "테스트와 개선", time: "15분", desc: "정상·빈 입력·긴 입력·모바일·잘못된 입력·API 실패를 점검한다." },
  { name: "공유 준비", time: "15분", desc: "세 문장 요약을 완성하고 공유 링크를 만든다." },
];

const missions = [
  ["수업 운영 도구", "역할 배정, 토론 질문, 조별 활동 관리"],
  ["평가 지원 도구", "루브릭 기반 피드백, 서술형 코멘트, 오답 분석"],
  ["탐구·질문 생성 도구", "수준별 탐구 질문, 프로젝트 주제"],
  ["학생 자기성찰 지원", "수업 리플렉션, 자기평가 도우미"],
];

const rubricAreas = [
  ["교육 문제 정의", "실제 수업의 문제인가?"],
  ["수업·평가 연결성", "교육적 타당성이 있는가?"],
  ["AI 활용 적절성", "이 일에 왜 AI가 필요한가?"],
  ["실현 가능성", "내일 수업에 정말 쓸 수 있는가?"],
  ["최소 기능 구현", "핵심 흐름이 실제로 작동하는가?"],
];

const rubricScale = [
  "1 — 아직 부족",
  "2 — 일부 충족",
  "3 — 기대 수준",
  "4 — 우수",
];

function buildMarkdown(p: Project) {
  return `# 프로젝트 — ${p.title || "(이름 미정)"}

## 기본
- 교과·학년: ${p.subject}
- 주요 사용자: ${p.user}
- 해결할 문제: ${p.problem}

## 핵심 기능
1. ${p.feature1}
2. ${p.feature2}
3. ${p.feature3}

## 입력 → 처리 → 출력
- 입력: ${p.input}
- 처리: ${p.process}
- 출력: ${p.output}

## 학생 경험 변화
${p.studentChange}

## 윤리 위험
${p.ethical}

## 테스트 결과
${p.testResult}

## 다음 개선
${p.nextImprovement}

## 한 줄 요약
- 우리 수업의 문제는 ${p.sentence1} 였다.
- 그래서 ${p.sentence2} 를 만들었다.
- 학생 경험이 ${p.sentence3} 처럼 바뀔 것이다.
`;
}

function buildPrompt(p: Project) {
  return `${p.title || "(앱 이름)"}을 한국어 웹앱으로 만들어줘.

[사용자]
${p.user}

[해결할 문제]
${p.problem}

[입력]
${p.input}

[처리]
${p.process}

[출력]
${p.output}

[핵심 기능 — 3개로 한정]
1. ${p.feature1}
2. ${p.feature2}
3. ${p.feature3}

[제약]
- 학생 실명·개인정보 입력 금지
- ${p.ethical || "민감 정보 수집 금지"}

먼저 화면 구성과 흐름을 한국어로 설명한 다음 구현해줘. 모바일에서도 사용하기 편해야 해.`;
}

export default function Mod11() {
  const [project, setProject] = useLocalStorage<Project>("vibecoding:mod11:project", empty);
  const [rubric, setRubric] = useLocalStorage<number[]>("vibecoding:mod11:rubric", rubricAreas.map(() => 0));
  const [copied, setCopied] = useState<"md" | "prompt" | null>(null);

  // Import from mod02 / mod08
  const [mod02] = useLocalStorage<{ repeatTime: string; studentStuck: string; toolGap: string }>(
    "vibecoding:mod02:bottleneck",
    { repeatTime: "", studentStuck: "", toolGap: "" },
  );
  type PRDBare = { appName?: string; problem?: string; primaryUser?: string; input?: string; process?: string; output?: string; feature1?: string; feature2?: string; feature3?: string; privacy?: string };
  const [mod08] = useLocalStorage<PRDBare>("vibecoding:mod08:prd", {});

  const importPrior = () => {
    setProject({
      ...project,
      title: project.title || mod08.appName || "",
      problem: project.problem || mod08.problem || mod02.studentStuck || "",
      user: project.user || mod08.primaryUser || "",
      feature1: project.feature1 || mod08.feature1 || "",
      feature2: project.feature2 || mod08.feature2 || "",
      feature3: project.feature3 || mod08.feature3 || "",
      input: project.input || mod08.input || "",
      process: project.process || mod08.process || "",
      output: project.output || mod08.output || "",
      ethical: project.ethical || mod08.privacy || "",
    });
  };

  const md = useMemo(() => buildMarkdown(project), [project]);
  const prompt = useMemo(() => buildPrompt(project), [project]);

  const copy = async (t: string, k: "md" | "prompt") => {
    try {
      await navigator.clipboard.writeText(t);
      setCopied(k);
      setTimeout(() => setCopied(null), 1800);
    } catch {}
  };

  const downloadMd = () => {
    const safe = (project.title || "project").replace(/[^\w가-힣\-_]/g, "_");
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${safe}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const update = <K extends keyof Project>(k: K, v: Project[K]) => setProject({ ...project, [k]: v });

  return (
    <article className="max-w-5xl mx-auto px-5 sm:px-8 py-10">
      <ModuleHeader module={m} />

      <LearningObjectives
        items={[
          "실제 수업 문제를 한 문장으로 정의할 수 있다.",
          "핵심 기능 3개 이하의 MVP를 정할 수 있다.",
          "러버블에서 프로토타입을 제작하고 테스트할 수 있다.",
          "도구가 학생 경험을 어떻게 바꿀지 설명할 수 있다.",
        ]}
      />

      <KeyMessage>좋은 앱보다 좋은 수업 문제 정의가 먼저입니다.</KeyMessage>

      <Section title="네 가지 미션 유형">
        <div className="grid sm:grid-cols-2 gap-3">
          {missions.map(([t, d], i) => (
            <div key={t} className="bg-surface-card rounded-lg p-5">
              <span className="serif text-3xl text-coral leading-none">{i + 1}</span>
              <p className="font-semibold text-ink mt-2">{t}</p>
              <p className="text-sm text-body mt-1">{d}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="90분 프로젝트 보드">
        <ol className="space-y-2">
          {stages.map((s, i) => (
            <li key={s.name} className="flex items-start gap-3 p-4 bg-surface-soft rounded-md">
              <span className="serif text-2xl text-coral leading-none w-12 shrink-0">{i + 1}</span>
              <div className="flex-1">
                <div className="flex items-baseline justify-between gap-3 flex-wrap">
                  <p className="font-semibold text-ink">{s.name}</p>
                  <span className="text-xs text-muted-text">{s.time}</span>
                </div>
                <p className="text-sm text-body mt-1">{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <PracticePanel title="최종 프로젝트 워크시트 (자동 저장)">
        <button onClick={importPrior} className="text-xs px-3 py-1.5 rounded-md bg-surface-card hover:bg-surface-cream-strong mb-3">
          Module 2 · 8 답변 불러오기
        </button>
        <PrivacyNote />

        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          <Field label="프로젝트 제목" value={project.title} onChange={(v) => update("title", v)} />
          <Field label="교과·학년" value={project.subject} onChange={(v) => update("subject", v)} />
          <Field label="주요 사용자" value={project.user} onChange={(v) => update("user", v)} />
        </div>
        <Field label="해결할 교실 문제" value={project.problem} onChange={(v) => update("problem", v)} rows={2} />

        <div className="grid sm:grid-cols-3 gap-3 mt-3">
          <Field label="핵심 기능 1" value={project.feature1} onChange={(v) => update("feature1", v)} />
          <Field label="핵심 기능 2" value={project.feature2} onChange={(v) => update("feature2", v)} />
          <Field label="핵심 기능 3" value={project.feature3} onChange={(v) => update("feature3", v)} />
        </div>
        <div className="grid sm:grid-cols-3 gap-3 mt-3">
          <Field label="입력" value={project.input} onChange={(v) => update("input", v)} rows={2} />
          <Field label="처리" value={project.process} onChange={(v) => update("process", v)} rows={2} />
          <Field label="출력" value={project.output} onChange={(v) => update("output", v)} rows={2} />
        </div>

        <Field label="학생 경험은 어떻게 바뀌나요?" value={project.studentChange} onChange={(v) => update("studentChange", v)} rows={2} />
        <Field label="윤리적 위험과 대응" value={project.ethical} onChange={(v) => update("ethical", v)} rows={2} />
        <Field label="테스트 결과" value={project.testResult} onChange={(v) => update("testResult", v)} rows={2} />
        <Field label="다음 개선 1순위" value={project.nextImprovement} onChange={(v) => update("nextImprovement", v)} rows={2} />

        <h4 className="serif text-lg mt-5 mb-2">한 줄 요약 세 문장</h4>
        <Field label="우리 수업의 문제는 ___였다." value={project.sentence1} onChange={(v) => update("sentence1", v)} />
        <Field label="그래서 ___를 만들었다." value={project.sentence2} onChange={(v) => update("sentence2", v)} />
        <Field label="학생 경험이 ___처럼 바뀔 것이다." value={project.sentence3} onChange={(v) => update("sentence3", v)} />

        <div className="flex flex-wrap gap-2 mt-5">
          <button onClick={() => copy(md, "md")} className="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-md bg-coral text-white hover:bg-coral-active">
            {copied === "md" ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied === "md" ? "복사됨" : "Markdown 복사"}
          </button>
          <button onClick={downloadMd} className="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-md border border-hairline hover:bg-surface-card">
            <Download className="w-3.5 h-3.5" /> .md 다운로드
          </button>
          <button onClick={() => copy(prompt, "prompt")} className="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-md border border-coral text-coral hover:bg-coral/5">
            {copied === "prompt" ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied === "prompt" ? "복사됨" : "러버블 빌드 프롬프트 복사"}
          </button>
          <button onClick={() => window.print()} className="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-md border border-hairline hover:bg-surface-card">
            <Printer className="w-3.5 h-3.5" /> 1쪽 요약 인쇄
          </button>
        </div>
      </PracticePanel>

      <Section title="자기 점검 루브릭">
        <ul className="space-y-2">
          {rubricAreas.map(([area, hint], i) => (
            <li key={area} className="flex flex-wrap items-center gap-3 p-3 bg-canvas border border-hairline rounded-md">
              <div className="flex-1 min-w-[180px]">
                <p className="font-semibold text-ink">{area}</p>
                <p className="text-xs text-muted-text">{hint}</p>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((n) => (
                  <button
                    key={n}
                    onClick={() => setRubric(rubric.map((v, idx) => (idx === i ? n : v)))}
                    className={`text-xs px-2.5 py-1 rounded-md border ${
                      rubric[i] === n ? "bg-coral text-white border-coral" : "border-hairline hover:bg-surface-card"
                    }`}
                    title={rubricScale[n - 1]}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </li>
          ))}
        </ul>
        <p className="text-xs text-muted-text mt-2">
          척도: 1 부족 · 2 일부 충족 · 3 기대 수준 · 4 우수
        </p>
      </Section>

      <Section title="강사용 핵심 질문">
        <ul className="bg-ink text-canvas rounded-lg p-6 space-y-2 list-disc list-inside leading-relaxed">
          <li>그 기능이 왜 필요한가요?</li>
          <li>이 앱은 수업의 어떤 문제를 해결하나요?</li>
          <li>교사 입장에서 실제로 쓰게 될까요?</li>
          <li>학생 경험이 어떻게 달라지나요?</li>
        </ul>
      </Section>

      <InstructorTip>
        “세 문장 요약”을 발표하게 하세요. 발표가 안 되는 프로젝트는 아직 문제 정의가
        부족합니다.
      </InstructorTip>

      <CompletionChecklist
        storageKey="vibecoding:mod11:check"
        items={[
          "프로젝트 문제·사용자·핵심 기능 3개를 정했다.",
          "테스트 결과를 한 줄로 기록했다.",
          "세 문장 요약을 완성했다.",
          "Markdown 또는 프롬프트로 결과물을 내보냈다.",
        ]}
      />

      <ModuleNavigation module={m} />
    </article>
  );
}

function Field({ label, value, onChange, rows = 1 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
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
