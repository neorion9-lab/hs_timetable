# PRD: 다학년 초등학교 시간표 관리 앱 "antigravity" MVP 버전

## 1. 목적/개요
- 목적: 초등학교 1–6학년 전체 시간표를 하나의 관리 단위로 다루되, 학년 간 독립 배치가 가능하도록 구성하고, 외부강사 수업(예: AI 수업) 5차시를 교과전담시간/도서관 등의 기존 자원과 충돌 없이 배치하는 MVP 도구를 만든다.
- 기본 방향:
  - 동적 그룹 생성 및 Drag-and-Drop으로 그룹 구성 편의성 확보
  - 템플릿 기반 자동 채움으로 초기 생산성 확보
  - 연도별 새 시간표 입력을 지원
- 주요 이해관계자: 교사단/학과담당자, 시설담당자, 행정실, IT 관리자, 외부강사 조정팀

## 2. MVP 범위
- 동적 그룹 관리
  - 그룹 생성/편집(Drag-and-Drop으로 그룹 간 재배치 가능)
  - 그룹 내 학년 구성원 재배치 가능; 최소 한 그룹은 남겨둠(안전장치)
  - 고정 프리셋 선택 옵션도 제공
- 템플릿 자동화
  - 기본 뼈대는 학년 그룹별로 동일하게 유지
  - 그룹 간 소폭 차등으로 일부 과목 배치를 달리하는 규칙 적용
  - 자동 채움 후 사용자가 블록 단위로 수정 가능
- 연도 관리
  - 연도별로 새 시간표를 사용자가 직접 입력/업로드하는 방식 유지
  - 템플릿 템플릿셋 → 그룹별 템플릿배치 연결
- 데이터 흐름
  - 학년 그룹 구성 → 템플릿 적용 → 신규 외부강사 수업 매핑 → 제약 엔진으로 충돌 체크 → 최종 확정
- 연도 비교 뷰
  - 초기 차이 지표: 교사 충돌 수 차이, 실 충돌 수 차이, 신규 수업 추가 차이, Removed/제외 차이
  - 차이 요약 카드 + 상세 차이 표, 그룹 필터링 가능
- 피드백 수집 방식
  - 설문으로 피드백 수집(초기 3문항 내외 + 간단한 자유의견란)

## 3. 데이터 모델(고수준, 엔티티 요약)
- AcademicYear: year_id, label, startDate, endDate, holidays
- Grade: grade_id, name
- GradeGroup: group_id, name, dynamic(boolean), memberGradeIds[]
- TemplateSet: templateSetId, name
- TemplateBlock: templateBlockId, days[], periods[], baselineSubjects[], rooms[]
- GroupTemplateAssignment: group_id, templateBlockIds[]
- Subject: subject_id, name, 담당교사_id
- Teacher: teacher_id, name, type(전담/외부), availableSlots[], maxLoad
- ExternalInstructor: externalId, name, availability
- Room: room_id, name, type, capacity
- ClassBlock: block_id, year_id, subject_id, teacher_id, room_id, group_id/grade_group_id, grade_id, day_of_week, period_start, duration, isExternal
- Availability: year_id, teacher_id, day_of_week, periods_available
- RoomAvailability: year_id, room_id, day_of_week, periods_available

## 4. MVP 데이터 샘플(JSON, 간단 포맷)
```json
{
  "academicYears": [
    {
      "year_id": "2025-2026",
      "label": "2025-2026 학사연도",
      "startDate": "2025-03-01",
      "endDate": "2026-02-28",
      "holidays": ["2025-04-01","2025-04-02","2025-05-05"]
    }
  ],
  "groups": [
    { "group_id": "GRP_A", "name": "그룹 A", "dynamic": true, "memberGradeIds": ["G1","G2"] },
    { "group_id": "GRP_B", "name": "그룹 B", "dynamic": true, "memberGradeIds": ["G3","G4","G5","G6"] }
  ],
  "templateSets": [
    { "templateSetId": "TPL_BASE", "name": "기본 뼈대",
      "templateBlocks": [
        { "templateBlockId": "TB_A1", "days": ["Mon","Tue","Wed","Thu","Fri"], "periods": [1,2], "baselineSubjects": ["SUB001","SUB002"], "rooms": ["R001","R002"] },
        { "templateBlockId": "TB_A2", "days": ["Mon","Wed","Fri"], "periods": [3,4], "baselineSubjects": ["SUB003"], "rooms": ["R001"] },
        { "templateBlockId": "TB_B1", "days": ["Tue","Thu"], "periods": [1,2,3], "baselineSubjects": ["SUB004","SUB005"], "rooms": ["R003"] }
      ]
    }
  ],
  "templateAssignments": [
    { "group_id": "GRP_A", "templateBlockIds": ["TB_A1","TB_A2"] },
    { "group_id": "GRP_B", "templateBlockIds": ["TB_B1"] }
  ],
  "classBlocks": [
    { "block_id": "CB001", "year_id": "2025-2026", "subject_id": "SUB001", "teacher_id": "T001", "room_id": "R001", "group_id": "GRP_A", "day_of_week": "Mon", "period_start": 1, "duration": 2, "isExternal": false },
    { "block_id": "CB002", "year_id": "2025-2026", "subject_id": "SUB003", "teacher_id": "T002", "room_id": "R002", "group_id": "GRP_B", "day_of_week": "Tue", "period_start": 3, "duration": 2, "isExternal": true }
  ]
}
```

## 5. 데이터 마이그레이션/매핑 가이드 요약
- 목표: 2년 전 데이터에서 새 모델로의 매핑을 원활히
- 매핑 원칙
  - 기존 교사/과목/방 ID를 새 시스템의 ID로 매핑하거나 필요 시 신규 ID 할당 후 매핑표 유지
  - 시간대 표현: 기존 교시 번호를 period_start, duration으로 변환하여 Slot 기반 저장
  - 그룹/학년 매핑: 학년별 독립 그룹과 동적 그룹의 memberGradeIds를 최신 구조에 맞춰 매핑
- 데이터 품질 관리
  - 누락/중복 체크, 필드 매핑 일치 여부 확인
  - 외부강사 가용성/도서관 방 등의 정보는 연도별로 재입력 가능하도록 설계

## 6. 비기능/운영 요구
- 성능: 초등학교 규모에서 빠른 응답
- 보안: 학교 내부에서만 사용, RBAC로 역할 분리
- 접근성: ARIA, 키보드 네비게이션, Drag-and-Drop 실패 시 대체 컨트롤
- 데이터 백업/복구: 연도별 아카이브 및 롤백 가능 구조 설계
- 확장성: 다캠퍼스/다학과, 장기 학사일정 반영 모듈은 후속 확장으로 설계

## 7. UI/UX 방향
- 온보딩 워크플로우: 연도 생성 → 그룹 구성(동적 가능, 템플릿 프리셋) → 템플릿 자동 채움 확인 → 신규 수업 입력 및 충돌 확인
- Drag-and-Drop UI: 그룹 간 재배치, 그룹 내 학년 구성원 재배치 가능
- 템플릿 자동화의 직관성: 기본 뼀대는 동일, 그룹 간 차등은 토글/오버라이드로 적용
- 연도 비교 뷰: 차이 요약 카드 + 상세 차이 표, 그룹 필터링 가능
- 피드백 채널: 설문 연동

## 8. 연도 관리 전략
- 그룹 구성은 동적 그룹으로 시작하되 Drag-and-Drop으로 재배치 가능
- 템플릿 자동화는 “그룹별 동일 뼈대 + 소폭 차등” 원칙 유지
- 연도 비교 뷰는 초기 4개 지표로 시작하고, 피드백에 따라 확장 가능
- 설문을 통한 피드백 수집 채널 유지

## 9. API/design(고수준)
- 주요 엔드포인트(예시)
  - POST /api/years — 새 연도 생성
  - GET /api/years/{yearId} — 연도 상세
  - POST /api/groups — 그룹 생성/편집
  - POST /api/templateSets — 템플릿 세트 생성
  - POST /api/classBlocks — 수업 블록 생성/수정
  - POST /api/compare/years — 두 연도 간 차이 계산 및 결과 조회
- 권한/인증은 RBAC 기반으로 구현

## 10. 산출물
- PRD 요약본
- MVP 데이터 샘플(JSON)
- 템플릿/그룹 관리 UI 흐름도 초안(필요 시)
- ER 다이어그램 초안(추가 요청 시 제공)

## 11. 의사결정 로그 및 가정
- 연도별 새 시간표 입력 방식을 기본으로 채택
- 동적 그룹은 Drag-and-Drop 가능하게 하되, 초기에는 간단한 흐름으로 시작
- 피드백 수집은 설문 방식으로 시작, 이후 필요 시 확장
