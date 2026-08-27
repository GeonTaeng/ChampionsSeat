'use client'

import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/recommend'
import { WalletCards, ArrowLeft, Info } from 'lucide-react'

export function BudgetOverState({
  minTotal,
  minZoneName,
  onReenter,
}: {
  minTotal: number
  minZoneName: string
  onReenter: () => void
}) {
  return (
    <div className="flex flex-col gap-4 animate-in fade-in-50 duration-300">
      <Alert className="border-amber-500/40 bg-amber-500/5 p-5">
        <WalletCards className="size-5 text-amber-600 dark:text-amber-400" />
        <AlertTitle className="text-base font-bold text-foreground">
          입력하신 예산으로는 조건에 맞는 좌석이 없어요.
        </AlertTitle>
        <AlertDescription className="mt-2.5 flex flex-col gap-4 text-sm">
          <div className="rounded-xl bg-card p-4 border border-border/80 shadow-xs">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground mb-1.5">
              <Info className="size-3.5" />
              <span>최소 필요 예산 가이드</span>
            </div>
            <p className="text-base font-medium text-foreground">
              최소{' '}
              <span className="tnum font-black text-primary text-lg">
                {formatCurrency(minTotal)}원
              </span>
              부터 예매 가능해요
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              ({minZoneName} 기준 예상 총금액)
            </p>
          </div>

          <div>
            <Button
              type="button"
              variant="default"
              size="default"
              onClick={onReenter}
              className="cursor-pointer font-bold shadow-xs"
            >
              <ArrowLeft data-icon="inline-start" className="size-4" />
              예산 다시 입력하기
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  )
}
