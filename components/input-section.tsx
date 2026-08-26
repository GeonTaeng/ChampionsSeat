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

export type FieldRefs = {
  cheerTeam: RefObject<HTMLDivElement | null>
  visitDayType: RefObject<HTMLDivElement | null>
  budget: RefObject<HTMLInputElement | null>
}

const PREF_LEVEL_LABELS = [
  '상관없음',
  '거의 고려 안 함',
  '조금 고려',
  '보통',
  '중요',
  '매우 중요',
]

function parseBudget(raw: string): number {
  const digits = raw.replace(/[^\d]/g, '')
  return digits ? Number.parseInt(digits, 10) : 0
}

function formatBudget(raw: string): string {
  const digits = raw.replace(/[^\d]/g, '')
  if (!digits) return ''
  return Number.parseInt(digits, 10).toLocaleString('ko-KR')
}

/* 세그먼트형 라디오 (카드 토글) */
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
  options: { value: T; label: string; icon: React.ElementType }[]
  onChange: (v: T) => void
  invalid?: boolean
  disabled?: boolean
}) {
  return (
    <div
      role="radiogroup"
      aria-label={legend}
      className="grid grid-cols-2 gap-2"
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
              'flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-medium transition-all outline-none',
              'focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
              'disabled:pointer-events-none disabled:opacity-50',
              active
                ? 'border-primary bg-primary/8 text-primary ring-1 ring-primary/40'
                : cn(
                    'border-border bg-card text-foreground hover:border-primary/40 hover:bg-accent',
                    invalid && 'border-destructive/60',
                  ),
            )}
          >
            <Icon className="size-4" />
            {opt.label}
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
}: {
  step: string
  title: string
  helper: string
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-1.5">
        <span className="tnum flex size-5 items-center justify-center rounded-md bg-navy/10 text-[11px] font-bold text-navy">
          {step}
        </span>
        <span className="text-sm font-semibold">{title}</span>
      </div>
      <p className="pl-6.5 text-xs text-muted-foreground">{helper}</p>
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
          <Icon className="size-3.5 text-muted-foreground" />
          <span className="text-sm font-medium">{label}</span>
          <Tooltip>
            <TooltipTrigger
              render={
                <button
                  type="button"
                  aria-label={`${label} 설명`}
                  className="text-muted-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50 rounded-full"
                />
              }
            >
              <HelpCircle className="size-3.5" />
            </TooltipTrigger>
            <TooltipContent>{help}</TooltipContent>
          </Tooltip>
        </div>
        <Badge variant="secondary" className="tnum tabular-nums">
          {value} · {PREF_LEVEL_LABELS[value]}
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
          onChange(Math.min(5, Math.max(0, next)))
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
  const budgetNumber = parseBudget(values.budgetRaw)

  const setPartySize = (next: number) => {
    onChange({ partySize: Math.min(40, Math.max(1, next)) })
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="text-base">직관 조건 입력</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {/* ① 응원팀 */}
          <div ref={fieldRefs.cheerTeam} className="flex flex-col gap-2 scroll-mt-24">
            <FieldLabel
              step="1"
              title="응원팀"
              helper="홈은 1루, 어웨이는 3루·원정석 위주로 추천해드려요."
            />
            <SegmentedControl
              legend="응원팀 선택"
              value={values.cheerTeam}
              disabled={disabled}
              invalid={!!errors.cheerTeam}
              options={[
                { value: 'home', label: '홈 (KIA)', icon: Home },
                { value: 'away', label: '어웨이', icon: Plane },
              ]}
              onChange={(v) => onChange({ cheerTeam: v })}
            />
            {errors.cheerTeam && (
              <p role="alert" className="text-xs font-medium text-destructive">
                {errors.cheerTeam}
              </p>
            )}
          </div>

          {/* ② 방문일 유형 */}
          <div
            ref={fieldRefs.visitDayType}
            className="flex flex-col gap-2 scroll-mt-24"
          >
            <FieldLabel
              step="2"
              title="방문일 유형"
              helper="평일과 주말·공휴일은 좌석 단가가 달라요."
            />
            <SegmentedControl
              legend="방문일 유형 선택"
              value={values.visitDayType}
              disabled={disabled}
              invalid={!!errors.visitDayType}
              options={[
                { value: 'weekday', label: '평일', icon: CalendarDays },
                { value: 'weekend', label: '주말·공휴일', icon: CalendarClock },
              ]}
              onChange={(v) => onChange({ visitDayType: v })}
            />
            {errors.visitDayType && (
              <p role="alert" className="text-xs font-medium text-destructive">
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
              >
                <Minus />
              </Button>
              <div className="tnum flex-1 rounded-lg border border-border bg-muted/40 py-2 text-center text-lg font-bold tabular-nums">
                {values.partySize}
                <span className="ml-1 text-sm font-normal text-muted-foreground">
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
              >
                <Plus />
              </Button>
            </div>
            {errors.partySize && (
              <p role="alert" className="text-xs font-medium text-destructive">
                {errors.partySize}
              </p>
            )}
          </div>

          {/* ④ 총 예산 */}
          <div className="flex flex-col gap-2">
            <FieldLabel
              step="4"
              title="총 예산"
              helper="인원 전체가 함께 쓸 총 예산을 원 단위로 입력해주세요."
            />
            <div className="relative">
              <Wallet className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                ref={fieldRefs.budget}
                inputMode="numeric"
                aria-label="총 예산 (원)"
                aria-invalid={!!errors.budget}
                placeholder="예: 150,000"
                disabled={disabled}
                value={formatBudget(values.budgetRaw)}
                onChange={(e) => onChange({ budgetRaw: e.target.value })}
                className="tnum h-11 pr-10 pl-9 text-base font-semibold tabular-nums scroll-mt-24"
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                원
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { label: '5만', value: '50000' },
                { label: '10만', value: '100000' },
                { label: '20만', value: '200000' },
              ].map((chip) => (
                <Button
                  key={chip.value}
                  type="button"
                  variant={values.budgetRaw.replace(/[^\d]/g, '') === chip.value ? 'default' : 'secondary'}
                  size="sm"
                  disabled={disabled}
                  onClick={() => onChange({ budgetRaw: chip.value })}
                >
                  {chip.label}
                </Button>
              ))}
            </div>
            {errors.budget && (
              <p role="alert" className="text-xs font-medium text-destructive">
                {errors.budget}
              </p>
            )}
          </div>

          <Separator />

          {/* ⑤ 선호도 */}
          <div className="flex flex-col gap-3">
            <FieldLabel
              step="5"
              title="관람 선호도"
              helper="무엇을 더 중요하게 볼지 0~5로 조절하면 추천 순위에 반영돼요."
            />
            <div className="flex flex-col gap-5 rounded-xl border border-border bg-muted/30 p-4">
              <PrefSlider
                label="응원 선호도"
                help="응원단상과 가까워 응원 열기를 즐기기 좋은 정도예요."
                icon={Sparkles}
                value={values.prefCheer}
                disabled={disabled}
                onChange={(v) => onChange({ prefCheer: v })}
              />
              <PrefSlider
                label="시야 선호도"
                help="그라운드를 바라보는 관람 각도와 시야의 좋은 정도예요."
                icon={Eye}
                value={values.prefView}
                disabled={disabled}
                onChange={(v) => onChange({ prefView: v })}
              />
              <PrefSlider
                label="편의 선호도"
                help="좌석 편안함과 화장실·매점 접근성이 좋은 정도예요."
                icon={Sofa}
                value={values.prefComfort}
                disabled={disabled}
                onChange={(v) => onChange({ prefComfort: v })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 실행 버튼 (데스크톱에서 sticky) */}
      <div className="sticky bottom-4 z-10">
        <Button
          type="button"
          size="lg"
          disabled={disabled}
          onClick={onSubmit}
          className="h-12 w-full text-base font-bold shadow-lg shadow-primary/20"
        >
          <Search data-icon="inline-start" />
          {disabled ? '추천 좌석 찾는 중...' : '좌석 추천받기'}
        </Button>
      </div>
    </div>
  )
}

export { parseBudget }
