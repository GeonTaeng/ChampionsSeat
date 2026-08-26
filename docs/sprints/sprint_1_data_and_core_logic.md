# Sprint 1: 좌석 마스터 데이터 & 추천 엔진 구축 (완료)

## 1. 스프린트 목표
KIA 챔피언스 필드의 공식 좌석 마스터 데이터를 정의하고, PRD에 명시된 가중치 계산, 필터링, 정렬, 추천 사유 생성 알고리즘을 구현하여 완벽한 단위 테스트를 수행합니다.

---

## 2. 작업 내역 (Tasks)

### Task 1-1: 도메인 타입 및 인터페이스 정의
- **대상 파일**: `lib/seat-data.ts`, `lib/recommend.ts`
- **구현 내용**:
  - `CheerTeam`, `VisitDayType`, `AreaCategory`, `FanTag` 정의
  - `SeatZone` (공식 마스터 데이터 스키마)
  - `SeatRecommendation`, `RecommendResult` (결과 인터페이스)

### Task 1-2: 챔피언스 필드 좌석 마스터 데이터셋 구축
- **대상 파일**: `lib/seat-data.ts`
- **구현 내용**:
  - 실제 KIA 챔피언스 필드 공식 예매 기준(티켓링크) 14개 대표 구역 데이터셋 100% 일치 구축
  - 3루(홈: KIA) vs 1루(원정: Away) 배치 및 `fanTag` 정합성 보정
  - 평일/주말 요금, 응원/시야/편의 점수(0~5), 특징 태그 완비

### Task 1-3: 추천 알고리즘 엔진 구현
- **대상 파일**: `lib/recommend.ts`
- **구현 내용**:
  1. `visitDayType`에 따른 적용 가격(평일가/주말가) 결정
  2. `cheerTeam === 'away'`일 때 `home` 전용 구역 제외, `cheerTeam === 'home'`일 때 `away` 전용 구역 제외
  3. 좌석 1석 가격 × `partySize` = 예상 총금액 계산
  4. 예상 총금액 <= `totalBudget` 후보 필터링
  5. 후보 0개인 경우: `status: 'budget-over'`, 최소 필요 예산 (`minTotal`) 및 최저가 구역명 (`minZoneName`) 산출 (PRD 5-2)
  6. 매칭 점수 계산: `(응원점수 × prefCheer) + (시야점수 × prefView) + (편의점수 × prefComfort)`
  7. 매칭 점수 내림차순 정렬 (동점 시 총금액 낮은 순 정렬) 후 TOP 3 슬라이싱

### Task 1-4: 템플릿 기반 추천 사유 생성기 구현
- **대상 파일**: `lib/recommend.ts` (`buildReasons` 함수)
- **구현 내용**:
  - 원정 팬(어웨이)인 경우 1루 원정 응원 가능성 최우선 명시
  - 사용자가 높게 설정한 선호도 1~2순위(시야/응원/편의) 맞춤 템플릿 문구 자동 결합
  - 방문일 및 인원수 기준 예상 총금액 요약 문장 산출

### Task 1-5: 추천 엔진 단위 테스트 작성 및 검증
- **대상 파일**: `lib/__tests__/recommend.test.ts`
- **검증 결과**: 총 19개 시나리오 100% PASS
  - 홈/어웨이 분기 테스트 PASS
  - 평일/주말 요금 계산 차이 테스트 PASS
  - 예산 초과(PRD 5-2) 및 최소 필요 예산 산출 테스트 PASS
  - 추천 사유 텍스트 생성 테스트 PASS
  - 프로덕션 빌드(`next build`) 정상 완료 PASS

---

## 3. 완료 정의 (Definition of Done)
- [x] `lib/seat-data.ts`가 실제 챔피언스 필드 가격/블록과 100% 일치
- [x] 추천 알고리즘이 순수 함수(Pure Function)로 부작용 없이 동작
- [x] 정상 조건, 예산 초과 조건, 어웨이 조건 등 핵심 시나리오 테스트 100% 통과 (19/19 Pass)
- [x] 프로덕션 빌드 에러 0건
