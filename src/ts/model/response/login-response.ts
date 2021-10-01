import Token from "../token";

export default class LoginResponse {
  result: string;
  token: Token;

  constructor(result: string, token: Token) {
    this.result = result;
    this.token = token;
  }
}
