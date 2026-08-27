import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty'
import { Ticket, Sparkles } from 'lucide-react'

export function ResultEmptyState() {
  return (
    <Empty className="min-h-80 rounded-[4px] border border-dashed border-white/10 bg-[#1a1c1c]/60 glass-panel p-8">
      <EmptyHeader>
        <EmptyMedia variant="icon" className="size-14 rounded-[4px] bg-[#C7012E]/15 text-[#C7012E] border border-[#C7012E]/30">
          <Ticket className="size-7" />
        </EmptyMedia>
        <EmptyTitle className="text-lg font-bold text-white mt-3">
          아직 추천 좌석이 생성되지 않았어요
        </EmptyTitle>
        <EmptyDescription className="text-xs text-[#A0A0A0] leading-relaxed mt-1">
          왼쪽에서 응원팀, 방문일, 인원, 예산, 선호도를 선택하고
          <br />
          <strong className="text-white">{'[조건으로 좌석 추천받기]'}</strong>를 누르면 100% 공식 기준 최적 TOP 3를 큐레이션합니다.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
