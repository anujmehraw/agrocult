import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { message } = await req.json();

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content:
                "You are an expert farming assistant for Indian farmers. Give short, practical advice.",
            },
            {
              role: "user",
              content: message,
            },
          ],
        }),
      }
    );

    const data = await response.json();
    console.log("GROQ:", data);

    const reply =
      data?.choices?.[0]?.message?.content ||
      "No response from AI";

    return NextResponse.json({ reply });

  } catch (err) {
    console.error("Groq error:", err);

    return NextResponse.json({
      reply: "AI is not available right now.",
    });
  }
}