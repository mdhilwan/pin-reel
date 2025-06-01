import dynamic from 'next/dynamic';
import places from '../data/places.json';

const Map = dynamic(() => import('../components/Map'), { ssr: false });

export default function Home() {
  return (
    <main>
      <h1>📍 Food Places from Instagram Reels</h1>
      <Map places={places} />
    </main>
  );
}
