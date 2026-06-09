export type DocType = 'sheets' | 'docs' | 'appsheet' | 'notebooklm' | 'etc';
export type Team = '원무' | '심사' | '국검' | '종검';
export type Category = '통계' | '관리' | '신청' | '자동화' | '기타';

export interface Document {
  id: string;
  title: string;
  doc_type: DocType;
  description: string | null;
  tags: string[];
  url: string;
  team: Team | null;
  category: Category | null;
  updated_at: string;
}
