"use client"

import {GoogleMap, LoadScript, Marker, InfoWindow} from '@react-google-maps/api';
import {Key, useEffect, useRef, useState} from 'react';
import useMapContext from "@/components/Context/MapContext";
import {Place} from "@/types/place";
import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation, Pagination} from "swiper/modules";
import {useRouter, useParams} from 'next/navigation';

const defaultCenter = {lat: 20, lng: 0};

export default function PinReelMap() {
  const router = useRouter();
  const {slug} = useParams();
  const {setPinurl, pinurl, placesData, setPlacesData, focusedPlace, setFocusedPlace} = useMapContext();
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
          {focusedPlace && (
            <InfoWindow
              position={{lat: focusedPlace.lat, lng: focusedPlace.lng}}
              onCloseClick={() => setFocusedPlace(null)}
            >
              <>
                <h1
                  className="mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 max-w-48 overflow text-ellipsis">
                  {focusedPlace.name}
                </h1>
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
                  className="relative w-50"
                >
                  {focusedPlace.reels.map((reel: string, index: number) => (
                    <SwiperSlide key={index}>
                      {({isActive}) => (
                        <a href={reel} target="_blank" rel="noopener noreferrer">
                          <img
                            src={focusedPlace.images[index]}
                            className={`w-full aspect-square object-cover rounded ${isActive ? 'opacity-100' : 'opacity-60'}`}
                            alt={`Reel ${index + 1}`}
                          />
                        </a>
                      )}
                    </SwiperSlide>
                  ))}
                </Swiper>
                <div className="flex gap-2 mt-2">
                  <a
                    className="inline-flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                    target="_blank"
                    href={`https://www.google.com/maps/dir/?api=1&destination=${focusedPlace.lat},${focusedPlace.lng}`}>
                    Maps
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                         className="ms-2" viewBox="0 0 16 16">
                      <path fillRule="evenodd"
                            d="M3.1 11.2a.5.5 0 0 1 .4-.2H6a.5.5 0 0 1 0 1H3.75L1.5 15h13l-2.25-3H10a.5.5 0 0 1 0-1h2.5a.5.5 0 0 1 .4.2l3 4a.5.5 0 0 1-.4.8H.5a.5.5 0 0 1-.4-.8z"/>
                      <path fillRule="evenodd"
                            d="M8 1a3 3 0 1 0 0 6 3 3 0 0 0 0-6M4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999z"/>
                    </svg>
                  </a>
                  <a
                    className="inline-flex items-center bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
                    target="_blank"
                    href={focusedPlace.reels[0]}>
                    Instagram
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                         className="ms-2" viewBox="0 0 16 16">
                      <path
                        d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/>
                    </svg>
                  </a>
                </div>
              </>
            </InfoWindow>
          )}
          {userLocation && (
            <Marker
              position={userLocation}
              icon={{
                url: '/assets/dot.png',
              }}
            />
          )}
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
