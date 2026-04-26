import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    // convert file to base64
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");

    const response = await fetch(
      "https://plant.id/api/v3/health_assessment",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Api-Key": process.env.NEXT_PUBLIC_CROP_API_KEY,
        },
        body: JSON.stringify({
          images: [base64],
          latitude: 23.2599,
          longitude: 77.4126,
          similar_images: true,
        }),
      }
    );

    const data = await response.json();

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Prediction failed" });
  }
}