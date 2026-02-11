import { NextResponse } from 'next/server';
import { fetchInstagramMedia } from '@/lib/fetchInstagram';

export async function GET() {
  try {
    const media = await fetchInstagramMedia(); // Fetch media data using the lib function
    return NextResponse.json(media); // Respond with the fetched media
  } catch (error: any) {
    console.error('Error in /api/instagramMedia:', error.message);
    return NextResponse.json({ error: 'Failed to fetch Instagram media' }, { status: 500 });
  }
}
