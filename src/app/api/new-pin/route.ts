import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const reelUrl = formData.get('reelUrl') as string;
  const profileUrl = formData.get('profileUrl') as string;
  const captionOrAddress = formData.get('captionOrAddress') as string;
  const imageUrl = formData.get('imageUrl') as string;
  const profileName = formData.get('profileName') as string;

  if (!reelUrl || !profileUrl || !captionOrAddress || !imageUrl) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Read existing data
  const dataPath = path.join(process.cwd(), 'src', 'data', 'places.json');
  let places = [];
  try {
    const raw = await readFile(dataPath, 'utf-8');
    places = JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read places.json:', err);
  }

  // Use google map api to geocode
  let lat = null;
  let lng = null;
  try {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY; // Make sure this is set in your .env
    const address = encodeURIComponent(captionOrAddress);
    const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`);
    const data = await res.json();
    if (data.status === 'OK' && data.results.length > 0) {
      lat = data.results[0].geometry.location.lat;
      lng = data.results[0].geometry.location.lng;
    } else {
      console.warn('Geocoding failed:', data.status, data.error_message);
    }
  } catch (error) {
    console.error('Geocoding request error:', error);
  }

  // Download and save the image to public/images
  const response = await fetch(imageUrl);
  if (!response.ok) {
    return NextResponse.json({ error: 'Failed to download image' }, { status: 400 });
  }
  const imageBuffer = Buffer.from(await response.arrayBuffer());
  const ext = path.extname(new URL(imageUrl).pathname).split('?')[0] || '.jpg';
  const localFileName = `${uuidv4()}${ext}`;
  const localFilePath = path.join(process.cwd(), 'public', 'images', localFileName);
  await writeFile(localFilePath, imageBuffer);
  const localImagePath = `/images/${localFileName}`;

  // Create new entry
  const newPlace = {
    name: profileName,
    igProfile: profileUrl,
    reels: [reelUrl],
    lat,
    lng,
    images: [localImagePath],
  };

  // Append and write back
  places.push(newPlace);
  await writeFile(dataPath, JSON.stringify(places, null, 2));

  return NextResponse.json({ success: true, data: newPlace });
}