'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Document, DocType, Category } from '@/lib/types';
import DocumentCard from './DocumentCard';
import DocumentForm from './DocumentForm';

const DOC_TYPES: { value: DocType | ''; label: string }[] = [
  { value: '', label: '전체' },
  { value: 'sheets',     label: '📊 Sheets' },
  { value: 'docs',       label: '📄 Docs' },
  { value: 'appsheet',   label: '📱 AppSheet' },
  { value: 'notebooklm', label: '🔬 NotebookLM' },
  { value: 'etc',        label: '⚙️ 기타' },
];

const CATEGORIES: { value: Category | ''; label: string }[] = [
  { value: '',      label: '전체' },
  { value: '통계',   label: '📈 통계' },
  { value: '관리',   label: '📋 관리' },
  { value: '신청',   label: '📝 신청' },
  { value: '자동화', label: '⚡ 자동화' },
  { value: '기타',   label: '📁 기타' },
];

export default function DocumentGrid({ documents }: { documents: Document[] }) {
  const router = useRouter();
  const [search,      setSearch]      = useState('');
  const [activeType,  setActiveType]  = useState<DocType | ''>('');
  const [activeCategory, setActiveCategory] = useState<Category | ''>('');
  const [formOpen,    setFormOpen]    = useState(false);
  const [editingDoc,  setEditingDoc]  = useState<Document | null>(null);

  function openAdd()               { setEditingDoc(null); setFormOpen(true); }
  function openEdit(doc: Document) { setEditingDoc(doc);  setFormOpen(true); }
  function closeForm()             { setFormOpen(false);  setEditingDoc(null); }
  function handleSuccess()         { closeForm(); router.refresh(); }

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return documents.filter((doc) => {
      if (activeType     && doc.doc_type !== activeType)     return false;
      if (activeCategory && doc.category !== activeCategory) return false;
      if (q) {
        const hit =
          doc.title.toLowerCase().includes(q) ||
          (doc.description ?? '').toLowerCase().includes(q) ||
          doc.tags.some((t) => t.toLowerCase().includes(q));
        if (!hit) return false;
      }
      return true;
    });
  }, [documents, activeType, activeCategory, search]);

  function filterBtn(active: boolean) {
    return `text-xs px-3 py-1.5 rounded-full border transition-all ${
      active
        ? 'bg-blue-600 text-white border-blue-600'
        : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400 hover:text-blue-600'
    }`;
  }

  return (
    <div>
      {/* ── 검색 + 필터 패널 ── */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-3">

          {/* 검색창 + 추가 버튼 */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input
                type="text"
                placeholder="문서명, 설명, 태그로 검색..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg leading-none"
                >×</button>
              )}
            </div>
            <button
              onClick={openAdd}
              className="shrink-0 text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              + 새 문서 추가
            </button>
          </div>

          {/* 유형 필터 */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-gray-500 font-medium w-8 shrink-0">유형</span>
            {DOC_TYPES.map(({ value, label }) => (
              <button key={value} onClick={() => setActiveType(value as DocType | '')}
                className={filterBtn(activeType === value)}>
                {label}
              </button>
            ))}
          </div>

          {/* 성격 필터 */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-gray-500 font-medium w-8 shrink-0">성격</span>
            {CATEGORIES.map(({ value, label }) => (
              <button key={value} onClick={() => setActiveCategory(value as Category | '')}
                className={filterBtn(activeCategory === value)}>
                {label}
              </button>
            ))}
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
              <DocumentCard key={doc.id} doc={doc} onEdit={openEdit} />
            ))}
          </div>
        )}
      </div>

      {formOpen && (
        <DocumentForm doc={editingDoc} onClose={closeForm} onSuccess={handleSuccess} />
      )}
    </div>
  );
}
