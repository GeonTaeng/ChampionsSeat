# KIA 챔피언스 필드 좌석 마스터 데이터 명세서 (Seat Dataset Spec)

## 1. 개요
PRD "성공 조건 1"에 따라, 본 서비스의 좌석 구역별 평일/주말 가격 및 블록 정보는 실제 KIA 챔피언스 필드 공식 예매 기준(티켓링크 예매 기준)과 100% 일치해야 합니다. 본 문서는 애플리케이션 내 정적 데이터셋(`lib/constants/stadium-data.ts`)으로 사용될 마스터 스키마와 데이터 정의를 기술합니다.

---

## 2. 데이터 스키마 (TypeScript Interface)

```typescript
export type CheerTeamType = 'home' | 'away';
export type VisitDayType = 'weekday' | 'weekend';
export type AreaCategory = 
  | 'VIP/테이블석'
  | '내야 지정석 (K9/K8)'
  | '내야 일반석 (K5/K3)'
  | '특화석 (익사이팅/서프라이즈)'
  | '외야석'
  | '특별 패밀리석';

export type TeamSuitability = 'home_only' | 'away_friendly' | 'neutral';

export interface StadiumSeatZone {
  id: string;                    // 고유 ID (예: 'k9-3base', 'k9-1base')
  category: AreaCategory;        // 구역 대분류
  zoneName: string;              // 구역 구분명 (예: 'K9석', '챔피언석')
  blockName: string;             // 블록명 (예: '3루 K9 114~121블록', '1루 K9 108~113블록')
  weekdayPrice: number;          // 평일 1인 기준 가격 (원)
  weekendPrice: number;          // 주말/공휴일 1인 기준 가격 (원)
  cheerScore: number;            // 응원 점수 (0 ~ 5)
  viewScore: number;             // 시야 점수 (0 ~ 5)
  comfortScore: number;          // 편의 점수 (0 ~ 5)
  teamSuitability: TeamSuitability; // 홈/어웨이 적합도
  features: string[];            // 구역별 특징 태그 (예: ['응원단상 바로 앞', '선수단 덕아웃 위'])
  description: string;           // 기본 설명
}
```

---

## 3. 챔피언스 필드 구역별 마스터 데이터 정의표

| 구역 ID | 구역 구분명 | 블록명 | 평일가(원) | 주말가(원) | 응원 | 시야 | 편의 | 적합도 | 주요 특징 |
|:---|:---|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---|
| `champ-vip` | 챔피언석 | 포수 후면 중앙 특별석 | 45,000 | 50,000 | 2 | 5 | 5 | neutral | 최고급 시야, 푹신한 프리미엄 의자, 중립 관람 |
| `table-center` | 중앙 테이블석 (2/3인) | 포수 후면 중앙 2~3층 | 40,000 | 45,000 | 2 | 5 | 5 | neutral | 넓은 개인 테이블, 음식 섭취 편리, 쾌적한 관람 |
| `k9-3base` | K9석 (3루 홈) | 3루 하단 114~121블록 | 15,000 | 18,000 | 5 | 4 | 4 | home_only | **KIA 홈 열혈 응원존**, 응원단상 인접 |
| `k9-1base` | K9석 (1루 원정) | 1루 하단 108~113블록 | 15,000 | 18,000 | 4 | 4 | 4 | away_friendly | **원정 팬 추천**, 원정 응원단상 인접 |
| `k8-3base` | K8석 (3루 홈) | 3루 122~123블록 | 13,000 | 15,000 | 4 | 4 | 3 | home_only | 홈 응원 열기 체감, 가성비 내야석 |
| `k8-1base` | K8석 (1루 원정) | 1루 106~107블록 | 13,000 | 15,000 | 4 | 4 | 3 | away_friendly | 원정 응원 및 내야 관람 가성비 우수 |
| `k5-3base` | K5석 (3루 홈) | 3루 외곽 124~127블록 | 11,000 | 13,000 | 3 | 3 | 3 | home_only | 합리적 가격의 내야 하단석 |
| `k5-1base` | K5석 (1루 원정) | 1루 외곽 101~105블록 | 11,000 | 13,000 | 3 | 3 | 3 | away_friendly | 원정 외곽 및 합리적 가격대 |
| `k3-upper` | K3석 (상단 일반) | 3루/1루 상단 300번대 블록 | 9,000 | 11,000 | 2 | 3 | 3 | neutral | 경기장 전체 조망, 탁 트인 시야, 저렴한 가격 |
| `exciting-3base` | 익사이팅존 (3루 홈) | 3루 불펜/파울라인 인접 | 20,000 | 25,000 | 3 | 5 | 3 | home_only | 그라운드 밀착, 선수 플레이 생생 체감 (헬멧 착용) |
| `exciting-1base` | 익사이팅존 (1루 원정) | 1루 불펜/파울라인 인접 | 20,000 | 25,000 | 3 | 5 | 3 | away_friendly | 원정 덕아웃/불펜 인접, 생생한 시야 |
| `surprise-zone` | 서프라이즈석 | 1/3루 익사이팅 상단 | 16,000 | 20,000 | 3 | 4 | 4 | neutral | 파울라인 근접 내야 쾌적 시야 |
| `outfield-free` | 외야 자유석/잔디석 | 외야 그린존 및 잔디석 | 8,000 | 10,000 | 2 | 2 | 4 | neutral | **최저가 구역**, 돗자리 피크닉, 가족 단위 추천 |
| `family-terrace` | 타이거즈 가족석/스카이피크닉 | 외야 상단 테라스 (4~6인) | 25,000 | 30,000 | 2 | 3 | 5 | neutral | 단체/가족 프라이빗 테이블 관람 |

---

## 4. 데이터 검증 체크리스트
- [ ] 평일(화~목) 기준 최저가(외야 자유석 8,000원) ~ 최고가(챔피언석 45,000원) 정합성 확인
- [ ] 주말(금~일 및 공휴일) 기준 가격 인상폭 정합성 확인
- [ ] 3루(KIA 홈) / 1루(원정) 방향성 및 `teamSuitability` 태그 무결성 검증
- [ ] 점수 체계(응원, 시야, 편의)가 구역 특성을 합리적이고 객관적으로 반영하는지 검증
