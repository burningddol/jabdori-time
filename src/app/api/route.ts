import { NextRequest, NextResponse } from "next/server";
import Cerebras from '@cerebras/cerebras_cloud_sdk';
import type { ConfessionFormData } from "@/lib/validation";

export const runtime = "nodejs";

const cerebras = new Cerebras({
  apiKey: process.env.CEREBRAS_API_KEY
});

function buildPrompt(payload: ConfessionFormData): string {
  const { name, task, excuse, tone } = payload;

  const toneInstruction = tone === "spicy"
    ? " 답변수위: 친구들이 핵매운맛으로 욕도 섞어서 말한다. 거침없이 팩트폭격해 무자비하게 잔인하게 해 캐릭터들이 전부 매운맛이 되어버려."
    : "답변수위: 순한맛으로 티타임가지듯 하되 따끔하게. 욕은 하지 말고 비꼬는 말투로.";
  
  return `5명의 친구가 있어. 각 친구는 ${name}이(가) 할 일을 미루고 변명하는 걸 듣고 잡도리(혼내기)를 해야해.

${name}이(가) 해야했던 일: ${task}
${name}의 변명: ${excuse}

지금부터 친구1, 친구2, 친구3, 친구4, 친구5가 각각 한 번씩 카톡 채팅처럼 대답해.

각 친구는 반드시 자신의 성격, 말투, 사고방식을 유지해야 하며 서로 말투가 섞이거나 비슷해지면 안 된다.
각 친구는 같은 상황을 보더라도 완전히 다른 관점에서 반응한다.
[친구1]
아이돌 출신 메인보컬. 대중 앞에 서는 것에 익숙하고, 항상 상냥한 미소와 부드러운 말투를 유지한다.
겉으로는 공감하고 이해해주는 것처럼 말하지만, 실제로는 상대가 가장 숨기고 싶은 핵심을 정확히 짚어낸다.
욕설이나 노골적인 비난은 절대 사용하지 않는다.
대신 “실망했다”, “기대했는데” 같은 표현으로 상대의 죄책감을 자극한다.
밝고 따뜻한 말투 속에 은근한 압박과 아픔을 숨겨두는 스타일이다.
상대가 변명할수록 더 부드럽게, 더 정확하게 정곡을 찌른다.

말투 키워드:
- 상냥함
- 웃음 섞인 말투
- 실망한 듯한 여운
- 팬서비스처럼 다정하지만 도망칠 수 없는 압박

---

[친구2]
5개국어 통역사 출신의 냉철한 현실주의자.
감정 표현이 거의 없고, 위로나 공감에는 관심이 없다.
사실, 결과, 비교만을 기준으로 말한다.
말투는 짧고 단정하며 불필요한 문장은 제거한다.
상대의 변명을 논리적으로 해체하며, 필요하다면 욕설도 사용한다.
다만 욕은 감정 폭발이 아니라, 판단의 일부처럼 차갑게 사용한다.
상대의 자존심을 직접적으로 긁어도 전혀 신경 쓰지 않는다.

말투 키워드:
- 짧고 건조함
- 비교, 수치, 결과 중심
- 냉정한 팩트 폭력
- 감정 없는 욕설 가능

---

[친구3]
주인공과 오랜 시간을 함께한 소꿉친구이자 FE 개발자.
기본적으로는 다정하고, 상대의 상황을 이해하려 노력한다.
하지만 같은 실수를 반복하거나 변명이 길어지면 태도가 확실히 바뀐다.
보호자처럼 현실적인 조언과 잔소리를 한다.
상대를 깎아내리기보다는, 제대로 정신 차리길 바라는 진심이 담긴 훈계를 한다.
선을 넘었다고 판단하면 말투는 여전히 차분하지만 내용은 단호해진다.

말투 키워드:
- 친근함
- 걱정 섞인 잔소리
- 보호자 같은 시선
- 진심 어린 단호함

---

[친구4]
생물학 박사학위를 가지고 있는 차도녀.
감정 표현이 극도로 절제되어 있으며, 불필요한 말은 하지 않는다.
사람을 평가할 때 과정에는 관심 없고, 결과만 본다.
성공하지 못한 사람에게는 냉정하고 거리감 있게 대한다.
직접적인 욕설은 거의 쓰지 않지만, 말 한마디 한마디가 상대를 위축시킨다.
존재 자체가 압박이며, 상대가 스스로 부족함을 느끼게 만든다.

말투 키워드:
- 시크함
- 감정 절제
- 결과 중심
- 조용한 경멸

---

[친구5]
외모는 어려 보이지만 방구석 히키코모리 천재 개발자.
감정 공감 능력은 거의 없고, 인간의 행동을 하나의 데이터처럼 분석한다.
말투는 매우 건조하고 분석적이다.
상대의 행동을 논리, 확률, 패턴, 통계로 설명하며 감정적 표현을 배제한다.
위로도 비난도 아닌, “분석 결과”만 전달한다.
그의 말은 차갑지만 반박하기 어렵다.
개발자용 참신한 드립을 1개씩친다 드립은 인터넷커뮤니티에서 참고한다. 

말투 키워드:
- 논리적
- 분석적
- 감정 배제
- 데이터 중심


${toneInstruction}


규칙:
0. 혹시나 나쁜 할 일을 지정해놓고 못했다고하면 오히려 칭찬을 해줘. 예를들어 할 일에 도둑질을 적어놓고 변명에 양심에 찔려서 못했다라고하면 이건 잘 한일이잖아? 상황에 맞게 유동적으로 잡도리해.
1. 각 친구는 딱 한 번만 답변해 (총 5개 메시지)
2. 카톡 채팅처럼 짧고 임팩트있게
3. 웃기지만 뼈가 있어야 해
4. 형식: "친구1: 메시지" 이런 식으로
5. 타임스탬프나 이모지는 넣지 마
6. 언어는 한글만 써 중간에 영어도 들어가도돼 한자는 절대 포함하면 안돼.
7. 각 친구는 앞선 친구의 발언을 참고하되, 같은 표현이나 논지를 반복하지 않고 자신만의 관점으로 반응한다.
8. 같은 표현을 반복하지 않는다.
9. 각 캐릭터는 공백포함 최소 60자, 최대 130자 사이로 골고루 분포되게 말한다.
`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as ConfessionFormData;

    if (!body.name || !body.task || !body.excuse || !body.tone) {
      return NextResponse.json(
        { error: "Missing required fields: name, task, excuse, tone" },
        { status: 400 }
      );
    }

    if (body.tone !== "spicy" && body.tone !== "mild") {
      return NextResponse.json(
        { error: "Invalid tone" },
        { status: 400 }
      );
    }

    const message = buildPrompt(body);

    const res = await cerebras.chat.completions.create({
      messages: [{ role: "user", content: message }],
      model: "llama3.1-8b",
      max_completion_tokens: 1000,
      temperature: 0.2,
      top_p: 0.95,
      stream: false
    });

    const content = (res as any).choices?.[0]?.message?.content;

    return NextResponse.json({
      answer: content,
    });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to process confession" },
      { status: 500 }
    );
  }
}

// api 체크용
export async function GET() {
  return NextResponse.json({ status: "ok", message: "Jabdori Time API is running" });
}
