import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { domain } = await req.json()

    if (!domain) {
      return NextResponse.json(
        { error: 'Domain is required' },
        { status: 400 }
      )
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      )
    }

    const prompt1 = `Analyze the company with domain ${domain}. Provide a detailed analysis including Company introduction (punchline, industry sector, location, employee count, founding year, company type, tagline, and specialties)

    Format the response as a JSON object with the following structure:
    {
      "companyInfo": {
        "name": "",
        "punchline": "",
        "website": "${domain}",
        "industry": "",
        "location": "",
        "employees": "",
        "foundingYear": "",
        "companyType": "",
        "tagline": "",
        "specialties": []
      }
    }`

    try {
      console.log('Starting company analysis for domain:', domain);

      // First completion for company info
      const companyCompletion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt1 }],
        model: "gpt-4-1106-preview",
        response_format: { type: "json_object" },
      });

      if (!companyCompletion.choices[0]?.message?.content) {
        throw new Error('No response from OpenAI for company analysis');
      }

      const companyData = JSON.parse(companyCompletion.choices[0].message.content);
      console.log('Company data received:', companyData);

      // Only proceed with competitors analysis after company data is processed
      if (companyData.companyInfo) {
        console.log('Starting competitors names analysis');
        
        // Prompt 2: Get competitor names
        const prompt2 = `Based on the following company information:
        ${JSON.stringify(companyData.companyInfo, null, 2)}
        
        Analyze and provide the top 5 competitors names only.

        Format the response as a JSON object with the following structure:
        {
          "competitors": [
            {
              "name": ""
            }
          ]
        }`

        const competitorsNamesCompletion = await openai.chat.completions.create({
          messages: [{ role: "user", content: prompt2 }],
          model: "gpt-4-1106-preview",
          response_format: { type: "json_object" },
        });

        if (!competitorsNamesCompletion.choices[0]?.message?.content) {
          throw new Error('No response from OpenAI for competitors names');
        }

        const competitorsNamesData = JSON.parse(competitorsNamesCompletion.choices[0].message.content);
        console.log('Competitors names received:', competitorsNamesData);

        // Array to store detailed competitor information
        const detailedCompetitors = [];

        // Process each competitor sequentially
        for (const competitor of competitorsNamesData.competitors) {
          console.log(`Analyzing competitor: ${competitor.name}`);

          const promptDetail = `Based on the following company information:
          ${JSON.stringify(companyData.companyInfo, null, 2)}
          
          Analyze and provide detailed description and key differences for the competitor "${competitor.name}".
          Focus on what makes them different from ${companyData.companyInfo.name || 'our company'}.

          Format the response as a JSON object with the following structure:
          {
            "competitor": {
              "name": "${competitor.name}",
              "description": "",
              "differences": []
            }
          }`

          const competitorDetailCompletion = await openai.chat.completions.create({
            messages: [{ role: "user", content: promptDetail }],
            model: "gpt-4-1106-preview",
            response_format: { type: "json_object" },
          });

          if (!competitorDetailCompletion.choices[0]?.message?.content) {
            console.error(`Failed to get details for competitor: ${competitor.name}`);
            continue;
          }

          const competitorDetail = JSON.parse(competitorDetailCompletion.choices[0].message.content);
          detailedCompetitors.push(competitorDetail.competitor);
          console.log(`Completed analysis for competitor: ${competitor.name}`);
        }

        // Combine all responses
        const combinedResponse = {
          companyInfo: companyData.companyInfo,
          competitors: detailedCompetitors
        };

        return NextResponse.json(combinedResponse);
      } else {
        throw new Error('Company information not found in the response');
      }

    } catch (error) {
      console.error('Error in analysis:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to analyze company' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in analysis:', error)
    return NextResponse.json(
      { error: 'Failed to analyze company' },
      { status: 500 }
    )
  }
}
