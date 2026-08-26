/**
 * KIA 챔피언스 필드 좌석 마스터 데이터셋
 * 
 * - 기준: 실제 KIA 챔피언스 필드 공식 예매 기준(티켓링크) 가격표 및 블록 배치
 * - 방향: 3루 = KIA 타이거즈(홈) / 1루 = 원정팀(어웨이)
 */

export type FanTag = 'home' | 'away' | 'neutral'

export type AreaCategory =
  | 'VIP/테이블석'
  | '내야 지정석 (K9/K8)'
  | '내야 일반석 (K5/K3)'
  | '특화석 (익사이팅/서프라이즈)'
  | '외야석'
  | '특별 패밀리석'

export type SeatZone = {
  id: string
  category: AreaCategory
  zoneName: string // 구역 구분 (예: "K9석", "챔피언석")
  blockName: string // 블록 (예: "3루 114~121블록", "포수 후면 중앙 특별석")
  weekdayPrice: number // 평일 1석 가격 (원)
  weekendPrice: number // 주말/공휴일 1석 가격 (원)
  cheerScore: number // 응원 점수 (0~5)
  viewScore: number // 시야 점수 (0~5)
  comfortScore: number // 편의 점수 (0~5)
  fanTag: FanTag // 홈 / 어웨이 / 중립
  features: string[] // 주요 특징 태그
  maxParty: number // 권장 최대 인원 수용력
}

export const SEAT_ZONES: SeatZone[] = [
  {
    id: 'champ-vip',
    category: 'VIP/테이블석',
    zoneName: '챔피언석',
    blockName: '포수 후면 중앙 특별석',
    weekdayPrice: 45000,
    weekendPrice: 50000,
    cheerScore: 2,
    viewScore: 5,
    comfortScore: 5,
    fanTag: 'neutral',
    features: ['포수 바로 뒤 최고 뷰', '푹신한 가죽 프리미엄 의자', '투구 궤적 생생 직관'],
    maxParty: 40,
  },
  {
    id: 'table-center',
    category: 'VIP/테이블석',
    zoneName: '중앙 테이블석',
    blockName: '포수 후면 2~3층 테이블석',
    weekdayPrice: 40000,
    weekendPrice: 45000,
    cheerScore: 2,
    viewScore: 5,
    comfortScore: 5,
    fanTag: 'neutral',
    features: ['넓은 전용 테이블', '음식 취식 최적화', '탁 트인 포수 뷰'],
    maxParty: 40,
  },
  {
    id: 'k9-3base',
    category: '내야 지정석 (K9/K8)',
    zoneName: 'K9석 (3루 홈)',
    blockName: '3루 하단 114~121블록',
    weekdayPrice: 15000,
    weekendPrice: 18000,
    cheerScore: 5,
    viewScore: 4,
    comfortScore: 4,
    fanTag: 'home',
    features: ['KIA 홈 응원단상 인접', '열광적인 직관 분위기', '하단 근접 시야'],
    maxParty: 40,
  },
  {
    id: 'k9-1base',
    category: '내야 지정석 (K9/K8)',
    zoneName: 'K9석 (1루 원정)',
    blockName: '1루 하단 108~113블록',
    weekdayPrice: 15000,
    weekendPrice: 18000,
    cheerScore: 5,
    viewScore: 4,
    comfortScore: 4,
    fanTag: 'away',
    features: ['원정 응원단상 바로 앞', '원정 팬 열혈 응원존', '하단 근접 시야'],
    maxParty: 40,
  },
  {
    id: 'k8-3base',
    category: '내야 지정석 (K9/K8)',
    zoneName: 'K8석 (3루 홈)',
    blockName: '3루 122~123블록',
    weekdayPrice: 13000,
    weekendPrice: 15000,
    cheerScore: 4,
    viewScore: 4,
    comfortScore: 3,
    fanTag: 'home',
    features: ['홈 응원 열기 체감', '가성비 뛰어난 내야 지정석'],
    maxParty: 40,
  },
  {
    id: 'k8-1base',
    category: '내야 지정석 (K9/K8)',
    zoneName: 'K8석 (1루 원정)',
    blockName: '1루 106~107블록',
    weekdayPrice: 13000,
    weekendPrice: 15000,
    cheerScore: 4,
    viewScore: 4,
    comfortScore: 3,
    fanTag: 'away',
    features: ['원정 응원 및 내야 관람 가성비 우수'],
    maxParty: 40,
  },
  {
    id: 'k5-3base',
    category: '내야 일반석 (K5/K3)',
    zoneName: 'K5석 (3루 홈)',
    blockName: '3루 외곽 124~127블록',
    weekdayPrice: 11000,
    weekendPrice: 13000,
    cheerScore: 3,
    viewScore: 3,
    comfortScore: 3,
    fanTag: 'home',
    features: ['합리적 가격의 내야 하단석', '편안한 관람'],
    maxParty: 40,
  },
  {
    id: 'k5-1base',
    category: '내야 일반석 (K5/K3)',
    zoneName: 'K5석 (1루 원정)',
    blockName: '1루 외곽 101~105블록',
    weekdayPrice: 11000,
    weekendPrice: 13000,
    cheerScore: 3,
    viewScore: 3,
    comfortScore: 3,
    fanTag: 'away',
    features: ['원정 외곽 및 합리적 가격대'],
    maxParty: 40,
  },
  {
    id: 'k3-upper',
    category: '내야 일반석 (K5/K3)',
    zoneName: 'K3석 (상단 일반)',
    blockName: '3루/1루 상단 300번대 블록',
    weekdayPrice: 9000,
    weekendPrice: 11000,
    cheerScore: 2,
    viewScore: 3,
    comfortScore: 3,
    fanTag: 'neutral',
    features: ['경기장 전체 조망', '탁 트인 시야', '부담 없는 가격'],
    maxParty: 40,
  },
  {
    id: 'exciting-3base',
    category: '특화석 (익사이팅/서프라이즈)',
    zoneName: '익사이팅존 (3루 홈)',
    blockName: '3루 그라운드/불펜 밀착석',
    weekdayPrice: 20000,
    weekendPrice: 25000,
    cheerScore: 3,
    viewScore: 5,
    comfortScore: 3,
    fanTag: 'home',
    features: ['그라운드 눈높이 생생 관람', '선수단 더그아웃/불펜 인접 (헬멧 대여)'],
    maxParty: 40,
  },
  {
    id: 'exciting-1base',
    category: '특화석 (익사이팅/서프라이즈)',
    zoneName: '익사이팅존 (1루 원정)',
    blockName: '1루 그라운드/원정불펜 밀착석',
    weekdayPrice: 20000,
    weekendPrice: 25000,
    cheerScore: 3,
    viewScore: 5,
    comfortScore: 3,
    fanTag: 'away',
    features: ['원정 불펜 초근접', '선수단 박진감 넘치는 플레이 체감'],
    maxParty: 40,
  },
  {
    id: 'surprise-zone',
    category: '특화석 (익사이팅/서프라이즈)',
    zoneName: '서프라이즈석',
    blockName: '1/3루 익사이팅 상단 블록',
    weekdayPrice: 16000,
    weekendPrice: 20000,
    cheerScore: 3,
    viewScore: 4,
    comfortScore: 4,
    fanTag: 'neutral',
    features: ['파울라인 근접 내야 시야', '쾌적한 좌석 간격'],
    maxParty: 40,
  },
  {
    id: 'outfield-free',
    category: '외야석',
    zoneName: '외야 잔디/자유석',
    blockName: '외야 그린존 잔디석',
    weekdayPrice: 8000,
    weekendPrice: 10000,
    cheerScore: 2,
    viewScore: 2,
    comfortScore: 4,
    fanTag: 'neutral',
    features: ['가장 저렴한 최저가 구역', '돗자리 피크닉 관람', '홈런볼 명당'],
    maxParty: 40,
  },
  {
    id: 'family-terrace',
    category: '특별 패밀리석',
    zoneName: '타이거즈 가족석',
    blockName: '외야/상단 패밀리 테라스존',
    weekdayPrice: 25000,
    weekendPrice: 30000,
    cheerScore: 2,
    viewScore: 3,
    comfortScore: 5,
    fanTag: 'neutral',
    features: ['가족/단체 전용 독립 공간', '넓은 전용 테이블 & 편의시설'],
    maxParty: 40,
  },
]
