-- GMHadmin: documents 테이블 생성 + 샘플 데이터
-- Supabase 대시보드 > SQL Editor 에 붙여넣고 Run 클릭

CREATE TABLE IF NOT EXISTS documents (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL,
  doc_type    text NOT NULL CHECK (doc_type IN ('sheets','docs','appsheet','notebooklm','etc')),
  description text,
  tags        text[] DEFAULT '{}',
  url         text NOT NULL,
  team        text CHECK (team IN ('원무','심사','국검','종검')),
  updated_at  timestamptz DEFAULT now()
);

-- 전체 공개 읽기 허용 (로그인 없이 조회 가능)
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "누구나 읽기 가능"
  ON documents FOR SELECT
  USING (true);

CREATE POLICY "인증된 사용자만 쓰기 가능"
  ON documents FOR ALL
  USING (auth.role() = 'authenticated');

-- 샘플 데이터 4개
INSERT INTO documents (title, doc_type, description, tags, url, team, updated_at) VALUES
(
  '2024년 원무팀 청구 현황',
  'sheets',
  '월별 진료비 청구 건수와 금액을 정리한 스프레드시트. 심평원 청구 전 검토용.',
  ARRAY['청구','월별현황','원무'],
  'https://docs.google.com/spreadsheets/d/SAMPLE_SHEET_ID_1',
  '원무',
  '2024-11-15 09:00:00+09'
),
(
  '심사 삭감 사례집 2024',
  'docs',
  '심평원 심사 결과 삭감된 주요 사례와 대응 방법을 정리한 문서.',
  ARRAY['삭감','심사','사례집'],
  'https://docs.google.com/document/d/SAMPLE_DOC_ID_1',
  '심사',
  '2024-10-22 14:30:00+09'
),
(
  '국검 검사항목 관리 앱',
  'appsheet',
  '국가 건강검진 검사항목 기준표를 관리하는 AppSheet 앱. 코드·수가·판정기준 조회 가능.',
  ARRAY['국검','검사항목','수가'],
  'https://www.appsheet.com/start/SAMPLE_APP_ID',
  '국검',
  '2024-09-30 11:00:00+09'
),
(
  '종합검진 운영 매뉴얼 노트북',
  'notebooklm',
  '종합검진 운영 절차·FAQs를 AI 노트북에 정리. 신규 직원 온보딩 및 현장 문의 대응용.',
  ARRAY['종검','매뉴얼','온보딩'],
  'https://notebooklm.google.com/notebook/SAMPLE_NOTEBOOK_ID',
  '종검',
  '2024-12-01 10:00:00+09'
);
