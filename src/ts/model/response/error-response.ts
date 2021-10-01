interface Error {
  id: string;
  status: number;
  title: string;
  detail: string;
}

export default interface ErrorResponse {
  result: string;
  errors: Array<Error>;
}
