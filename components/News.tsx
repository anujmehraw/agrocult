"use client";
import { useEffect, useState } from "react";

export default function News() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(
          `https://newsapi.org/v2/everything?q=agriculture OR farming OR crops OR किसान India&language=en&pageSize=6&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`
        );

        const data = await res.json();
        console.log("INDIA NEWS:", data);

        if (data.status === "ok") {
          setNews(data.articles);
        } else {
          throw new Error("API failed");
        }

      } catch {
        console.log("Using fallback");

        // 🔥 Indian-focused fallback
        setNews([
          {
            title: "PM Kisan Scheme Updates",
            description: "Government releases new benefits for farmers",
          },
          {
            title: "Monsoon impact on crops",
            description: "Rainfall patterns affecting Indian agriculture",
          },
          {
            title: "Organic farming rise in India",
            description: "Farmers shifting to sustainable agriculture",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl shadow">

      <h2 className="text-lg font-semibold mb-4 text-green-700">
        📰 India Farming News
      </h2>

      {loading && <p className="text-gray-500">Loading...</p>}

      <div className="space-y-4">
        {news.map((n, i) => (
          <div key={i} className="border-b pb-3">

            <p className="font-semibold">
              {n.title}
            </p>

            <p className="text-sm text-gray-600">
              {n.description || "No description available"}
            </p>

            {/* 🔥 clickable */}
            {n.url && (
              <a
                href={n.url}
                target="_blank"
                className="text-green-600 text-sm"
              >
                Read more →
              </a>
            )}

          </div>
        ))}
      </div>
    </div>
  );
}