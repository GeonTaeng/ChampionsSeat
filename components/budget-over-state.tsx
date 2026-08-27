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
      <Alert className="glass-panel rounded-[4px] border-[#C7012E]/40 bg-[#1a1c1c] p-6 shadow-md">
        <WalletCards className="size-5 text-[#C7012E]" />
        <AlertTitle className="text-base font-bold text-white">
          입력하신 예산으로는 조건에 맞는 좌석이 없어요.
        </AlertTitle>
        <AlertDescription className="mt-3 flex flex-col gap-4 text-sm">
          <div className="rounded-[4px] bg-[#121414] p-4 border border-white/10">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#A0A0A0] mb-1.5">
              <Info className="size-3.5 text-[#C7012E]" />
              <span>최소 필요 예산 가이드</span>
            </div>
            <p className="text-base font-medium text-white">
              최소{' '}
              <span className="tnum font-black text-[#C7012E] text-lg">
                {formatCurrency(minTotal)}원
              </span>
              부터 예매 가능해요
            </p>
            <p className="text-xs text-[#A0A0A0] mt-1">
              ({minZoneName} 기준 예상 총금액)
            </p>
          </div>

          <div>
            <Button
              type="button"
              variant="default"
              size="default"
              onClick={onReenter}
              className="rounded-[4px] bg-[#C7012E] hover:bg-[#A50126] text-white font-bold cursor-pointer border border-white/10"
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
