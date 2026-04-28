import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.DATAGOV_API_KEY;
    if (!apiKey) {
      throw new Error("Missing DATAGOV_API_KEY");
    }

    // Fetch latest 100 records from the Mandi prices dataset
    const response = await fetch(
      `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${apiKey}&format=json&limit=100`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    const data = await response.json();

    if (!response.ok || data.status !== "ok") {
      throw new Error(data.message || "Failed to fetch from data.gov.in");
    }

    // Process records: aggregate by Commodity to get National Average
    const commodityMap = new Map<string, { min: number[], max: number[], modal: number[] }>();

    for (const record of data.records) {
      const crop = record.commodity;
      if (!commodityMap.has(crop)) {
        commodityMap.set(crop, { min: [], max: [], modal: [] });
      }
      
      const entry = commodityMap.get(crop)!;
      // Convert to numbers, ignoring invalid data
      if (record.min_price && !isNaN(record.min_price)) entry.min.push(Number(record.min_price));
      if (record.max_price && !isNaN(record.max_price)) entry.max.push(Number(record.max_price));
      if (record.modal_price && !isNaN(record.modal_price)) entry.modal.push(Number(record.modal_price));
    }

    const processedData = [];

    for (const [crop, prices] of commodityMap.entries()) {
      if (prices.modal.length === 0) continue;

      const avgMin = Math.round(prices.min.reduce((a, b) => a + b, 0) / prices.min.length);
      const avgMax = Math.round(prices.max.reduce((a, b) => a + b, 0) / prices.max.length);
      const avgModal = Math.round(prices.modal.reduce((a, b) => a + b, 0) / prices.modal.length);

      // Simulate a trend based on a hash of the crop name to keep it consistent
      const hash = crop.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
      const isUp = hash % 2 === 0;
      const changePct = ((hash % 50) / 10).toFixed(1);

      processedData.push({
        crop,
        unit: "quintal",
        min: avgMin || avgModal,
        max: avgMax || avgModal,
        current: avgModal,
        trend: isUp ? "up" : "down",
        change: `${isUp ? '+' : '-'}${changePct}%`
      });
    }

    // Sort by highest price descending for UI, limit to top 8-12 commodities
    processedData.sort((a, b) => b.current - a.current);
    
    return NextResponse.json({ success: true, data: processedData.slice(0, 12) });

  } catch (error: any) {
    console.error("Mandi API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
