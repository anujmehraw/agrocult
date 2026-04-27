import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

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

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-flash-latest",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const prompt = `You are a highly precise agricultural plant pathologist AI. 
Analyze this plant image and identify any diseases, pests, or deficiencies. 
CRITICAL: You MUST write the 'name' and 'chemical' text strictly in ${language}.
Return ONLY a strictly valid JSON object (no markdown, no backticks) with this EXACT structure:
{
  "result": {
    "disease": {
      "suggestions": [
        {
          "name": "Name of the Disease or 'Healthy'",
          "probability": 0.98,
          "details": {
            "treatment": {
              "chemical": ["Provide a highly detailed analysis: What the disease is, why it happened, and specific step-by-step organic and chemical treatments."]
            }
          }
        }
      ]
    }
  }
}`;

    const imagePart = {
      inlineData: {
        data: base64,
        mimeType: mimeType
      }
    };

    const result = await model.generateContent([prompt, imagePart]);
    let responseText = result.response.text();
    
    // Safely parse JSON even if there are formatting artifacts
    responseText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse Gemini JSON:", responseText);
      throw new Error("AI returned malformed data. Please try again.");
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Gemini API Error:", err);
    return NextResponse.json({ error: err.message || "Prediction failed" }, { status: 500 });
  }
}