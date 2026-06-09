import { NextRequest } from 'next/server';
import { getServerClient } from '@/lib/supabase';

/** 중첩 괄호를 추적해 첫 번째 완전한 JSON 객체를 추출 */
function extractJSON(text: string): { answer?: string; results?: unknown[] } | null {
  const start = text.indexOf('{');
  if (start === -1) return null;
  let depth = 0;
  let inStr = false;
  let esc = false;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (esc) { esc = false; continue; }
    if (ch === '\\' && inStr) { esc = true; continue; }
    if (ch === '"') { inStr = !inStr; continue; }
    if (inStr) continue;
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) {
        try { return JSON.parse(text.slice(start, i + 1)); } catch { return null; }
      }
    }
  }
  return null;
}

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  if (!process.env.OPENROUTER_API_KEY) {
    return new Response(
      JSON.stringify({ answer: 'OpenRouter API 키가 설정되지 않았습니다.', results: [] }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  const supabase = getServerClient();
  const { data: documents, error } = await supabase
    .from('documents')
    .select('title, description, tags, url, doc_type, team');

  if (error) {
    return new Response(
      JSON.stringify({ answer: '문서 목록을 불러오는 데 실패했습니다.', results: [] }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 키워드 사전 필터링: 질문 키워드와 겹치는 문서 상위 8개만 AI에 전송
  const keywords = message.toLowerCase().split(/\s+/).filter((w: string) => w.length > 1);
  const scored = (documents ?? []).map((d) => {
    const haystack = `${d.title} ${d.description ?? ''} ${d.tags.join(' ')}`.toLowerCase();
    const score = keywords.filter((kw: string) => haystack.includes(kw)).length;
    return { ...d, score };
  });
  const relevant = scored.sort((a, b) => b.score - a.score).slice(0, 8);

  const docList = relevant
    .map((d, i) =>
      `${i + 1}. 제목: ${d.title} | 설명: ${d.description ?? '없음'} | 태그: ${d.tags.join(', ')} | URL: ${d.url}`
    )
    .join('\n');

  const systemPrompt = `좋은문화병원 원무팀 문서 검색 도우미입니다. 아래 문서 목록에서 질문에 맞는 문서를 추천하세요.

[문서 목록]
${docList}

반드시 JSON만 출력하세요. 다른 텍스트 금지.
{"answer":"한국어 설명 1-2문장","results":[{"title":"제목","url":"URL","reason":"이유"}]}`;

  const upstreamRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://gmhadmin.vercel.app',
      'X-Title': 'GMH Document Dashboard',
    },
    body: JSON.stringify({
      model: 'nvidia/nemotron-nano-9b-v2:free',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      temperature: 0.2,
      max_tokens: 1200,
      stream: true,
    }),
  });

  if (!upstreamRes.ok) {
    const err = await upstreamRes.text();
    console.error('OpenRouter error:', err);
    return new Response(
      JSON.stringify({ answer: 'AI 검색 중 오류가 발생했습니다.', results: [] }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const stream = new ReadableStream({
    async start(controller) {
      const reader = upstreamRes.body!.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';
      let answerSent = '';  // 이미 클라이언트로 전송한 answer 텍스트

      // answer 필드 내부 텍스트만 실시간으로 스트리밍하는 헬퍼
      function tryStreamAnswer(raw: string) {
        // accumulated가 `{"answer":"...` 형태로 쌓이는 중일 때 answer 값 부분만 추출
        const answerStart = raw.indexOf('"answer":"');
        if (answerStart === -1) return;
        let inStr = false;
        let esc = false;
        let valueStart = -1;
        for (let i = answerStart + 9; i < raw.length; i++) {
          const ch = raw[i];
          if (valueStart === -1 && ch === '"') { valueStart = i + 1; inStr = true; continue; }
          if (valueStart === -1) continue;
          if (esc) { esc = false; continue; }
          if (ch === '\\') { esc = true; continue; }
          if (ch === '"') {
            // answer 값 끝
            const answerText = raw.slice(valueStart, i)
              .replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
            const newPart = answerText.slice(answerSent.length);
            if (newPart) {
              answerSent = answerText;
              controller.enqueue(
                new TextEncoder().encode(`data: ${JSON.stringify({ token: newPart })}\n\n`)
              );
            }
            return;
          }
        }
        // 아직 닫히지 않은 경우: 지금까지 나온 부분만 스트리밍
        if (valueStart !== -1) {
          const partial = raw.slice(valueStart)
            .replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
          const newPart = partial.slice(answerSent.length);
          if (newPart) {
            answerSent += newPart;
            controller.enqueue(
              new TextEncoder().encode(`data: ${JSON.stringify({ token: newPart })}\n\n`)
            );
          }
        }
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (data === '[DONE]') continue;
          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices?.[0]?.delta?.content ?? '';
            if (delta) {
              accumulated += delta;
              tryStreamAnswer(accumulated);
            }
          } catch { /* 무시 */ }
        }
      }

      // 스트림 완료: 전체 JSON에서 results 추출
      const full = extractJSON(accumulated);
      controller.enqueue(
        new TextEncoder().encode(
          `data: ${JSON.stringify({ done: true, results: full?.results ?? [] })}\n\n`
        )
      );
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
