"use client";

const cropPrices = [
  { crop: "Wheat", unit: "quintal", min: 2200, max: 2550, trend: "up" },
  { crop: "Rice (Paddy)", unit: "quintal", min: 1900, max: 2300, trend: "down" },
  { crop: "Maize", unit: "quintal", min: 1700, max: 2050, trend: "up" },
  { crop: "Soybean", unit: "quintal", min: 3800, max: 4400, trend: "up" },
  { crop: "Cotton", unit: "quintal", min: 6200, max: 7100, trend: "down" },
  { crop: "Onion", unit: "quintal", min: 1200, max: 2100, trend: "up" },
];

export default function Marketplace() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-green-700">🛒 Crop Marketplace</h2>
        <p className="text-sm text-gray-600">
          Estimated mandi rates (INR per quintal)
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {cropPrices.map((item) => (
          <div
            key={item.crop}
            className="rounded-xl border bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-gray-900">{item.crop}</h3>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  item.trend === "up"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {item.trend === "up" ? "Rising" : "Falling"}
              </span>
            </div>

            <p className="mt-2 text-sm text-gray-600">
              Range: <b>Rs {item.min}</b> - <b>Rs {item.max}</b> / {item.unit}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
