// 실행: node --env-file=.env.local scripts/seed.js
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const documents = [
  // ── 구글 Sheets ──────────────────────────────────────────────
  {
    title: '방문퇴원 고객만족도 조사',
    doc_type: 'sheets',
    description: '방문퇴원 고객만족조사 실시간 관리',
    tags: ['고객만족', '방문퇴원', '조사'],
    url: 'https://docs.google.com/spreadsheets/d/1TRRp7f-1CNBOiymXdCjVQx7eIoJSXTFWqG5lVQXeROA/edit?gid=0#gid=0',
    team: '원무',
    updated_at: '2024-01-22T00:00:00+09:00',
  },
  {
    title: '각 과별 내원경로파악',
    doc_type: 'sheets',
    description: '신규진료부 내원경로 파악',
    tags: ['내원경로', '신규진료', '통계'],
    url: 'https://docs.google.com/spreadsheets/d/1mJy2XaCDjlVXIpDfJy5IprkBPvCXMOU6K5fKkzwGN4A/edit?gid=1409904224#gid=1409904224',
    team: '원무',
    updated_at: '2024-03-05T00:00:00+09:00',
  },
  {
    title: '생일자쿠폰 증정리스트',
    doc_type: 'sheets',
    description: '생일자 고객 선물 관리 일원화',
    tags: ['생일쿠폰', '고객관리', '선물'],
    url: 'https://docs.google.com/spreadsheets/d/1H1K8BZhQaf9Eb5ETQQtxy9GYWzP4OW7R7jjViPBOAeo/edit?gid=0#gid=0',
    team: '원무',
    updated_at: '2025-04-16T00:00:00+09:00',
  },
  {
    title: '재원 및 장기입원환자 중간계산 관리',
    doc_type: 'sheets',
    description: '심사팀 연계 장기재원환자 실시간 미수관리',
    tags: ['재원', '장기입원', '미수관리', '심사팀'],
    url: 'https://docs.google.com/spreadsheets/d/1xmt4Me3KF34ScC8Oc79Rc1wqB4Ab6i4G/edit?gid=111357610#gid=111357610',
    team: '원무',
    updated_at: '2025-04-30T00:00:00+09:00',
  },
  {
    title: '키오스크 통계',
    doc_type: 'sheets',
    description: '키오스크 수납률 파악',
    tags: ['키오스크', '수납', '통계'],
    url: 'https://docs.google.com/spreadsheets/d/1yKpPnWM_TnFjAeTtcEM0CyIK67FHTB2rYqfPzMXVWFg/edit?gid=1474317006#gid=1474317006',
    team: '원무',
    updated_at: '2025-05-14T00:00:00+09:00',
  },
  {
    title: '키오스크 오류관리',
    doc_type: 'sheets',
    description: '키오스크 수납시 각종 오류통계',
    tags: ['키오스크', '오류', '통계'],
    url: 'https://docs.google.com/spreadsheets/d/1VSkSthzkAG0HsY5ZmxxPUgMLfGhcmX3hqsxCHEmUn8g/edit?gid=0#gid=0',
    team: '원무',
    updated_at: '2025-08-04T00:00:00+09:00',
  },
  {
    title: '예방접종 통계',
    doc_type: 'sheets',
    description: '독감·코로나 접종 파악',
    tags: ['예방접종', '독감', '코로나', '통계'],
    url: 'https://docs.google.com/spreadsheets/d/12u8ukHQotIv7jXEfViKPGqYUPw2Jjv_7pJZxvTHPfGc/edit?gid=120315447#gid=120315447',
    team: '원무',
    updated_at: '2025-09-08T00:00:00+09:00',
  },
  {
    title: '예방접종 비용관리',
    doc_type: 'sheets',
    description: '백신비+시행비 파악',
    tags: ['예방접종', '비용', '백신'],
    url: 'https://docs.google.com/spreadsheets/d/1lxuaUNY4m6RQbonwyUQUE6pAqhpQ5h8A/edit?rtpof=true&gid=1097040344#gid=1097040344',
    team: '원무',
    updated_at: '2025-09-25T00:00:00+09:00',
  },
  {
    title: '외래고객 피드백',
    doc_type: 'sheets',
    description: '고객 건의사항 및 피드백 반영',
    tags: ['피드백', '외래', '고객의견'],
    url: 'https://docs.google.com/spreadsheets/d/1SfO3bqhWMZ5VkgBD_wV4gC_Vd44cwzZXrCVk19J3pO0/edit?gid=0#gid=0',
    team: '원무',
    updated_at: '2025-11-05T00:00:00+09:00',
  },
  {
    title: '일일마감',
    doc_type: 'sheets',
    description: '원무마감파일 중앙화',
    tags: ['마감', '일일', '수납'],
    url: 'https://docs.google.com/spreadsheets/d/1rmS6wVhI3VPjClydeCqDlQaydaL37SBcYRN2I_ICIR0/edit?gid=732484150#gid=732484150',
    team: '원무',
    updated_at: '2025-11-07T00:00:00+09:00',
  },
  {
    title: '입원 중 타병원 진료건',
    doc_type: 'sheets',
    description: '재원환자 타병원진료 관리',
    tags: ['재원', '타병원', '심사팀'],
    url: 'https://docs.google.com/spreadsheets/d/1n_DBDbkexEz4N1mcg4oz2a59daP-dZ4eOMTKugBCyiY/edit?gid=0#gid=0',
    team: '원무',
    updated_at: '2025-12-24T00:00:00+09:00',
  },
  {
    title: '원무 Y코드 사용내역',
    doc_type: 'sheets',
    description: 'Y코드 및 급제발송 관리',
    tags: ['Y코드', '급제', '사용내역'],
    url: 'https://docs.google.com/spreadsheets/d/1_PUT9r4N-pTkHL2w8Wmiz0K-s8Oj2zglSkz7IJCw4MY/edit?gid=0#gid=0',
    team: '원무',
    updated_at: '2026-02-03T00:00:00+09:00',
  },
  {
    title: '공문번호',
    doc_type: 'sheets',
    description: '원무팀 공문번호 관리 일원화',
    tags: ['공문', '번호관리'],
    url: 'https://docs.google.com/spreadsheets/d/1fYW5rreEX-YjAen5K-la2htneu32LYKOGt8bh8NLujY/edit',
    team: '원무',
    updated_at: '2026-02-12T00:00:00+09:00',
  },
  {
    title: '원무 인수인계',
    doc_type: 'sheets',
    description: '주간 → 야간 및 주말 인수인계 공유',
    tags: ['인수인계', '야간', '주말'],
    url: 'https://docs.google.com/spreadsheets/d/1g1FNtG808wAmArvhR3PF9IUlYVB_Ahqjb3vcnQaaMtY/edit',
    team: '원무',
    updated_at: '2026-02-19T00:00:00+09:00',
  },
  {
    title: '영상CD복사',
    doc_type: 'sheets',
    description: '영상기록 CD복사 용지 절감 (영상의학팀 협조)',
    tags: ['영상CD', '복사', '영상의학팀'],
    url: 'https://docs.google.com/spreadsheets/d/1-cUfQD_nA2KOC0PZ59_0r-liJu0z1UtoR2b1VnmZVYs/edit?gid=0#gid=0',
    team: '원무',
    updated_at: '2026-03-18T00:00:00+09:00',
  },
  {
    title: '로봇(다빈치수술) 주차권',
    doc_type: 'sheets',
    description: '주차권배부 실시간 관리',
    tags: ['다빈치', '주차권', '로봇수술'],
    url: 'https://docs.google.com/spreadsheets/d/1vGHsd1LMuQZSVLxayJuvI-nYI9BvY9S802dB3cjNbfE/edit?gid=0#gid=0',
    team: '원무',
    updated_at: '2026-04-15T00:00:00+09:00',
  },
  {
    title: '산정특례 대상자',
    doc_type: 'sheets',
    description: '산특대상 신청관리 중앙화',
    tags: ['산정특례', '신청관리'],
    url: 'https://docs.google.com/spreadsheets/d/1ErS2XEwWuL7aQmtJnlIjODAIBwQXQTUwgQip0AWtNeA/edit?gid=0#gid=0',
    team: '원무',
    updated_at: '2026-04-18T00:00:00+09:00',
  },
  {
    title: '일일 입원병상 관리',
    doc_type: 'sheets',
    description: '일일 가용병상 실시간 파악용',
    tags: ['병상', '입원', '일일'],
    url: 'https://docs.google.com/spreadsheets/d/1HD7ZDT_2xAZ0CKMkgMnhcgEp4MDkVIPOsVq6LVP6CgI/edit?gid=822453451#gid=822453451',
    team: '원무',
    updated_at: '2026-04-23T00:00:00+09:00',
  },
  {
    title: '진료과별 수납오류 수정',
    doc_type: 'sheets',
    description: '진료과별 수납오류 수정 (심사팀 협조)',
    tags: ['수납오류', '심사팀', '수정'],
    url: 'https://docs.google.com/spreadsheets/d/1jrugPwtkh6qAGzzgRREoOAb7V7HuIJg8LwPD4CyZvRg/edit?gid=0#gid=0',
    team: '원무',
    updated_at: '2026-05-22T00:00:00+09:00',
  },
  // ── AppSheet ─────────────────────────────────────────────────
  {
    title: '시재교환 신청',
    doc_type: 'appsheet',
    description: '시재교환 프로세스 개선',
    tags: ['시재', '교환', '신청'],
    url: 'https://www.appsheet.com/start/7800e304-c20c-44bd-96ee-97a3a5b16f7e',
    team: '원무',
    updated_at: '2025-10-31T00:00:00+09:00',
  },
  // ── 구글 Sheets (AppSheet 섹션에 있었지만 Sheets URL) ─────────
  {
    title: '안내매니저 출퇴근 관리',
    doc_type: 'sheets',
    description: 'QR 활용 출퇴근 관리',
    tags: ['출퇴근', 'QR', '안내매니저'],
    url: 'https://docs.google.com/spreadsheets/d/1x831cc8c_VqKR7Nd7Rg6t6V2X3XH70DeA_c1EXRoqzQ/edit',
    team: '원무',
    updated_at: '2026-01-02T00:00:00+09:00',
  },
  // ── Google Apps Script (구글 Chat 활용 섹션) ─────────────────
  {
    title: '마감비서 앱',
    doc_type: 'etc',
    description: '마감 프로세스 스마트화 (Google Apps Script)',
    tags: ['마감', '자동화', '앱스스크립트'],
    url: 'https://script.google.com/macros/s/AKfycbz--ZXcQzU6TNYVwcfChEuKAwqycTZKGMIt43rEIWhFyS1vke96Vd94ISpdUCsF_mkL/exec',
    team: '원무',
    updated_at: '2026-03-21T00:00:00+09:00',
  },
];

async function seed() {
  console.log('기존 샘플 데이터 삭제 중...');
  const { error: delErr } = await supabase
    .from('documents')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // 전체 삭제

  if (delErr) {
    console.error('삭제 실패:', delErr.message);
    process.exit(1);
  }

  console.log(`실제 문서 ${documents.length}개 입력 중...`);
  const { data, error: insErr } = await supabase
    .from('documents')
    .insert(documents)
    .select('id, title');

  if (insErr) {
    console.error('입력 실패:', insErr.message);
    process.exit(1);
  }

  console.log(`완료! ${data.length}개 입력됨:`);
  data.forEach((d, i) => console.log(`  ${i + 1}. ${d.title}`));
}

seed();
