-- category 컬럼 추가
ALTER TABLE documents ADD COLUMN IF NOT EXISTS category text DEFAULT '기타';

-- 기존 22개 문서 자동 분류
UPDATE documents SET category = '통계' WHERE title IN (
  '방문퇴원 고객만족도 조사',
  '각 과별 내원경로파악',
  '키오스크 통계',
  '예방접종 통계',
  '예방접종 비용관리',
  '일일 입원병상 관리'
);

UPDATE documents SET category = '신청' WHERE title IN (
  '시재교환 신청',
  '안내매니저 출퇴근 관리'
);

UPDATE documents SET category = '자동화' WHERE title IN (
  '마감비서 앱'
);

-- 나머지(기본값 '기타'인 것들)를 '관리'로
UPDATE documents SET category = '관리'
WHERE category = '기타';

-- 결과 확인
SELECT category, count(*) FROM documents GROUP BY category ORDER BY count DESC;
