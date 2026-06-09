import { NextRequest, NextResponse } from 'next/server';
import { getServerClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  if (!process.env.OPENROUTER_API_KEY) {
    return NextResponse.json(
      { answer: 'OpenRouter API 키가 설정되지 않았습니다. .env.local의 OPENROUTER_API_KEY를 확인해 주세요.', results: [] },
      { status: 200 }
    );
  }

  const supabase = getServerClient();
  const { data: documents, error } = await supabase
    .from('documents')
    .select('title, description, tags, url, doc_type, team');

  if (error) {
    return NextResponse.json({ answer: '문서 목록을 불러오는 데 실패했습니다.', results: [] }, { status: 500 });
  }

  const docList = documents
    .map(
      (d, i) =>
        `${i + 1}. 제목: ${d.title} | 유형: ${d.doc_type} | 설명: ${d.description ?? '없음'} | 태그: ${d.tags.join(', ')} | URL: ${d.url}`
    )
    .join('\n');

  const systemPrompt = `당신은 좋은문화병원 원무팀의 문서 검색 도우미입니다.
사용자가 자연어로 질문하면, 아래 문서 목록에서 관련 문서를 찾아 추천해 주세요.

[문서 목록]
${docList}

[응답 규칙]
- 반드시 아래 JSON 형식으로만 응답하세요. 다른 텍스트는 절대 포함하지 마세요.
- answer: 한국어로 자연스럽게 검색 결과를 설명하는 문장 (2-3문장)
- results: 관련 문서 배열 (없으면 빈 배열)

{
  "answer": "설명 문장",
  "results": [
    { "title": "문서 제목", "url": "문서 URL", "reason": "추천 이유 한 줄" }
  ]
}`;

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://gmhadmin.vercel.app',
      'X-Title': 'GMH Document Dashboard',
    },
    body: JSON.stringify({
      model: 'google/gemma-4-31b-it:free',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      temperature: 0.3,
      max_tokens: 800,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('OpenRouter error:', err);
    return NextResponse.json({ answer: 'AI 검색 중 오류가 발생했습니다.', results: [] }, { status: 500 });
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content ?? '';

  try {
    // 모델이 ```json ... ``` 블록으로 감쌀 때 제거
    const cleaned = content.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    const parsed = JSON.parse(cleaned);
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ answer: content, results: [] });
  }
}
