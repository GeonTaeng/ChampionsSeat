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
  cheer: '응원 분위기',
  view: '경기 시야',
  comfort: '좌석 편의',
}

function formatWon(value: number): string {
  return `${value.toLocaleString('ko-KR')}원`
}

function buildReasons(
  input: RecommendInput,
  rec: Omit<SeatRecommendation, 'reasons'>,
): string[] {
  const { zone } = rec
  const dayLabel = input.visitDayType === 'weekend' ? '주말' : '평일'

  // 선호도가 높은 항목을 근거로 사용 (동률이면 점수가 높은 순)
  const prefs = [
    { key: 'cheer' as const, pref: input.prefCheer, score: zone.cheerScore },
    { key: 'view' as const, pref: input.prefView, score: zone.viewScore },
    { key: 'comfort' as const, pref: input.prefComfort, score: zone.comfortScore },
  ]
    .filter((p) => p.pref > 0)
    .sort((a, b) => b.pref - a.pref || b.score - a.score)

  const reasons: string[] = []

  const top = prefs[0]
  if (top) {
    const detail: Record<string, string> = {
      cheer: `${zone.blockName}은 응원 열기가 뜨거운 구역이라 직관 분위기를 제대로 즐길 수 있어요.`,
      view: `${zone.blockName}은 그라운드가 시원하게 들어오는 시야 좋은 자리예요.`,
      comfort: `${zone.blockName}은 좌석이 넉넉하고 편의시설 접근이 편한 구역이에요.`,
    }
    reasons.push(`${PREF_LABELS[top.key]}을(를) 가장 중요하게 보셨네요. ${detail[top.key]}`)
  } else {
    reasons.push(`${zone.blockName}은 가격 대비 균형이 좋은 무난한 선택이에요.`)
  }

  const second = prefs[1]
  if (second && second.score >= 4) {
    reasons.push(`${PREF_LABELS[second.key]} 측면에서도 만족도가 높은 편이에요.`)
  }

  reasons.push(
    `${dayLabel} 기준 ${input.partySize}명 예상 총금액은 ${formatWon(rec.totalPrice)}입니다.`,
  )

  return reasons
}

export function recommendSeats(input: RecommendInput): RecommendResult {
  const unitPriceOf = (zone: SeatZone) =>
    input.visitDayType === 'weekend' ? zone.weekendPrice : zone.weekdayPrice

  // ② 어웨이 선택 시 홈 전용 구역 제외 + 인원 수용 가능한 구역만
  const fanEligible = SEAT_ZONES.filter((zone) => {
    if (input.cheerTeam === 'away' && zone.fanTag === 'home') return false
    if (input.partySize > zone.maxParty) return false
    return true
  })

  // 조건에 맞는 구역 자체가 없음 → no-data
  if (fanEligible.length === 0) {
    return { status: 'no-data' }
  }

  // ③④ 단가 × 인원, 예산 이내 필터
  const withTotals = fanEligible.map((zone) => {
    const unitPrice = unitPriceOf(zone)
    return { zone, unitPrice, totalPrice: unitPrice * input.partySize }
  })

  const affordable = withTotals.filter((c) => c.totalPrice <= input.totalBudget)

  // ⑤ 후보 0개 → 예산 초과
  if (affordable.length === 0) {
    const cheapest = withTotals.reduce((min, c) =>
      c.totalPrice < min.totalPrice ? c : min,
    )
    return {
      status: 'budget-over',
      minTotal: cheapest.totalPrice,
      minZoneName: cheapest.zone.blockName,
    }
  }

  // ⑥⑦ 매칭점수 계산 후 정렬 (동점이면 총금액 낮은 순), 상위 3개
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
        isAwayEligible: input.cheerTeam === 'away' && c.zone.fanTag === 'away',
      }
      return { ...base, reasons: buildReasons(input, base) }
    })
    .sort((a, b) => b.matchScore - a.matchScore || a.totalPrice - b.totalPrice)
    .slice(0, 3)

  return { status: 'success', items: scored }
}

export function formatCurrency(value: number): string {
  return value.toLocaleString('ko-KR')
}
