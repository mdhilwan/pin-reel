import dynamic from 'next/dynamic';
import places from '@/data/places.json';

const PinReelMap = dynamic(() => import('@/components/PinReelMap'));

export default function Home() {
  return (
    <>
      <main>
        <PinReelMap places={places}/>
      </main>
    </>
);
}
