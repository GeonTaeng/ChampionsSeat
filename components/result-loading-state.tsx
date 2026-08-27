'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Loader2, Clock } from 'lucide-react'

export function ResultLoadingState() {
  const [slow, setSlow] = useState(false)

  useEffect(() => {
    // PRD 5-3: 8초 이상 지연 시 보조 안내 문구 노출
    const timer = setTimeout(() => setSlow(true), 8000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex flex-col gap-4 animate-in fade-in-50 duration-300" aria-busy="true" aria-live="polite">
      <div className="flex items-center gap-2 text-sm font-semibold text-primary">
        <Loader2 className="size-4 animate-spin text-primary" />
        <span>조건에 맞는 최적 좌석을 분석하고 있어요...</span>
      </div>

      {slow && (
        <div className="flex items-center gap-2 rounded-xl bg-amber-500/10 border border-amber-500/30 p-3 text-xs font-medium text-amber-900 dark:text-amber-200 animate-in fade-in-50">
          <Clock className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <span>예상보다 시간이 걸리고 있어요. 잠시만 기다려주세요.</span>
        </div>
      )}

      {[0, 1, 2].map((i) => (
        <Card key={i} className="border-border/60">
          <CardContent className="flex flex-col gap-4 p-5">
            <div className="flex items-center justify-between">
              <Skeleton className="h-7 w-16 rounded-lg" />
              <Skeleton className="h-5 w-24 rounded-md" />
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-16 w-full rounded-xl" />
            <div className="flex flex-col gap-2.5">
              <Skeleton className="h-3 w-full rounded-full" />
              <Skeleton className="h-3 w-full rounded-full" />
              <Skeleton className="h-3 w-full rounded-full" />
            </div>
            <Skeleton className="h-20 w-full rounded-xl" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
