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
    <Empty className="min-h-72 border border-dashed border-border bg-card/40">
      <EmptyHeader>
        <EmptyMedia variant="icon" className="size-12 bg-muted text-muted-foreground">
          <SearchX className="size-6" />
        </EmptyMedia>
        <EmptyTitle className="text-base">
          조건에 맞는 좌석 정보가 없어요
        </EmptyTitle>
        <EmptyDescription>
          현재 조건에 대한 좌석 정보를 찾을 수 없어요.
          <br />
          다른 조건으로 다시 시도해주세요.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
