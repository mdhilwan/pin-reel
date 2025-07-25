"use client"

import {GoogleMap, LoadScript, Marker} from '@react-google-maps/api';
import {Key, useEffect, useRef, useState} from 'react';
import useMapContext from "@/components/Context/MapContext";
import {Place} from "@/types/place";
import {useRouter, useParams} from 'next/navigation';
import PinInfoWindow from "@/components/PinInfoWindow";
import PinUserLocation from "@/components/PinUserLocation";

const defaultCenter = {lat: 20, lng: 0};

export default function PinReelMap() {
  const router = useRouter();
  const {slug} = useParams();
  const {setPinurl, pinurl, placesData, setPlacesData, focusedPlace, setFocusedPlace, userLocation, setUserLocation} = useMapContext();
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
    if (pinurl && slug !== pinurl) {
      router.push(`/pin/${pinurl}`, { scroll: false })
    } else if (slug && placesData.length > 0) {
      const place = placesData.find(place => place.pinurl === slug) || null
      setFocusedPlace(place)
    }
  }, [pinurl, slug, placesData]);

  useEffect(() => {
    locateMe()
  }, []);

  const getZoom = () => {
    if (slug) {
      return 16
    } else if (userLocation) {
      return 12
    }
    return 2
  }

  return (
    <div className="w-full md:w-1/2">
      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
        <GoogleMap
          mapContainerStyle={{width: '100%', height: '100%'}}
          center={location || userLocation || defaultCenter}
          zoom={getZoom()}
          onLoad={handleLoad}
        >
          {placesData.map((place: Place, index: Key | null | undefined) => (
            <Marker
              key={index}
              position={{lat: place.lat, lng: place.lng}}
              onClick={() => setPinurl(place.pinurl)}
            />
          ))}
          <PinInfoWindow/>
          <PinUserLocation/>
        </GoogleMap>
      </LoadScript>
      <div className={"absolute bottom-23 left-2 z-50"}>
        <button
          onClick={() => router.push(`/`, { scroll: false })}
          className="bg-white px-3 py-2 border border-gray-300 rounded cursor-pointer"
        >
          📍 Locate Me
        </button>
        <button
          className="bg-white px-3 py-2 ms-2 border border-gray-300 rounded cursor-pointer hidden"
        >
          🗺️ View Map
        </button>
      </div>
    </div>
  );
}
