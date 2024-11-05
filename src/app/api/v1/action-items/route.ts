import { NextResponse } from 'next/server'
import OpenAI from 'openai'

// Type definition for the expected response structure
type DocumentSummary = {
  title: string;
  summary: string;
  participants?: string[];
  date?: string;
  duration?: string;
  keyPoints: string[];
  actionItems: string[];
  nextSteps?: string[];
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://api.x.ai/v1",
})

/*
Example curl request:

curl -X POST http://localhost:3000/api/v1/action-items \
-H "Content-Type: application/json" \
-d '{
  "prompt": "Meeting transcript or document content to analyze"
}'

Response format:
{
  "result": {
    "title": "Brief title or subject",
    "summary": "Concise summary of the main discussion points",
    "participants": ["List of participants"],
    "date": "Meeting date",
    "duration": "Meeting duration", 
    "keyPoints": ["Key discussion points"],
    "actionItems": ["Action items and tasks"],
    "nextSteps": ["Follow-up items"]
  }
}
*/

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { message: 'Prompt is required' },
        { status: 400 }
      )
    }

    const completion = await openai.chat.completions.create({
      model: "grok-beta",
      messages: [
        {
          role: "system",
          content: `You are an AI assistant that analyzes documents and meeting transcripts.
Extract and return a JSON object with the following structure:
{
  "title": "Brief title or subject",
  "summary": "Concise summary of the main discussion points",
  "participants": ["List of participants"] (if applicable),
  "date": "Meeting date" (if applicable),
  "duration": "Meeting duration" (if applicable),
  "keyPoints": ["Array of key discussion points"],
  "actionItems": ["Array of specific action items and tasks"],
  "nextSteps": ["Array of follow-up items and next steps"]
}
Ensure all arrays contain clear, actionable items when applicable.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
    })

    const result = completion.choices[0].message.content;
    console.log('Generated summary:', result)

    return NextResponse.json({ "result": result })

  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json(
      { message: 'Failed to analyze document and generate summary' },
      { status: 500 }
    )
  }
}
