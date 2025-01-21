import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  console.log('\n🔍 [Competitor Names API] Starting Analysis');
  console.time('competitor-names-api');

  try {
    const { companyInfo } = await req.json()
    console.log(`📍 [Competitor Names API] Finding competitors for: ${companyInfo?.name || 'Unknown Company'}`);

    if (!companyInfo) {
      console.error('❌ [Competitor Names API] Error: Company information is required');
      return NextResponse.json(
        { error: 'Company information is required' },
        { status: 400 }
      )
    }

    const prompt = `Based on this company information:
    ${JSON.stringify(companyInfo, null, 2)}
    
    List the top 5 competitors names only.
    Format the response as a JSON object with the following structure:
    {
      "competitors": [
        {
          "name": ""
        }
      ]
    }`

    console.log('🤖 [Competitor Names API] Sending request to OpenAI');
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4-1106-preview",
      response_format: { type: "json_object" },
    });

    if (!completion.choices[0]?.message?.content) {
      console.error('❌ [Competitor Names API] Error: No response from OpenAI');
      throw new Error('No response from OpenAI');
    }

    const data = JSON.parse(completion.choices[0].message.content);
    console.log('✅ [Competitor Names API] Successfully received competitor names:', 
      data.competitors.map((c: { name: string }) => c.name).join(', '));
    console.timeEnd('competitor-names-api');
    return NextResponse.json(data);

  } catch (error) {
    console.error('❌ [Competitor Names API] Error:', error);
    console.timeEnd('competitor-names-api');
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get competitor names' },
      { status: 500 }
    );
  }
}
