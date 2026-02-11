import { NextResponse } from 'next/server';
import { topTracks } from '@/lib/spotify';

export async function GET() {
  console.log('Handling /api/topTracks request');

    try {
      const response = await topTracks();
      const { items } = await response.json();

      const tracks = items.slice(0, 50).map((track: any) => ({
        title: track.name,
        coverImage: track.album.images[0]?.url,
        url: track.external_urls.spotify,
      }));

      return NextResponse.json(tracks);
    } catch (error) {
      console.error('Error fetching top tracks:', error);
      return NextResponse.json({ error: 'Failed to fetch top tracks' }, { status: 500 });
    }
}
