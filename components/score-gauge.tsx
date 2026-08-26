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
      <span className="w-8 shrink-0 text-xs font-medium text-muted-foreground">
        {label}
      </span>
      <div
        className="flex flex-1 items-center gap-1"
        role="img"
        aria-label={`${label} 점수 ${score}점 만점 ${max}점`}
      >
        {Array.from({ length: max }, (_, i) => (
          <span
            key={i}
            className={cn(
              'h-1.5 flex-1 rounded-full transition-colors',
              i < score
                ? emphasis
                  ? 'bg-primary'
                  : 'bg-navy/70'
                : 'bg-muted',
            )}
          />
        ))}
      </div>
      <span className="tnum w-6 shrink-0 text-right text-xs font-semibold tabular-nums">
        {score}
      </span>
    </div>
  )
}
