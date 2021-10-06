import Token from "./token";
import { Staff, Cover, Manga, User } from "./data";

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

export interface UserResponse extends Response {
  response: string;
  data: User;
}

export interface MangaStatusResponse extends Response {
  statuses: object;
}

export interface MangaResponse extends Response {
  response: string;
  data: Manga[];
  limit: number;
  offset: number;
  total: number;
}

export interface StaffResponse extends Response {
  response: string;
  data: Staff[];
  limit: number;
  offset: number;
  total: number;
}

export interface CoverResponse extends Response {
  response: string;
  data: Cover[];
  limit: number;
  offset: number;
  total: number;
}
