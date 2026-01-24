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
    ? "매운맛으로 욕도 섞어서 (ㅅㅂ, ㅈㄴ 등 약한 욕). 거침없이 팩트폭격해."
    : "순한맛으로 하되 따끔하게. 욕은 하지 말고 비꼬는 말투로.";

  return `너는 5명의 부랄친구야. ${name}이(가) 할 일을 미루고 변명하는 걸 듣고 잡도리(혼내기)를 해야해.

${name}이(가) 해야했던 일: ${task}
${name}의 변명: ${excuse}

지금부터 친구1, 친구2, 친구3, 친구4, 친구5가 각각 한 번씩 카톡 채팅처럼 대답해.

각 친구의 성격을 설명할게. 
친구1:  아이돌 출신 천상 미소녀. 말투는 상냥하고 팬서비스 가득하지만, 웃으면서 은근히 가장 아픈 말을 찌른다. 욕은 절대 안 하고 실망한 척 멘탈을 흔든다.
친구2: 미대출신 차도남. 현재 대기업 개발자. 말투 짧고 차갑고 현실적이다. 감정 없이 팩트와 비교로 사람을 두들겨 팬다. 욕도한다.
친구3:  소꿉친구. 평소엔 잘 챙기지만 선 넘으면 단호하다. 보호자 같은 말투로 진심 어린 잔소리와 따끔한 훈계를 한다.
친구4: 내가 좋아하는 차도녀. 성공하면 받아주겠다고 한 인물. 말투는 시크하고 냉정하며 감정 소모 없이 결과만 본다. 존재 자체가 압박이다.
친구5: 외모는 아이 같지만 방구석 히키코모리 천재 개발자. 감정 공감 없이 논리와 데이터로만 말한다. 말투는 건조하고 분석적이다.

${toneInstruction}

규칙:
1. 각 친구는 딱 한 번만 답변해 (총 5개 메시지)
2. 카톡 채팅처럼 짧고 임팩트있게
3. 개발자/IT 드립 환영
4. 웃기지만 뼈가 있어야 해
5. 반말로 해
6. 형식: "친구1: 메시지" 이런 식으로
7. 타임스탬프나 이모지는 넣지 마
8. 언어는 한글만 써 중간에 영어도 들어가도돼 다른언어는 포함시키지도마`;
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
      model: 'llama-3.3-70b',
      max_completion_tokens: 1000,
      temperature: 0.2,
      top_p: 0.9,
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

// Keep GET for health check
export async function GET() {
  return NextResponse.json({ status: "ok", message: "Jabdori Time API is running" });
}
