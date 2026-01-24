
import {  NextResponse } from "next/server";
import Cerebras from '@cerebras/cerebras_cloud_sdk';

export const runtime = "nodejs";



const cerebras = new Cerebras({
  apiKey: process.env.CEREBRAS_API_KEY
});

export async function GET() {
  const  message  = `오늘 해야했던 할일은 테일윈드css 공부인데 게임하다가 못했음.따끔한 충고를 웃긴 드립 섞어서 해줘.카톡 채팅처럼. 부랄친구이고 친구1~친구5가 잡도리하는 형식으로. 개발자스러운 답변으로 핵매운맛으로 욕섞어서. 각 친구는 답변 한번씩만해. 내답변과 타임스탬프는 포함하지마. 언어는 한글만 써`;
  
try {
    console.log(1111);

    const res = await await cerebras.chat.completions.create({
    messages: [{"role":"user","content":`${message}`}],
    model:'llama-3.3-70b',
    max_completion_tokens: 1000,
    temperature: 0.2,
    top_p: 1,
    stream: false
  });
  
  const content =
  (res as any).choices?.[0]?.message?.content;
  console.log( content);
  return NextResponse.json({
    answer: content,
  });
    
  } catch (error) {
    console.error("Error :", error);
    return NextResponse.json(
      { error: "Failed to fetch memos" },
      { status: 500 }
    );
  }
}
