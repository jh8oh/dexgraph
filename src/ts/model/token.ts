export default class Token {
  session: string;
  refresh: string;

  constructor(session: string, refresh: string) {
    this.session = session;
    this.refresh = refresh;
  }
}
