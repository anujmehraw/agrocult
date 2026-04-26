"use client";

export default function Gallery() {
  const images = [
    "https://images.unsplash.com/photo-1501004318641-b39e6451bec6",
    "https://images.unsplash.com/photo-1464226184884-fa280b87c399",
    "https://images.unsplash.com/photo-1492496913980-501348b61469",
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          className="rounded-xl shadow hover:scale-105 transition"
        />
      ))}
    </div>
  );
}