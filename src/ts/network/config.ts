// Host URL
const HOST_URL = "https://api.mangadex.org/";

// Auth Endpoints
const LOGIN_ENDPOINT = "auth/login";

// Manga Endpoints
const MANGA_FOLLOW_ENDPOINT = "user/follows/manga";
const MANGA_STATUS_ENDPOINT = (id: string): string => `manga/${id}/status`;
const AUTHOR_ARTIST_ENDPOINT = (id: string): string => `author/${id}`;
const COVER_ENDPOINT = (id: string): string => `cover/${id}`;

export {
  HOST_URL,
  LOGIN_ENDPOINT,
  MANGA_FOLLOW_ENDPOINT,
  MANGA_STATUS_ENDPOINT,
  AUTHOR_ARTIST_ENDPOINT,
  COVER_ENDPOINT,
};
