const getAccessToken = async () => {

  const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!refresh_token || !process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
      throw new Error("Missing Spotify environment variables")
  }

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
      ).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Spotify token error: ${data.error || 'Unknown error'}`);
  }
  return data;
};

export const topTracks = async () => {
  const { access_token } = await getAccessToken();

  return fetch("https://api.spotify.com/v1/me/top/tracks", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};

export const topArtists = async () => {
  const { access_token } = await getAccessToken();

  return fetch("https://api.spotify.com/v1/me/top/artists", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};

export const getUser = async () => {
  const { access_token } = await getAccessToken();
  
  return fetch(`https://api.spotify.com/v1/users/${process.env.SPOTIFY_USER_NAME}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};
