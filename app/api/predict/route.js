import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file" });
    }

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an agricultural expert. Analyze plant images and give disease, risk level, and advice.",
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Analyze this crop image." },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64}`,
              },
            },
          ],
        },
      ],
    });

    const reply = response.choices[0].message.content;

    return NextResponse.json({
      disease: reply,
      confidence: 0.9,
      risk: "AI Generated",
      irrigation: "Follow AI advice",
    });

  } catch (err) {
    console.error(err);

    return NextResponse.json({
      error: "Analysis failed",
    });
  }
}