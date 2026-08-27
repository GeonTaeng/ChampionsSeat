'use client'

import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AlertCircle, RotateCw } from 'lucide-react'

export function ErrorState({
  failCount,
  onRetry,
}: {
  failCount: number
  onRetry: () => void
}) {
  const isMultipleFails = failCount >= 2
  const message = isMultipleFails
    ? '일시적인 문제가 계속되고 있어요. 잠시 후 다시 시도해주세요.'
    : '좌석 추천을 불러오지 못했어요. 다시 시도해주세요.'

  return (
    <div className="flex flex-col gap-4 animate-in fade-in-50 duration-300">
      <Alert variant="destructive" className="border-destructive/40 bg-destructive/5 p-5">
        <AlertCircle className="size-5" />
        <AlertTitle className="text-base font-bold">{message}</AlertTitle>
        <AlertDescription className="mt-2.5 flex flex-col gap-4 text-sm">
          <p className="text-muted-foreground text-xs">
            {isMultipleFails
              ? '네트워크 상태를 확인하시거나 잠시 후에 다시 시도해 주세요. 입력하신 조건은 안전하게 유지됩니다.'
              : '추천 연산 중 오류가 발생했습니다. 입력하신 조건은 그대로 유지되니 다시 시도해 보세요.'}
          </p>
          <div>
            <Button
              type="button"
              variant="outline"
              size="default"
              onClick={onRetry}
              className="cursor-pointer font-bold border-destructive/40 hover:bg-destructive/10"
            >
              <RotateCw data-icon="inline-start" className="size-4" />
              다시 시도
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  )
}
