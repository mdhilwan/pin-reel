'use client';

import places from '@/data/places.json';
import {createContext, useContext, useState} from 'react';

type Place = {
  name: string;
  lat: number;
  lng: number;
  distance?: number;
  images: string[]
  reels: string[];
};

const MapContext = createContext<{
  focusedPlace: Place | null;
  setFocusedPlace: (place: Place | null) => void;
  placesData: Place[];
  setPlacesData: (places: Place[]) => void;
}>({
  focusedPlace: null,
  setFocusedPlace: () => {},
  placesData: [],
  setPlacesData: () => {},
});

export const MapProvider = ({children}: { children: React.ReactNode }) => {
  const [focusedPlace, setFocusedPlace] = useState<Place | null>(null);
  const [placesData, setPlacesData] = useState<Place[]>(places);

  return (
    <MapContext.Provider value={{focusedPlace, setFocusedPlace, placesData, setPlacesData}}>
      {children}
    </MapContext.Provider>
  );
};

export default function useMapContext() {
  return useContext(MapContext);
}