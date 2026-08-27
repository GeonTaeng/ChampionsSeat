import { GoogleGenAI } from '@google/genai'

const apiKey = process.env.GEMINI_API_KEY || ''

export const ai = new GoogleGenAI({
  apiKey: apiKey,
})

export type AiSeatReasonInput = {
  zoneName: string
  blockName: string
  cheerTeam: 'home' | 'away'
  visitDayType: 'weekday' | 'weekend'
  partySize: number
  totalPrice: number
  unitPrice: number
  prefCheer: number
  prefView: number
  prefComfort: number
  features: string[]
}

/**
 * Gemini AI를 활용하여 야구 직관 팬을 위한 생생하고 전문적인 맞춤 추천 사유 및 꿀팁 생성
 */
export async function generateAiSeatReason(input: AiSeatReasonInput): Promise<{
  aiReason: string
  matchTip: string
}> {
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured')
  }

  const teamName = input.cheerTeam === 'home' ? 'KIA 타이거즈(홈팀)' : '원정팀'
  const dayName = input.visitDayType === 'weekend' ? '주말/공휴일' : '평일'

  const prompt = `
당신은 대한민국 최고의 야구장 직관 가이드이자 KIA 챔피언스 필드 좌석 전문가입니다.
사용자의 직관 조건과 추천된 좌석 정보를 바탕으로, 야구 팬의 가슴을 뛰게 하는 친절하고 생생한 맞춤형 추천 사유(1~2문장)와 직관 꿀팁(1문장)을 작성해주세요.

[사용자 입력 조건]
- 응원팀: ${teamName}
- 방문일: ${dayName}
- 인원: ${input.partySize}명
- 응원 선호도 (0~5점): ${input.prefCheer}점
- 시야 선호도 (0~5점): ${input.prefView}점
- 편의 선호도 (0~5점): ${input.prefComfort}점

[추천 좌석 정보]
- 구역: ${input.zoneName} (${input.blockName})
- 1석당 가격: ${input.unitPrice.toLocaleString('ko-KR')}원
- ${input.partySize}명 총 예상금액: ${input.totalPrice.toLocaleString('ko-KR')}원
- 특징: ${input.features.join(', ')}

[작성 규칙]
1. 친근하고 전문적인 어조 (~해요, ~추천드려요)
2. 사용자의 가장 높은 선호도 항목과 응원팀 특성을 자연스럽게 녹여낼 것
3. JSON 형식으로만 반환할 것 (마크다운 백틱 없이):
{"aiReason": "추천 사유 1~2문장", "matchTip": "해당 좌석 관람 꿀팁 1문장"}
`

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    })

    const text = response.text || ''
    const parsed = JSON.parse(text)
    return {
      aiReason: parsed.aiReason || '조건에 최적화된 추천 좌석입니다.',
      matchTip: parsed.matchTip || '즐거운 직관 되세요!',
    }
  } catch (error) {
    console.error('[Gemini AI API Error]:', error)
    throw error
  }
}
