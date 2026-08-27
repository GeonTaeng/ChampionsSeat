import { NextResponse } from 'next/server'
import { generateAiSeatReason, type AiSeatReasonInput } from '@/lib/gemini'

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { items: AiSeatReasonInput[] }
    if (!body || !Array.isArray(body.items)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    // 병렬로 TOP 3 좌석의 AI 추천 사유 생성
    const aiResults = await Promise.allSettled(
      body.items.map((item) => generateAiSeatReason(item)),
    )

    const results = aiResults.map((res) => {
      if (res.status === 'fulfilled') {
        return res.value
      } else {
        return null
      }
    })

    return NextResponse.json({ results })
  } catch (error) {
    console.error('[API Route Error /api/ai-reason]:', error)
    return NextResponse.json(
      { error: 'AI reason generation failed' },
      { status: 500 },
    )
  }
}
