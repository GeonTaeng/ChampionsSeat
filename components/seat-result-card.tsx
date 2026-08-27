'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CountUp } from '@/components/count-up'
import { ScoreGauge } from '@/components/score-gauge'
import { formatCurrency, type SeatRecommendation } from '@/lib/recommend'
import { cn } from '@/lib/utils'
import { Crown, Sparkles, Tag, Bot, Lightbulb, Loader2 } from 'lucide-react'

const RANK_CONFIG = [
  { label: '1위', badgeClass: 'bg-amber-500 text-white font-black shadow-xs', icon: Crown },
  { label: '2위', badgeClass: 'bg-slate-400 text-white font-bold', icon: null },
  { label: '3위', badgeClass: 'bg-amber-700/80 text-white font-bold', icon: null },
]

export type AiEnhancedData = {
  aiReason?: string
  matchTip?: string
}

export function SeatResultCard({
  rec,
  rank,
  partySize,
  aiData,
  isAiLoading,
}: {
  rec: SeatRecommendation
  rank: number
  partySize: number
  aiData?: AiEnhancedData | null
  isAiLoading?: boolean
}) {
  const isBest = rank === 0
  const rankInfo = RANK_CONFIG[rank] ?? {
    label: `${rank + 1}위`,
    badgeClass: 'bg-muted text-muted-foreground font-bold',
    icon: null,
  }

  const hasAiReason = !!aiData?.aiReason

  return (
    <Card
      className={cn(
        'animate-in fade-in-0 slide-in-from-bottom-3 fill-mode-both duration-500 overflow-hidden transition-all',
        isBest
          ? 'border-primary/80 ring-2 ring-primary/30 shadow-[0_8px_30px_-10px_rgba(235,16,40,0.25)] bg-gradient-to-b from-card to-primary/[0.02]'
          : 'border-border/80 hover:border-primary/30 hover:shadow-md',
      )}
      style={{ animationDelay: `${rank * 80}ms` }}
    >
      <CardContent className="flex flex-col gap-4 p-5 md:p-6">
        {/* 상단 순위 + 배지 라인 */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'tnum flex h-7 min-w-7 items-center justify-center rounded-lg px-2.5 text-xs',
                rankInfo.badgeClass,
              )}
            >
              {rankInfo.label}
            </span>
            {isBest && (
              <Badge className="gap-1 bg-primary text-primary-foreground font-bold hover:bg-primary">
                <Crown className="size-3" />
                BEST MATCH
              </Badge>
            )}
            <Badge variant="outline" className="text-xs text-muted-foreground">
              {rec.zone.category}
            </Badge>
          </div>

          <div className="flex items-center gap-1.5">
            {rec.isAwayEligible && (
              <Badge variant="secondary" className="gap-1 font-semibold text-field bg-field/10 border-field/30">
                <Sparkles className="size-3 text-field" />
                원정 응원 추천
              </Badge>
            )}
            {hasAiReason ? (
              <Badge variant="outline" className="gap-1 text-primary border-primary/40 bg-primary/5 animate-pulse">
                <Bot className="size-3 text-primary" />
                Gemini AI 분석
              </Badge>
            ) : isAiLoading ? (
              <Badge variant="ghost" className="gap-1 text-muted-foreground text-xs">
                <Loader2 className="size-3 animate-spin" />
                AI 분석 중
              </Badge>
            ) : null}
          </div>
        </div>

        {/* 구역명 & 블록명 */}
        <div className="flex flex-col gap-1">
          <h3
            className={cn(
              'font-black tracking-tight text-balance text-foreground',
              isBest ? 'text-xl md:text-2xl' : 'text-lg md:text-xl',
            )}
          >
            {rec.zone.zoneName}
          </h3>
          <p className="text-sm font-medium text-muted-foreground">{rec.zone.blockName}</p>
        </div>

        {/* 예상 총금액 */}
        <div className="flex flex-col gap-1 rounded-xl bg-muted/40 p-3.5 border border-border/50">
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              예상 총금액 ({partySize}명)
            </span>
            <div className="flex items-baseline gap-1">
              <span
                className={cn(
                  'font-black tracking-tight text-primary tabular-nums',
                  isBest ? 'text-3xl md:text-4xl' : 'text-2xl md:text-3xl',
                )}
              >
                <CountUp value={rec.totalPrice} />
              </span>
              <span className="font-bold text-primary text-lg">원</span>
            </div>
          </div>
          <div className="flex justify-end">
            <p className="tnum text-xs text-muted-foreground">
              1석 {formatCurrency(rec.unitPrice)}원 × {partySize}명 기준
            </p>
          </div>
        </div>

        <Separator />

        {/* 점수 게이지 */}
        <div className="flex flex-col gap-2.5">
          <ScoreGauge label="응원 열기" score={rec.zone.cheerScore} emphasis={isBest} />
          <ScoreGauge label="경기 시야" score={rec.zone.viewScore} emphasis={isBest} />
          <ScoreGauge label="좌석 편의" score={rec.zone.comfortScore} emphasis={isBest} />
        </div>

        {/* 추천 이유 (AI 생성 사유 or 룰 기반 템플릿 사유) */}
        <div
          className={cn(
            'rounded-xl p-3.5 text-sm leading-relaxed border transition-all duration-500',
            hasAiReason
              ? 'bg-gradient-to-br from-primary/10 via-card to-primary/5 border-primary/30 shadow-xs'
              : isBest
                ? 'bg-primary/5 border-primary/20 text-foreground font-medium'
                : 'bg-muted/50 border-border/60 text-foreground/90',
          )}
        >
          <div className="flex items-center justify-between gap-1.5 mb-2 font-bold text-xs">
            <div className="flex items-center gap-1.5 text-primary">
              {hasAiReason ? <Bot className="size-4" /> : <Sparkles className="size-3.5" />}
              <span>{hasAiReason ? 'Gemini AI 맞춤 추천 해설' : '추천 사유'}</span>
            </div>
            {hasAiReason && (
              <span className="text-[10px] font-normal text-muted-foreground">Gemini 2.5 Flash</span>
            )}
          </div>

          {hasAiReason ? (
            <p className="text-foreground leading-relaxed animate-in fade-in-50 duration-500">
              {aiData.aiReason}
            </p>
          ) : (
            rec.reasons.map((reason, i) => (
              <p key={i} className={cn(i > 0 && 'mt-1.5 text-muted-foreground text-xs')}>
                {reason}
              </p>
            ))
          )}

          {/* 직관 꿀팁 (AI 생성 시 표시) */}
          {aiData?.matchTip && (
            <div className="mt-3 flex items-start gap-2 rounded-lg bg-card/90 p-2.5 text-xs text-foreground border border-border/60 shadow-xs animate-in fade-in-50 duration-500">
              <Lightbulb className="size-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-600 dark:text-amber-400 mr-1">직관 TIP:</span>
                <span>{aiData.matchTip}</span>
              </div>
            </div>
          )}
        </div>

        {/* 특징 태그 */}
        {rec.zone.features && rec.zone.features.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <Tag className="size-3 text-muted-foreground mr-0.5" />
            {rec.zone.features.map((feature, idx) => (
              <span
                key={idx}
                className="inline-flex items-center rounded-md bg-secondary/80 px-2 py-0.5 text-[11px] font-medium text-secondary-foreground"
              >
                #{feature}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
