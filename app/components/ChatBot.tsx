'use client';

import { useRef, useState } from 'react';

interface DocResult {
  title: string;
  url: string;
  reason: string;
}

interface Message {
  role: 'user' | 'assistant';
  text: string;
  results?: DocResult[];
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: '안녕하세요! 찾고 싶은 문서를 자연어로 물어보세요.\n예) "키오스크 관련 자료 보여줘" 또는 "환자 피드백 문서 찾아줘"',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  async function handleSend() {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: Message = { role: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: data.answer ?? '결과를 찾지 못했습니다.', results: data.results ?? [] },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: '오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    }
  }

  return (
    <>
      {/* 플로팅 버튼 */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center text-2xl"
        aria-label="AI 문서 검색 챗봇 열기"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* 챗봇 패널 */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-h-[560px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          {/* 헤더 */}
          <div className="bg-blue-600 px-4 py-3 flex items-center gap-2">
            <span className="text-lg">🤖</span>
            <div>
              <p className="text-sm font-semibold text-white">AI 문서 검색</p>
              <p className="text-xs text-blue-200">자연어로 문서를 찾아드립니다</p>
            </div>
          </div>

          {/* 메시지 영역 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] ${msg.role === 'user' ? '' : 'space-y-2'}`}>
                  {/* 말풍선 */}
                  <div
                    className={`px-3.5 py-2.5 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-sm'
                        : 'bg-white text-gray-800 border border-gray-200 rounded-tl-sm shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* 추천 문서 카드 */}
                  {msg.results && msg.results.length > 0 && (
                    <div className="space-y-1.5">
                      {msg.results.map((doc, j) => (
                        <a
                          key={j}
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start gap-2 bg-white border border-blue-100 rounded-xl px-3 py-2.5 hover:border-blue-400 hover:shadow-sm transition-all group"
                        >
                          <span className="text-blue-500 mt-0.5 shrink-0">📎</span>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-gray-800 group-hover:text-blue-600 truncate">
                              {doc.title}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5 leading-snug">{doc.reason}</p>
                          </div>
                          <span className="text-blue-400 text-xs shrink-0 ml-auto mt-0.5">열기 →</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* 로딩 인디케이터 */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                  <span className="flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
                  </span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* 입력창 */}
          <div className="p-3 border-t border-gray-100 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="예) 키오스크 관련 자료 찾아줘"
                className="flex-1 text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium disabled:opacity-40 hover:bg-blue-700 transition-colors"
              >
                전송
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
