import { cn } from '@/lib/utils'

export function ScoreGauge({
  label,
  score,
  max = 5,
  emphasis = false,
}: {
  label: string
  score: number
  max?: number
  emphasis?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="w-16 shrink-0 text-xs font-semibold text-[#A0A0A0]">
        {label}
      </span>
      <div
        className="flex flex-1 items-center gap-1.5"
        role="img"
        aria-label={`${label} 점수 ${score}점 만점 ${max}점`}
      >
        {Array.from({ length: max }, (_, i) => (
          <span
            key={i}
            className={cn(
              'h-2 flex-1 rounded-[2px] transition-all duration-300',
              i < score
                ? emphasis
                  ? 'bg-[#C7012E] shadow-[0_0_8px_rgba(199,1,46,0.6)]'
                  : 'bg-white/70'
                : 'bg-white/10',
            )}
          />
        ))}
      </div>
      <span className="tnum w-6 shrink-0 text-right text-xs font-bold tabular-nums text-white">
        {score}
      </span>
    </div>
  )
}
