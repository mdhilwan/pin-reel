'use client';

import PlaceButton from "@/components/PlaceButton";
import useMapContext from "@/components/Context/MapContext";

export default function PlacesList() {
  const { placesData } = useMapContext();
  return <div className="w-1/3 h-[100vh] overflow-y-auto p-4 border-l">
    <h2 className="text-lg font-semibold mb-4">Saved Places</h2>
    <ul className="space-y-3">
      {placesData.map((place, index) => (
        <li key={index} className="border rounded hover:bg-gray-50 cursor-pointer">
          <div>
            {place.images?.map((imgSrc, i) => (
              <img
                key={i}
                src={imgSrc}
                alt={`${place.name} image ${i + 1}`}
                className="w-full h-40 object-cover rounded"
              />
            ))}
            <div className="p-3">

            <PlaceButton place={place} />
            {place.distance && (
              <p className="text-sm text-gray-500">{place.distance?.toFixed(2)} km away</p>
            )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  </div>
}