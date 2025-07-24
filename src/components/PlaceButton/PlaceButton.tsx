'use client';

import React from "react";
import useMapContext from "@/components/Context/MapContext";
import {Place} from "@/types/place";
import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation, Pagination} from "swiper/modules";

interface PlaceButtonProps {
  place: Place;
}

export default function PlaceButton({place}: PlaceButtonProps) {
  const {setPinurl} = useMapContext();

  return <button
    onClick={() => setPinurl(place.pinurl)}
    className="text-left w-full cursor-pointer"
  >
    <Swiper
      style={{
        // @ts-expect-error target custom swiper color variables
        "--swiper-navigation-color": "#000",
        "--swiper-pagination-color": "#fff",
        "--swiper-navigation-size": "30px"
      }}
      spaceBetween={10}
      slidesPerView={1}
      pagination={{clickable: true}}
      navigation
      modules={[Pagination, Navigation]}
      className="relative"
    >
      {place.images?.map((imgSrc, i) => (
        <SwiperSlide key={i}>
          {({isActive}) => (
            <img
              src={imgSrc}
              alt={`${place.name} image ${i + 1}`}
              className={`w-full h-60 lg:h-120 object-cover rounded transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-60'}`}
            />
          )}
        </SwiperSlide>
      ))}
    </Swiper>
    <div className="p-3">
      <div className="font-medium">{place.name}</div>
      <div className="text-sm text-gray-600">{place.reels.length} reels</div>
      {place.distance && (
        <p className="text-sm text-gray-500">{place.distance?.toFixed(2)} km away</p>
      )}
    </div>
  </button>
}