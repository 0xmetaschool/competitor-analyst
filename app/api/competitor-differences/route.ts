import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  console.log('\n⚖️ [Competitor Differences API] Starting Analysis');
  console.time('competitor-differences-api');

  try {
    const { companyInfo, competitorInfo } = await req.json()
    console.log(`📍 [Competitor Differences API] Analyzing differences between ${companyInfo?.name || 'Company'} and ${competitorInfo?.name || 'Competitor'}`);

    if (!companyInfo || !competitorInfo) {
      console.error('❌ [Competitor Differences API] Error: Company and competitor information are required');
      return NextResponse.json(
        { error: 'Company and competitor information are required' },
        { status: 400 }
      )
    }

    const prompt = `Compare these two companies:
    
    Company: ${JSON.stringify(companyInfo, null, 2)}
    
    Competitor: ${JSON.stringify(competitorInfo, null, 2)}
    
    List exactly 3 key differences between them.
    Format the response as a JSON object with the following structure:
    {
      "differences": {
        "name": "${competitorInfo.name}",
        "differencesList": [
          "First key difference (10-15 words)",
          "Second key difference (10-15 words)",
          "Third key difference (10-15 words)"
        ]
      }
    }

    Important guidelines:
    1. Provide EXACTLY 3 differences
    2. Each difference should be 10-15 words long
    3. Focus on the most significant differences
    4. Keep each point clear and specific

    Example difference format:
    "Company focuses on enterprise cloud solutions while competitor specializes in consumer mobile applications."
    `

    console.log('🤖 [Competitor Differences API] Sending request to OpenAI');
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4-1106-preview",
      response_format: { type: "json_object" },
    });

    if (!completion.choices[0]?.message?.content) {
      console.error('❌ [Competitor Differences API] Error: No response from OpenAI');
      throw new Error('No response from OpenAI');
    }

    const data = JSON.parse(completion.choices[0].message.content);
    
    // Validate response structure
    if (!data.differences || !Array.isArray(data.differences.differencesList)) {
      console.error('❌ [Competitor Differences API] Error: Invalid response structure from OpenAI');
      throw new Error('Invalid response structure from OpenAI');
    }

    // Validate number of differences
    if (data.differences.differencesList.length !== 3) {
      console.error('❌ [Competitor Differences API] Error: Expected exactly 3 differences');
      throw new Error('Expected exactly 3 differences');
    }

    // Validate difference lengths
    data.differences.differencesList.forEach((diff: string, index: number) => {
      const wordCount = diff.split(/\s+/).length;
      if (wordCount < 10 || wordCount > 15) {
        console.warn(`⚠️ [Competitor Differences API] Warning: Difference ${index + 1} length (${wordCount} words) outside desired range of 10-15 words`);
      }
    });

    console.log(`✅ [Competitor Differences API] Successfully analyzed differences for competitor: ${competitorInfo.name}`);
    console.log(`📊 [Competitor Differences API] Generated ${data.differences.differencesList.length} key differences`);
    console.timeEnd('competitor-differences-api');
    
    return NextResponse.json({
      differences: {
        name: competitorInfo.name,
        differencesList: data.differences.differencesList
      }
    });

  } catch (error) {
    console.error('❌ [Competitor Differences API] Error:', error);
    console.timeEnd('competitor-differences-api');
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to analyze competitor differences' },
      { status: 500 }
    );
  }
}
