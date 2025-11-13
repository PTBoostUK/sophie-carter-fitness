import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { currentText, instruction, fieldName, sectionName } = await request.json()

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured. Please set OPENAI_API_KEY in your environment variables.' },
        { status: 500 }
      )
    }

    if (!currentText || !instruction) {
      return NextResponse.json(
        { error: 'Missing required fields: currentText and instruction' },
        { status: 400 }
      )
    }

    // Create a context-aware prompt
    const contextPrompt = `You are helping to edit website content for a personal fitness trainer's website. 

Current ${fieldName || 'content'}: "${currentText}"

User instruction: "${instruction}"

Please provide an improved version of the content based on the user's instruction. Keep the same tone and style appropriate for a fitness trainer's website. Return only the revised text without any explanations, additional commentary, or quotation marks. Do not wrap the response in quotes.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a professional copywriter specializing in fitness and wellness content. You help improve website content while maintaining the brand voice and tone.',
        },
        {
          role: 'user',
          content: contextPrompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    let improvedText = completion.choices[0]?.message?.content?.trim()

    if (!improvedText) {
      return NextResponse.json(
        { error: 'No response from AI' },
        { status: 500 }
      )
    }

    // Remove leading and trailing quotation marks if present
    improvedText = improvedText.replace(/^["']+|["']+$/g, '')

    return NextResponse.json({ improvedText })
  } catch (error: any) {
    console.error('AI API error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process AI request' },
      { status: 500 }
    )
  }
}

