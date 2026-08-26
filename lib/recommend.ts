import { SEAT_ZONES, type SeatZone } from '@/lib/seat-data'

export type CheerTeam = 'home' | 'away'
export type VisitDayType = 'weekday' | 'weekend'

export type RecommendInput = {
  cheerTeam: CheerTeam
  visitDayType: VisitDayType
  partySize: number
  totalBudget: number
  prefCheer: number
  prefView: number
  prefComfort: number
}

export type SeatRecommendation = {
  zone: SeatZone
  unitPrice: number
  totalPrice: number
  matchScore: number
  reasons: string[]
  isAwayEligible: boolean
}

export type RecommendResult =
  | { status: 'success'; items: SeatRecommendation[] }
  | { status: 'budget-over'; minTotal: number; minZoneName: string }
  | { status: 'no-data' }

const PREF_LABELS: Record<'cheer' | 'view' | 'comfort', string> = {
  cheer: '응원 열기',
  view: '경기 시야',
  comfort: '좌석 편의',
}

export function formatCurrency(value: number): string {
  return value.toLocaleString('ko-KR')
}

/**
 * PRD 규칙에 따른 템플릿 기반 추천 이유 생성 함수
 */
function buildReasons(
  input: RecommendInput,
  rec: Omit<SeatRecommendation, 'reasons'>,
): string[] {
  const { zone } = rec
  const dayLabel = input.visitDayType === 'weekend' ? '주말/공휴일' : '평일'

  // 선호도 높은 순서로 정렬 (동점 시 해당 구역의 점수가 높은 순)
  const prefs = [
    { key: 'cheer' as const, pref: input.prefCheer, score: zone.cheerScore },
    { key: 'view' as const, pref: input.prefView, score: zone.viewScore },
    { key: 'comfort' as const, pref: input.prefComfort, score: zone.comfortScore },
  ].sort((a, b) => b.pref - a.pref || b.score - a.score)

  const reasons: string[] = []

  // 1. 원정 팬 맞춤 안내 (어웨이인 경우 최우선 명시)
  if (input.cheerTeam === 'away' && zone.fanTag === 'away') {
    reasons.push(
      `1루 측 원정 응원단상과 인접해 있어 눈치 보지 않고 원정팀을 마음껏 응원할 수 있는 구역이에요.`,
    )
  } else if (input.cheerTeam === 'home' && zone.fanTag === 'home') {
    reasons.push(
      `KIA 타이거즈 홈 3루 응원석으로 열광적인 타이거즈 응원 열기를 가장 가깝게 만끽할 수 있어요.`,
    )
  }

  // 2. 가장 높은 선호도 항목 1~2개 우선 언급
  const topPref = prefs[0]
  if (topPref && topPref.pref >= 3) {
    const detailMap: Record<string, string> = {
      cheer: `${zone.blockName}은 관중들의 뜨거운 함성과 응원 직관 분위기를 제대로 체감하기에 제격입니다.`,
      view: `${zone.blockName}은 투타의 움직임과 그라운드 전체가 한눈에 들어오는 뛰어난 시야를 자랑합니다.`,
      comfort: `${zone.blockName}은 쾌적한 좌석 공간과 이동 및 편의시설 접근성이 우수합니다.`,
    }
    reasons.push(
      `${PREF_LABELS[topPref.key]}를 중요하게 보신 조건에 맞춰 추천드렸어요. ${detailMap[topPref.key]}`,
    )
  } else if (reasons.length === 0) {
    reasons.push(`${zone.zoneName}(${zone.blockName})은 가격 대비 균형 잡힌 관람 환경을 제공합니다.`)
  }

  // 3. 2순위 선호도 보조 언급 (점수가 높을 경우)
  const secondPref = prefs[1]
  if (secondPref && secondPref.pref >= 4 && secondPref.score >= 4) {
    reasons.push(`${PREF_LABELS[secondPref.key]} 만족도 역시 매우 높은 구역입니다.`)
  }

  // 4. 인원 및 예상 총금액 1줄 요약
  reasons.push(
    `${dayLabel} 기준 ${input.partySize}명 관람 시 예상 총금액은 ${formatCurrency(rec.totalPrice)}원(1석당 ${formatCurrency(rec.unitPrice)}원)입니다.`,
  )

  return reasons
}

/**
 * 좌석 추천 알고리즘 (PRD 4장 기능 명세 100% 구현)
 */
export function recommendSeats(input: RecommendInput): RecommendResult {
  const getUnitPrice = (zone: SeatZone) =>
    input.visitDayType === 'weekend' ? zone.weekendPrice : zone.weekdayPrice

  // 1. 응원팀 조건 필터링 (홈/어웨이에 따른 구역 선별)
  const fanEligible = SEAT_ZONES.filter((zone) => {
    // 어웨이 선택 시 홈 전용 구역 제외
    if (input.cheerTeam === 'away' && zone.fanTag === 'home') return false
    // 홈 선택 시 어웨이 전용 구역 제외
    if (input.cheerTeam === 'home' && zone.fanTag === 'away') return false
    // 인원 수용 가능 여부
    if (input.partySize > zone.maxParty) return false
    return true
  })

  // 조건에 대응하는 좌석 데이터가 마스터셋에 아예 없는 경우 (PRD 5-6)
  if (fanEligible.length === 0) {
    return { status: 'no-data' }
  }

  // 2. 1석 가격 × 인원수 = 예상 총금액 계산
  const withTotals = fanEligible.map((zone) => {
    const unitPrice = getUnitPrice(zone)
    return {
      zone,
      unitPrice,
      totalPrice: unitPrice * input.partySize,
    }
  })

  // 3. 예산(totalBudget) 이하 후보 필터링
  const affordable = withTotals.filter((c) => c.totalPrice <= input.totalBudget)

  // 4. 예산 초과로 후보가 0개인 경우 (PRD 5-2)
  if (affordable.length === 0) {
    // 해당 조건(홈/원정 반영) 중 가장 저렴한 구역 계산
    const cheapest = withTotals.reduce((min, c) =>
      c.totalPrice < min.totalPrice ? c : min,
    )
    return {
      status: 'budget-over',
      minTotal: cheapest.totalPrice,
      minZoneName: `${cheapest.zone.zoneName} (${cheapest.zone.blockName})`,
    }
  }

  // 5. 매칭 점수 계산: (응원 점수 × pref_cheer) + (시야 점수 × pref_view) + (편의 점수 × pref_comfort)
  const scored: SeatRecommendation[] = affordable
    .map((c) => {
      const matchScore =
        c.zone.cheerScore * input.prefCheer +
        c.zone.viewScore * input.prefView +
        c.zone.comfortScore * input.prefComfort

      const base = {
        zone: c.zone,
        unitPrice: c.unitPrice,
        totalPrice: c.totalPrice,
        matchScore,
        isAwayEligible: input.cheerTeam === 'away' && (c.zone.fanTag === 'away' || c.zone.fanTag === 'neutral'),
      }
      return { ...base, reasons: buildReasons(input, base) }
    })
    // 6. 매칭 점수 내림차순 정렬 (동점 시 예상 총금액이 낮은 구역 우선)
    .sort((a, b) => b.matchScore - a.matchScore || a.totalPrice - b.totalPrice)
    // 7. 상위 3개 선정
    .slice(0, 3)

  return { status: 'success', items: scored }
}
