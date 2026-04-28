import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { articles, targetLanguage } = await req.json();

    if (!articles || !Array.isArray(articles) || articles.length === 0 || targetLanguage === "English") {
      return NextResponse.json({ success: true, articles });
    }

    const prompt = `You are a professional agricultural news translator. Translate the following news articles into ${targetLanguage}.
Ensure the tone is professional and suitable for farmers.
Return ONLY a JSON object with a key "translated_articles" which is an array of objects, each having "title" and "description" keys.

Articles to translate:
${JSON.stringify(articles.map(a => ({ title: a.title, description: a.description })))}`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: "json_object" },
        max_tokens: 2000,
        temperature: 0,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Error from Groq API");
    }

    const content = JSON.parse(data.choices[0].message.content);
    const translatedList = content.translated_articles;

    if (!translatedList || !Array.isArray(translatedList)) {
      throw new Error("Invalid response format from AI");
    }

    const finalArticles = articles.map((orig, i) => ({
      ...orig,
      title: translatedList[i]?.title || orig.title,
      description: translatedList[i]?.description || orig.description,
    }));

    return NextResponse.json({ success: true, articles: finalArticles });
  } catch (error: any) {
    console.error("Translate News API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
