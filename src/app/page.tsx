import dynamic from 'next/dynamic';
import places from '@/data/places.json';

const PinReelMap = dynamic(() => import('@/components/PinReelMap'));

export default function Home() {
  return (
    <>
      <main>
        <h1>📍 Food Places from Instagram Reels</h1>
        <PinReelMap places={places} />
      </main>
    </>
  );
}
