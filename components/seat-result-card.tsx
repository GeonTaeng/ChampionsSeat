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
  { label: '1위', badgeClass: 'bg-[#C7012E] text-white font-black shadow-sm', icon: Crown },
  { label: '2위', badgeClass: 'bg-[#38393a] text-white font-bold border border-white/10', icon: null },
  { label: '3위', badgeClass: 'bg-[#242727] text-[#A0A0A0] font-bold border border-white/10', icon: null },
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
    badgeClass: 'bg-[#1a1c1c] text-[#A0A0A0] font-bold',
    icon: null,
  }

  const hasAiReason = !!aiData?.aiReason

  return (
    <Card
      className={cn(
        'animate-in fade-in-0 slide-in-from-bottom-3 fill-mode-both duration-500 overflow-hidden transition-all rounded-[4px]',
        isBest
          ? 'glass-card border-[#C7012E]/70 shadow-[0_8px_30px_-8px_rgba(199,1,46,0.35)] ring-1 ring-[#C7012E]/50 bg-gradient-to-b from-[#1a1c1c] to-[#121414]'
          : 'glass-panel border-white/10 hover:border-white/20 bg-[#1a1c1c]/90',
      )}
      style={{ animationDelay: `${rank * 80}ms` }}
    >
      <CardContent className="flex flex-col gap-4 p-5 md:p-6">
        {/* 상단 순위 + 배지 라인 */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'tnum flex h-7 min-w-7 items-center justify-center rounded-[4px] px-2.5 text-xs',
                rankInfo.badgeClass,
              )}
            >
              {rankInfo.label}
            </span>
            {isBest && (
              <Badge className="gap-1 bg-[#C7012E] hover:bg-[#C7012E] text-white font-bold rounded-[4px] border border-white/10">
                <Crown className="size-3" />
                BEST MATCH
              </Badge>
            )}
            <Badge variant="outline" className="text-xs text-[#A0A0A0] rounded-[4px] border-white/10">
              {rec.zone.category}
            </Badge>
          </div>

          <div className="flex items-center gap-1.5">
            {rec.isAwayEligible && (
              <Badge variant="secondary" className="gap-1 font-semibold text-[#00E676] bg-[#00E676]/10 border border-[#00E676]/30 rounded-[4px]">
                <Sparkles className="size-3 text-[#00E676]" />
                원정 응원 추천
              </Badge>
            )}
            {hasAiReason ? (
              <Badge variant="outline" className="gap-1 text-[#FF4D6D] border-[#C7012E]/50 bg-[#C7012E]/10 rounded-[4px] animate-pulse">
                <Bot className="size-3 text-[#C7012E]" />
                Gemini AI 분석
              </Badge>
            ) : isAiLoading ? (
              <Badge variant="ghost" className="gap-1 text-[#A0A0A0] text-xs rounded-[4px]">
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
              'font-black tracking-tight text-balance text-white',
              isBest ? 'text-xl md:text-2xl' : 'text-lg md:text-xl',
            )}
          >
            {rec.zone.zoneName}
          </h3>
          <p className="text-sm font-medium text-[#A0A0A0]">{rec.zone.blockName}</p>
        </div>

        {/* 예상 총금액 */}
        <div className="flex flex-col gap-1 rounded-[4px] bg-[#121414] p-4 border border-white/10">
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-semibold text-[#A0A0A0]">
              예상 총금액 ({partySize}명)
            </span>
            <div className="flex items-baseline gap-1">
              <span
                className={cn(
                  'font-black tracking-tight tabular-nums',
                  isBest ? 'text-3xl md:text-4xl text-[#C7012E]' : 'text-2xl md:text-3xl text-white',
                )}
              >
                <CountUp value={rec.totalPrice} />
              </span>
              <span className="font-bold text-white text-lg">원</span>
            </div>
          </div>
          <div className="flex justify-end">
            <p className="tnum text-xs text-[#A0A0A0]">
              1석 {formatCurrency(rec.unitPrice)}원 × {partySize}명 기준
            </p>
          </div>
        </div>

        <Separator className="border-white/10" />

        {/* 점수 게이지 */}
        <div className="flex flex-col gap-2.5">
          <ScoreGauge label="응원 열기" score={rec.zone.cheerScore} emphasis={isBest} />
          <ScoreGauge label="경기 시야" score={rec.zone.viewScore} emphasis={isBest} />
          <ScoreGauge label="좌석 편의" score={rec.zone.comfortScore} emphasis={isBest} />
        </div>

        {/* 추천 이유 (AI 생성 사유 or 룰 기반 템플릿 사유) */}
        <div
          className={cn(
            'rounded-[4px] p-4 text-sm leading-relaxed border transition-all duration-500',
            hasAiReason
              ? 'bg-gradient-to-br from-[#2e151b] via-[#1a1c1c] to-[#121414] border-[#C7012E]/40 shadow-sm'
              : isBest
                ? 'bg-[#C7012E]/10 border-[#C7012E]/30 text-white font-medium'
                : 'bg-[#121414] border-white/10 text-[#FFFFFF]',
          )}
        >
          <div className="flex items-center justify-between gap-1.5 mb-2 font-bold text-xs">
            <div className="flex items-center gap-1.5 text-[#FF4D6D]">
              {hasAiReason ? <Bot className="size-4 text-[#C7012E]" /> : <Sparkles className="size-3.5 text-[#C7012E]" />}
              <span className="text-white">{hasAiReason ? 'Gemini AI 맞춤 추천 해설' : '추천 사유'}</span>
            </div>
            {hasAiReason && (
              <span className="text-[10px] font-semibold text-[#A0A0A0]">Gemini 3.6 Flash</span>
            )}
          </div>

          {hasAiReason ? (
            <p className="text-white/90 leading-relaxed animate-in fade-in-50 duration-500">
              {aiData.aiReason}
            </p>
          ) : (
            rec.reasons.map((reason, i) => (
              <p key={i} className={cn(i > 0 && 'mt-1.5 text-[#A0A0A0] text-xs')}>
                {reason}
              </p>
            ))
          )}

          {/* 직관 꿀팁 (AI 생성 시 표시) */}
          {aiData?.matchTip && (
            <div className="mt-3 flex items-start gap-2 rounded-[4px] bg-[#121414] p-3 text-xs text-white border border-white/10 shadow-xs animate-in fade-in-50 duration-500">
              <Lightbulb className="size-4 text-[#FFD700] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#FFD700] mr-1">직관 전술 TIP:</span>
                <span className="text-white/90">{aiData.matchTip}</span>
              </div>
            </div>
          )}
        </div>

        {/* 특징 태그 */}
        {rec.zone.features && rec.zone.features.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <Tag className="size-3 text-[#A0A0A0] mr-0.5" />
            {rec.zone.features.map((feature, idx) => (
              <span
                key={idx}
                className="inline-flex items-center rounded-[4px] bg-[#242727] border border-white/5 px-2 py-0.5 text-[11px] font-medium text-[#A0A0A0]"
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
