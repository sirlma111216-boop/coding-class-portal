import { useMemo, useState } from "react";
import { X, CheckCircle2, AlertCircle, ArrowRight, Sparkles } from "lucide-react";
import { moduleByNumber } from "@/data/course";
import {
  ModuleHeader,
  Section,
  KeyMessage,
  CopyBlock,
  ModuleNavigation,
} from "@/components/module-ui";
import { useLocalStorage } from "@/hooks/use-local-storage";
import chatbotExample from "@/assets/ai-chatbot-example.png.asset.json";

const m = moduleByNumber(7)!;

const FLOW = ["학습 맥락", "질문 생성", "학생 답변", "AI 피드백", "검토와 활용"];

const timeline = [
  ["수업 맥락과 사용자 확인", "5분", "누가, 어떤 수업에서, 어떤 학습 문제를 해결하기 위해 사용할지 정합니다."],
  ["첫 프롬프트 붙여넣기", "10분", "학습 주제부터 질문·학생 답변·피드백까지 이어지는 첫 MVP를 생성합니다."],
  ["입력과 결과 흐름 확인", "10분", "학습 주제 → 질문 생성 → 예시 답변 생성 → 피드백 출력이 순서대로 작동하는지 확인합니다."],
  ["기능을 하나씩 개선", "15분", "질문 품질, 학생 답변 흐름, 피드백 품질, 사용성을 하나씩 개선합니다."],
  ["AI 기능과 안전장치 확인", "10분", "Lovable AI, 개인정보 안내, 교사 검토 문구가 제대로 작동하는지 확인합니다."],
  ["테스트와 공유", "10분", "여러 교과와 학습 주제로 시험하고 동료 교사와 결과를 공유합니다."],
];

const STARTER = `Create a Korean-language web app called "AI 형성평가 피드백 도우미" for teachers.

Important:
- The implementation instructions may be written in English.
- All visible app UI, page titles, labels, buttons, instructions, placeholder examples, sample student responses, error messages, and AI-generated results must be in Korean.
- Use Lovable AI from the first version.
- Do not require an external API key for this workshop version.
- Do not ask for student names or personally identifiable information.
- The teacher must review all AI-generated questions and feedback before using them.

The app must follow this educational flow:

Step 1. Learning context
The teacher enters:
- school level: elementary / middle / high school
- subject
- grade
- unit or learning topic
- learning objective
Use clear required-field labels and provide simple Korean examples.

Step 2. Formative assessment question
Use AI to generate 3 short formative assessment questions based on:
- school level, grade, subject, learning topic, learning objective
Each question should:
- check student understanding rather than simple memorization
- be answerable in 1 to 3 sentences
- use language appropriate for the selected grade
Allow the teacher to: select one question, edit the selected question, generate a new set.

Step 3. Student response
Show two clearly separated options:
1. "예시 학생 답변 생성"
2. "학생 답변 직접 입력"
For sample response generation, let the teacher choose:
- achievement level: 도움이 필요함 / 기본 도달 / 충분히 도달
- include a misconception: 포함 / 포함하지 않음
Generate one realistic Korean student response that directly answers the selected question.
For manual input: provide a text area and clearly warn the teacher not to enter student names or sensitive information.

Step 4. Confirmation
Before generating feedback, show a confirmation card containing:
- 학습 목표 / 선택한 형성평가 질문 / 학생 답변 / 학생 수준 / 피드백 말투

Step 5. AI feedback
The teacher chooses a feedback tone: 따뜻한 격려 / 구체적 코칭 / 간결한 피드백
Generate feedback in exactly four sections:
- 격려 / 잘한 점 / 보완할 점 / 다음 학습 행동
Each section: one concise sentence.
The feedback must refer to the learning objective and the selected question, be based on evidence from the response, avoid vague praise or comparison, suggest one realistic next learning action, and include a visible notice that the teacher must review the result.

Step 6. Core actions
Include: 질문 생성 / 질문 다시 생성 / 예시 학생 답변 생성 / 피드백 생성 / 결과 복사 / 다시 생성 / 처음부터 다시 하기

Step 7. Safety notice
Show: "학생 실명과 민감한 개인정보를 입력하지 마세요. AI가 생성한 질문과 피드백은 교사가 최종 검토해야 합니다."

Step 8. First-version scope
Keep the first version simple. Do not add: login, database, class management, student accounts, ranking, payment, file upload.

Create a clean, simple, mobile-friendly layout for teachers.
Use a step-by-step interface: 학습 맥락 → 형성평가 질문 → 학생 답변 → 피드백 결과.
Keep the visual design calm, clear, and easy to use during class.`;

const STARTER_KO = `교사를 위한 한국어 웹앱 "AI 형성평가 피드백 도우미"를 만들어줘.

중요:
- 구현 지시문은 영어로 작성해도 되지만, 앱 화면에 보이는 모든 UI(제목, 라벨, 버튼, 안내, 예시, 학생 답변 예시, 오류 메시지, AI 결과)는 반드시 한국어로 표시할 것.
- 첫 버전부터 Lovable AI를 사용할 것.
- 이 연수 버전에서는 외부 API 키를 요구하지 않도록 할 것.
- 학생 이름 등 개인정보를 입력받지 않도록 할 것.
- AI가 생성한 질문과 피드백은 교사가 반드시 최종 검토하도록 안내할 것.

앱은 다음 교육적 흐름을 따를 것:

1단계. 학습 맥락
교사가 다음을 입력:
- 학교급(초/중/고), 교과, 학년, 단원 또는 학습 주제, 학습 목표
- 필수 항목 표시와 한국어 예시를 함께 제공.

2단계. 형성평가 질문
학교급, 학년, 교과, 학습 주제, 학습 목표를 바탕으로 짧은 형성평가 질문 3개를 AI가 생성.
각 질문은:
- 단순 암기가 아닌 이해도를 확인할 것
- 1~3문장으로 답할 수 있을 것
- 선택한 학년 수준의 언어를 사용할 것
교사는 질문 선택, 선택한 질문 수정, 새 질문 다시 생성이 가능해야 함.

3단계. 학생 답변
두 가지 옵션을 명확히 구분해 제공:
1) "예시 학생 답변 생성"
2) "학생 답변 직접 입력"
예시 답변 생성 시 교사가 선택:
- 도달 수준: 도움이 필요함 / 기본 도달 / 충분히 도달
- 오개념 포함 여부: 포함 / 포함하지 않음
선택한 질문에 실제로 답하는 사실적인 한국어 학생 답변 1개를 생성.
직접 입력 시 텍스트 영역과 함께, 학생 이름·민감정보 입력 금지 안내를 명확히 표시.

4단계. 확인
피드백 생성 전에 다음을 담은 확인 카드 표시:
- 학습 목표 / 선택한 형성평가 질문 / 학생 답변 / 학생 수준 / 피드백 말투

5단계. AI 피드백
교사가 말투 선택: 따뜻한 격려 / 구체적 코칭 / 간결한 피드백
피드백은 정확히 4개 영역으로 생성: 격려 / 잘한 점 / 보완할 점 / 다음 학습 행동
각 영역은 간결한 한 문장. 학습 목표와 선택한 질문을 참조하고, 학생 답변의 근거를 바탕으로 작성.
막연한 칭찬이나 다른 학생과의 비교는 피하고, 수업에서 바로 실행 가능한 다음 학습 행동 1가지를 제안.
교사 최종 검토 안내 문구를 항상 함께 표시.

6단계. 핵심 동작
질문 생성 / 질문 다시 생성 / 예시 학생 답변 생성 / 피드백 생성 / 결과 복사 / 다시 생성 / 처음부터 다시 하기 버튼 포함.

7단계. 안전 안내
"학생 실명과 민감한 개인정보를 입력하지 마세요. AI가 생성한 질문과 피드백은 교사가 최종 검토해야 합니다." 문구 표시.

8단계. 첫 버전 범위
첫 버전은 단순하게 유지. 로그인, 데이터베이스, 학급 관리, 학생 계정, 순위, 결제, 파일 업로드는 넣지 않음.

레이아웃은 교사가 수업 중에도 쓰기 쉬운 깔끔하고 모바일 친화적인 형태로,
학습 맥락 → 형성평가 질문 → 학생 답변 → 피드백 결과 순의 단계형 인터페이스로 만들어줘.`;

const REV1 = `Keep the current app structure and improve only the formative assessment question generation.

Generate questions that:
- directly match the learning objective
- assess understanding rather than simple memorization
- can be answered in 1 to 3 sentences
- use language appropriate for the selected grade
- include different question types such as explanation, prediction, comparison, and evidence-based reasoning

Show a small Korean question-type label for each generated question.
Keep all visible UI text in Korean.
Do not change unrelated pages, design, or features.`;

const REV1_KO = `현재 앱 구조는 유지하고, 형성평가 질문 생성 부분만 개선해줘.

생성되는 질문은:
- 학습 목표와 직접 연결될 것
- 단순 암기가 아니라 이해도를 확인할 것
- 1~3문장으로 답할 수 있을 것
- 선택한 학년 수준의 언어를 사용할 것
- 설명, 예측, 비교, 근거 제시 등 다양한 유형을 포함할 것

각 질문 옆에 짧은 한국어 질문 유형 라벨을 표시해줘.
모든 화면 UI는 한국어로 유지하고, 관련 없는 페이지·디자인·기능은 바꾸지 마.`;

const REV2 = `Keep the current app structure and improve only the student response step.

Show two clearly separated options:
1. Generate a sample student response
2. Enter a student response manually

For sample response generation:
- use the selected formative assessment question
- reflect the selected achievement level
- optionally include one realistic misconception
- generate one concise Korean response
- never include a student name

Before generating feedback, show the selected question and student response together in a confirmation card.

Keep all visible UI text in Korean.
Do not change unrelated features.`;

const REV2_KO = `현재 앱 구조는 유지하고, 학생 답변 단계만 개선해줘.

다음 두 옵션을 명확히 구분해 보여줘:
1) 예시 학생 답변 생성
2) 학생 답변 직접 입력

예시 답변 생성 시:
- 선택된 형성평가 질문을 사용하고
- 선택된 도달 수준을 반영하며
- 선택적으로 사실적인 오개념을 하나 포함할 수 있게 하고
- 간결한 한국어 답변 1개를 생성하며
- 학생 이름은 절대 포함하지 말 것.

피드백 생성 전에, 선택한 질문과 학생 답변을 함께 보여주는 확인 카드를 표시해줘.

모든 화면 UI는 한국어로 유지하고, 관련 없는 기능은 바꾸지 마.`;

const REV3 = `Keep the current result card structure and improve only the AI feedback quality.

The feedback must be based on:
- the learning objective
- the selected formative assessment question
- the student response
- the selected achievement level

Organize the result into exactly four sections:
- 격려 / 잘한 점 / 보완할 점 / 다음 학습 행동

Avoid: vague praise, unsupported claims, judgmental language, comparison with other students.
Make the next learning action specific and immediately possible in class.

Keep all visible UI and generated feedback in Korean.
Do not change the design or unrelated features.`;

const REV4 = `Keep the current features and improve only usability and testing.

Add:
- clear required-field indicators
- simple Korean examples under each input
- a confirmation step before feedback generation
- a loading state during AI generation
- a full feedback copy button
- a regenerate button
- a reset button
- a friendly Korean error message when generation fails

Test the full flow with:
- empty input, a very short learning topic, a long student response, mobile screen
- sample response generation, manual response input, copy and regenerate actions

Fix only the problems found during testing.
Keep all visible UI text in Korean.
Do not redesign unrelated sections.`;

const improvements = [
  ["① 학습 목표에 맞는 질문 만들기", "질문 품질 개선", REV1],
  ["② 예시 답변 생성과 직접 입력 개선", "학생 답변 흐름 개선", REV2],
  ["③ 답변의 근거가 드러나는 피드백 만들기", "피드백 품질 개선", REV3],
  ["④ 결과 활용과 오류 대응 개선", "사용성과 테스트 개선", REV4],
];

const checks = [
  "앱 첫 화면이 정상적으로 열리는가?",
  "학년·교과·학습 주제를 입력할 수 있는가?",
  "학습 목표에 맞는 형성평가 질문 3개가 생성되는가?",
  "질문을 선택하거나 수정할 수 있는가?",
  "예시 학생 답변을 생성할 수 있는가?",
  "학생 답변을 직접 입력할 수 있는가?",
  "질문과 학생 답변을 함께 확인할 수 있는가?",
  "피드백이 4개 영역으로 생성되는가?",
  "피드백이 학생 답변의 실제 내용과 연결되는가?",
  "결과 복사 버튼이 작동하는가?",
  "다시 생성 버튼이 작동하는가?",
  "모바일에서 가로 스크롤이 생기지 않는가?",
  "학생 실명과 개인정보를 요구하지 않는가?",
  "교사 최종 검토 안내가 표시되는가?",
];

const ERR_FEATURE = `The [feature name] is not working.

Current result:
[describe what currently happens]

Expected result:
[describe what should happen]

Find the smallest cause and fix only this issue.
Do not change the design or unrelated features.
Keep all visible UI text in Korean.`;

const ERR_RESULT = `The current result is incorrect or unclear.

Problem:
[describe the incorrect result]

Expected result:
[describe the correct result]

Fix only this part and test it again.
Do not add new features.
Keep all visible UI text in Korean.`;

const ERR_FLOW = `Test the current core flow step by step:
학습 맥락 입력
→ 형성평가 질문 생성
→ 질문 선택 또는 수정
→ 예시 학생 답변 생성 또는 직접 입력
→ AI 피드백 생성
→ 결과 복사

Identify the first step that fails.
Explain the cause briefly.
Fix only that problem and test the full flow again.
Do not redesign the app.
Keep all visible UI text in Korean.`;

const CHATBOT_TEMPLATE = `현재 만들고 있는 앱:
[앱의 이름과 목적]

현재 작동하는 기능:
[정상 작동하는 기능]

현재 문제:
[작동하지 않거나 어색한 부분]

원하는 사용자 흐름:
[사용자가 어떤 순서로 이용해야 하는지]

추가하거나 변경할 기능:
[수정할 기능]

유지해야 할 부분:
[디자인, 기존 기능, 다른 페이지 등]

변경하면 안 되는 부분:
[절대 건드리지 않아야 할 요소]

현재 오류 메시지:
[오류 메시지가 있다면 입력]

첨부 자료:
[화면 캡처, 오류 화면, 현재 코드 또는 설명]

요청:
위 내용을 바탕으로 Lovable에 그대로 붙여 넣을 수 있는 구체적인 영문 프롬프트를 작성해줘.
완성 앱의 모든 UI와 결과는 한국어로 만들도록 지시해줘.`;

const decisionItems = [
  "여러 화면이 함께 바뀌어야 한다.",
  "새로운 기능을 추가해야 한다.",
  "사용자 흐름을 다시 설계해야 한다.",
  "백엔드나 데이터 저장 방식을 바꿔야 한다.",
  "현재 오류의 원인을 정확히 모르겠다.",
  "Lovable에서 같은 수정을 두 번 이상 실패했다.",
  "요구사항이 길고 복잡하다.",
];

export default function Mod07() {
  const [liveChecks, setLiveChecks] = useLocalStorage<boolean[]>(
    "vibecoding:mod07:checks-v2",
    checks.map(() => false),
  );
  const [decision, setDecision] = useLocalStorage<boolean[]>(
    "vibecoding:mod07:decision",
    decisionItems.map(() => false),
  );
  const [zoomed, setZoomed] = useState(false);

  const checkCount = liveChecks.filter(Boolean).length;
  const decisionCount = decision.filter(Boolean).length;

  const verdict = useMemo(() => {
    if (decisionCount <= 1)
      return {
        tone: "green",
        text: "Lovable에 바로 요청해도 좋습니다. 문제 화면을 캡처하고 수정 범위를 작게 지정하세요.",
      };
    if (decisionCount <= 3)
      return {
        tone: "coral",
        text: "먼저 AI 챗봇에서 요구사항을 정리한 뒤 Lovable에 입력하는 것이 좋습니다.",
      };
    return {
      tone: "coral-strong",
      text: "구조적인 수정입니다. 현재 상태, 원하는 구조, 유지 조건을 정리해 AI 챗봇에서 Lovable용 프롬프트를 먼저 작성하세요.",
    };
  }, [decisionCount]);

  return (
    <article className="max-w-4xl mx-auto px-5 sm:px-8 py-10">
      <ModuleHeader module={m} />

      <p className="serif text-2xl md:text-3xl leading-snug text-ink mb-2">
        첫 번째 완성 경험 — AI 형성평가 피드백 도우미
      </p>
      <p className="text-body mb-6">
        학습 주제에 맞는 형성평가 질문을 만들고, 학생 답변을 바탕으로 다음 학습을 안내하는 AI 피드백 도구를 완성합니다.
      </p>

      <KeyMessage>오늘의 목표는 기능 욕심이 아니라 완성 경험입니다.</KeyMessage>

      {/* Educational flow chips */}
      <Section title="형성평가의 교육적 흐름">
        <div className="flex flex-wrap items-center gap-2">
          {FLOW.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <span className="inline-flex items-center px-3 py-1.5 rounded-pill bg-surface-cream-strong text-ink text-sm font-medium">
                {s}
              </span>
              {i < FLOW.length - 1 && <ArrowRight className="w-4 h-4 text-coral shrink-0" />}
            </div>
          ))}
        </div>
      </Section>

      {/* Timeline */}
      <Section title="60분 워크숍 타임라인">
        <div className="flex items-baseline gap-2 mb-4">
          <span className="serif text-5xl text-coral">60</span>
          <span className="text-sm text-muted-text">분 실습</span>
        </div>
        <ol className="space-y-3">
          {timeline.map(([t, d, desc], i) => (
            <li key={t} className="flex gap-4 p-4 bg-surface-soft rounded-lg">
              <span className="serif text-3xl text-coral leading-none w-10 shrink-0">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-baseline gap-2 mb-1">
                  <h3 className="text-body-strong font-medium">{t}</h3>
                  <span className="text-xs text-muted-text">— {d}</span>
                </div>
                <p className="text-sm text-body">{desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* Starter prompt */}
      <Section title="첫 프롬프트 — 형성평가의 전체 흐름 만들기">
        <p className="text-sm text-body mb-3">
          아래 영문 프롬프트 전체를 복사해 Lovable의 새 프로젝트 입력창에 붙여 넣으세요. 프롬프트는 영어지만 완성되는 앱의 화면과 결과는 모두 한국어입니다.
        </p>
        <CopyBlock label="첫 프롬프트 (영문)" text={STARTER} />
      </Section>

      {/* Why this order */}
      <Section title="왜 이런 순서로 만들까요?">
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            ["학습 목표가 출발점", "형성평가는 학습 목표에 도달했는지 확인하는 활동이므로 수업 맥락을 먼저 입력합니다."],
            ["질문이 답변보다 먼저", "학생 답변은 특정 질문에 대한 응답이어야 분석과 피드백의 근거가 분명해집니다."],
            ["예시 학생 답변 생성", "실제 학생 답변이 없는 연수 상황에서도 수준별 예시 답변을 생성해 전체 흐름을 시험할 수 있습니다."],
            ["실제 수업에서는 직접 입력", "실제 수업에서는 학생 실명을 제외한 익명 답변을 직접 입력해 활용할 수 있습니다."],
            ["교사가 최종 판단", "AI가 만든 질문과 피드백은 초안이며, 교육적 적절성은 교사가 최종 확인합니다."],
          ].map(([t, d]) => (
            <div key={t} className="bg-surface-card rounded-lg p-5">
              <h4 className="serif text-lg mb-2 text-ink">{t}</h4>
              <p className="text-sm text-body">{d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Lovable AI notice */}
      <Section>
        <div className="bg-surface-soft border border-coral/30 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-coral" />
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-pill bg-coral text-white text-xs font-medium">
              Lovable AI 사용
            </span>
          </div>
          <h3 className="serif text-xl mb-2">왜 첫 버전부터 AI를 사용하나요?</h3>
          <p className="text-sm text-body mb-3">
            이번 앱의 핵심은 형성평가 질문 생성, 예시 학생 답변 생성, 학생 답변 기반 피드백 생성입니다. 따라서 모의 결과만 보여주는 앱보다 첫 버전부터 Lovable AI를 연결해야 전체 수업 흐름을 실제로 확인할 수 있습니다.
          </p>
          <p className="text-xs text-muted-text">
            연수에서는 실제 학생 개인정보 대신 예시 데이터나 익명 답변을 사용합니다.
          </p>
        </div>
      </Section>

      {/* Incremental prompts */}
      <Section title="단계적 개선 프롬프트">
        {improvements.map(([title, sub, prompt]) => (
          <div key={title} className="mb-6">
            <h3 className="serif text-xl mb-1">{title}</h3>
            <p className="text-xs text-muted-text mb-2">{sub}</p>
            <CopyBlock label={title} text={prompt} />
          </div>
        ))}
      </Section>

      {/* Live test checklist */}
      <Section title="라이브 테스트 체크리스트">
        <p className="text-sm text-muted-text mb-4">
          14개 중 <span className="text-coral font-medium">{checkCount}</span>개 확인
        </p>
        <ul className="space-y-2">
          {checks.map((t, i) => (
            <li key={t}>
              <label className="flex items-center gap-3 p-3 rounded-md hover:bg-surface-soft cursor-pointer">
                <input
                  type="checkbox"
                  checked={liveChecks[i]}
                  onChange={() =>
                    setLiveChecks(liveChecks.map((v, idx) => (idx === i ? !v : v)))
                  }
                  className="accent-coral w-4 h-4"
                />
                <span className={liveChecks[i] ? "text-muted-text line-through" : "text-body-strong"}>
                  {i + 1}. {t}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </Section>

      {/* Stuck: two comparison cards */}
      <Section title="막혔을 때 — 어디에 먼저 물어보면 좋을까요?">
        <p className="text-sm text-body mb-6">
          모든 수정 요청을 Lovable 채팅에 바로 입력하는 것이 항상 가장 효율적인 것은 아닙니다. 수정 범위에 따라 도구를 선택하면 크레딧과 시간을 아낄 수 있습니다.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {/* Lovable direct */}
          <div className="rounded-lg p-6 bg-emerald-50 border border-emerald-200">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              <h3 className="serif text-lg text-emerald-900">Lovable에 바로 요청해도 좋은 경우</h3>
            </div>
            <ul className="text-sm text-emerald-950 space-y-1.5 mb-4 list-disc list-inside">
              <li>버튼 문구 수정</li>
              <li>색상 또는 간격 변경</li>
              <li>간단한 정렬 문제</li>
              <li>특정 요소의 위치 조정</li>
              <li>오타 수정</li>
              <li>화면 캡처를 보여주며 "이 부분만 수정해줘"로 요청 가능한 문제</li>
              <li>원인이 명확하고 수정 범위가 작은 오류</li>
            </ul>
            <p className="text-sm font-medium text-emerald-900 mb-2">
              작고 명확한 수정은 Lovable에 바로 요청하는 것이 빠릅니다.
            </p>
            <p className="text-xs text-emerald-800 italic">
              예: "이 버튼 문구를 '피드백 생성'으로 바꾸고, 다른 요소는 변경하지 마."
            </p>
          </div>

          {/* Chatbot first */}
          <div className="rounded-lg p-6 bg-orange-50 border border-orange-200">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-orange-700" />
              <h3 className="serif text-lg text-orange-900">다른 AI 챗봇에서 먼저 정리하면 좋은 경우</h3>
            </div>
            <ul className="text-sm text-orange-950 space-y-1.5 mb-4 list-disc list-inside">
              <li>앱의 전체 사용자 흐름 변경</li>
              <li>여러 화면과 기능을 함께 수정</li>
              <li>새로운 기능 추가</li>
              <li>백엔드 또는 데이터 구조 변경</li>
              <li>기존 기능을 다시 설계</li>
              <li>오류 원인이 여러 곳에 걸쳐 있는 경우</li>
              <li>대규모 수정</li>
              <li>Lovable이 반복해서 같은 오류를 만드는 경우</li>
              <li>긴 요구사항을 체계적인 프롬프트로 정리해야 하는 경우</li>
            </ul>
            <p className="text-sm font-medium text-orange-900">
              구조적이거나 큰 수정은 ChatGPT 같은 범용 AI 챗봇에서 먼저 요구사항과 프롬프트를 정리한 뒤 Lovable에 입력하는 편이 효율적입니다.
            </p>
          </div>
        </div>

        {/* Example image */}
        <figure className="mt-8">
          <figcaption className="serif text-lg mb-2">
            예시 — 복잡한 수정사항을 AI 챗봇에서 Lovable 프롬프트로 정리하기
          </figcaption>
          <p className="text-sm text-body mb-3">
            현재 문제, 원하는 구조, 유지 조건을 AI 챗봇에 전달하고 Lovable용 프롬프트를 작성받는 예시입니다.
          </p>
          <button
            type="button"
            onClick={() => setZoomed(true)}
            className="block w-full rounded-lg overflow-hidden border border-hairline hover:border-coral transition-colors cursor-zoom-in"
            aria-label="예시 이미지 확대"
          >
            <img
              src={chatbotExample.url}
              alt="AI 챗봇에서 Lovable용 영문 프롬프트를 정리하는 대화 예시"
              className="w-full h-auto block"
            />
          </button>
          <p className="text-sm text-muted-text mt-3">
            이 예시처럼 앱의 현재 상황과 원하는 흐름을 먼저 설명하면, Lovable에 여러 번 시행착오를 요청하는 대신 한 번에 더 명확한 수정 프롬프트를 만들 수 있습니다.
          </p>
        </figure>
      </Section>

      {/* Why chatbot first - 4 reasons */}
      <Section title="왜 먼저 다른 AI 챗봇에서 정리할까요?">
        <div className="grid sm:grid-cols-2 gap-3 mb-4">
          {[
            ["요구사항을 구조화할 수 있다", "현재 문제, 원하는 흐름, 유지할 요소, 변경하지 않을 범위를 분리해 정리할 수 있습니다."],
            ["Lovable 크레딧을 아낄 수 있다", "Lovable에서 여러 번 시행착오를 반복하기 전에 요청 내용을 정리하면 불필요한 수정 횟수를 줄일 수 있습니다."],
            ["더 긴 맥락을 전달할 수 있다", "앱의 목적, 사용자, 현재 문제, 이전 수정 과정까지 충분히 설명하고 적절한 프롬프트를 만들 수 있습니다."],
            ["수정 범위를 통제할 수 있다", "'이 기능만 바꾸기', '디자인은 유지하기', '다른 페이지는 수정하지 않기' 같은 조건을 명확히 포함할 수 있습니다."],
          ].map(([t, d], i) => (
            <div key={t} className="bg-surface-card rounded-lg p-5">
              <div className="serif text-3xl text-coral leading-none mb-2">{i + 1}</div>
              <h4 className="serif text-lg mb-1">{t}</h4>
              <p className="text-sm text-body">{d}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-3 p-4 bg-warning/10 border border-warning/30 rounded-lg">
          <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
          <p className="text-sm text-body-strong">
            다른 AI 챗봇이 실제 Lovable 프로젝트 내부를 직접 확인하는 것은 아닙니다. 현재 화면 캡처, 발생한 문제, 원하는 결과, 유지할 조건을 충분히 제공해야 합니다.
          </p>
        </div>
      </Section>

      {/* 4-step complex modification */}
      <Section title="복잡한 수정을 요청하는 4단계">
        <ol className="space-y-3">
          {[
            ["현재 상황 정리", "어떤 앱인지, 현재 무엇이 작동하고 무엇이 작동하지 않는지 적습니다."],
            ["화면 캡처 또는 오류 메시지 제공", "문제가 보이는 화면과 오류 메시지를 함께 전달합니다."],
            ["원하는 결과와 유지 조건 설명", "어떤 흐름으로 바꾸고 싶은지, 어떤 부분은 절대 바꾸면 안 되는지 설명합니다."],
            ["Lovable용 프롬프트 요청", "정리된 요구사항을 바탕으로 Lovable에 그대로 넣을 영문 프롬프트를 요청합니다."],
          ].map(([t, d], i) => (
            <li key={t} className="flex gap-4 p-4 bg-surface-soft rounded-lg">
              <span className="serif text-3xl text-coral leading-none w-10 shrink-0">{i + 1}</span>
              <div>
                <h4 className="text-body-strong font-medium mb-1">{t}</h4>
                <p className="text-sm text-body">{d}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="text-sm serif text-coral mt-4 text-center">
          AI 챗봇에서 만든 프롬프트를 검토한 뒤 Lovable에 붙여 넣으세요.
        </p>

        <div className="mt-6">
          <h3 className="serif text-xl mb-2">복잡한 수정사항을 AI 챗봇에 설명하는 템플릿</h3>
          <CopyBlock label="AI 챗봇 입력 템플릿" text={CHATBOT_TEMPLATE} />
        </div>
      </Section>

      {/* Simple error prompts (3) */}
      <Section title="간단 오류 해결 프롬프트 3종">
        {[
          ["① 버튼이나 기능이 작동하지 않아요", ERR_FEATURE, "예시 학생 답변 생성 버튼을 눌러도 아무 반응이 없습니다. 원래는 선택된 질문에 대한 학생 답변 예시가 표시되어야 합니다. 다른 화면과 디자인은 변경하지 말고 이 기능만 수정해줘."],
          ["② 화면이나 AI 결과가 이상해요", ERR_RESULT, "학생 답변과 관계없는 피드백이 생성됩니다. 선택한 질문과 학생 답변에 실제로 나타난 내용을 근거로 피드백을 작성하도록 수정해줘. 새 기능은 추가하지 마."],
          ["③ 전체 흐름을 순서대로 점검해줘", ERR_FLOW, "어디에서 문제가 생기는지 모르겠습니다. 학습 맥락 입력부터 결과 복사까지 순서대로 테스트하고, 처음 실패하는 단계만 찾아 수정해줘."],
        ].map(([title, prompt, ex]) => (
          <div key={title} className="mb-5">
            <h3 className="serif text-xl mb-2">{title}</h3>
            <CopyBlock label={title} text={prompt} />
            <p className="text-xs text-muted-text mt-2">
              <span className="font-medium text-ink">한국어 예시:</span> {ex}
            </p>
          </div>
        ))}

        <div className="mt-6 bg-surface-card rounded-lg p-6">
          <h3 className="serif text-xl mb-3">오류 요청은 네 가지만 기억하세요</h3>
          <ol className="text-sm text-body-strong space-y-1.5 list-decimal list-inside mb-3">
            <li>현재 무엇이 문제인가?</li>
            <li>원래 어떻게 되어야 하는가?</li>
            <li>어떤 부분은 유지해야 하는가?</li>
            <li>수정 범위는 어디까지인가?</li>
          </ol>
          <p className="text-sm serif text-coral">
            여러 문제를 한꺼번에 해결하려 하지 말고, 가장 먼저 실패하는 한 가지부터 수정하세요.
          </p>
        </div>
      </Section>

      {/* Decision helper */}
      <Section title="이 수정은 어디에 먼저 요청할까요?">
        <div className="bg-canvas border-2 border-coral/30 rounded-lg p-6">
          <ul className="space-y-2 mb-5">
            {decisionItems.map((t, i) => (
              <li key={t}>
                <label className="flex items-center gap-3 p-2 rounded-md hover:bg-surface-soft cursor-pointer">
                  <input
                    type="checkbox"
                    checked={decision[i]}
                    onChange={() =>
                      setDecision(decision.map((v, idx) => (idx === i ? !v : v)))
                    }
                    className="accent-coral w-4 h-4"
                  />
                  <span className="text-sm text-body-strong">{t}</span>
                </label>
              </li>
            ))}
          </ul>
          <div
            className={`rounded-lg p-4 ${
              verdict.tone === "green"
                ? "bg-emerald-50 border border-emerald-200 text-emerald-900"
                : verdict.tone === "coral"
                  ? "bg-orange-50 border border-orange-200 text-orange-900"
                  : "bg-coral/10 border border-coral text-ink"
            }`}
          >
            <p className="text-xs uppercase tracking-widest font-medium mb-1 opacity-70">
              판단 결과 · 체크 {decisionCount}개
            </p>
            <p className="text-sm">{verdict.text}</p>
          </div>
        </div>
      </Section>

      {/* Resources link */}
      <Section title="자료실 바로가기">
        <a
          href="/resources"
          className="flex items-center justify-between gap-3 p-5 bg-ink text-canvas rounded-lg hover:bg-ink/90 transition-colors"
        >
          <div>
            <p className="serif text-xl">모든 프롬프트와 체크리스트를 자료실에서 확인하세요</p>
            <p className="text-sm text-canvas/70 mt-1">복사, Markdown 다운로드, 인쇄 지원</p>
          </div>
          <ArrowRight className="w-5 h-5 shrink-0" />
        </a>
      </Section>

      <ModuleNavigation module={m} />

      {/* Lightbox */}
      {zoomed && (
        <div
          className="fixed inset-0 bg-ink/90 z-50 flex items-center justify-center p-4"
          onClick={() => setZoomed(false)}
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={() => setZoomed(false)}
            className="absolute top-4 right-4 inline-flex items-center gap-1 px-3 py-2 rounded-md bg-canvas text-ink text-sm font-medium"
            aria-label="닫기"
          >
            <X className="w-4 h-4" /> 닫기
          </button>
          <img
            src={chatbotExample.url}
            alt="AI 챗봇에서 Lovable용 영문 프롬프트를 정리하는 대화 예시 확대"
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </article>
  );
}
