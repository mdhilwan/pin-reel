import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { useState } from 'react';

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

const center = {
  lat: 20,
  lng: 0
};

export default function Map({ places }: Props) {
  const [selected, setSelected] = useState<Place | null>(null);

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={2}>
        {places.map((place, index) => (
          <Marker
            key={index}
            position={{ lat: place.lat, lng: place.lng }}
            onClick={() => setSelected(place)}
          />
        ))}
        {selected && (
          <InfoWindow
            position={{ lat: selected.lat, lng: selected.lng }}
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
      </GoogleMap>
    </LoadScript>
  );
}
