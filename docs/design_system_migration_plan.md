# Tiger Strike Dynamics 디자인 시스템 전환 계획서 (Design Migration Plan)

## 1. 개요
본 문서는 루트의 [`design.md`](file:///c:/ChampionsSeat/design.md)에 정의된 **"Tiger Strike Dynamics" (고성능 스포츠 테크 디자인 시스템)**을 바탕으로, 현재 서비스의 전반적인 톤앤매너, 컴포넌트 스타일, 비주얼 리듬을 전면 개편하기 위한 마이그레이션 계획서입니다.

- **핵심 컨셉**: 깊은 다크 테마 기반의 고강도 대비(High-Intensity Contrast) + 4px의 정밀한 전술적 라운딩(Tactical Precision) + 데이터 중심 시각적 위계(Information Hierarchy)
- **적용 대상**: 글로벌 테마, UI 기본 컴포넌트, 헤더/레이아웃, 5대 입력 폼 컨트롤, TOP 3 결과 카드 및 5대 예외 상태 뷰

---

## 2. 디자인 토큰 및 스타일 매핑 규격

### 2-1. 컬러 팔레트 매핑
| 토큰명 | 색상 코드 / 값 | 적용 대상 |
|:---|:---|:---|
| **Tiger Red (Primary)** | `#C7012E` | 메인 CTA 버튼, 액센트 뱃지, 포커스 링, 베스트 매치 강조 |
| **Action Red Hover** | `#A50126` | 버튼 및 인터랙티브 요소 호버 상태 |
| **Surface (Main BG)** | `#121414` | 페이지 전체 메인 배경 (`body`, `main`) |
| **Surface Bright** | `#38393a` / `rgba(56, 57, 58, 0.6)` | 카드 헤더, 탭 활성 배경, 호버 표면 |
| **Surface Container Low** | `#1a1c1c` | 입력 필드 배경, 스테퍼 배경, 카드 기본 표면 |
| **On Surface (Text)** | `#FFFFFF` | 헤드라인, 핵심 텍스트, 금액 숫자 |
| **On Surface Variant** | `#A0A0A0` | 보조 텍스트, 헬퍼 텍스트, 단위 라벨, 플레이스홀더 |
| **Border Line** | `rgba(255, 255, 255, 0.05)` | 글래스모피즘 카드 테두리 및 구분선 |

### 2-2. 라운딩 및 쉐이프 규격
- **Radius Token**: `4px` (`rounded-[4px]`)
- 기존의 부드러운 라운딩(`rounded-xl`, `rounded-2xl`, `rounded-full`)을 일괄 **4px 정밀 사각 라운딩**으로 통일하여 테크니컬한 전술 분석 도구의 느낌 구현

### 2-3. 타이포그래피 & 레이아웃 규격
- **폰트**: `Inter`, `sans-serif`
- **컨테이너 최대 너비**: `max-w-[1200px]` (기존 1024px에서 확장하여 와이드 스포츠 대시보드 뷰 제공)
- **Glassmorphism**: `backdrop-blur-[12px]` + `bg-[#1a1c1c]/90` + `border border-white/5` + `shadow-md`

---

## 3. 단계별 수정 및 구현 로드맵

```
[Phase 1: 글로벌 테마 & 토큰] ──► [Phase 2: UI 컴포넌트 규격화] ──► [Phase 3: 헤더 & 레이아웃]
           │                                 │                               │
           ▼                                 ▼                               ▼
[Phase 4: 입력 폼 섹션 리뉴얼] ─► [Phase 5: 결과 카드 & 예외 뷰] ─► [Phase 6: QA & 빌드/배포]
```

### Phase 1: 글로벌 테마 & CSS 변수 전면 개편
- **대상**: [`app/globals.css`](file:///c:/ChampionsSeat/app/globals.css), [`app/layout.tsx`](file:///c:/ChampionsSeat/app/layout.tsx)
- **작업**:
  - 기본 다크 테마 고정(`dark` 클래스 기본 적용 및 color-scheme dark)
  - `Inter` 폰트 적용
  - CSS 변수 토큰(`--background: #121414`, `--primary: #C7012E`, `--card: #1a1c1c`, `--radius: 4px`) 업데이트

### Phase 2: Shadcn / Base UI 컴포넌트 프리셋 조정
- **대상**: `components/ui/button.tsx`, `card.tsx`, `input.tsx`, `badge.tsx`, `slider.tsx`, `alert.tsx`
- **작업**:
  - 버튼: 4px 라운딩, Primary `#C7012E`, Ghost 스타일링
  - 카드: Glassmorphism (`backdrop-blur-md`, `border-white/5`, `bg-[#1a1c1c]/90`)
  - 인풋: `bg-[#1a1c1c]`, focus-border `#C7012E`, 4px 라운딩
  - 뱃지: 날렵한 사각 뱃지(`rounded-[4px]`)

### Phase 3: 헤더 & 레이아웃 구조 리뉴얼
- **대상**: [`components/app-header.tsx`](file:///c:/ChampionsSeat/components/app-header.tsx), [`app/page.tsx`](file:///c:/ChampionsSeat/app/page.tsx)
- **작업**:
  - 헤더: 타이거즈 레드 액센트 라인, 테크니컬한 타이포그래피 및 배지 적용
  - 그리드 컨테이너: `max-w-[1200px]` 와이드 레이아웃 적용 및 시각적 리듬(4px 단위 스페이싱) 적용

### Phase 4: 5대 입력 폼 섹션 톤앤매너 리뉴얼
- **대상**: [`components/input-section.tsx`](file:///c:/ChampionsSeat/components/input-section.tsx)
- **작업**:
  - 응원팀 / 방문일 세그먼트 버튼: 4px 라운딩, 선택 시 `#C7012E` 테두리 및 딥레드 액센트
  - 방문 인원 스테퍼: 사각 버튼 및 다크 컨테이너 박스
  - 총 예산 인풋 & 퀵 버튼: `#1a1c1c` 배경 + 4px 사각 칩
  - 선호도 슬라이더: 타이거즈 레드 트랙과 세련된 다크 게이지

### Phase 5: 추천 결과 카드 & 5대 예외 상태 뷰 고도화
- **대상**: [`components/seat-result-card.tsx`](file:///c:/ChampionsSeat/components/seat-result-card.tsx), `score-gauge.tsx`, `budget-over-state.tsx`, `error-state.tsx`, `no-data-state.tsx`
- **작업**:
  - TOP 3 결과 카드: 글래스모피즘 + 1위 카드 타이거 레드 글로우 라인 + 사각 뱃지
  - 점수 게이지: 바 형태의 날렵한 스포츠 테크 게이지
  - Gemini AI 분석 박스 및 직관 꿀팁 카드 톤앤매너 일체화
  - 예산 초과(5-2) 및 에러(5-4) Alert UI를 다크 테크 스타일에 맞게 재디자인

### Phase 6: E2E QA, 단위 테스트 및 빌드 검증
- 기존 44개 테스트 스위트 통과 유지 확인
- Next.js 프로덕션 빌드 및 모바일/데스크톱 렌더링 검증
- 라이브 배포 진행

---

## 4. 완료 정의 (Definition of Done)
- [ ] `design.md`에 명시된 모든 색상 코드(#C7012E, #121414, #1a1c1c, #38393a, #FFFFFF, #A0A0A0) 100% 반영
- [ ] 모든 버튼, 카드, 인풋의 라운딩이 4px로 일관되게 적용
- [ ] Glassmorphism(블러 12px + 미세 보더 1px)이 카드/컨테이너에 매끄럽게 렌더링
- [ ] PRD 기능 및 Gemini AI 실시간 해설 기능이 100% 정상 작동 유지
- [ ] `npm run build` 및 44개 테스트 전수 통과
