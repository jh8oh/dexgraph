import axios, { AxiosResponse } from "axios";
import {
  AUTHOR_ARTIST_ENDPOINT,
  COVER_ENDPOINT,
  HOST_URL,
  LOGIN_ENDPOINT,
  MANGA_ENDPOINT,
  MANGA_STATUS_ENDPOINT,
} from "./config";
import {
  AuthorArtistResponse,
  CoverResponse,
  LoginResponse,
  MangaResponse,
  MangaStatusResponse,
} from "../model/response";

export const login = async (
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

export const getMangaStatus = async (
  session: string
): Promise<AxiosResponse<MangaStatusResponse>> => {
  const bearer = { Authorization: `Bearer ${session}` };
  return await axios.get(HOST_URL + MANGA_STATUS_ENDPOINT, {
    headers: bearer,
  });
};

export const getManga = async (
  mangaIds: (string | undefined)[]
): Promise<AxiosResponse<MangaResponse>> => {
  const body = {
    limit: 100,
    ids: mangaIds,
    contentRating: ["safe", "suggestive", "erotica", "pornographic"],
  };
  const response = await axios.get(HOST_URL + MANGA_ENDPOINT, {
    params: body,
  });

  return response;
};

const getAuthorArtist = async (
  authorIds: (string | undefined)[]
): Promise<AxiosResponse<AuthorArtistResponse>> => {
  const body = { limit: 100, ids: authorIds };
  return await axios.get(HOST_URL + AUTHOR_ARTIST_ENDPOINT, {
    params: body,
  });
};

const getCover = async (
  coverIds: (string | undefined)[]
): Promise<AxiosResponse<CoverResponse>> => {
  const body = { limit: 100, ids: coverIds };
  return await axios.get(HOST_URL + COVER_ENDPOINT, {
    params: body,
  });
};

export const getMangaRelated = async (
  authorIds: (string | undefined)[],
  artistIds: (string | undefined)[],
  coverIds: (string | undefined)[]
): Promise<
  PromiseSettledResult<AxiosResponse<AuthorArtistResponse> | AxiosResponse<CoverResponse>>[]
> => {
  return await Promise.allSettled([
    getAuthorArtist(authorIds),
    getAuthorArtist(artistIds),
    getCover(coverIds),
  ]);
};
