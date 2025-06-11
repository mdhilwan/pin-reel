'use client';

import React from "react";
import useMapContext from "@/components/Context/MapContext";
import {Place} from "@/types/place";

interface PlaceButtonProps {
  place: Place;
  children: React.ReactNode;
}

export default function PlaceButton({children, place}: PlaceButtonProps) {
  const { setFocusedPlace } = useMapContext();

  return <button
    onClick={() => setFocusedPlace(place)}
    className="text-left w-full cursor-pointer">
    {children}
  </button>
}