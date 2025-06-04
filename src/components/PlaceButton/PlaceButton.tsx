'use client';

import useMapContext from "@/components/Context/MapContext";

type Place = {
  name: string;
  lat: number;
  lng: number;
  reels: string[];
};

export default function PlaceButton({place}: { place: Place}) {
  const { setFocusedPlace } = useMapContext();

  return <button onClick={() => setFocusedPlace(place)} className="text-left w-full cursor-pointer">
    <div className="font-medium">{place.name}</div>
    <div className="text-sm text-gray-600">{place.reels.length} reels</div>
  </button>
}