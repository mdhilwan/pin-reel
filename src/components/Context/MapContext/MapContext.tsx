'use client';

import places from '@/data/places.json';
import {createContext, useContext, useState} from 'react';
import {Place} from "@/types/place";

const MapContext = createContext<{
  pinurl: string | null | undefined;
  setPinurl: (pinurl: string) => void;
  focusedPlace: Place | null | undefined;
  setFocusedPlace: (place: Place | null) => void;
  placesData: Place[];
  setPlacesData: (places: Place[]) => void;
  userLocation: null | { lat: number; lng: number };
  setUserLocation: ({lat, lng}: { lat: number; lng: number }) => void;
}>({
  pinurl: null,
  setPinurl: () => {},
  focusedPlace: null,
  setFocusedPlace: () => {},
  placesData: [],
  setPlacesData: () => {},
  userLocation: null,
  setUserLocation: () => {},
});

export const MapProvider = ({children}: { children: React.ReactNode }) => {
  const [focusedPlace, setFocusedPlace] = useState<Place | null>(null);
  const [placesData, setPlacesData] = useState<Place[]>(places);
  const [pinurl, setPinurl] = useState<string>("");
  const [userLocation, setUserLocation] = useState<null | { lat: number; lng: number }>(null);

  return (
    <MapContext.Provider value={{pinurl, setPinurl, focusedPlace, setFocusedPlace, placesData, setPlacesData, userLocation, setUserLocation}}>
      {children}
    </MapContext.Provider>
  );
};

export default function useMapContext() {
  return useContext(MapContext);
}