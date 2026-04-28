import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const language = formData.get("language") || "English";

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const mimeType = file.type?.startsWith("image/") ? file.type : "image/jpeg";

    const prompt = `You are a highly precise agricultural plant pathologist AI.
Analyze this plant/crop leaf image and identify any diseases, pests, or nutrient deficiencies.
CRITICAL: You MUST write the 'name' and 'chemical' text strictly in ${language}.
Return ONLY a strictly valid JSON object (no markdown, no backticks, no explanation) with this EXACT structure:
{
  "result": {
    "disease": {
      "suggestions": [
        {
          "name": "Name of the Disease or 'Healthy' if the plant looks fine",
          "probability": 0.95,
          "details": {
            "treatment": {
              "chemical": ["Provide a highly detailed multi-paragraph analysis: What the disease is, why it happened, visible symptoms to confirm, and specific step-by-step organic AND chemical treatments with dosage guidance."]
            }
          }
        }
      ]
    }
  }
}`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt,
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:${mimeType};base64,${base64}`,
                },
              },
            ],
          },
        ],
        max_tokens: 1500,
        temperature: 0.2,
      }),
    });

    const groqData = await response.json();

    if (!response.ok) {
      throw new Error(groqData.error?.message || "Groq API error");
    }

    let responseText = groqData.choices?.[0]?.message?.content || "";

    // Strip any accidental markdown fences
    responseText = responseText.replace(/```json/gi, "").replace(/```/g, "").trim();

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse Groq JSON:", responseText);
      throw new Error("AI returned malformed data. Please try again.");
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Predict API Error:", err);
    return NextResponse.json({ error: err.message || "Prediction failed" }, { status: 500 });
  }
}