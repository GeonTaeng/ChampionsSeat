# Gemini AI 기반 서비스 고도화 개발 계획서 (AI Enhancement Plan)

## 1. 개요 및 배경
본 계획서는 기존 PRD의 성공 조건(100% 데이터 정합성, 초고속 단일 화면 완결성, 예외 처리 안전망)을 완벽히 보존하면서, **Google Gemini AI(`GEMINI_API_KEY`)를 접목하여 사용자 경험과 추천 만족도를 극대화**하기 위한 고도화 개발 계획입니다.

---

## 2. 하이브리드(Hybrid) 아키텍처 원칙

```
[사용자 조건 입력]
       │
       ▼
[1단계: 코어 룰 엔진 (즉시 응답)] ───► TOP 3 좌석 산출 + 템플릿 사유 (0.1초 내 렌더링)
       │
       ▼ (백그라운드 비동기 호출)
[2단계: Gemini AI 고도화 엔진] ───► 맞춤형 직관 해설 & 좌석별 꿀팁 실시간 스트리밍/업데이트
       │
       ├─► 성공 시: AI 생성 배지와 함께 생생한 사유 & 직관 팁으로 매끄럽게 교체
       └─► 실패/지연 시: 1단계 템플릿 사유 유지 (무중단 Graceful Fallback)
```

1. **무중단 신뢰성**: AI API 호출 지연이나 네트워크 오류가 발생해도 기존 룰 기반 TOP 3 결과가 즉시 표시되므로 서비스 안정성 100% 보장
2. **비목표 준수**: 로그인, 결제 등 기획서 비목표를 침범하지 않고, 순수 '좌석 추천 가치 고도화'에 집중
3. **보안성**: `GEMINI_API_KEY`는 서버 사이드 API 라우트(`app/api/ai-reason`)에서만 안전하게 호출

---

## 3. Gemini AI 고도화 스프린트 계획 (Sprint 5)

| 단계 | 작업명 | 주요 내용 | 산출물 |
|:---|:---|:---|:---|
| **Phase 1** | **Gemini SDK 세팅 & 백엔드 엔드포인트** | • `@google/genai` 최신 SDK 설치<br>• `.env` 키 연동 및 백엔드 라우트(`app/api/ai-reason/route.ts`) 구축<br>• JSON Schema 기반 구조화 프롬프트 엔지니어링 | `lib/gemini.ts`, `app/api/ai-reason/route.ts` |
| **Phase 2** | **프론트엔드 비동기 AI 인핸스먼트 연동** | • TOP 3 결과 표시 후 백그라운드에서 AI 사유 비동기 패치<br>• "Gemini AI 분석 사유" 반짝임 배지 및 직관 꿀팁 카드 추가<br>• AI 로딩 상태 스켈레톤 & Fallback 처리 | `components/seat-result-card.tsx`, `app/page.tsx` |
| **Phase 3** | **프롬프트 튜닝 & 야구장 직관 꿀팁 고도화** | • 챔피언스 필드 전용 컨텍스트(응원가, 먹거리, 햇빛/그늘 방향, 파울볼 주의) 주입<br>• 홈/원정 팬별 맞춤 감성 멘트 생성 최적화 | `lib/gemini.ts` 프롬프트 템플릿 |
| **Phase 4** | **종합 테스트 & 안정성 검증** | • API 키 유효성 테스트, 타임아웃 테스트, Fallback 동작 검증<br>• 프로덕션 빌드 및 속도 최적화 | `lib/__tests__/gemini.test.ts` |

---

## 4. 프롬프트 엔지니어링 설계 규격

```typescript
const prompt = `
당신은 KIA 챔피언스 필드 좌석 전문가입니다.
사용자 조건([응원팀: ${team}], [방문일: ${day}], [인원: ${party}], [선호도: 응원${cheer}/시야${view}/편의${comfort}])과
선정된 좌석([구역: ${zone}], [블록: ${block}], [금액: ${price}], [특징: ${features}])을 바탕으로:
1. 사용자의 최우선 선호도를 충족하는 감성적이고 전문적인 추천 사유 (1~2문장)
2. 해당 좌석만의 직관 꿀팁 (예: 그늘 여부, 음식 섭취 편의, 응원단상 뷰 등 1문장)
을 JSON 형식으로 반환하세요.
`
```

---

## 5. 완료 정의 (Definition of Done)
- [x] `@google/genai` 공식 SDK 설치 및 `.env` 환경 변수 세팅 완료
- [x] Next.js 서버 API 라우트(`app/api/ai-reason`) 연동 완료
- [ ] 프론트엔드 카드 내 Gemini AI 실시간 사유 및 직관 꿀팁 렌더링
- [ ] API 호출 실패 시 기존 룰 기반 사유로 Graceful Fallback 유지 검증
