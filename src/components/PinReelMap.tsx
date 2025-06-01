"use client"

import {GoogleMap, LoadScript, Marker, InfoWindow} from '@react-google-maps/api';
import {useEffect, useRef, useState} from 'react';

type Place = {
  name: string;
  lat: number;
  lng: number;
  reels: string[];
};

type Props = {
  places: Place[];
};

const defaultCenter = {lat: 20, lng: 0};

export default function PinReelMap({places}: Props) {
  const [selected, setSelected] = useState<Place | null>(null);
  const [userLocation, setUserLocation] = useState<null | { lat: number; lng: number }>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const handleLoad = (map: google.maps.Map) => {
    mapRef.current = map;
  };

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

  useEffect(() => {
    locateMe();
  }, []);

  return (
    <div className="relative flex">
      <div className="w-2/3 h-[100vh]">
        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
          <GoogleMap
            mapContainerStyle={{width: '100%', height: '100%'}}
            center={userLocation || defaultCenter}
            zoom={userLocation ? 6.5 : 2}
            onLoad={handleLoad}
          >
            {places.map((place, index) => (
              <Marker
                key={index}
                position={{lat: place.lat, lng: place.lng}}
                onClick={() => setSelected(place)}
              />
            ))}
            {selected && (
              <InfoWindow
                position={{lat: selected.lat, lng: selected.lng}}
                onCloseClick={() => setSelected(null)}
              >
                <div>
                  <h4>{selected.name}</h4>
                  <ul>
                    {selected.reels.map((reel: string, index: number) => (
                      <li key={index}>
                        <a href={reel} target="_blank" rel="noopener noreferrer">
                          View Reel {index + 1}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </InfoWindow>
            )}
            {userLocation && (
              <Marker
                position={userLocation}
                icon={{
                  url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                }}
              />
            )}
          </GoogleMap>
        </LoadScript>
        <button
          onClick={locateMe}
          className="absolute bottom-2 left-2 bg-white px-3 py-2 border border-gray-300 rounded z-50"
        >
          📍 Locate Me
        </button>
      </div>
      <div className="w-1/3 h-[100vh] overflow-y-auto p-4 border-l">
        <h2 className="text-lg font-semibold mb-4">Saved Places</h2>
        <ul className="space-y-3">
          {places.map((place, index) => (
            <li key={index} className="border p-3 rounded hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelected(place)}>
              <div className="font-medium">{place.name}</div>
              <div className="text-sm text-gray-600">{place.reels.length} reels</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
