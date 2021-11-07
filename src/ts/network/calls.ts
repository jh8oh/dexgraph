import axios, { AxiosResponse } from "axios";
import {
  STAFF_ENDPOINT,
  COVER_ENDPOINT,
  REFRESH_ENDPOINT,
  HOST_URL,
  LOGIN_ENDPOINT,
  MANGA_ENDPOINT,
  MANGA_STATUS_ENDPOINT,
  LOGGED_USER_ENDPOINT,
  CHECK_ENDPOINT,
} from "./config";
import {
  StaffResponse,
  CoverResponse,
  LoginResponse,
  MangaResponse,
  MangaStatusResponse,
  UserResponse,
  CheckResponse,
  RefreshResponse,
} from "../model/response";

export const login = async (
  username: string,
  password: string,
  isEmail: boolean
): Promise<AxiosResponse<LoginResponse>> => {
  return await axios.post(HOST_URL + LOGIN_ENDPOINT, {
    username: isEmail ? "" : username,
    email: isEmail ? username : "",
    password: password,
  });
};

export const check = async (session: string): Promise<AxiosResponse<CheckResponse>> => {
  const bearer = { Authorization: `Bearer ${session}` };
  return await axios.get(HOST_URL + CHECK_ENDPOINT, {
    headers: bearer,
  });
};

export const refresh = async (refresh: string): Promise<AxiosResponse<RefreshResponse>> => {
  return await axios.post(HOST_URL + REFRESH_ENDPOINT, {
    token: refresh,
  });
};

export const getUser = async (session: string): Promise<AxiosResponse<UserResponse>> => {
  const bearer = { Authorization: `Bearer ${session}` };
  return await axios.get(HOST_URL + LOGGED_USER_ENDPOINT, {
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
  return await axios.get(HOST_URL + MANGA_ENDPOINT, {
    params: body,
  });
};

export const getMangaStatus = async (
  session: string
): Promise<AxiosResponse<MangaStatusResponse>> => {
  const bearer = { Authorization: `Bearer ${session}` };
  return await axios.get(HOST_URL + MANGA_STATUS_ENDPOINT, {
    headers: bearer,
  });
};

const getStaff = async (
  authorIds: (string | undefined)[]
): Promise<AxiosResponse<StaffResponse>> => {
  const body = { limit: 100, ids: authorIds };
  return await axios.get(HOST_URL + STAFF_ENDPOINT, {
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
): Promise<PromiseSettledResult<AxiosResponse<StaffResponse> | AxiosResponse<CoverResponse>>[]> => {
  return await Promise.allSettled([getStaff(authorIds), getStaff(artistIds), getCover(coverIds)]);
};
