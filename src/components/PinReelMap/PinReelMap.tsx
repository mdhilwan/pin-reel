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
        zoom: 8
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
    <div className="w-0 md:w-1/2 h-[100vh]">
      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
        <GoogleMap
          mapContainerStyle={{width: '100%', height: '100%'}}
          center={location || userLocation || defaultCenter}
          zoom={userLocation ? 6.5 : 2}
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
              <div>
                <h4>{focusedPlace.name}</h4>
                <ul>
                  {focusedPlace.reels.map((reel: string, index: number) => (
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
  );
}
