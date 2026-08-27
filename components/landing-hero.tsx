'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Sparkles,
  ArrowRight,
  Calculator,
  Target,
  Eye,
  CheckCircle,
  Flame,
} from 'lucide-react'

export function LandingHero({
  onStartRecommendation,
}: {
  onStartRecommendation: () => void
}) {
  return (
    <div className="w-full bg-[#121414] text-[#e2e2e2]">
      {/* 1. Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-16 pb-20 overflow-hidden border-b border-white/5">
        {/* 야구장 나이트 경기 배경 이미지 + 오버레이 */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30 scale-105 transition-transform duration-1000"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBWVAGZcP0QLHZXJVx7vr_uGeMxPrkwOI63JTVkED1DXp8CPeVxO8B73_jBjDD7I3_ehIuxs9HRqDS2MjvArLISix60oWu3Rj1AowAJGELX4MO7Bx9dsvqU4Z0UQ5x5wP4Zwf-cFSoJY-ajZHGaV5a1dDQlAUBlOcVWL8eof01gnI18fKWlvzwPqn8U8EdCpFuWQIF1eZNwvfme6dNAWrZsvuQ6Z4vQHItPCmgCtMrN4gvN4ZIWEPY6')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#121414]/70 via-[#121414]/90 to-[#121414]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(199,1,46,0.22)_0%,rgba(18,20,20,0)_70%)]" />
        </div>

        <div className="relative z-10 text-center px-5 md:px-8 max-w-5xl mx-auto flex flex-col items-center">
          {/* 상단 뱃지 */}
          <div className="inline-flex items-center gap-2 py-1.5 px-4 border border-[#C7012E]/40 rounded-full text-[#ffb3b2] text-xs font-bold mb-6 tracking-widest bg-[#C7012E]/15 backdrop-blur-md shadow-sm">
            <Flame className="size-3.5 text-[#C7012E]" />
            <span>OFFICIAL FAN CONCIERGE</span>
            <span className="text-white/30">|</span>
            <span className="text-white/90">KIA 챔피언스 필드 AI 좌석 스카우트</span>
          </div>

          {/* 메인 헤드라인 */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tight drop-shadow-2xl">
            당신의 완벽한 직관을 위한
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffb3b2] via-[#C7012E] to-[#e60035]">
              단 하나의 스카우트
            </span>
          </h1>

          {/* 서브 설명 */}
          <p className="text-base sm:text-lg md:text-xl text-[#e5bdbc]/90 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            예산, 인원, 선호도만 입력하면 AI가 찾아주는 챔피언스 필드 최적의 좌석 TOP 3.
            <br className="hidden sm:inline" />
            복잡한 예매 전쟁에서 벗어나 당신만의 명당을 확보하세요.
          </p>

          {/* 대형 CTA 버튼 */}
          <button
            type="button"
            onClick={onStartRecommendation}
            className="cursor-pointer bg-[#C7012E] hover:bg-[#A50126] text-white text-lg sm:text-xl md:text-2xl font-bold uppercase px-10 py-5 rounded-[6px] transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-[0_0_35px_rgba(199,1,46,0.6)] flex items-center gap-3 group border border-white/10"
          >
            <span>내 좌석 찾으러 가기</span>
            <ArrowRight className="size-6 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </section>

      {/* 2. Why Seat Scout? Section */}
      <section className="py-20 md:py-28 px-5 md:px-8 relative bg-[#0c0f0f] border-b border-white/5">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
              Why Seat Scout?
            </h2>
            <div className="w-24 h-1 bg-[#C7012E] mx-auto rounded-full" />
            <p className="mt-4 text-sm md:text-base text-[#A0A0A0]">
              직관 팬의 고민을 해결하기 위한 3가지 전술적 혁신
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Feature 1 */}
            <div className="bg-[#1a1c1c] p-8 rounded-[6px] border border-white/5 hover:border-[#C7012E]/50 hover:shadow-[0_0_25px_rgba(199,1,46,0.25)] transition-all duration-300 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#C7012E]/5 rounded-bl-full -z-0 group-hover:bg-[#C7012E]/10 transition-colors" />
              <div className="relative z-10">
                <div className="flex size-14 items-center justify-center rounded-[6px] bg-[#C7012E]/15 text-[#ffb3b2] mb-6">
                  <Calculator className="size-7 text-[#ffb3b2]" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">정확한 가격</h3>
                <p className="text-sm md:text-base text-[#A0A0A0] leading-relaxed">
                  평일/주말 및 티켓링크 14개 대표 구역 가격표를 실시간 반영하여 숨겨진 오차 없이 100% 정확한 총 예상 금액을 계산합니다.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#1a1c1c] p-8 rounded-[6px] border border-white/5 hover:border-[#C7012E]/50 hover:shadow-[0_0_25px_rgba(199,1,46,0.25)] transition-all duration-300 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#C7012E]/5 rounded-bl-full -z-0 group-hover:bg-[#C7012E]/10 transition-colors" />
              <div className="relative z-10">
                <div className="flex size-14 items-center justify-center rounded-[6px] bg-[#C7012E]/15 text-[#ffb3b2] mb-6">
                  <Target className="size-7 text-[#ffb3b2]" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">맞춤형 추천</h3>
                <p className="text-sm md:text-base text-[#A0A0A0] leading-relaxed">
                  응원팀(3루 홈/1루 원정), 선호하는 관람 스타일(시야 집중/열띤 응원/편의시설)을 AI가 정밀 분석하여 맞춤형 좌석 랭킹을 제공합니다.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#1a1c1c] p-8 rounded-[6px] border border-white/5 hover:border-[#C7012E]/50 hover:shadow-[0_0_25px_rgba(199,1,46,0.25)] transition-all duration-300 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#C7012E]/5 rounded-bl-full -z-0 group-hover:bg-[#C7012E]/10 transition-colors" />
              <div className="relative z-10">
                <div className="flex size-14 items-center justify-center rounded-[6px] bg-[#C7012E]/15 text-[#ffb3b2] mb-6">
                  <Eye className="size-7 text-[#ffb3b2]" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">시각적 확신</h3>
                <p className="text-sm md:text-base text-[#A0A0A0] leading-relaxed">
                  단순한 좌석표가 아닙니다. Gemini AI의 실시간 맞춤 해설과 직관 꿀팁(그늘 방향, 파울볼, 먹거리 팁)을 통해 실패 없는 예매를 도와드립니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. How it Works Section */}
      <section className="py-20 md:py-28 px-5 md:px-8 bg-[#121414] relative border-b border-white/5">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
            {/* 좌측 단계 설명 */}
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight tracking-tight">
                단 3단계,
                <br />
                완벽한 좌석을 찾는 법
              </h2>
              <p className="text-sm md:text-base text-[#A0A0A0] mb-8">
                복잡한 블록 배치도 대신, 몇 번의 터치로 원하는 자리를 찾아보세요.
              </p>

              <div className="space-y-6">
                {/* Step 1 */}
                <div className="flex gap-5 items-start p-4 rounded-[6px] bg-[#1a1c1c] border border-white/10">
                  <div className="w-11 h-11 rounded-full bg-[#C7012E] flex items-center justify-center font-black text-white shrink-0 shadow-[0_0_15px_rgba(199,1,46,0.5)]">
                    1
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">조건 입력</h4>
                    <p className="text-sm text-[#A0A0A0]">
                      응원팀, 방문일, 인원, 예산, 선호하는 관람 스타일을 선택합니다.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-5 items-start p-4 rounded-[6px] bg-[#1a1c1c] border border-white/5 hover:border-white/10 transition-colors">
                  <div className="w-11 h-11 rounded-full border border-[#ffb3b2] text-[#ffb3b2] flex items-center justify-center font-bold shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">AI 분석 및 추천</h4>
                    <p className="text-sm text-[#A0A0A0]">
                      14개 대표 구역 데이터를 바탕으로 최적의 블록 TOP 3를 제안합니다.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-5 items-start p-4 rounded-[6px] bg-[#1a1c1c] border border-white/5 hover:border-white/10 transition-colors">
                  <div className="w-11 h-11 rounded-full border border-[#ffb3b2] text-[#ffb3b2] flex items-center justify-center font-bold shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">시야 확인 및 결정</h4>
                    <p className="text-sm text-[#A0A0A0]">
                      추천받은 좌석의 Gemini AI 전술 꿀팁을 확인하고 예매를 준비합니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 우측 3D 인터랙티브 프리뷰 대시보드 카드 */}
            <div className="w-full md:w-1/2 relative h-[460px] bg-[#1a1c1c] rounded-[8px] border border-white/10 overflow-hidden flex items-center justify-center shadow-2xl">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-70 mix-blend-luminosity"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAbBxOe-GjExF4nWjQMHlvq6gNP0AnyeBzrK1okGk77Ud8SYcC9oUQHprAi6Yo5t6vaml9Pqv7Dz09-EAZpDv4HqDB7H_Fusnx9W6oehxRU4Hb-KAV9ScO-qdD3mrRYhmKvVBBL8bxLzfN5yGD8GQXMOmqfPoNRa6gcm35XXM1cPVWcBKa5NOgGe9IzEGlx801xt7zl3kOc0cajo3jq_80zHbrlzKUqO7I4tBftIhJWU6sJTye4iHMc')",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121414] via-transparent to-transparent" />

              {/* 실시간 큐레이션 오버레이 패널 */}
              <div className="absolute bottom-6 left-6 right-6 bg-[#1a1c1c]/95 backdrop-blur-md border border-white/10 p-5 rounded-[6px] shadow-2xl">
                <div className="flex justify-between items-center mb-2.5">
                  <span className="text-[#ffb3b2] text-xs font-bold uppercase tracking-wider">
                    Selected Zone
                  </span>
                  <span className="text-white font-bold text-sm">K9석 3루 118블록</span>
                </div>
                <div className="h-2 bg-[#333535] rounded-full overflow-hidden">
                  <div className="h-full bg-[#C7012E] w-[96%]" />
                </div>
                <div className="mt-2.5 flex justify-between items-center text-xs">
                  <span className="text-[#00E676] font-semibold">● 응원단상 바로 앞 최적 뷰</span>
                  <span className="text-[#ffb3b2] font-bold">96% Match Rate</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Secondary CTA Banner */}
      <section className="py-20 px-5 md:px-8 bg-[#0c0f0f] relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(199,1,46,0.18)_0%,rgba(12,15,15,0)_70%)]" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            준비되셨나요?
            <br />
            지금 바로 최고의 명당을 찾아보세요.
          </h2>
          <p className="text-base text-[#A0A0A0] max-w-xl mx-auto mb-8">
            별도의 회원가입 없이 바로 챔피언스 필드 맞춤 추천을 시작할 수 있습니다.
          </p>
          <button
            type="button"
            onClick={onStartRecommendation}
            className="cursor-pointer bg-[#C7012E] hover:bg-[#A50126] text-white text-lg sm:text-xl font-bold uppercase px-12 py-5 rounded-[6px] transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-[0_0_35px_rgba(199,1,46,0.5)] border border-white/10"
          >
            스카우트 시작하기
          </button>
        </div>
      </section>
    </div>
  )
}
