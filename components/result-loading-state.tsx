'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Loader2, Clock } from 'lucide-react'

export function ResultLoadingState() {
  const [slow, setSlow] = useState(false)

  useEffect(() => {
    // 8초 이상 지연 시 보조 메시지 노출
    const timer = setTimeout(() => setSlow(true), 8000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex flex-col gap-4" aria-busy="true" aria-live="polite">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Loader2 className="size-4 animate-spin text-primary" />
        추천 좌석 찾는 중...
      </div>

      {slow && (
        <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
          <Clock className="size-3.5" />
          예상보다 시간이 걸리고 있어요. 조금만 기다려주세요.
        </div>
      )}

      {[0, 1, 2].map((i) => (
        <Card key={i}>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-7 w-14 rounded-full" />
              <Skeleton className="h-5 w-24 rounded-full" />
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-40" />
            </div>
            <Skeleton className="h-9 w-48" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-1.5 w-full" />
              <Skeleton className="h-1.5 w-full" />
              <Skeleton className="h-1.5 w-full" />
            </div>
            <Skeleton className="h-16 w-full rounded-lg" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
