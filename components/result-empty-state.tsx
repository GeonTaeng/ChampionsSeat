import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty'
import { Ticket } from 'lucide-react'

export function ResultEmptyState() {
  return (
    <Empty className="min-h-80 border border-dashed border-border bg-card/40">
      <EmptyHeader>
        <EmptyMedia variant="icon" className="size-12 bg-primary/10 text-primary">
          <Ticket className="size-6" />
        </EmptyMedia>
        <EmptyTitle className="text-base">
          아직 추천 좌석이 없어요
        </EmptyTitle>
        <EmptyDescription>
          왼쪽에서 응원팀·예산·취향을 고르고
          <br />
          {'"좌석 추천받기"'}를 누르면 오늘 앉기 좋은 자리를 알려드려요.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
