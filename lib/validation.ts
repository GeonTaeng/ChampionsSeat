import type { CheerTeam, VisitDayType } from '@/lib/recommend'

export type FormValues = {
  cheerTeam: CheerTeam | null
  visitDayType: VisitDayType | null
  partySize: number
  budgetRaw: string
  prefCheer: number
  prefView: number
  prefComfort: number
}

export type FormErrors = {
  cheerTeam?: string
  visitDayType?: string
  partySize?: string
  budget?: string
}

export function parseBudget(raw: string): number {
  const digits = raw.replace(/[^\d]/g, '')
  return digits ? Number.parseInt(digits, 10) : 0
}

export function formatBudget(raw: string): string {
  const digits = raw.replace(/[^\d]/g, '')
  if (!digits) return ''
  return Number.parseInt(digits, 10).toLocaleString('ko-KR')
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

/**
 * PRD 5-1 (필수값 누락) 및 5-5 (형식/범위 초과) 검증 규칙
 */
export function validateForm(values: FormValues): FormErrors {
  const errors: FormErrors = {}

  // 1. cheer_team 검증
  if (!values.cheerTeam) {
    errors.cheerTeam = '응원팀을 선택해주세요'
  }

  // 2. visit_day_type 검증
  if (!values.visitDayType) {
    errors.visitDayType = '방문일 유형을 선택해주세요'
  }

  // 3. party_size 검증 (1~40 정수)
  if (!Number.isInteger(values.partySize) || values.partySize < 1) {
    errors.partySize = '1명 이상의 정수를 입력해주세요'
  } else if (values.partySize > 40) {
    errors.partySize = '인원은 최대 40명까지 입력 가능합니다'
  }

  // 4. total_budget 검증 (0 초과 정수)
  const budget = parseBudget(values.budgetRaw)
  if (!values.budgetRaw.trim()) {
    errors.budget = '예산을 입력해주세요'
  } else if (/[^\d,]/.test(values.budgetRaw)) {
    errors.budget = '예산은 숫자만 입력해주세요'
  } else if (budget < 1) {
    errors.budget = '1원 이상의 예산을 입력해주세요'
  } else if (budget > 100_000_000) {
    errors.budget = '현실적인 예산(1억원 이하)을 입력해주세요'
  }

  return errors
}
