"use client"

import {GoogleMap, LoadScript, Marker, InfoWindow} from '@react-google-maps/api';
import {useEffect, useRef, useState} from 'react';
import useMapContext from "@/components/Context/MapContext";
import {Place} from "@/types/place";

const defaultCenter = {lat: 20, lng: 0};

export default function PinReelMap() {
  const {placesData, setPlacesData, focusedPlace, setFocusedPlace} = useMapContext();
  const [userLocation, setUserLocation] = useState<null | { lat: number; lng: number }>(null);
  const [location, setLocation] = useState<null | { lat: number; lng: number }>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const handleLoad = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  useEffect(() => {
    if (focusedPlace) {
      const coords = {
        lat: focusedPlace.lat,
        lng: focusedPlace.lng,
      };
      setLocation(coords)

      mapRef.current?.moveCamera({
        center: coords,
        zoom: 16
      })
    }
  }, [focusedPlace]);

  const locateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const coords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setUserLocation(coords);
          mapRef.current?.panTo(coords);
        },
        err => {
          console.error('Geolocation error:', err);
        }
      );
    }
  };

  const addDistancesToPlaces = ({lat, lng}: { lat: number, lng: number }) => {
    const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const toRad = (x: number) => x * Math.PI / 180;
      const R = 6371; // km
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

      return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
    };

    const updatedPlaces = [...placesData].map((place: Place) => {
      place.distance = getDistance(lat, lng, place.lat, place.lng);
      return place;
    }).sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));

    setPlacesData(updatedPlaces);
  };

  useEffect(() => {
    if (userLocation) {
      addDistancesToPlaces(userLocation)
    }
  }, [userLocation]);

  useEffect(() => {
    locateMe()
  }, []);

  return (
    <div className="w-full md:w-1/2">
      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
        <GoogleMap
          mapContainerStyle={{width: '100%', height: '100%'}}
          center={location || userLocation || defaultCenter}
          zoom={userLocation ? 12 : 2}
          onLoad={handleLoad}
        >
          {placesData.map((place, index) => (
            <Marker
              key={index}
              position={{lat: place.lat, lng: place.lng}}
              onClick={() => setFocusedPlace(place)}
            />
          ))}
          {focusedPlace && (
            <InfoWindow
              position={{lat: focusedPlace.lat, lng: focusedPlace.lng}}
              onCloseClick={() => setFocusedPlace(null)}
            >
              <>
                <h1
                  className="mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
                  {focusedPlace.name}
                </h1>
                <ul>
                  {focusedPlace.reels.map((reel: string, index: number) => (
                    <li key={index}>
                      <a href={reel} target="_blank" rel="noopener noreferrer">
                        <img
                          src={focusedPlace.images[index]}
                          className="w-full md:w-50 aspect-square object-cover rounded"
                          alt={`Reel ${index + 1}`}
                        />
                      </a>
                    </li>
                  ))}
                </ul>
                <a className="inline-flex mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" target={"_blank"} href={`https://www.google.com/maps/search/?api=1&query=${focusedPlace.lat},${focusedPlace.lng}`}>
                  Open Maps
                  <svg className="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                       fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M1 5h12m0 0L9 1m4 4L9 9"/>
                  </svg>
                </a>
              </>
            </InfoWindow>
          )}
          {userLocation && (
            <Marker
              position={userLocation}
              icon={{
                url: './assets/dot.png',
              }}
            />
          )}
        </GoogleMap>
      </LoadScript>
      <div className={"absolute bottom-2 left-2 z-50"}>
        <button
          onClick={locateMe}
          className="bg-white px-3 py-2 border border-gray-300 rounded cursor-pointer"
        >
          📍 Locate Me
        </button>
        <button
          className="bg-white px-3 py-2 ms-2 border border-gray-300 rounded cursor-pointer md:hidden"
        >
          🗺️ View Map
        </button>
      </div>
    </div>
  );
}
