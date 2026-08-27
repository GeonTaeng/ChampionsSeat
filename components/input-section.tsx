'use client'

import { type RefObject } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import {
  Home,
  Plane,
  CalendarDays,
  CalendarClock,
  Minus,
  Plus,
  Wallet,
  Sparkles,
  Eye,
  Sofa,
  HelpCircle,
  Search,
} from 'lucide-react'
import {
  type FormValues,
  type FormErrors,
  parseBudget,
  formatBudget,
  clamp,
} from '@/lib/validation'

export type FieldRefs = {
  cheerTeam: RefObject<HTMLDivElement | null>
  visitDayType: RefObject<HTMLDivElement | null>
  budget: RefObject<HTMLInputElement | null>
  partySize?: RefObject<HTMLDivElement | null>
}

const PREF_LEVEL_LABELS = [
  '상관없음',
  '거의 고려 안 함',
  '조금 고려',
  '보통',
  '중요',
  '매우 중요',
]

/* 세그먼트형 라디오 (카드 토글) - Tiger Strike Dynamics 4px 사각 쉐이프 */
function SegmentedControl<T extends string>({
  legend,
  value,
  options,
  onChange,
  invalid,
  disabled,
}: {
  legend: string
  value: T | null
  options: { value: T; label: string; subLabel?: string; icon: React.ElementType }[]
  onChange: (v: T) => void
  invalid?: boolean
  disabled?: boolean
}) {
  return (
    <div
      role="radiogroup"
      aria-label={legend}
      className="grid grid-cols-2 gap-2.5"
    >
      {options.map((opt) => {
        const Icon = opt.icon
        const active = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={opt.label}
            disabled={disabled}
            onClick={() => onChange(opt.value)}
            className={cn(
              'flex flex-col items-center justify-center gap-1 rounded-[4px] border p-3.5 text-sm font-medium transition-all outline-none cursor-pointer',
              'focus-visible:border-[#C7012E] focus-visible:ring-2 focus-visible:ring-[#C7012E]/40',
              'disabled:pointer-events-none disabled:opacity-50',
              active
                ? 'border-[#C7012E] bg-[#C7012E]/15 text-white font-bold ring-1 ring-[#C7012E] shadow-sm'
                : cn(
                    'border-white/10 bg-[#1a1c1c] text-[#A0A0A0] hover:border-white/20 hover:bg-[#242727] hover:text-white',
                    invalid && 'border-[#E53935]/80 bg-[#E53935]/10',
                  ),
            )}
          >
            <div className="flex items-center gap-2">
              <Icon className={cn('size-4', active ? 'text-[#C7012E]' : 'text-[#A0A0A0]')} />
              <span className={active ? 'text-white' : 'text-[#FFFFFF]'}>{opt.label}</span>
            </div>
            {opt.subLabel && (
              <span className="text-[11px] font-normal text-[#A0A0A0]">
                {opt.subLabel}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

function FieldLabel({
  step,
  title,
  helper,
  required = true,
}: {
  step: string
  title: string
  helper: string
  required?: boolean
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-1.5">
        <span className="tnum flex size-5 items-center justify-center rounded-[4px] bg-[#C7012E]/20 text-[11px] font-bold text-[#FF4D6D]">
          {step}
        </span>
        <span className="text-sm font-bold text-white">
          {title}
          {required && <span className="ml-1 text-[#C7012E]">*</span>}
        </span>
      </div>
      <p className="pl-6.5 text-xs text-[#A0A0A0]">{helper}</p>
    </div>
  )
}

function PrefSlider({
  label,
  help,
  icon: Icon,
  value,
  onChange,
  disabled,
}: {
  label: string
  help: string
  icon: React.ElementType
  value: number
  onChange: (v: number) => void
  disabled?: boolean
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Icon className="size-3.5 text-[#A0A0A0]" />
          <span className="text-sm font-medium text-white">{label}</span>
          <Tooltip>
            <TooltipTrigger
              render={
                <button
                  type="button"
                  aria-label={`${label} 설명`}
                  className="text-[#A0A0A0] hover:text-white outline-none rounded-[4px]"
                />
              }
            >
              <HelpCircle className="size-3.5" />
            </TooltipTrigger>
            <TooltipContent className="bg-[#242727] text-white border-white/10">{help}</TooltipContent>
          </Tooltip>
        </div>
        <Badge variant="secondary" className="tnum tabular-nums font-bold rounded-[4px] bg-[#121414] text-white border border-white/10">
          {value}점 · {PREF_LEVEL_LABELS[value]}
        </Badge>
      </div>
      <Slider
        aria-label={label}
        min={0}
        max={5}
        step={1}
        value={[value]}
        disabled={disabled}
        onValueChange={(v) => {
          const next = Array.isArray(v) ? v[0] : v
          onChange(clamp(next, 0, 5))
        }}
      />
    </div>
  )
}

export function InputSection({
  values,
  errors,
  disabled,
  fieldRefs,
  onChange,
  onSubmit,
}: {
  values: FormValues
  errors: FormErrors
  disabled: boolean
  fieldRefs: FieldRefs
  onChange: (patch: Partial<FormValues>) => void
  onSubmit: () => void
}) {
  const setPartySize = (next: number) => {
    onChange({ partySize: clamp(next, 1, 40) })
  }

  const addBudget = (amount: number) => {
    const current = parseBudget(values.budgetRaw)
    const next = current + amount
    onChange({ budgetRaw: String(next) })
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="glass-panel rounded-[4px] border-white/10 bg-[#1a1c1c]/90">
        <CardHeader className="border-b border-white/10 pb-4">
          <CardTitle className="text-base font-bold text-white">직관 조건 입력</CardTitle>
          <p className="text-xs text-[#A0A0A0]">
            5가지 핵심 조건을 설정하시면 티켓링크 기준 최적 좌석을 큐레이션합니다.
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 pt-5">
          {/* ① 응원팀 */}
          <div ref={fieldRefs.cheerTeam} className="flex flex-col gap-2 scroll-mt-28">
            <FieldLabel
              step="1"
              title="응원팀"
              helper="홈은 3루 응원석, 어웨이는 1루 원정석 위주로 추천해드려요."
            />
            <SegmentedControl
              legend="응원팀 선택"
              value={values.cheerTeam}
              disabled={disabled}
              invalid={!!errors.cheerTeam}
              options={[
                { value: 'home', label: '홈 (KIA)', subLabel: '3루 응원단상 방면', icon: Home },
                { value: 'away', label: '어웨이 (원정)', subLabel: '1루 원정석 방면', icon: Plane },
              ]}
              onChange={(v) => onChange({ cheerTeam: v })}
            />
            {errors.cheerTeam && (
              <p role="alert" className="text-xs font-semibold text-[#FF4D6D] animate-in fade-in-50">
                {errors.cheerTeam}
              </p>
            )}
          </div>

          {/* ② 방문일 유형 */}
          <div
            ref={fieldRefs.visitDayType}
            className="flex flex-col gap-2 scroll-mt-28"
          >
            <FieldLabel
              step="2"
              title="방문일 유형"
              helper="평일과 주말·공휴일은 좌석 가격이 다르게 적용됩니다."
            />
            <SegmentedControl
              legend="방문일 유형 선택"
              value={values.visitDayType}
              disabled={disabled}
              invalid={!!errors.visitDayType}
              options={[
                { value: 'weekday', label: '평일', subLabel: '화~목 경기', icon: CalendarDays },
                { value: 'weekend', label: '주말·공휴일', subLabel: '금~일/공휴일', icon: CalendarClock },
              ]}
              onChange={(v) => onChange({ visitDayType: v })}
            />
            {errors.visitDayType && (
              <p role="alert" className="text-xs font-semibold text-[#FF4D6D] animate-in fade-in-50">
                {errors.visitDayType}
              </p>
            )}
          </div>

          {/* ③ 방문 인원 */}
          <div className="flex flex-col gap-2">
            <FieldLabel
              step="3"
              title="방문 인원"
              helper="함께 관람할 인원을 1~40명 사이로 정해주세요."
            />
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="인원 줄이기"
                disabled={disabled || values.partySize <= 1}
                onClick={() => setPartySize(values.partySize - 1)}
                className="size-11 rounded-[4px] border-white/10 bg-[#121414] hover:bg-[#242727] text-white"
              >
                <Minus className="size-4" />
              </Button>
              <div className="tnum flex-1 rounded-[4px] border border-white/10 bg-[#121414] py-2.5 text-center text-lg font-bold tabular-nums text-white">
                {values.partySize}
                <span className="ml-1 text-sm font-normal text-[#A0A0A0]">
                  명
                </span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="인원 늘리기"
                disabled={disabled || values.partySize >= 40}
                onClick={() => setPartySize(values.partySize + 1)}
                className="size-11 rounded-[4px] border-white/10 bg-[#121414] hover:bg-[#242727] text-white"
              >
                <Plus className="size-4" />
              </Button>
            </div>
            {errors.partySize && (
              <p role="alert" className="text-xs font-semibold text-[#FF4D6D] animate-in fade-in-50">
                {errors.partySize}
              </p>
            )}
          </div>

          {/* ④ 총 예산 */}
          <div className="flex flex-col gap-2">
            <FieldLabel
              step="4"
              title="총 예산"
              helper="인원 전체가 함께 지불할 좌석 총액을 입력하세요 (원)."
            />
            <div className="relative">
              <Wallet className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#A0A0A0]" />
              <Input
                ref={fieldRefs.budget}
                inputMode="numeric"
                aria-label="총 예산 (원)"
                aria-invalid={!!errors.budget}
                placeholder="예: 50,000"
                disabled={disabled}
                value={formatBudget(values.budgetRaw)}
                onChange={(e) => onChange({ budgetRaw: e.target.value })}
                className={cn(
                  'tnum h-11 pr-10 pl-9 text-base font-bold tabular-nums rounded-[4px] bg-[#121414] border-white/10 text-white scroll-mt-28 transition-colors',
                  errors.budget && 'border-[#E53935] focus-visible:ring-[#E53935]/30',
                )}
              />
              <span className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-sm font-semibold text-[#A0A0A0]">
                원
              </span>
            </div>
            {/* 퀵 예산 버튼 (4px 칩) */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: '+1만', amount: 10000 },
                { label: '+3만', amount: 30000 },
                { label: '+5만', amount: 50000 },
                { label: '+10만', amount: 100000 },
              ].map((btn) => (
                <Button
                  key={btn.label}
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={disabled}
                  onClick={() => addBudget(btn.amount)}
                  className="h-7 rounded-[4px] bg-[#242727] hover:bg-[#38393a] text-white text-xs font-medium cursor-pointer border border-white/5"
                >
                  {btn.label}
                </Button>
              ))}
              {values.budgetRaw && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={disabled}
                  onClick={() => onChange({ budgetRaw: '' })}
                  className="h-7 rounded-[4px] text-xs text-[#A0A0A0] hover:text-white"
                >
                  초기화
                </Button>
              )}
            </div>
            {errors.budget && (
              <p role="alert" className="text-xs font-semibold text-[#FF4D6D] animate-in fade-in-50">
                {errors.budget}
              </p>
            )}
          </div>

          <Separator className="border-white/10" />

          {/* ⑤ 선호도 */}
          <div className="flex flex-col gap-3">
            <FieldLabel
              step="5"
              title="관람 선호도"
              helper="각 항목을 0~5점으로 조절하면 맞춤 가중치가 적용돼요."
            />
            <div className="flex flex-col gap-5 rounded-[4px] border border-white/10 bg-[#121414] p-4">
              <PrefSlider
                label="응원 선호도"
                help="응원단상과 가까워 열광적인 응원 분위기를 즐기기 좋은 정도예요."
                icon={Sparkles}
                value={values.prefCheer}
                disabled={disabled}
                onChange={(v) => onChange({ prefCheer: v })}
              />
              <PrefSlider
                label="시야 선호도"
                help="그라운드와 투타 플레이가 잘 보이는 각도와 시야 수준이에요."
                icon={Eye}
                value={values.prefView}
                disabled={disabled}
                onChange={(v) => onChange({ prefView: v })}
              />
              <PrefSlider
                label="편의 선호도"
                help="좌석의 편안함 및 테이블, 이동 편의성이 높은 정도예요."
                icon={Sofa}
                value={values.prefComfort}
                disabled={disabled}
                onChange={(v) => onChange({ prefComfort: v })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 실행 버튼 - Tiger Red Primary CTA */}
      <div className="sticky bottom-4 z-10">
        <Button
          type="button"
          size="lg"
          disabled={disabled}
          onClick={onSubmit}
          className="h-13 w-full rounded-[4px] text-base font-bold bg-[#C7012E] hover:bg-[#A50126] text-white shadow-lg shadow-[#C7012E]/30 cursor-pointer border border-white/10"
        >
          <Search data-icon="inline-start" className="size-4" />
          {disabled ? '추천 좌석 찾는 중...' : '조건으로 좌석 추천받기'}
        </Button>
      </div>
    </div>
  )
}

export { parseBudget, formatBudget }
export type { FormValues, FormErrors }
