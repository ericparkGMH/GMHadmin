'use client';

import { useMemo, useState } from 'react';
import { Document, DocType, Team } from '@/lib/types';
import DocumentCard from './DocumentCard';

const DOC_TYPES: { value: DocType | ''; label: string }[] = [
  { value: '', label: '전체' },
  { value: 'sheets', label: '📊 Sheets' },
  { value: 'docs', label: '📄 Docs' },
  { value: 'appsheet', label: '📱 AppSheet' },
  { value: 'notebooklm', label: '🔬 NotebookLM' },
  { value: 'etc', label: '⚙️ 기타' },
];

const TEAMS: { value: Team | ''; label: string }[] = [
  { value: '', label: '전체' },
  { value: '원무', label: '원무팀' },
  { value: '심사', label: '심사팀' },
  { value: '국검', label: '국검팀' },
  { value: '종검', label: '종검팀' },
];

export default function DocumentGrid({ documents }: { documents: Document[] }) {
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState<DocType | ''>('');
  const [activeTeam, setActiveTeam] = useState<Team | ''>('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return documents.filter((doc) => {
      if (activeType && doc.doc_type !== activeType) return false;
      if (activeTeam && doc.team !== activeTeam) return false;
      if (q) {
        const hit =
          doc.title.toLowerCase().includes(q) ||
          (doc.description ?? '').toLowerCase().includes(q) ||
          doc.tags.some((t) => t.toLowerCase().includes(q));
        if (!hit) return false;
      }
      return true;
    });
  }, [documents, activeType, activeTeam, search]);

  return (
    <div>
      {/* ── 검색 + 필터 패널 ── */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-3">
          {/* 검색창 */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="문서명, 설명, 태그로 검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg leading-none"
              >
                ×
              </button>
            )}
          </div>

          {/* 필터 행 */}
          <div className="flex flex-wrap gap-4">
            {/* 문서 유형 */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-gray-500 font-medium mr-1">유형</span>
              {DOC_TYPES.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setActiveType(value as DocType | '')}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                    activeType === value
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400 hover:text-blue-600'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* 담당팀 */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-gray-500 font-medium mr-1">팀</span>
              {TEAMS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setActiveTeam(value as Team | '')}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                    activeTeam === value
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400 hover:text-blue-600'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── 문서 그리드 ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <p className="text-sm text-gray-500 mb-4">
          {filtered.length === documents.length
            ? `전체 ${documents.length}개 문서`
            : `${filtered.length}개 검색됨 (전체 ${documents.length}개)`}
        </p>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">🔎</p>
            <p className="text-base">검색 결과가 없어요</p>
            <p className="text-sm mt-1">다른 키워드나 필터를 사용해 보세요</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((doc) => (
              <DocumentCard key={doc.id} doc={doc} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
