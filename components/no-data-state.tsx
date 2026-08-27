import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty'
import { SearchX } from 'lucide-react'

export function NoDataState() {
  return (
    <Empty className="min-h-72 border border-dashed border-border/80 bg-card/50 rounded-2xl p-6 animate-in fade-in-50 duration-300">
      <EmptyHeader className="max-w-md">
        <EmptyMedia variant="icon" className="size-14 bg-muted text-muted-foreground rounded-2xl">
          <SearchX className="size-7" />
        </EmptyMedia>
        <EmptyTitle className="text-base font-bold mt-2">
          조건에 일치하는 좌석 정보가 없어요
        </EmptyTitle>
        <EmptyDescription className="text-xs text-muted-foreground leading-relaxed mt-1">
          현재 조건에 대한 좌석 정보를 찾을 수 없어요.
          <br />
          선택하신 응원팀이나 관람 인원 등 다른 조건으로 다시 시도해주세요.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
