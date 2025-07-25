import {Marker} from "@react-google-maps/api";
import useMapContext from "@/components/Context/MapContext";

export default function PinUserLocation() {
  const { userLocation } = useMapContext();

  return <>
    {userLocation && (
      <Marker
        position={userLocation}
        icon={{
          url: '/assets/dot.png',
        }}
      />
    )}</>
}