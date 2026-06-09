# GMHadmin - Google Workspace 문서 대시보드

## 프로젝트 목표
Google Workspace로 만든 문서들(Sheets, Docs, AppSheet, NotebookLM 등)을
한 곳에서 검색·분류·바로가기할 수 있는 웹 대시보드.
문서 내용을 직접 가져오지 않고, 문서별 메타데이터(카탈로그)를 DB에 저장하고
클릭 시 원본을 새 탭으로 여는 "도서관 색인" 방식.

## 기술 스택
- 프레임워크: Next.js (App Router) + TypeScript + Tailwind CSS
- DB: Supabase (테이블 생성·쿼리 직접 수행)
- AI 검색: OpenRouter API (자연어 검색, 자동 태깅/요약)
- 버전관리: GitHub (gh CLI)
- 배포: Vercel (vercel CLI)

## 데이터 모델 - documents 테이블
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid | 기본키 (자동생성) |
| title | text | 문서명 |
| doc_type | text | sheets / docs / appsheet / notebooklm / etc |
| description | text | 문서 설명 |
| tags | text[] | 태그 배열 |
| url | text | 원본 문서 링크 |
| team | text | 담당팀: 원무 / 심사 / 국검 / 종검 |
| updated_at | timestamptz | 마지막 수정일 |

## 기능 요구사항
1. 카드형 그리드로 문서 목록 표시, 클릭 시 새 탭으로 원본 열기
2. 문서 유형·담당팀·태그 필터 + 키워드 검색
3. 문서 추가/수정 폼 (링크 + 메타데이터 입력)
4. OpenRouter 자연어 검색 ("심사팀 삭감 관련 자료 찾아줘")

## 개발 규칙
- API 키는 절대 코드에 직접 쓰지 않음 → .env.local 과 Vercel 환경변수 사용
- .env.local 은 .gitignore 에 포함
- 단계별 개발, 각 단계 완료 후 사용자 확인 필수

## 진행 단계
- [x] 1단계: 프로젝트 뼈대 생성 + GitHub 저장소 연결
- [x] 2단계: Supabase 테이블 생성 + 실제 문서 22개 입력
- [x] 3단계: 목록·검색·필터 화면 (유형 필터 + 키워드 검색)
- [x] 4단계: AI 챗봇 (팀 필터 대체, OpenRouter 자연어 검색)
- [x] 5단계: OpenRouter 자연어 검색 (google/gemma-4-31b-it:free)
- [x] 6단계: Vercel 배포 완료

## 배포 정보
- Production URL: https://gmhadmin.vercel.app
- GitHub: https://github.com/ericparkGMH/GMHadmin
- Vercel 프로젝트: ericpark-8572s-projects/gmhadmin

## 환경변수 목록
```
NEXT_PUBLIC_SUPABASE_URL=          # Supabase 브라우저용 공개 URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=     # Supabase anon(공개) 키
SUPABASE_SERVICE_ROLE_KEY=         # Supabase 서버 전용 관리자 키
OPENROUTER_API_KEY=                # OpenRouter API 키
```
