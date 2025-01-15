import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { domain } = await req.json()

    const prompt = `Analyze the company with domain ${domain}. Provide a detailed analysis including:
    1. Company introduction (punchline, industry sector, location, employee count, founding year, company type, tagline, and specialties)
    2. Top 5 competitors with descriptions and key differences

    Format the response as a JSON object with the following structure:
    {
      "companyInfo": {
        "name": "",
        "punchline": "",
        "website": "",
        "industry": "",
        "location": "",
        "employees": "",
        "foundingYear": "",
        "companyType": "",
        "tagline": "",
        "specialties": []
      },
      "competitors": [
        {
          "name": "",
          "description": "",
          "differences": []
        }
      ]
    }`

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4-1106-preview",
      response_format: { type: "json_object" },
    })

    const analysisData = JSON.parse(completion.choices[0].message.content)
    return NextResponse.json(analysisData)
    
  } catch (error) {
    console.error('Error in analysis:', error)
    return NextResponse.json(
      { error: 'Failed to analyze company' },
      { status: 500 }
    )
  }
}
