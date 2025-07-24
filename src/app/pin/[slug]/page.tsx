"use client"

import dynamic from "next/dynamic";
import {MapProvider} from "@/components/Context/MapContext/MapContext";
import PlacesList from "@/components/PlacesList";

const PinReelMap = dynamic(() => import('@/components/PinReelMap'), { ssr: false });

export default function PinSlugPage() {
  return <main className="relative flex h-full">
    <MapProvider>
      <PinReelMap/>
      <PlacesList/>
    </MapProvider>
  </main>;
}