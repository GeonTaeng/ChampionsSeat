'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CountUp } from '@/components/count-up'
import { ScoreGauge } from '@/components/score-gauge'
import { formatCurrency, type SeatRecommendation } from '@/lib/recommend'
import { cn } from '@/lib/utils'
import { Crown, Sparkles, Tag } from 'lucide-react'

const RANK_CONFIG = [
  { label: '1위', badgeClass: 'bg-amber-500 text-white font-black shadow-xs', icon: Crown },
  { label: '2위', badgeClass: 'bg-slate-400 text-white font-bold', icon: null },
  { label: '3위', badgeClass: 'bg-amber-700/80 text-white font-bold', icon: null },
]

export function SeatResultCard({
  rec,
  rank,
  partySize,
}: {
  rec: SeatRecommendation
  rank: number
  partySize: number
}) {
  const isBest = rank === 0
  const rankInfo = RANK_CONFIG[rank] ?? {
    label: `${rank + 1}위`,
    badgeClass: 'bg-muted text-muted-foreground font-bold',
    icon: null,
  }

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

          {rec.isAwayEligible && (
            <Badge variant="secondary" className="gap-1 font-semibold text-field bg-field/10 border-field/30">
              <Sparkles className="size-3 text-field" />
              원정 응원 추천
            </Badge>
          )}
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

        {/* 추천 이유 */}
        <div
          className={cn(
            'rounded-xl p-3.5 text-sm leading-relaxed border',
            isBest
              ? 'bg-primary/5 border-primary/20 text-foreground font-medium'
              : 'bg-muted/50 border-border/60 text-foreground/90',
          )}
        >
          <div className="flex items-center gap-1.5 mb-2 font-bold text-xs text-primary">
            <Sparkles className="size-3.5" />
            <span>AI 추천 사유</span>
          </div>
          {rec.reasons.map((reason, i) => (
            <p key={i} className={cn(i > 0 && 'mt-1.5 text-muted-foreground text-xs')}>
              {reason}
            </p>
          ))}
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
