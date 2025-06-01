import {GoogleMap, LoadScript, Marker, InfoWindow} from '@react-google-maps/api';
import {useEffect, useRef, useState} from 'react';

type Place = {
  name: string;
  lat: number;
  lng: number;
  reel: string;
};

type Props = {
  places: Place[];
};

const containerStyle = {
  width: '100%',
  height: '80vh'
};

const defaultCenter = { lat: 20, lng: 0 };

export default function Map({places}: Props) {
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
    locateMe(); // automatically center on first load
  }, []);

  return (
    <div style={{position: 'relative'}}>
      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
        <GoogleMap
          mapContainerStyle={containerStyle}
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
                <a href={selected.reel} target="_blank" rel="noopener noreferrer">
                  View Reel
                </a>
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
      {/* Locate Me Button */}
      <button
        onClick={locateMe}
        style={{
          position: 'absolute',
          bottom: 10,
          left: 10,
          background: 'white',
          padding: '8px 12px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          cursor: 'pointer',
          zIndex: 1000,
        }}
      >
        📍 Locate Me
      </button>
    </div>
  );
}
