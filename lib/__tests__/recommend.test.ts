import { recommendSeats, type RecommendInput } from '../recommend'
import { SEAT_ZONES } from '../seat-data'

function runTests() {
  console.log('=== Sprint 1 추천 엔진 및 데이터셋 검증 테스트 시작 ===\n')

  let passed = 0
  let total = 0

  function assert(condition: boolean, testName: string) {
    total++
    if (condition) {
      console.log(`✅ [PASS] ${testName}`)
      passed++
    } else {
      console.error(`❌ [FAIL] ${testName}`)
    }
  }

  // 1. 데이터셋 무결성 검증
  assert(SEAT_ZONES.length >= 10, `마스터 데이터셋 구역 수 충분함 (현재 ${SEAT_ZONES.length}개)`)
  const hasOutfield = SEAT_ZONES.some(z => z.id === 'outfield-free' && z.weekdayPrice === 8000 && z.weekendPrice === 10000)
  assert(hasOutfield, '외야 자유석 평일 8,000원 / 주말 10,000원 정합성')
  const hasK9Home = SEAT_ZONES.some(z => z.id === 'k9-3base' && z.fanTag === 'home' && z.weekdayPrice === 15000)
  assert(hasK9Home, '3루 K9석 홈 전용 및 가격 정합성')
  const hasK9Away = SEAT_ZONES.some(z => z.id === 'k9-1base' && z.fanTag === 'away' && z.weekdayPrice === 15000)
  assert(hasK9Away, '1루 K9석 원정 전용 및 가격 정합성')

  // 2. 홈 vs 어웨이 추천 결과 분기 검증
  const homeInput: RecommendInput = {
    cheerTeam: 'home',
    visitDayType: 'weekend',
    partySize: 2,
    totalBudget: 100000,
    prefCheer: 5,
    prefView: 3,
    prefComfort: 3,
  }
  const homeRes = recommendSeats(homeInput)
  assert(homeRes.status === 'success', '홈 팬 정상 추천 반환')
  if (homeRes.status === 'success') {
    assert(homeRes.items.length === 3, '홈 팬 추천 결과 TOP 3 반환')
    const hasAwayOnly = homeRes.items.some(i => i.zone.fanTag === 'away')
    assert(!hasAwayOnly, '홈 팬 결과에 원정 전용 구역이 포함되지 않음')
    assert(homeRes.items[0].zone.id === 'k9-3base', '홈+응원5점 시 1위는 3루 K9석')
  }

  const awayInput: RecommendInput = {
    ...homeInput,
    cheerTeam: 'away',
  }
  const awayRes = recommendSeats(awayInput)
  assert(awayRes.status === 'success', '어웨이 팬 정상 추천 반환')
  if (awayRes.status === 'success') {
    const hasHomeOnly = awayRes.items.some(i => i.zone.fanTag === 'home')
    assert(!hasHomeOnly, '어웨이 팬 결과에 홈 전용 구역이 포함되지 않음')
    assert(awayRes.items[0].zone.id === 'k9-1base', '어웨이+응원5점 시 1위는 1루 K9석')
    assert(awayRes.items[0].isAwayEligible === true, '어웨이 추천 구역 isAwayEligible 플래그 true')
  }

  // 3. 평일 vs 주말 가격 차이 검증
  const weekdayInput: RecommendInput = {
    ...homeInput,
    visitDayType: 'weekday',
  }
  const weekdayRes = recommendSeats(weekdayInput)
  if (weekdayRes.status === 'success' && homeRes.status === 'success') {
    const weekdayTop = weekdayRes.items[0]
    const weekendTop = homeRes.items[0]
    assert(
      weekdayTop.totalPrice < weekendTop.totalPrice,
      `평일 요금(${weekdayTop.totalPrice}원)이 주말 요금(${weekendTop.totalPrice}원)보다 저렴함`,
    )
  }

  // 4. 예산 초과 및 최소 필요 예산 가이드 검증 (PRD 5-2)
  const lowBudgetInput: RecommendInput = {
    cheerTeam: 'home',
    visitDayType: 'weekend',
    partySize: 2,
    totalBudget: 15000, // 2인 외야 주말(20,000원)보다 적음
    prefCheer: 3,
    prefView: 3,
    prefComfort: 3,
  }
  const budgetOverRes = recommendSeats(lowBudgetInput)
  assert(budgetOverRes.status === 'budget-over', '예산 초과 시 budget-over 상태 반환')
  if (budgetOverRes.status === 'budget-over') {
    assert(budgetOverRes.minTotal === 20000, `최소 필요 예산 20,000원 정확 산출 (실제: ${budgetOverRes.minTotal}원)`)
    assert(budgetOverRes.minZoneName.includes('외야'), `최저가 구역명 포함 (${budgetOverRes.minZoneName})`)
  }

  // 5. 추천 사유 생성 검증
  if (homeRes.status === 'success') {
    const reasons = homeRes.items[0].reasons
    assert(reasons.length >= 2, `추천 사유 문장수 충족 (${reasons.length}개)`)
    assert(reasons.some(r => r.includes('KIA') || r.includes('응원')), '추천 사유에 홈팀/응원 키워드 포함')
    assert(reasons.some(r => r.includes('2명') && r.includes('원')), '추천 사유에 인원 및 금액 요약 포함')
  }

  console.log(`\n총 테스트: ${total}개 중 ${passed}개 통과`)
  if (passed === total) {
    console.log('🎉 모든 스프린트 1 단위 테스트 통과!')
  }
}

runTests()
