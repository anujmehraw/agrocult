"use client";
import { useEffect, useState } from "react";
import { useTranslation } from "../lib/useTranslation";

export default function News() {
  const { t, language } = useTranslation();
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(
          `https://newsapi.org/v2/everything?q=("Indian agriculture" OR "Indian farmers" OR "PM Kisan" OR "Kharif" OR "Rabi" OR "Mandi prices" OR "Indian farming")&language=en&sortBy=publishedAt&pageSize=6&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`
        );

        const data = await res.json();
        
        if (data.status === "ok" && data.articles.length > 0) {
          // Filter out removed articles
          const validArticles = data.articles.filter((a: any) => a.title !== "[Removed]" && a.url).slice(0, 6);
          
          // Translate if not English
          if (language !== "English") {
            const transRes = await fetch("/api/translate-news", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ articles: validArticles, targetLanguage: language })
            });
            const transData = await transRes.json();
            if (transData.success) {
              setNews(transData.articles);
            } else {
              setNews(validArticles);
            }
          } else {
            setNews(validArticles);
          }
        } else {
          throw new Error("API failed or empty");
        }

      } catch {
        // 🔥 Indian-focused fallback
        setNews([
          {
            title: t("PM Kisan Samman Nidhi 16th Installment Released"),
            description: t("Millions of farmers across India receive direct financial assistance ahead of the sowing season."),
            url: "#"
          },
          {
            title: t("IMD Predicts Favorable Monsoon for Kharif Crops"),
            description: t("The Indian Meteorological Department forecasts above-average rainfall, boosting hopes for a record rice and soybean harvest."),
            url: "#"
          },
          {
            title: t("Rise of Agritech Startups in Maharashtra and Gujarat"),
            description: t("Local farmers are increasingly adopting drone technology and AI for precision agriculture."),
            url: "#"
          },
          {
            title: t("Government Announces New MSP for Wheat and Mustard"),
            description: t("The minimum support price has been increased to ensure better margins for farmers this rabi season."),
            url: "#"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [language, t]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-.586-1.414l-4.5-4.5A2 2 0 0012.5 3H11"></path></svg>
          {t("Live Indian Farming News")}
        </h3>
        <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 rounded-full">{t("Updates daily")}</span>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white border border-gray-100 p-5 rounded-2xl h-32 animate-pulse flex flex-col justify-between shadow-sm">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-100 rounded w-full mt-2"></div>
              <div className="h-3 bg-gray-100 rounded w-5/6 mt-1"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {news.map((n, i) => (
            <a 
              key={i} 
              href={n.url} 
              target="_blank" 
              rel="noreferrer"
              className="bg-white p-5 rounded-2xl border border-gray-100 hover:border-green-300 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-green-500 transform scale-y-0 group-hover:scale-y-100 transition-transform origin-top"></div>
              
              <h4 className="font-bold text-gray-900 leading-tight mb-2 line-clamp-2 group-hover:text-green-700 transition-colors">
                {n.title}
              </h4>
              
              <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-1">
                {n.description || t("Click to read the full article.")}
              </p>
              
              <div className="mt-auto flex justify-between items-center text-xs font-semibold text-green-600">
                <span>{t("Read Article")}</span>
                <span>→</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}