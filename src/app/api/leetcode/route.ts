import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  console.log("API route /api/leetcode called");
  const username = req.nextUrl.searchParams.get('username') || 'kianis4';
  const apiUrl = `https://leetcode-api-faisalshohag.vercel.app/${username}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch data from the API');
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
