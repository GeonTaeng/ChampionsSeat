'use client'

import { Button } from '@/components/ui/button'
import { Sparkles, Compass } from 'lucide-react'

export function AppHeader({ onCtaClick }: { onCtaClick?: () => void }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#121414]/90 backdrop-blur-md shadow-md">
      <div className="mx-auto flex h-18 max-w-[1200px] items-center justify-between px-5 md:px-8">
        {/* 브랜드 로고 영역 (code.html 매칭) */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          className="flex items-center gap-2.5 font-black text-lg sm:text-xl text-white tracking-tight uppercase cursor-pointer"
        >
          <span className="flex size-8 items-center justify-center rounded-[4px] bg-[#C7012E] text-white font-black text-xs shadow-md">
            KIA
          </span>
          <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#ffb3b2]">
            Tigers Seat Scout
          </span>
        </a>

        {/* 데스크톱 네비게이션 & CTA (code.html 매칭) */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="hidden md:flex items-center space-x-6 text-xs uppercase font-bold tracking-wider text-[#e2e2e2]">
            <span className="text-[#A0A0A0] hover:text-white transition-colors cursor-default">
              2026 티켓링크 공식 기준
            </span>
            <span className="text-[#A0A0A0] hover:text-white transition-colors cursor-default">
              Gemini 3.6 Flash 탑재
            </span>
          </div>

          {onCtaClick && (
            <button
              type="button"
              onClick={onCtaClick}
              className="cursor-pointer bg-[#C7012E] hover:bg-[#A50126] text-white text-xs sm:text-sm font-bold uppercase px-5 sm:px-6 py-2.5 rounded-[4px] transition-all duration-300 transform active:scale-95 shadow-[0_0_15px_rgba(199,1,46,0.4)] border border-white/10 flex items-center gap-1.5"
            >
              <Sparkles className="size-3.5" />
              <span>Start Scout</span>
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
