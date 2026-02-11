import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = 'https://graph.instagram.com';

export async function GET(req: NextRequest) {
  const ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;

  if (!ACCESS_TOKEN) {
    return NextResponse.json({ error: 'Instagram access token is missing.' }, { status: 500 });
  }

  const searchParams = req.nextUrl.searchParams;
  const type = searchParams.get('type');

  try {
      let url = '';
      if (type === 'profile') {
        // Endpoint to fetch user profile
        url = `${BASE_URL}/me?fields=id,username,account_type&access_token=${ACCESS_TOKEN}`;
      } else if (type === 'media') {
        // Endpoint to fetch media posts
        url = `${BASE_URL}/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${ACCESS_TOKEN}`;
      } else {
        return NextResponse.json({ error: 'Invalid query parameter. Use "type=profile" or "type=media".' }, { status: 400 });
      }

      const response = await fetch(url);

      if (!response.ok) {
        const error = await response.json();
        return NextResponse.json({ error }, { status: response.status });
      }

      const data = await response.json();
      return NextResponse.json(data);
    } catch (error) {
      console.error('Error fetching Instagram data:', error);
      return NextResponse.json({ error: 'Failed to fetch Instagram data.' }, { status: 500 });
    }
}
