'use client';

import { Document, DocType, Team } from '@/lib/types';

const DOC_TYPE_STYLE: Record<DocType, { label: string; className: string }> = {
  sheets:     { label: '📊 Sheets',     className: 'bg-green-100 text-green-800' },
  docs:       { label: '📄 Docs',       className: 'bg-blue-100 text-blue-800' },
  appsheet:   { label: '📱 AppSheet',   className: 'bg-amber-100 text-amber-800' },
  notebooklm: { label: '🔬 NotebookLM', className: 'bg-purple-100 text-purple-800' },
  etc:        { label: '⚙️ 기타',        className: 'bg-slate-100 text-slate-700' },
};

const TEAM_STYLE: Record<NonNullable<Team>, string> = {
  원무: 'bg-sky-100 text-sky-800',
  심사: 'bg-rose-100 text-rose-800',
  국검: 'bg-teal-100 text-teal-800',
  종검: 'bg-violet-100 text-violet-800',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

export default function DocumentCard({ doc }: { doc: Document }) {
  const typeStyle = DOC_TYPE_STYLE[doc.doc_type];

  return (
    <a
      href={doc.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 cursor-pointer"
    >
      {/* 배지 행 */}
      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${typeStyle.className}`}>
          {typeStyle.label}
        </span>
        {doc.team && (
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${TEAM_STYLE[doc.team]}`}>
            {doc.team}팀
          </span>
        )}
      </div>

      {/* 제목 */}
      <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors leading-snug mb-1.5">
        {doc.title}
      </h3>

      {/* 설명 */}
      {doc.description && (
        <p className="text-sm text-gray-500 leading-relaxed mb-3 flex-1">
          {doc.description}
        </p>
      )}

      {/* 태그 */}
      {doc.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {doc.tags.map((tag) => (
            <span key={tag} className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* 날짜 + 화살표 */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-400">{formatDate(doc.updated_at)}</span>
        <span className="text-blue-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all text-sm">
          열기 →
        </span>
      </div>
    </a>
  );
}
