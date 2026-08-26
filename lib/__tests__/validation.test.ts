import { validateForm, parseBudget, formatBudget, clamp, type FormValues } from '../validation'

function runValidationTests() {
  console.log('=== Sprint 2 폼 유효성 검증(Validation) 테스트 시작 ===\n')

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

  // 1. 초기 상태(전부 미입력) 검증 (PRD 5-1)
  const emptyValues: FormValues = {
    cheerTeam: null,
    visitDayType: null,
    partySize: 1,
    budgetRaw: '',
    prefCheer: 3,
    prefView: 3,
    prefComfort: 3,
  }
  const emptyErrors = validateForm(emptyValues)
  assert(emptyErrors.cheerTeam === '응원팀을 선택해주세요', '응원팀 누락 에러 반환')
  assert(emptyErrors.visitDayType === '방문일 유형을 선택해주세요', '방문일 유형 누락 에러 반환')
  assert(emptyErrors.budget === '예산을 입력해주세요', '예산 누락 에러 반환')

  // 2. 정상 입력 검증
  const validValues: FormValues = {
    cheerTeam: 'home',
    visitDayType: 'weekend',
    partySize: 2,
    budgetRaw: '50000',
    prefCheer: 3,
    prefView: 4,
    prefComfort: 2,
  }
  const validErrors = validateForm(validValues)
  assert(Object.keys(validErrors).length === 0, '정상 입력 시 에러 객체 비어있음')

  // 3. 인원 범위 검증 (PRD 5-5)
  const invalidPartyLow: FormValues = { ...validValues, partySize: 0 }
  assert(validateForm(invalidPartyLow).partySize === '1명 이상의 정수를 입력해주세요', '인원 0 이하 에러')

  const invalidPartyHigh: FormValues = { ...validValues, partySize: 41 }
  assert(validateForm(invalidPartyHigh).partySize === '인원은 최대 40명까지 입력 가능합니다', '인원 40명 초과 에러')

  // 4. 예산 검증 (PRD 5-1, 5-5)
  const zeroBudget: FormValues = { ...validValues, budgetRaw: '0' }
  assert(validateForm(zeroBudget).budget === '1원 이상의 예산을 입력해주세요', '예산 0원 에러')

  const nonNumericBudget: FormValues = { ...validValues, budgetRaw: 'abc' }
  assert(validateForm(nonNumericBudget).budget === '예산은 숫자만 입력해주세요', '예산 문자 입력 에러')

  // 5. 유틸리티 함수 검증
  assert(parseBudget('150,000') === 150000, 'parseBudget 콤마 파싱 검증')
  assert(formatBudget('150000') === '150,000', 'formatBudget 콤마 포맷팅 검증')
  assert(clamp(7, 0, 5) === 5, 'clamp 상한치 검증')
  assert(clamp(-1, 0, 5) === 0, 'clamp 하한치 검증')

  console.log(`\n총 테스트: ${total}개 중 ${passed}개 통과`)
  if (passed === total) {
    console.log('🎉 모든 스프린트 2 유효성 검증 테스트 통과!')
  }
}

runValidationTests()
