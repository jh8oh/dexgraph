import Token from "../token";

export default interface LoginResponse {
  result: string;
  token: Token;
}
