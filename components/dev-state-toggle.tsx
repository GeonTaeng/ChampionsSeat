'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { FlaskConical, X } from 'lucide-react'

export type ResultStatus =
  | 'empty'
  | 'loading'
  | 'success'
  | 'budget-over'
  | 'no-data'
  | 'error'

const OPTIONS: { value: ResultStatus; label: string }[] = [
  { value: 'empty', label: '① 초기' },
  { value: 'loading', label: '② 로딩' },
  { value: 'success', label: '③ 정상 결과' },
  { value: 'budget-over', label: '④ 예산 초과' },
  { value: 'no-data', label: '⑤ 데이터 없음' },
  { value: 'error', label: '⑥ 실패' },
]

export function DevStateToggle({
  forced,
  onForce,
}: {
  forced: ResultStatus | null
  onForce: (status: ResultStatus | null) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-2">
      {open && (
        <div className="w-52 rounded-xl border border-border bg-popover p-3 text-popover-foreground shadow-xl">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-bold">State 프리뷰 (개발용)</span>
            <button
              type="button"
              aria-label="닫기"
              onClick={() => setOpen(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          </div>
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => onForce(null)}
              className={cn(
                'rounded-md px-2 py-1.5 text-left text-xs font-medium transition-colors',
                forced === null
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted',
              )}
            >
              자동 (실제 로직)
            </button>
            {OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onForce(opt.value)}
                className={cn(
                  'rounded-md px-2 py-1.5 text-left text-xs font-medium transition-colors',
                  forced === opt.value
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted',
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
      <Button
        type="button"
        size="icon-lg"
        variant={open ? 'default' : 'secondary'}
        aria-label="개발용 상태 프리뷰 토글"
        onClick={() => setOpen((v) => !v)}
        className="rounded-full shadow-lg"
      >
        <FlaskConical />
      </Button>
    </div>
  )
}
