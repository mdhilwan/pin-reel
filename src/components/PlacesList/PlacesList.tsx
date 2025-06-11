'use client';

import PlaceButton from "@/components/PlaceButton";
import useMapContext from "@/components/Context/MapContext";
import React from "react";
import {Swiper, SwiperSlide} from 'swiper/react';
import {Pagination, Navigation} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function PlacesList() {
  const {placesData} = useMapContext();
  return <div className="w-full md:w-1/2 h-[100vh] overflow-y-auto p-4 border-l">
    <h2 className="text-lg font-semibold mb-4">Saved Places</h2>
    <ul className="grid grid-cols-1 sm:grid-cols-2 grid-cols-1 gap-4">
      {placesData.map((place, index) => (
        <li key={index} className="border rounded hover:bg-gray-50 cursor-pointer">
          <PlaceButton place={place}>
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
                      className={`w-full h-40 object-cover rounded transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-60'}`}
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
          </PlaceButton>
        </li>
      ))}
    </ul>
  </div>
}