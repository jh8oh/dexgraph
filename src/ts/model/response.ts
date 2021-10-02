import Token from "./token";
import { AuthorArtist, Cover, Manga } from "./manga";

interface Response {
  result: string;
}

interface Error {
  id: string;
  status: number;
  title: string;
  detail: string;
}

export interface ErrorResponse extends Response {
  errors: Array<Error>;
}

export interface LoginResponse extends Response {
  token: Token;
}

export interface MangaFollowResponse extends Response {
  response: string;
  data: Manga[];
  limit: number;
  offset: number;
  total: number;
}

export interface MangaStatusResponse extends Response {
  status: string;
}

export interface AuthorArtistResponse extends Response {
  response: string;
  data: AuthorArtist;
}

export interface CoverResponse extends Response {
  response: string;
  data: Cover;
}
