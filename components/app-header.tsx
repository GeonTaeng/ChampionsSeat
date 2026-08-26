import { Badge } from '@/components/ui/badge'
import { Info, Sparkles } from 'lucide-react'

export function AppHeader() {
  return (
    <header className="relative overflow-hidden bg-navy text-navy-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(circle at 15% 20%, color-mix(in oklab, var(--primary) 45%, transparent), transparent 45%), radial-gradient(circle at 90% 0%, color-mix(in oklab, var(--field) 30%, transparent), transparent 40%)',
        }}
      />
      <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-5 px-5 py-10 md:px-8 md:py-14">
        <div className="flex items-start justify-between gap-4">
          <Badge className="gap-1 bg-primary text-primary-foreground">
            <Sparkles className="size-3" />
            KIA 챔피언스 필드
          </Badge>
          <Badge
            variant="outline"
            className="gap-1 border-navy-foreground/25 text-navy-foreground/80"
          >
            <Info className="size-3" />
            예매 사이트 아님 · 참고용 추천
          </Badge>
        </div>

        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-black tracking-tight text-balance md:text-4xl">
            오늘 어디 앉지? <span className="text-primary">3초 만에</span> 정해드려요
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-navy-foreground/75 md:text-base">
            응원팀·예산·취향만 고르면 오늘 앉을 자리를 정해드려요. 복잡한 좌석표를
            안 봐도 챔피언스 필드에서 나에게 맞는 좌석 TOP 3를 바로 확인하세요.
          </p>
        </div>
      </div>
    </header>
  )
}
