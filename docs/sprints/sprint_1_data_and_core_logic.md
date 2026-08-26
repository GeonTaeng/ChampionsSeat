# Sprint 1: 좌석 마스터 데이터 & 추천 엔진 구축

## 1. 스프린트 목표
KIA 챔피언스 필드의 공식 좌석 마스터 데이터를 정의하고, PRD에 명시된 가중치 계산, 필터링, 정렬, 추천 사유 생성 알고리즘을 구현하여 완벽한 단위 테스트를 수행합니다.

---

## 2. 작업 내역 (Tasks)

### Task 1-1: 도메인 타입 및 인터페이스 정의
- **대상 파일**: `lib/types/seat.ts`
- **구현 내용**:
  - `CheerTeam`, `VisitDayType`, `AreaCategory` 유니온 타입 정의
  - `SeatZone` (마스터 데이터 인터페이스)
  - `UserInputState` (입력 폼 상태 인터페이스)
  - `RecommendationItem`, `RecommendationResult` (결과 인터페이스)
  - `ValidationError`, `AppState` (상태 관리 인터페이스)

### Task 1-2: 챔피언스 필드 좌석 마스터 데이터셋 구축
- **대상 파일**: `lib/constants/stadium-data.ts`
- **구현 내용**:
  - `docs/seat_dataset_spec.md` 기반 14개 대표 구역 데이터셋 정의
  - 평일/주말 1인 요금, 응원/시야/편의 점수(0~5점), 홈/원정 적합도 태그 완비
  - 데이터 불변성(`as const` / `readonly`) 보장

### Task 1-3: 추천 알고리즘 엔진 구현
- **대상 파일**: `lib/utils/recommendation.ts`
- **구현 내용**:
  1. `visit_day_type`에 따른 적용 가격(평일가/주말가) 결정
  2. `cheer_team === 'away'`일 때 `home_only` 구역 제외 또는 점수 패널티 처리
  3. 좌석 1석 가격 × `party_size` = 예상 총금액 계산
  4. 예상 총금액 <= `total_budget` 후보 필터링
  5. 후보 0개인 경우: 최소 필요 예산 계산용 데이터 및 최저가 구역 메타데이터 산출 (5-2 대응)
  6. 매칭 점수 계산: `(응원점수 × pref_cheer) + (시야점수 × pref_view) + (편의점수 × pref_comfort)`
  7. 매칭 점수 내림차순 정렬 (동점 시 총금액 낮은 순 정렬) 후 상위 3개 슬라이싱

### Task 1-4: 템플릿 기반 추천 사유 생성기 구현
- **대상 파일**: `lib/utils/reason-generator.ts`
- **구현 내용**:
  - 사용자가 높게 설정한 선호도(시야/응원/편의) 1~2개 자동 감지
  - 응원팀(홈 vs 원정)에 맞는 맞춤 문구 조합
  - 방문일 유형 및 인원수 기준 총금액 요약 문장 결합
  - 예시: *"응원과 시야를 모두 중시하시는 팬분께 최적화된 3루 열혈 응원존입니다. 주말 기준 2인 총 36,000원으로 즐기실 수 있습니다."*

### Task 1-5: 추천 엔진 단위 테스트 작성 및 검증
- **대상 파일**: `lib/utils/__tests__/recommendation.test.ts` 또는 실행 검증 스크립트
- **검증 항목**:
  - 홈 vs 어웨이 선택 시 추천 구역 차이 발생 검증
  - 평일 vs 주말 가격 반영 검증
  - 예산 초과 시 `EMPTY_BUDGET` 결과 및 최소 필요 예산 반환 검증
  - 동점 발생 시 저렴한 좌석 우선 배치 검증

---

## 3. 완료 정의 (Definition of Done)
- [ ] `stadium-data.ts`가 실제 챔피언스 필드 가격/블록과 100% 일치
- [ ] 추천 알고리즘이 순수 함수(Pure Function)로 부작용 없이 동작
- [ ] 정상 조건, 예산 초과 조건, 어웨이 조건 등 핵심 시나리오 테스트 100% 통과
