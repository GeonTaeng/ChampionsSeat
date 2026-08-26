'use client'

import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/recommend'
import { Wallet } from 'lucide-react'

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
    <Alert className="border-primary/30 bg-accent">
      <Wallet className="text-primary" />
      <AlertTitle className="text-base">
        입력하신 예산으로는 조건에 맞는 좌석이 없어요.
      </AlertTitle>
      <AlertDescription className="mt-1 flex flex-col gap-3">
        <p className="text-foreground">
          현재 조건에서는{' '}
          <span className="tnum font-bold text-primary">
            최소 {formatCurrency(minTotal)}원
          </span>
          부터 예매할 수 있어요.
          <br />
          <span className="text-muted-foreground">
            ({minZoneName} 기준 예상 총금액)
          </span>
        </p>
        <div>
          <Button variant="outline" size="sm" onClick={onReenter}>
            예산 다시 입력하기
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )
}
