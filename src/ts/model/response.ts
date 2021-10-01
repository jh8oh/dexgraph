import Token from "./token";
import Manga from "./manga";

interface Error {
  id: string;
  status: number;
  title: string;
  detail: string;
}

export interface ErrorResponse {
  result: string;
  errors: Array<Error>;
}

export interface LoginResponse {
  result: string;
  token: Token;
}

export interface MangaFollowResponse {
  result: string;
  response: string;
  data: Manga[];
  limit: number;
  offset: number;
  total: number;
}
