'use client'

import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { TriangleAlert, RotateCw } from 'lucide-react'

export function ErrorState({
  failCount,
  onRetry,
}: {
  failCount: number
  onRetry: () => void
}) {
  const message =
    failCount >= 2
      ? '일시적인 문제가 계속되고 있어요. 잠시 후 다시 시도해주세요.'
      : '좌석 추천을 불러오지 못했어요. 다시 시도해주세요.'

  return (
    <Alert variant="destructive" className="border-destructive/30">
      <TriangleAlert />
      <AlertTitle className="text-base">{message}</AlertTitle>
      <AlertDescription className="mt-1 flex flex-col gap-3">
        <p>입력하신 조건은 그대로 유지돼요.</p>
        <div>
          <Button variant="outline" size="sm" onClick={onRetry}>
            <RotateCw data-icon="inline-start" />
            다시 시도
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )
}
