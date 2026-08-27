'use client'

import { useRef, useState } from 'react'
import { AppHeader } from '@/components/app-header'
import { LandingHero } from '@/components/landing-hero'
import { AppFooter } from '@/components/app-footer'
import { InputSection, type FieldRefs } from '@/components/input-section'
import { SeatResultCard, type AiEnhancedData } from '@/components/seat-result-card'
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

  // Gemini AI 비동기 상태 관리
  const [aiDataMap, setAiDataMap] = useState<Record<string, AiEnhancedData>>({})
  const [isAiLoading, setIsAiLoading] = useState(false)

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

  const scrollToInput = () => {
    inputTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const focusBudget = () => {
    scrollToField(budgetRef)
  }

  // Gemini AI 백엔드 비동기 호출
  const fetchAiReasons = async (
    input: RecommendInput,
    items: RecommendResult & { status: 'success' },
  ) => {
    setIsAiLoading(true)
    try {
      const payload = items.items.map((item) => ({
        zoneName: item.zone.zoneName,
        blockName: item.zone.blockName,
        cheerTeam: input.cheerTeam,
        visitDayType: input.visitDayType,
        partySize: input.partySize,
        totalPrice: item.totalPrice,
        unitPrice: item.unitPrice,
        prefCheer: input.prefCheer,
        prefView: input.prefView,
        prefComfort: input.prefComfort,
        features: item.zone.features || [],
      }))

      const response = await fetch('/api/ai-reason', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: payload }),
      })

      if (response.ok) {
        const data = (await response.json()) as { results: (AiEnhancedData | null)[] }
        const nextMap: Record<string, AiEnhancedData> = {}
        data.results.forEach((res, index) => {
          const item = items.items[index]
          if (res && item) {
            nextMap[item.zone.id] = res
          }
        })
        setAiDataMap(nextMap)
      }
    } catch (err) {
      console.warn('[Gemini AI] AI 사유 호출 실패, 룰 기반 템플릿 사유 유지:', err)
    } finally {
      setIsAiLoading(false)
    }
  }

  const runRecommendation = (input: RecommendInput) => {
    setStatus('loading')
    setForced(null)
    setAiDataMap({})

    // PRD 5-3 타임아웃 가드 (15초 초과 시 PRD 5-4 실패 처리)
    const timeoutId = window.setTimeout(() => {
      setStatus('error')
      setFailCount((c) => c + 1)
      console.error('[Timeout] 좌석 추천 연산 시간이 15초를 초과하여 실패 처리되었습니다.')
    }, 15000)

    // 1단계: 룰 기반 초고속 연산 (0.6초 자연스러운 인터랙션 후 렌더링)
    window.setTimeout(() => {
      try {
        clearTimeout(timeoutId)
        const res = recommendSeats(input)
        setResult(res)
        setStatus(res.status)
        setFailCount(0)

        // 결과 영역으로 스크롤
        window.setTimeout(() => {
          resultRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
        }, 100)

        // 2단계: 추천 성공 시 Gemini AI 비동기 사유 생성
        if (res.status === 'success') {
          fetchAiReasons(input, res)
        }
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
      if (formErrors.cheerTeam) scrollToField(cheerTeamRef)
      else if (formErrors.visitDayType) scrollToField(visitDayTypeRef)
      else if (formErrors.budget) scrollToField(budgetRef)
      return
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
                  aiData={aiDataMap[rec.zone.id]}
                  isAiLoading={isAiLoading}
                />
              ))}
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={scrollToInput}
                className="w-full cursor-pointer font-bold border-white/10 hover:bg-white/5 rounded-[4px]"
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
    <main className="min-h-dvh bg-[#121414] pb-24 text-white">
      {/* 글로벌 상단 헤더 */}
      <AppHeader onCtaClick={scrollToInput} />

      {/* 랜딩 히어로 & 서비스 소개 섹션 */}
      <LandingHero onStartRecommendation={scrollToInput} />

      {/* 실제 서비스 인입 영역 (1200px 와이드 그리드) */}
      <div
        ref={inputTopRef}
        className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-8 px-5 py-10 md:grid-cols-12 md:px-8 md:py-14 md:scroll-mt-16"
      >
        {/* 입력 섹션 (왼쪽) */}
        <section className="md:col-span-5 flex flex-col gap-3" aria-label="좌석 조건 입력">
          <div className="flex items-center gap-2 mb-1">
            <span className="flex size-6 items-center justify-center rounded-[4px] bg-[#C7012E] text-xs font-black text-white">
              STEP
            </span>
            <h2 className="text-xl font-bold tracking-tight text-white">
              직관 조건 설정
            </h2>
          </div>
          <InputSection
            values={values}
            errors={errors}
            disabled={isLoading}
            fieldRefs={fieldRefs}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />
        </section>

        {/* 결과 섹션 (오른쪽, sticky) */}
        <section
          ref={resultRef}
          aria-label="추천 결과"
          aria-live="polite"
          className="md:col-span-7"
        >
          <div className="flex flex-col gap-4 md:sticky md:top-20">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex size-6 items-center justify-center rounded-[4px] bg-[#1a1c1c] border border-white/10 text-xs font-bold text-[#A0A0A0]">
                    TOP 3
                  </span>
                  <h2 className="text-xl font-bold tracking-tight text-white">
                    맞춤 좌석 큐레이션 결과
                  </h2>
                </div>
                {effectiveStatus === 'success' && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-[#00E676]">
                      매칭 완료
                    </span>
                    {isAiLoading && (
                      <span className="text-[11px] text-[#A0A0A0] animate-pulse">
                        · AI 전술 팁 분석 중...
                      </span>
                    )}
                  </div>
                )}
              </div>

              {showSummary && summaryInput && (
                <div className="flex flex-wrap gap-1.5 animate-in fade-in-50">
                  {summaryChips(summaryInput).map((chip, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="tnum font-medium rounded-[4px] border border-white/10 bg-[#1a1c1c] text-[#FFFFFF]"
                    >
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

      {/* 글로벌 푸터 */}
      <AppFooter onCtaClick={scrollToInput} />
    </main>
  )
}
