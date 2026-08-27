# KIA 챔피언스 필드 좌석 추천 서비스 - 마스터 개발 계획서 (Development Plan) - 전체 스프린트 완료

## 1. 개요 및 목적
본 문서는 `PRD.md`에 명시된 요구사항을 바탕으로, **KIA 챔피언스 필드 좌석 추천 서비스**를 체계적이고 무결하게 개발하기 위한 스프린트 기반 종합 개발 계획서입니다.

- **서비스 형태**: 단일 화면(Single Page) 반응형 웹 애플리케이션
- **핵심 가치**: 예매 초보자 및 원정 팬이 5가지 조건(응원팀, 방문일, 인원, 예산, 선호도)만으로 최적의 좌석 TOP 3와 추천 사유를 즉시 확인
- **개발 원칙**:
  1. **PRD 준수**: 성공 조건 1~4 및 완료 조건 13개 항목 100% 충족
  2. **범위 통제 (Scope Control)**: 로그인, DB, 결제, 실시간 좌석 연동, AI 챗봇 등 Out of Scope 철저히 배제
  3. **데이터 무결성**: 실제 KIA 챔피언스 필드 예매 기준 가격표 및 블록 데이터와 100% 일치
  4. **스프린트 기반 점진적 개발 & 테스트**: 각 스프린트별 명확한 완료 기준(DoD) 설정 및 검증

---

## 2. 실제 시스템 아키텍처 및 디렉토리 구조

```
ChampionsSeat/
├── app/
│   ├── layout.tsx             # 글로벌 레이아웃, 메타데이터, 폰트 및 테마 설정
│   ├── page.tsx               # 단일 화면 통합 컨테이너 (Input + Sticky Result + State Machine)
│   └── globals.css            # 글로벌 스타일 및 테마 토큰 정의
├── components/
│   ├── app-header.tsx         # 상단 서비스 헤더 및 타이틀
│   ├── input-section.tsx      # 5개 입력 영역 (Team, Date, Party, Budget, Prefs) + 실행 버튼
│   ├── seat-result-card.tsx   # 정상 추천 TOP 3 좌석 카드 (순위/금액/사유/특징태그)
│   ├── result-loading-state.tsx # PRD 5-3 지연 로딩 스켈레톤 및 8초 안내 문구
│   ├── budget-over-state.tsx  # PRD 5-2 예산 초과 안내 및 최소 필요 예산 가이드
│   ├── error-state.tsx        # PRD 5-4 실패/재시도 (1회/2회 연속 실패 메시지 분기)
│   ├── no-data-state.tsx      # PRD 5-6 데이터 누락 Empty State
│   ├── result-empty-state.tsx # 초기 미실행 안내 상태
│   ├── dev-state-toggle.tsx   # 개발 및 QA 검증용 상태 강제 토글러
│   └── ui/                    # Button, Input, Slider, Card, Badge, Alert 등 Shadcn UI
├── lib/
│   ├── seat-data.ts           # KIA 챔피언스 필드 14개 구역 공식 좌석 마스터 데이터셋
│   ├── recommend.ts           # 가중치 추천 엔진, 홈/어웨이 필터링 및 템플릿 사유 생성기
│   ├── validation.ts          # PRD 5-1, 5-5 폼 유효성 검증 및 클램프 모듈
│   ├── utils.ts               # Tailwind 클래스 병합 유틸리티
│   └── __tests__/
│       ├── recommend.test.ts  # Sprint 1 추천 엔진 단위 테스트 (19/19 Pass)
│       ├── validation.test.ts # Sprint 2 폼 검증 단위 테스트 (12/12 Pass)
│       └── e2e-qa.test.ts     # Sprint 4 PRD 13대 완료 조건 E2E 테스트 (13/13 Pass)
└── docs/
    ├── development_plan.md    # 전체 마스터 개발 계획서 (본 문서)
    ├── seat_dataset_spec.md   # 좌석 마스터 데이터셋 명세 및 검증표 (완료)
    └── sprints/
        ├── sprint_1_data_and_core_logic.md       # Sprint 1: 데이터 & 핵심 로직 (완료)
        ├── sprint_2_ui_input_and_validation.md   # Sprint 2: 입력 영역 & 검증 (완료)
        ├── sprint_3_ui_result_and_exceptions.md  # Sprint 3: 결과 영역 & 예외 처리 (완료)
        └── sprint_4_integration_and_qa.md        # Sprint 4: 통합, QA & 최적화 (완료)
```

---

## 3. 전체 스프린트 완료 현황

| 스프린트 | 스프린트 명 | 진행 상태 | 주요 완료 내역 및 산출물 |
|:---|:---|:---:|:---|
| **Sprint 1** | **좌석 마스터 데이터 & 추천 엔진 구축** | **완료 (100%)** | • 챔피언스 필드 공식 좌석 14개 구역 마스터 데이터셋 100% 구축<br>• 가중치 추천 알고리즘, 홈/어웨이 분기, 템플릿 사유 생성기 구현<br>• 단위 테스트 19개 시나리오 100% PASS (`lib/seat-data.ts`, `lib/recommend.ts`, `recommend.test.ts`) |
| **Sprint 2** | **입력 영역 UI & 폼 유효성 검증 시스템** | **완료 (100%)** | • 5대 입력 항목(응원팀, 방문일, 인원, 예산, 선호도 3종) UI 구축<br>• PRD 5-1(필수 누락), PRD 5-5(범위/형식 오류) 검증 및 자동 포커스/스크롤 구현<br>• 폼 유효성 단위 테스트 12개 시나리오 100% PASS (`components/input-section.tsx`, `lib/validation.ts`, `validation.test.ts`) |
| **Sprint 3** | **결과 화면, 로딩 상태 & 예외 처리 뷰** | **완료 (100%)** | • 순위별(Gold/Silver/Bronze) TOP 3 결과 카드, 예상 총금액 카운트업, 특징 태그 렌더링<br>• PRD 5-3 지연 로딩(8초 보조안내, 15초 타임아웃 가드)<br>• PRD 5-2(예산초과+최소가이드), PRD 5-4(실패+재시도), PRD 5-6(데이터누락) 뷰 완비 (`components/seat-result-card.tsx`, `components/budget-over-state.tsx`, `app/page.tsx`) |
| **Sprint 4** | **전체 파이프라인 통합, E2E QA & 완성도 최적화** | **완료 (100%)** | • 전체 단일 화면 상태 머신 및 스크롤 인터랙션 완결<br>• **PRD 6장 13대 완료 조건 전수 PASS (13/13 Pass)** (`e2e-qa.test.ts`)<br>• 모바일/데스크톱 반응형, 접근성 및 프로덕션 빌드 무결성 확보 |

---

## 4. 핵심 요구사항 매핑 및 전수 검증 결과

| PRD 항목 | 세부 요구사항 | 담당 스프린트 | 검증 상태 | 검증 내용 |
|:---|:---|:---:|:---:|:---|
| **데이터 정합성** | 평일/주말 가격, 블록명, 점수 100% 일치 | Sprint 1 | **Pass (100%)** | 티켓링크 챔피언스 필드 예매 기준 14개 구역 전수 일치 |
| **알고리즘** | `(응원×w1) + (시야×w2) + (편의×w3)`, 어웨이 필터, 동점자 처리 | Sprint 1 | **Pass (100%)** | 추천 엔진 단위 테스트 19/19 통과 |
| **추천 사유** | 선호도 최고항목 1~2개 우선언급 + 어웨이 특성 반영 | Sprint 1 | **Pass (100%)** | `buildReasons` 맞춤 사유 및 인원/금액 요약 검증 |
| **입력 명세** | 5대 항목 (팀, 요일, 인원 1~40, 예산, 슬라이더 0~5) | Sprint 2 | **Pass (100%)** | 컨트롤 인터랙션, 퀵 예산 증액, 클램프 정상 동작 |
| **5-1 필수값 누락** | 인라인 에러, 테두리 강조, 미입력 필드 스크롤/포커스 | Sprint 2 | **Pass (100%)** | 미선택 제출 시 에러 발생 필드로 자동 포커스/스크롤 |
| **5-5 범위 초과** | 인원 40명 초과, 음수/비정상 예산 클램프 및 에러 | Sprint 2 | **Pass (100%)** | 40명 초과 및 문자 예산 차단, 인라인 에러 노출 |
| **결과 카드** | 순위, 구역 구분, 블록, 예상 총금액, 추천 이유, 태그 | Sprint 3 | **Pass (100%)** | 1~3위 순위 뱃지, 카운트업, 특징 태그 완비 |
| **5-2 예산 초과** | 에러가 아닌 안내 + 최소 필요 예산 가이드 + 예산 수정 포커스 | Sprint 3 | **Pass (100%)** | 최저가 구역 자동 계산 및 예산 필드 포커스 복귀 |
| **5-3 지연 로딩** | 2초 로딩 인디케이터, 8초 지연 안내, 15초 타임아웃 | Sprint 3 | **Pass (100%)** | 스켈레톤, 8초 안내 문구, 15초 타임아웃 가드 구현 |
| **5-4/5-6 예외** | 다시 시도 버튼, 입력값 보존, 2회 연속 실패 메시지 변경 | Sprint 3 | **Pass (100%)** | 입력값 유지 재시도, 2회 실패 문구 전환, 데이터 누락 뷰 분기 |
| **Out of Scope** | DB, 로그인, 결제, 외부 API 등 불포함 | Sprint 1~4 | **Pass (100%)** | 순수 클라이언트 정적 연산 구조 100% 준수 |

---

## 5. 최종 종합 테스트 결과
- **테스트 스위트 합계**: 총 **44개 테스트 100% 통과 (44/44 Pass)**
  - `lib/__tests__/recommend.test.ts` (19개)
  - `lib/__tests__/validation.test.ts` (12개)
  - `lib/__tests__/e2e-qa.test.ts` (13개)
- **프로덕션 빌드**: Next.js 16.3.3 Turbopack `npm run build` 100% 통과 (에러 0건)
- **서버 상태**: 로컬 호스트 `http://localhost:3000` 정상 구동 중
