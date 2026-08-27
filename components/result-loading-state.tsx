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
      <div className="flex items-center gap-2 text-sm font-bold text-[#C7012E]">
        <Loader2 className="size-4 animate-spin text-[#C7012E]" />
        <span>조건에 맞는 최적 좌석을 정밀 분석하고 있어요...</span>
      </div>

      {slow && (
        <div className="flex items-center gap-2 rounded-[4px] bg-[#C7012E]/10 border border-[#C7012E]/30 p-3.5 text-xs font-medium text-white animate-in fade-in-50">
          <Clock className="size-4 shrink-0 text-[#C7012E]" />
          <span>예상보다 시간이 걸리고 있어요. 잠시만 기다려주세요.</span>
        </div>
      )}

      {[0, 1, 2].map((i) => (
        <Card key={i} className="glass-panel rounded-[4px] border-white/10 bg-[#1a1c1c]/90">
          <CardContent className="flex flex-col gap-4 p-5">
            <div className="flex items-center justify-between">
              <Skeleton className="h-7 w-16 rounded-[4px] bg-white/10" />
              <Skeleton className="h-5 w-24 rounded-[4px] bg-white/10" />
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-6 w-40 rounded-[4px] bg-white/10" />
              <Skeleton className="h-4 w-48 rounded-[4px] bg-white/10" />
            </div>
            <Skeleton className="h-16 w-full rounded-[4px] bg-white/10" />
            <div className="flex flex-col gap-2.5">
              <Skeleton className="h-2 w-full rounded-[2px] bg-white/10" />
              <Skeleton className="h-2 w-full rounded-[2px] bg-white/10" />
              <Skeleton className="h-2 w-full rounded-[2px] bg-white/10" />
            </div>
            <Skeleton className="h-20 w-full rounded-[4px] bg-white/10" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
