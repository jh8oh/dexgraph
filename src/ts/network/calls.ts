import axios, { AxiosResponse } from "axios";
import { HOST_URL, LOGIN_ENDPOINT, MANGA_FOLLOW_ENDPOINT } from "./config";
import LoginResponse from "../model/response/login-response";
import MangaFollowResponse from "../model/response/manga-follow-response";

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

const getMangaFollows = async (
  session: string,
  offset: number
): Promise<AxiosResponse<MangaFollowResponse>> => {
  const bearer = { Authorization: `Bearer ${session}` };
  const body = { limit: 100, offset: offset };

  const response = await axios.get(HOST_URL + MANGA_FOLLOW_ENDPOINT, {
    headers: bearer,
    params: body,
  });

  return response;
};

export { login, getMangaFollows };
