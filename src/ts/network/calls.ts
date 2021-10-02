import axios, { AxiosResponse } from "axios";
import {
  AUTHOR_ARTIST_ENDPOINT,
  COVER_ENDPOINT,
  HOST_URL,
  LOGIN_ENDPOINT,
  MANGA_FOLLOW_ENDPOINT,
  MANGA_STATUS_ENDPOINT,
} from "./config";
import {
  AuthorArtistResponse,
  CoverResponse,
  LoginResponse,
  MangaFollowResponse,
  MangaStatusResponse,
} from "../model/response";

const login = async (
  username: string,
  password: string,
  isEmail: boolean
): Promise<AxiosResponse<LoginResponse>> => {
  const response = await axios.post(HOST_URL + LOGIN_ENDPOINT, {
    username: isEmail ? "" : username,
    email: isEmail ? username : "",
    password: password,
  });

  return response;
};

const getBearer = (session: string) => {
  return { Authorization: `Bearer ${session}` };
};

const getMangaFollows = async (
  session: string,
  body: { limit: number; offset: number }
): Promise<AxiosResponse<MangaFollowResponse>> => {
  const bearer = getBearer(session);

  const response = await axios.get(HOST_URL + MANGA_FOLLOW_ENDPOINT, {
    headers: bearer,
    params: body,
  });

  return response;
};

const getMangaStatus = async (
  session: string,
  mangaId: string
): Promise<AxiosResponse<MangaStatusResponse>> => {
  const bearer = getBearer(session);

  const response = await axios.get(HOST_URL + MANGA_STATUS_ENDPOINT(mangaId), {
    headers: bearer,
  });

  return response;
};

const getAuthorArtist = async (authorId: string): Promise<AxiosResponse<AuthorArtistResponse>> => {
  return await axios.get(HOST_URL + AUTHOR_ARTIST_ENDPOINT(authorId));
};

const getCover = async (coverId: string): Promise<AxiosResponse<CoverResponse>> => {
  return await axios.get(HOST_URL + COVER_ENDPOINT(coverId));
};

const getMangaRelated = async (
  session: string,
  mangaId: string,
  authorId: string,
  artistId: string,
  coverId: string
): Promise<
  [
    PromiseSettledResult<AxiosResponse<MangaStatusResponse>>,
    PromiseSettledResult<AxiosResponse<AuthorArtistResponse>>,
    PromiseSettledResult<AxiosResponse<AuthorArtistResponse>>,
    PromiseSettledResult<AxiosResponse<CoverResponse>>
  ]
> => {
  return await Promise.allSettled([
    getMangaStatus(session, mangaId),
    getAuthorArtist(authorId),
    getAuthorArtist(artistId),
    getCover(coverId),
  ]);
};

export { login, getMangaFollows, getMangaRelated };
