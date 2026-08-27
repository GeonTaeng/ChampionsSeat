# KIA 챔피언스 필드 좌석 추천 서비스 - 개발 문서 체계 (Documentation Index)

## 📌 개요
본 디렉토리는 `PRD.md` 명세에 따라 개발된 **KIA 챔피언스 필드 좌석 추천 서비스**의 개발 계획, 데이터셋 명세, 스프린트별 작업 내역 및 QA 검증 결과를 관리하는 공식 문서 보관소입니다.

모든 기능과 예외 처리(PRD 5장 5대 예외 규칙) 및 완료 조건(PRD 6장 13대 완료 조건)이 구현 및 검증 완료(100% Pass)되었습니다.

---

## 📑 문서 구성 목록

| 문서명 | 경로 | 주요 내용 및 목적 | 완료 상태 |
|:---|:---|:---|:---:|
| **마스터 개발 계획서** | [`development_plan.md`](./development_plan.md) | 시스템 아키텍처, 4단계 스프린트 로드맵, 핵심 요구사항 매핑 및 최종 빌드/테스트 요약 | **완료 (100%)** |
| **좌석 데이터셋 명세서** | [`seat_dataset_spec.md`](./seat_dataset_spec.md) | 티켓링크 공식 기준 14개 대표 구역 가격표, 3루 홈/1루 원정 방향성, 점수 체계 및 특징 태그 명세 | **완료 (100%)** |
| **Gemini AI 고도화 계획서** | [`ai_enhancement_plan.md`](./ai_enhancement_plan.md) | Google Gemini API 연동, 하이브리드 아키텍처, 실시간 AI 맞춤 해설 & 직관 팁 생성 계획 | **진행 중** |
| **Sprint 1 완료 보고서** | [`sprints/sprint_1_data_and_core_logic.md`](./sprints/sprint_1_data_and_core_logic.md) | 공식 좌석 마스터 데이터셋 구축, 가중치 추천 엔진, 템플릿 사유 생성기 및 단위 테스트 (19/19 Pass) | **완료 (100%)** |
| **Sprint 2 완료 보고서** | [`sprints/sprint_2_ui_input_and_validation.md`](./sprints/sprint_2_ui_input_and_validation.md) | 5대 직관 조건 입력 폼, PRD 5-1(누락) & 5-5(범위초과) 검증, 자동 포커스/스크롤 및 테스트 (12/12 Pass) | **완료 (100%)** |
| **Sprint 3 완료 보고서** | [`sprints/sprint_3_ui_result_and_exceptions.md`](./sprints/sprint_3_ui_result_and_exceptions.md) | 순위 뱃지(Gold/Silver/Bronze) TOP 3 카드, PRD 5-3 지연 로딩/타임아웃, PRD 5-2 예산 초과 및 5-4/5-6 예외 뷰 | **완료 (100%)** |
| **Sprint 4 완료 보고서** | [`sprints/sprint_4_integration_and_qa.md`](./sprints/sprint_4_integration_and_qa.md) | 전체 파이프라인 통합 및 **PRD 6장 13대 완료 조건(Done Criteria) 전수 자동화 QA 검증 (13/13 Pass)** | **완료 (100%)** |

---

## 🧪 테스트 및 품질 검증 요약
- **전체 자동화 테스트 스위트**: 총 **44개 시나리오 100% 통과 (44/44 Pass)**
  - 추천 알고리즘 단위 테스트: 19개 Pass (`lib/__tests__/recommend.test.ts`)
  - 폼 유효성 검증 단위 테스트: 12개 Pass (`lib/__tests__/validation.test.ts`)
  - PRD 13대 완료 조건 E2E QA: 13개 Pass (`lib/__tests__/e2e-qa.test.ts`)
- **프로덕션 빌드 검증**: `next build` (Next.js 16.3.3 Turbopack) 번들링 에러 및 린트 경고 0건
- **로컬 서비스 구동**: `http://localhost:3000` 정상 구동 확인
