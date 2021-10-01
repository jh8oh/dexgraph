class Token {
  session: string;
  refresh: string;

  constructor(session: string, refresh: string) {
    this.session = session;
    this.refresh = refresh;
  }
}

export default class LoginResponse {
  result: string;
  token: Token;

  constructor(result: string, token: Token) {
    this.result = result;
    this.token = token;
  }
}
