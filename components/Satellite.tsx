"use client";

export default function Satellite() {
  const lat = 23.2599;
  const lon = 77.4126;

  const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lon}&zoom=14&size=600x300&maptype=satellite&key=YOUR_GOOGLE_MAPS_KEY`;

  return (
    <div className="bg-white p-4 rounded-xl shadow">

      <h3 className="font-semibold mb-2">
        🛰 Satellite View
      </h3>

      <img
        src={mapUrl}
        alt="satellite"
        className="rounded-lg w-full"
      />

      <p className="text-sm text-gray-600 mt-2">
        Monitor crop area using satellite imagery
      </p>

    </div>
  );
}