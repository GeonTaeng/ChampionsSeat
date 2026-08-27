'use client'

export function AppFooter({ onCtaClick }: { onCtaClick?: () => void }) {
  return (
    <footer className="w-full bg-[#0c0f0f] border-t border-white/5 py-12 px-5 md:px-8">
      <div className="mx-auto max-w-[1200px] flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <span className="text-xl font-black text-white tracking-tighter uppercase">
            KIA Tigers Seat Scout
          </span>
          <p className="text-xs text-[#A0A0A0] mt-2">
            © 2026 KIA Tigers Seat Scout. Powered by Google Gemini AI. All rights reserved.
          </p>
        </div>

        <div className="flex flex-wrap gap-6 justify-center text-xs text-[#A0A0A0]">
          <span className="hover:text-white transition-colors cursor-pointer" onClick={onCtaClick}>
            좌석 추천 시작
          </span>
          <span className="hover:text-white transition-colors cursor-default">
            광주-기아 챔피언스 필드
          </span>
          <span className="hover:text-white transition-colors cursor-default">
            티켓링크 공식 가격표 연동
          </span>
          <span className="hover:text-white transition-colors cursor-default">
            개인정보 비수집 안전 서비스
          </span>
        </div>
      </div>
    </footer>
  )
}
