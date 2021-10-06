import { Token, Staff, Cover, Manga, User } from "./data";

interface Response {
  result: string;
}

// Errors
interface Error {
  id: string;
  status: number;
  title: string;
  detail: string;
}

export interface ErrorResponse extends Response {
  errors: Array<Error>;
}

// Auth
export interface LoginResponse extends Response {
  token: Token;
}

// User
export interface UserResponse extends Response {
  response: string;
  data: User;
}

// Manga
export interface MangaResponse extends Response {
  response: string;
  data: Manga[];
  limit: number;
  offset: number;
  total: number;
}

export interface MangaStatusResponse extends Response {
  statuses: object;
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
