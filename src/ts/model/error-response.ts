class Error {
  id: string;
  status: number;
  title: string;
  detail: string;

  constructor(id: string, status: number, title: string, detail: string) {
    this.id = id;
    this.status = status;
    this.title = title;
    this.detail = detail;
  }
}

export default class ErrorResponse {
  result: string;
  errors: Array<Error>;

  constructor(result: string, errors: Array<Error>) {
    this.result = result;
    this.errors = errors;
  }
}
