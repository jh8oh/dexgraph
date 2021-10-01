import Manga from "../manga";

export default interface MangaFollowResponse {
  result: string;
  response: string;
  data: Manga[];
  limit: number;
  offset: number;
  total: number;
}
