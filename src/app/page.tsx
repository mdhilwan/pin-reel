import dynamic from 'next/dynamic';
import {MapProvider} from "@/components/Context/MapContext/MapContext";

const PinReelMap = dynamic(() => import('@/components/PinReelMap'));
const PlacesList = dynamic(() => import('@/components/PlacesList'));

export default function Home() {
  return (
    <>
      <main className="relative flex h-full">
        <MapProvider>
          <PinReelMap/>
          <PlacesList/>
        </MapProvider>
      </main>
    </>
  );
}
