import { Staff, Cover, Manga, MangaFull } from "@/ts/model/data";
import Token from "@/ts/model/token";
import { InjectionKey } from "vue";
import { createStore, Store } from "vuex";

export interface State {
  token: Token;

  // Followed manga list
  followedMangas: MangaFull[];

  // Followed data
  followStatusCount: [string, number][];
  mangaStatusCount: [string, number][];
  demographicCount: [string, number][];
  contentRatingCount: [string, number][];
  originalLanguageCount: [string, number][];
  genreCount: [string, number][];
  themeCount: [string, number][];
  formatCount: [string, number][];
  authorCount: [Staff, number][];
  artistCount: [Staff, number][];
}

export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
  state: {
    token: { session: "", refresh: "" },
    followedMangas: [],
    followStatusCount: [],
    mangaStatusCount: [],
    demographicCount: [],
    contentRatingCount: [],
    originalLanguageCount: [],
    genreCount: [],
    themeCount: [],
    formatCount: [],
    authorCount: [],
    artistCount: [],
  },
  mutations: {
    setToken(state, token: Token) {
      state.token = token;
    },
    addManga(state, manga: MangaFull) {
      state.followedMangas.push(manga);
    },
    addFollowStatusCount(state, count: [string, number]) {
      state.followStatusCount.push(count);
    },
    addMangaStatusCount(state, count: [string, number]) {
      state.mangaStatusCount.push(count);
    },
    addDemographicCount(state, count: [string, number]) {
      state.demographicCount.push(count);
    },
    addContentRatingCount(state, count: [string, number]) {
      state.contentRatingCount.push(count);
    },
    addOriginalLanguageCount(state, count: [string, number]) {
      state.originalLanguageCount.push(count);
    },
    addGenreCount(state, count: [string, number]) {
      state.genreCount.push(count);
    },
    addThemeCount(state, count: [string, number]) {
      state.themeCount.push(count);
    },
    addFormatCount(state, count: [string, number]) {
      state.formatCount.push(count);
    },
    addAuthorCount(state, count: [Staff, number]) {
      state.authorCount.push(count);
    },
    addArtistCount(state, count: [Staff, number]) {
      state.artistCount.push(count);
    },
  },
});
