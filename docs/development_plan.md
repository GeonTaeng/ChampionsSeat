# KIA 챔피언스 필드 좌석 추천 서비스 - 마스터 개발 계획서 (Development Plan)

## 1. 개요 및 목적
본 문서는 `PRD.md`에 명시된 요구사항을 바탕으로, **KIA 챔피언스 필드 좌석 추천 서비스**를 체계적이고 무결하게 개발하기 위한 스프린트 기반 종합 개발 계획서입니다.

- **서비스 형태**: 단일 화면(Single Page) 반응형 웹 애플리케이션
- **핵심 가치**: 예매 초보자 및 원정 팬이 5가지 조건(응원팀, 방문일, 인원, 예산, 선호도)만으로 최적의 좌석 TOP 3와 추천 사유를 즉시 확인
- **개발 원칙**:
  1. **PRD 준수**: 성공 조건 1~4 및 완료 조건 13개 항목 100% 충족
  2. **범위 통제 (Scope Control)**: 로그인, DB, 결제, 실시간 좌석 연동, AI 챗봇 등 Out of Scope 철저히 배제
  3. **데이터 무결성**: 실제 KIA 챔피언스 필드 예매 기준 가격표 및 블록 데이터와 100% 일치
  4. **스프린트 기반 점진적 개발 & 테스트**: 각 스프린트별 명확한 완료 기준(DoD) 설정

---

## 2. 시스템 아키텍처 및 디렉토리 구조

```
ChampionsSeat/
├── app/
│   ├── layout.tsx             # 글로벌 레이아웃, 메타데이터 및 SEO 설정
│   ├── page.tsx               # 단일 화면 컨테이너 (Input + Action + Result/Exception)
│   └── globals.css            # 글로벌 스타일 및 테마 정의
├── components/
│   ├── seat-finder/
│   │   ├── SeatFinderContainer.tsx   # 상태 관리 및 오케스트레이션
│   │   ├── InputSection.tsx          # 5개 입력 영역 (Team, Date, Party, Budget, Prefs)
│   │   ├── ActionSection.tsx         # 추천받기 버튼 및 로딩/지연 메시지
│   │   ├── ResultSection.tsx         # 정상 결과 TOP 3 카드 및 입력 요약
│   │   ├── BudgetExceededView.tsx    # 5-2 예산 초과 안내 및 최소 필요 예산 가이드
│   │   ├── ErrorStateView.tsx        # 5-4 실패/재시도 및 5-6 데이터 누락 뷰
│   │   └── ui/                       # Stepper, Slider, RadioGroup 등 커스텀 UI
├── lib/
│   ├── constants/
│   │   └── stadium-data.ts    # KIA 챔피언스 필드 좌석 마스터 데이터셋 (정적 JSON/TS)
│   ├── types/
│   │   └── seat.ts            # 좌석, 입력값, 추천 결과, 에러 상태 타입 정의
│   ├── utils/
│   │   ├── recommendation.ts  # 가중치 점수 계산, 필터링 및 정렬 알고리즘
│   │   ├── reason-generator.ts# 템플릿 기반 추천 사유 생성기
│   │   ├── validation.ts      # 5-1, 5-5 입력값 검증 및 clamp 유틸
│   │   └── formatters.ts      # 통화 포맷팅, 인원 표시 등 헬퍼 함수
├── docs/
│   ├── development_plan.md    # 전체 개발 계획서 (본 문서)
│   ├── seat_dataset_spec.md   # 좌석 마스터 데이터셋 명세 및 검증표
│   └── sprints/
│       ├── sprint_1_data_and_core_logic.md       # 스프린트 1: 데이터 & 핵심 로직
│       ├── sprint_2_ui_input_and_validation.md   # 스프린트 2: 입력 영역 & 검증
│       ├── sprint_3_ui_result_and_exceptions.md  # 스프린트 3: 결과 영역 & 예외 처리
│       └── sprint_4_integration_and_qa.md        # 스프린트 4: 통합, QA & 최적화
```

---

## 3. 전체 스프린트 로드맵 요약

| 스프린트 | 스프린트 명 | 주요 목표 | 산출물 |
|:---|:---|:---|:---|
| **Sprint 1** | **좌석 마스터 데이터 & 추천 엔진 구축** | • 챔피언스 필드 공식 좌석 데이터 100% 전수 구축<br>• 점수 산출, 필터링, 정렬 알고리즘 및 추천 사유 생성기 구현<br>• 추천 로직 단위 테스트 | `seat.ts`, `stadium-data.ts`, `recommendation.ts`, `reason-generator.ts`, `seat_dataset_spec.md` |
| **Sprint 2** | **입력 영역 UI & 폼 유효성 검증 시스템** | • 단일 화면 상단 입력 섹션 5개 항목 UI 구현<br>• 5-1(누락), 5-5(범위초과) 실시간/제출 검증 및 포커스 이동 구현<br>• 반응형 및 직관적 헬퍼 텍스트 배치 | `InputSection.tsx`, `validation.ts`, Form UI 컴포넌트군 |
| **Sprint 3** | **결과 화면, 로딩 상태 & 예외 처리 뷰** | • TOP 3 좌석 카드 및 입력 요약 바 렌더링<br>• 5-3 지연 로딩(2초, 8초, 타임아웃) 제어<br>• 5-2(예산초과+최소가이드), 5-4(에러+재시도), 5-6(데이터누락) UI 구현 | `ResultSection.tsx`, `BudgetExceededView.tsx`, `ErrorStateView.tsx`, `ActionSection.tsx` |
| **Sprint 4** | **전체 파이프라인 통합, E2E QA & 완성도 최적화** | • 전체 상태 오케스트레이션 및 스크롤 플로우 연결<br>• PRD 13대 완료 조건 전수 체크리스트 검증<br>• 모바일/태블릿/데스크톱 크로스 브라우징 및 UX 폴리싱 | `page.tsx`, `SeatFinderContainer.tsx`, QA 체크리스트 리포트, `walkthrough.md` |

---

## 4. 핵심 요구사항 매핑 및 통제 매트릭스

| PRD 항목 | 세부 요구사항 | 담당 스프린트 | 검증 기준 |
|:---|:---|:---|:---|
| **데이터 정합성** | 평일/주말 가격, 블록명, 점수 100% 일치 | Sprint 1 | KBO 및 티켓링크 챔필 예매 기준 데이터 전수 대조 |
| **알고리즘** | `(응원×w1) + (시야×w2) + (편의×w3)`, 어웨이 필터, 동점자 처리 | Sprint 1 | 계산 유닛 테스트 100% 통과 |
| **추천 사유** | 선호도 최고항목 1~2개 우선언급 + 어웨이 특성 반영 | Sprint 1 | 템플릿 생성 문구 가독성 및 정합성 |
| **입력 명세** | 5대 항목 (팀, 요일, 인원 1~40, 예산, 슬라이더 0~5) | Sprint 2 | 입력 컨트롤 조작 및 기본값 검증 |
| **5-1 필수값 누락** | 인라인 에러, 테두리 강조, 미입력 필드 스크롤/포커스 | Sprint 2 | 미선택 제출 시 즉시 에러 포커싱 |
| **5-5 범위 초과** | 인원 40명 초과, 음수/비정상 예산 클램프 및 에러 | Sprint 2 | 비정상 입력값 차단 및 안내 문구 |
| **결과 카드** | 순위, 구역 구분, 블록, 예상 총금액, 추천 이유 노출 | Sprint 3 | 1~3위 순위 정렬 및 금액 계산 정확도 |
| **5-2 예산 초과** | 에러가 아닌 안내 + 최소 필요 예산 가이드 + 예산 수정 포커스 | Sprint 3 | 최저가 구역 자동 계산 및 입력 복귀 버튼 |
| **5-3 지연 로딩** | 2초 로딩 인디케이터, 8초 지연 안내, 15초 타임아웃 | Sprint 3 | 비동기 지연 시뮬레이션 테스트 |
| **5-4/5-6 예외** | 다시 시도 버튼, 입력값 보존, 2회 연속 실패 메시지 변경 | Sprint 3 | 에러 상태 복구 및 입력값 유지 확인 |
| **Out of Scope** | DB, 로그인, 결제, 외부 API 등 불포함 | Sprint 1~4 | 번들 및 소스코드 내 불필요 모듈 배제 확인 |

---

## 5. 변경 관리 및 문서 관리 가이드
- 모든 개발 진행 상황은 `docs/sprints/` 폴더 내의 각 스프린트 문서의 체크리스트를 통해 실시간으로 업데이트합니다.
- 각 스프린트 완료 시, DoD(완료 정의)에 따라 단위 테스트 및 수동 검증을 거친 후 다음 스프린트로 이행합니다.
