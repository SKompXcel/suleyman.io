import { NextResponse } from 'next/server';
import { topArtists } from '@/lib/spotify';

export async function GET() {
  console.log('Handling /api/topArtists request');

    try {
      const response = await topArtists();
      const { items } = await response.json();

      const artists = items.slice(0, 50).map((artist: any) => ({
        title: artist.name,
        coverImage: artist.images[0]?.url,
        url: artist.external_urls.spotify,
      }));

      return NextResponse.json(artists);
    } catch (error) {
      console.error('Error fetching top artists:', error);
      return NextResponse.json({ error: 'Failed to fetch top artists' }, { status: 500 });
    }
}
