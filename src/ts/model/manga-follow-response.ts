class Manga {}

export default class MangaFollowResponse {
  result: string;
  response: string;
  data: Manga[];
  limit: number;
  offset: number;
  total: number;

  constructor(
    result: string,
    response: string,
    data: Manga[],
    limit: number,
    offset: number,
    total: number
  ) {
    this.result = result;
    this.response = response;
    this.data = data;
    this.limit = limit;
    this.offset = offset;
    this.total = total;
  }
}
