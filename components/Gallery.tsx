"use client";

export default function Gallery() {
  const images = [
    "https://images.unsplash.com/photo-1501004318641-b39e6451bec6",
    "https://images.unsplash.com/photo-1464226184884-fa280b87c399",
    "https://images.unsplash.com/photo-1492496913980-501348b61469",
  ];

  return (
    <div>
      <h2 className="mb-1 text-xl font-bold text-amber-950">🖼️ Farm Gallery</h2>
      <p className="mb-4 text-sm text-amber-700">
        Browse crop visuals and field inspiration.
      </p>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {images.map((src, i) => (
          <div key={i} className="overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-sm">
            <img
              src={src}
              className="h-40 w-full object-cover transition duration-300 hover:scale-105"
              alt={`crop-${i + 1}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}