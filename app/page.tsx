import { getServerClient } from '@/lib/supabase';
import { Document } from '@/lib/types';
import DocumentGrid from './components/DocumentGrid';

export const dynamic = 'force-dynamic';

async function getDocuments(): Promise<Document[]> {
  const supabase = getServerClient();
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data as Document[];
}

export default async function Home() {
  const documents = await getDocuments();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              GMH 문서 대시보드
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              좋은문화병원 원무팀 업무전산화 색인
            </p>
          </div>
          <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">
            {documents.length}개 문서
          </span>
        </div>
      </header>

      {/* 문서 그리드 + 필터 */}
      <DocumentGrid documents={documents} />
    </div>
  );
}
