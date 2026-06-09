'use client';

import { useEffect, useState } from 'react';
import { Document, DocType, Team } from '@/lib/types';

interface Props {
  doc: Document | null; // null = 새 문서
  onClose: () => void;
  onSuccess: () => void;
}

const DOC_TYPES: { value: DocType; label: string }[] = [
  { value: 'sheets',     label: '📊 Sheets' },
  { value: 'docs',       label: '📄 Docs' },
  { value: 'appsheet',   label: '📱 AppSheet' },
  { value: 'notebooklm', label: '🔬 NotebookLM' },
  { value: 'etc',        label: '⚙️ 기타' },
];

const TEAMS: { value: Team; label: string }[] = [
  { value: '원무', label: '원무팀' },
  { value: '심사', label: '심사팀' },
  { value: '국검', label: '국검팀' },
  { value: '종검', label: '종검팀' },
];

const today = () => new Date().toISOString().slice(0, 10);

function toDateInput(iso: string) {
  return iso ? new Date(iso).toISOString().slice(0, 10) : today();
}

export default function DocumentForm({ doc, onClose, onSuccess }: Props) {
  const isEdit = doc !== null;

  const [url,         setUrl]         = useState(doc?.url ?? '');
  const [title,       setTitle]       = useState(doc?.title ?? '');
  const [docType,     setDocType]     = useState<DocType>(doc?.doc_type ?? 'sheets');
  const [team,        setTeam]        = useState<Team | ''>(doc?.team ?? '원무');
  const [description, setDescription] = useState(doc?.description ?? '');
  const [tagsInput,   setTagsInput]   = useState(doc?.tags?.join(', ') ?? '');
  const [updatedAt,   setUpdatedAt]   = useState(toDateInput(doc?.updated_at ?? ''));
  const [isLoading,   setIsLoading]   = useState(false);
  const [error,       setError]       = useState('');
  const [confirmDel,  setConfirmDel]  = useState(false);

  // ESC 키로 닫기
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim() || !title.trim()) {
      setError('URL과 제목은 필수입니다.');
      return;
    }

    setIsLoading(true);
    setError('');

    const payload = {
      url:         url.trim(),
      title:       title.trim(),
      doc_type:    docType,
      team:        team || null,
      description: description.trim() || null,
      tags:        tagsInput.split(',').map(t => t.trim()).filter(Boolean),
      updated_at:  new Date(updatedAt).toISOString(),
    };

    const res = await fetch(
      isEdit ? `/api/documents/${doc.id}` : '/api/documents',
      {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    setIsLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? '저장 중 오류가 발생했습니다.');
      return;
    }

    onSuccess();
  }

  async function handleDelete() {
    setIsLoading(true);
    await fetch(`/api/documents/${doc!.id}`, { method: 'DELETE' });
    setIsLoading(false);
    onSuccess();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* 폼 패널 */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">
            {isEdit ? '문서 수정' : '새 문서 추가'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

          {/* URL */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://docs.google.com/..."
              className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* 제목 */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="예) 키오스크 통계"
              className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* 유형 + 팀 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">문서 유형</label>
              <select
                value={docType}
                onChange={e => setDocType(e.target.value as DocType)}
                className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {DOC_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">담당팀</label>
              <select
                value={team}
                onChange={e => setTeam(e.target.value as Team | '')}
                className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">선택 안 함</option>
                {TEAMS.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 설명 */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">설명</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="문서의 용도나 내용을 간단히 설명해 주세요"
              rows={2}
              className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* 태그 */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">태그</label>
            <input
              type="text"
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
              placeholder="쉼표로 구분  예) 키오스크, 수납, 통계"
              className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 등록일 */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">등록일</label>
            <input
              type="date"
              value={updatedAt}
              onChange={e => setUpdatedAt(e.target.value)}
              className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 오류 메시지 */}
          {error && (
            <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}

          {/* 버튼 */}
          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? '저장 중...' : (isEdit ? '수정 저장' : '문서 추가')}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
          </div>

          {/* 삭제 버튼 (수정 모드만) */}
          {isEdit && (
            <div className="pt-1 border-t border-gray-100">
              {confirmDel ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 flex-1">정말 삭제할까요?</span>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isLoading}
                    className="text-xs px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    삭제
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDel(false)}
                    className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg text-gray-600"
                  >
                    취소
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDel(true)}
                  className="w-full text-xs text-red-500 hover:text-red-700 py-1.5 transition-colors"
                >
                  이 문서 삭제
                </button>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
