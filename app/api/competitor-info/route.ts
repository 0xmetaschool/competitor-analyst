import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  console.log('\n📊 [Competitor Info API] Starting Analysis');
  console.time('competitor-info-api');

  try {
    const { companyInfo, competitorName } = await req.json()
    console.log(`📍 [Competitor Info API] Analyzing competitor: ${competitorName}`);

    if (!companyInfo || !competitorName) {
      console.error('❌ [Competitor Info API] Error: Company information and competitor name are required');
      return NextResponse.json(
        { error: 'Company information and competitor name are required' },
        { status: 400 }
      )
    }

    const prompt = `Based on this company information:
    ${JSON.stringify(companyInfo, null, 2)}
    
    Provide a concise analysis of the competitor "${competitorName}".
    Format the response as a JSON object with the following structure:
    {
      "competitor": {
        "name": "${competitorName}",
        "description": "Brief 20-30 word description of the competitor",
        "industry": "Main industry",
        "location": "Headquarters location",
        "employees": "Employee count range",
        "foundingYear": "Year founded",
        "companyType": "Type of company"
      }
    }
    
    Important: Keep the description between 20-30 words, focusing on the most important aspects of the competitor.
    Example description format: "Leading cloud computing provider known for AWS services, offering a wide range of technology solutions to businesses globally."
    `

    console.log('🤖 [Competitor Info API] Sending request to OpenAI');
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4-1106-preview",
      response_format: { type: "json_object" },
    });

    if (!completion.choices[0]?.message?.content) {
      console.error('❌ [Competitor Info API] Error: No response from OpenAI');
      throw new Error('No response from OpenAI');
    }

    const data = JSON.parse(completion.choices[0].message.content);
    
    // Validate response structure
    if (!data.competitor || !data.competitor.description) {
      console.error('❌ [Competitor Info API] Error: Invalid response structure from OpenAI');
      throw new Error('Invalid response structure from OpenAI');
    }

    // Validate description length
    const wordCount = data.competitor.description.split(/\s+/).length;
    if (wordCount < 20 || wordCount > 30) {
      console.warn(`⚠️ [Competitor Info API] Warning: Description length (${wordCount} words) outside desired range of 20-30 words`);
    }

    console.log(`✅ [Competitor Info API] Successfully received info for competitor: ${competitorName}`);
    console.timeEnd('competitor-info-api');
    return NextResponse.json(data);

  } catch (error) {
    console.error('❌ [Competitor Info API] Error:', error);
    console.timeEnd('competitor-info-api');
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get competitor info' },
      { status: 500 }
    );
  }
}
