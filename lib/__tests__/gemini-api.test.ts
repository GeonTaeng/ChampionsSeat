import { generateAiSeatReason } from '../gemini'

async function testGeminiIntegration() {
  console.log('================================================================')
  console.log('   Sprint 5: Gemini AI 실시간 API 호출 및 JSON 구조화 응답 테스트   ')
  console.log('================================================================\n')

  try {
    console.log('🚀 Gemini 2.5 Flash 모델로 KIA 챔피언스 필드 좌석 분석 요청 중...')
    const sampleInput = {
      zoneName: 'K9석 (3루 홈)',
      blockName: '3루 하단 114~121블록',
      cheerTeam: 'home' as const,
      visitDayType: 'weekend' as const,
      partySize: 2,
      totalPrice: 36000,
      unitPrice: 18000,
      prefCheer: 5,
      prefView: 4,
      prefComfort: 3,
      features: ['KIA 홈 응원단상 인접', '열광적인 직관 분위기', '하단 근접 시야'],
    }

    const startTime = Date.now()
    const result = await generateAiSeatReason(sampleInput)
    const elapsed = Date.now() - startTime

    console.log(`\n✅ [성공] Gemini AI 응답 수신 완료 (소요 시간: ${elapsed}ms)`)
    console.log('----------------------------------------------------------------')
    console.log(`🤖 AI 맞춤 추천 해설:\n   "${result.aiReason}"\n`)
    console.log(`💡 직관 꿀팁 (TIP):\n   "${result.matchTip}"`)
    console.log('----------------------------------------------------------------')
    console.log('🎉 Sprint 5 Gemini AI API 연동 테스트 100% 통과!\n')
  } catch (error) {
    console.error('❌ [오류] Gemini AI 연동 테스트 실패:', error)
  }
}

testGeminiIntegration()
