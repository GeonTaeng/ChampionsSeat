'use client'

import { useRef, useState } from 'react'
import { AppHeader } from '@/components/app-header'
import { InputSection, type FieldRefs } from '@/components/input-section'
import { SeatResultCard } from '@/components/seat-result-card'
import { ResultEmptyState } from '@/components/result-empty-state'
import { ResultLoadingState } from '@/components/result-loading-state'
import { BudgetOverState } from '@/components/budget-over-state'
import { NoDataState } from '@/components/no-data-state'
import { ErrorState } from '@/components/error-state'
import { DevStateToggle, type ResultStatus } from '@/components/dev-state-toggle'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  recommendSeats,
  type RecommendInput,
  type RecommendResult,
} from '@/lib/recommend'
import {
  type FormValues,
  type FormErrors,
  validateForm,
  parseBudget,
} from '@/lib/validation'
import { ArrowUp } from 'lucide-react'

const DEFAULT_VALUES: FormValues = {
  cheerTeam: null,
  visitDayType: null,
  partySize: 1,
  budgetRaw: '',
  prefCheer: 3,
  prefView: 3,
  prefComfort: 3,
}

// 개발용 프리뷰(강제 상태)에서 사용할 샘플 입력
const DEMO_INPUT: RecommendInput = {
  cheerTeam: 'home',
  visitDayType: 'weekend',
  partySize: 2,
  totalBudget: 100000,
  prefCheer: 4,
  prefView: 3,
  prefComfort: 2,
}

function summaryChips(input: RecommendInput): string[] {
  return [
    input.cheerTeam === 'home' ? '홈 (KIA 타이거즈)' : '어웨이 (원정팀)',
    input.visitDayType === 'weekend' ? '주말·공휴일' : '평일',
    `${input.partySize}명`,
    `${input.totalBudget.toLocaleString('ko-KR')}원`,
  ]
}

export default function Page() {
  const [values, setValues] = useState<FormValues>(DEFAULT_VALUES)
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<ResultStatus>('empty')
  const [result, setResult] = useState<RecommendResult | null>(null)
  const [submittedInput, setSubmittedInput] = useState<RecommendInput | null>(null)
  const [failCount, setFailCount] = useState(0)
  const [forced, setForced] = useState<ResultStatus | null>(null)

  const cheerTeamRef = useRef<HTMLDivElement | null>(null)
  const visitDayTypeRef = useRef<HTMLDivElement | null>(null)
  const budgetRef = useRef<HTMLInputElement | null>(null)
  const resultRef = useRef<HTMLDivElement | null>(null)
  const inputTopRef = useRef<HTMLDivElement | null>(null)

  const fieldRefs: FieldRefs = {
    cheerTeam: cheerTeamRef,
    visitDayType: visitDayTypeRef,
    budget: budgetRef,
  }

  const handleChange = (patch: Partial<FormValues>) => {
    const nextErrors: FormErrors = { ...errors }

    if ('budgetRaw' in patch && patch.budgetRaw !== undefined) {
      const raw = patch.budgetRaw
      if (/[^\d,]/.test(raw)) {
        nextErrors.budget = '예산은 숫자만 입력해주세요'
      } else {
        delete nextErrors.budget
      }
      patch = { ...patch, budgetRaw: raw.replace(/[^\d]/g, '') }
    }
    if ('cheerTeam' in patch) delete nextErrors.cheerTeam
    if ('visitDayType' in patch) delete nextErrors.visitDayType
    if ('partySize' in patch) delete nextErrors.partySize

    setErrors(nextErrors)
    setValues((prev) => ({ ...prev, ...patch }))
  }

  const scrollToField = (ref: { current: HTMLElement | null }) => {
    if (!ref.current) return
    ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    if (ref.current instanceof HTMLInputElement) {
      setTimeout(() => ref.current?.focus(), 250)
    }
  }

  const runRecommendation = (input: RecommendInput) => {
    setStatus('loading')
    setForced(null)

    // PRD 5-3 타임아웃 가드 (15초 초과 시 PRD 5-4 실패 처리)
    const timeoutId = window.setTimeout(() => {
      setStatus('error')
      setFailCount((c) => c + 1)
      console.error('[Timeout] 좌석 추천 연산 시간이 15초를 초과하여 실패 처리되었습니다.')
    }, 15000)

    // 연산 실행 (자연스러운 체감을 위한 미세 지연)
    window.setTimeout(() => {
      try {
        clearTimeout(timeoutId)
        const res = recommendSeats(input)
        setResult(res)
        setStatus(res.status)
        setFailCount(0)

        // 결과 영역으로 부드럽게 스크롤
        window.setTimeout(() => {
          resultRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
        }, 100)
      } catch (err) {
        clearTimeout(timeoutId)
        console.error('[Error] 좌석 추천 로직 오류:', err)
        setFailCount((c) => c + 1)
        setStatus('error')
      }
    }, 600)
  }

  const handleSubmit = () => {
    const formErrors = validateForm(values)
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      // PRD 5-1: 미입력된 첫 번째 필드로 자동 스크롤 & 포커스
      if (formErrors.cheerTeam) scrollToField(cheerTeamRef)
      else if (formErrors.visitDayType) scrollToField(visitDayTypeRef)
      else if (formErrors.budget) scrollToField(budgetRef)
      return // 검증 실패 시 로직 미실행 및 기존 결과 유지
    }

    setErrors({})
    const input: RecommendInput = {
      cheerTeam: values.cheerTeam!,
      visitDayType: values.visitDayType!,
      partySize: values.partySize,
      totalBudget: parseBudget(values.budgetRaw),
      prefCheer: values.prefCheer,
      prefView: values.prefView,
      prefComfort: values.prefComfort,
    }
    setSubmittedInput(input)
    runRecommendation(input)
  }

  const scrollToInput = () => {
    inputTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const focusBudget = () => {
    scrollToField(budgetRef)
  }

  // 개발용 강제 상태 처리
  const handleForce = (s: ResultStatus | null) => {
    setForced(s)
    if (s === null) return
    if (s === 'success') setResult(recommendSeats(DEMO_INPUT))
    if (s === 'budget-over')
      setResult(recommendSeats({ ...DEMO_INPUT, totalBudget: 1000 }))
    if (s === 'no-data')
      setResult(recommendSeats({ ...DEMO_INPUT, partySize: 40 }))
    if (s === 'error') setFailCount((c) => Math.max(1, c))
  }

  const effectiveStatus: ResultStatus = forced ?? status
  const isLoading = effectiveStatus === 'loading'

  const summaryInput =
    forced && forced !== 'empty' && forced !== 'loading'
      ? DEMO_INPUT
      : submittedInput

  const renderResult = () => {
    switch (effectiveStatus) {
      case 'empty':
        return <ResultEmptyState />
      case 'loading':
        return <ResultLoadingState />
      case 'error':
        return (
          <ErrorState
            failCount={forced === 'error' ? Math.max(failCount, 1) : failCount}
            onRetry={() => {
              if (forced === 'error') {
                setFailCount((c) => c + 1)
                return
              }
              if (submittedInput) runRecommendation(submittedInput)
            }}
          />
        )
      case 'budget-over':
        if (result?.status === 'budget-over') {
          return (
            <BudgetOverState
              minTotal={result.minTotal}
              minZoneName={result.minZoneName}
              onReenter={focusBudget}
            />
          )
        }
        return <NoDataState />
      case 'no-data':
        return <NoDataState />
      case 'success':
        if (result?.status === 'success') {
          return (
            <div className="flex flex-col gap-4 animate-in fade-in-50 duration-300">
              {result.items.map((rec, i) => (
                <SeatResultCard
                  key={rec.zone.id}
                  rec={rec}
                  rank={i}
                  partySize={summaryInput?.partySize ?? values.partySize}
                />
              ))}
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={scrollToInput}
                className="w-full cursor-pointer font-bold border-border/80 hover:bg-accent"
              >
                <ArrowUp data-icon="inline-start" className="size-4" />
                조건 바꿔서 다시 추천받기
              </Button>
            </div>
          )
        }
        return <ResultEmptyState />
      default:
        return <ResultEmptyState />
    }
  }

  const showSummary =
    summaryInput &&
    (effectiveStatus === 'success' ||
      effectiveStatus === 'budget-over' ||
      effectiveStatus === 'no-data')

  return (
    <main className="min-h-dvh bg-background pb-20">
      <AppHeader />

      <div
        ref={inputTopRef}
        className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-6 px-5 py-8 md:grid-cols-12 md:px-8 md:py-10 md:scroll-mt-4"
      >
        {/* 입력 (왼쪽) */}
        <section className="md:col-span-5" aria-label="좌석 조건 입력">
          <InputSection
            values={values}
            errors={errors}
            disabled={isLoading}
            fieldRefs={fieldRefs}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />
        </section>

        {/* 결과 (오른쪽, sticky) */}
        <section
          ref={resultRef}
          aria-label="추천 결과"
          aria-live="polite"
          className="md:col-span-7"
        >
          <div className="flex flex-col gap-4 md:sticky md:top-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold tracking-tight text-foreground">추천 결과</h2>
                {effectiveStatus === 'success' && (
                  <span className="text-xs font-semibold text-primary">
                    TOP 3 · 맞춤 추천 순
                  </span>
                )}
              </div>
              {showSummary && summaryInput && (
                <div className="flex flex-wrap gap-1.5 animate-in fade-in-50">
                  {summaryChips(summaryInput).map((chip, i) => (
                    <Badge key={i} variant="secondary" className="tnum font-medium">
                      {chip}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {renderResult()}
          </div>
        </section>
      </div>

      <DevStateToggle forced={forced} onForce={handleForce} />
    </main>
  )
}
