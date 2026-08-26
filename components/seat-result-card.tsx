'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CountUp } from '@/components/count-up'
import { ScoreGauge } from '@/components/score-gauge'
import { formatCurrency, type SeatRecommendation } from '@/lib/recommend'
import { cn } from '@/lib/utils'
import { Crown, Plane } from 'lucide-react'

const RANK_LABEL = ['1위', '2위', '3위']

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

  return (
    <Card
      className={cn(
        'animate-in fade-in-0 slide-in-from-bottom-3 fill-mode-both duration-500',
        isBest
          ? 'ring-2 ring-primary/70 shadow-[0_4px_24px_-8px_var(--primary)]'
          : 'ring-foreground/10',
      )}
      style={{ animationDelay: `${rank * 60}ms` }}
    >
      <CardContent className="flex flex-col gap-4">
        {/* 순위 + 배지 라인 */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'tnum flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-xs font-bold',
                isBest
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-navy/10 text-navy',
              )}
            >
              {RANK_LABEL[rank] ?? `${rank + 1}위`}
            </span>
            {isBest && (
              <Badge className="gap-1">
                <Crown className="size-3" />
                BEST MATCH
              </Badge>
            )}
          </div>
          {rec.isAwayEligible && (
            <Badge variant="secondary" className="gap-1 text-field">
              <Plane className="size-3" />
              원정 응원 가능
            </Badge>
          )}
        </div>

        {/* 구역명 / 블록명 */}
        <div className="flex flex-col gap-0.5">
          <h3
            className={cn(
              'font-bold tracking-tight text-balance',
              isBest ? 'text-xl' : 'text-lg',
            )}
          >
            {rec.zone.zoneName}
          </h3>
          <p className="text-sm text-muted-foreground">{rec.zone.blockName}</p>
        </div>

        {/* 예상 총금액 */}
        <div className="flex flex-col gap-0.5">
          <div className="flex items-baseline gap-1">
            <span
              className={cn(
                'font-black tracking-tight text-primary',
                isBest ? 'text-4xl' : 'text-3xl',
              )}
            >
              <CountUp value={rec.totalPrice} />
            </span>
            <span
              className={cn(
                'font-bold text-primary',
                isBest ? 'text-xl' : 'text-lg',
              )}
            >
              원
            </span>
          </div>
          <p className="tnum text-xs text-muted-foreground">
            1석 {formatCurrency(rec.unitPrice)}원 × {partySize}명
          </p>
        </div>

        <Separator />

        {/* 점수 게이지 */}
        <div className="flex flex-col gap-2">
          <ScoreGauge label="응원" score={rec.zone.cheerScore} emphasis={isBest} />
          <ScoreGauge label="시야" score={rec.zone.viewScore} emphasis={isBest} />
          <ScoreGauge label="편의" score={rec.zone.comfortScore} emphasis={isBest} />
        </div>

        {/* 추천 이유 */}
        <div
          className={cn(
            'rounded-lg p-3 text-sm leading-relaxed',
            isBest ? 'bg-accent text-foreground' : 'bg-muted/60 text-foreground',
          )}
        >
          {rec.reasons.map((reason, i) => (
            <p key={i} className={cn(i > 0 && 'mt-1 text-muted-foreground')}>
              {reason}
            </p>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
