'use client';

import PlaceButton from "@/components/PlaceButton";
import useMapContext from "@/components/Context/MapContext";
import React from "react";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function PlacesList() {
  const {placesData} = useMapContext();
  return <div className="mx-auto md:m-0 md:w-1/2 h-[100vh] overflow-y-auto sm:p-4 md:border-l">
    <h2 className="text-lg font-semibold mb-4 p-3 sm:p-0">Saved Places</h2>
    <ul className="grid grid-cols-1 sm:grid-cols-2 grid-cols-1 gap-4">
      {placesData.map((place, index) => (
        <li key={index} className="border rounded hover:bg-gray-50 cursor-pointer">
          <PlaceButton place={place}/>
        </li>
      ))}
    </ul>
  </div>
}