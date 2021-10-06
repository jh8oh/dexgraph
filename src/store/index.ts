import { MangaFull } from "@/ts/model/data";
import Token from "@/ts/model/token";
import { InjectionKey } from "vue";
import { createStore, Store } from "vuex";

export interface State {
  token: Token;

  // Followed manga list
  followedMangas: MangaFull[];

  // Dynamic data
  originalLanguages: string[];
  genres: string[];
  themes: string[];
  formats: string[];
  authors: string[];
  artists: string[];
}

export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
  state: {
    token: { session: "", refresh: "" },
    followedMangas: [],
    originalLanguages: [],
    genres: [],
    themes: [],
    formats: [],
    authors: [],
    artists: [],
  },
  mutations: {
    setToken(state, token: Token) {
      state.token = token;
    },
    addManga(state, manga: MangaFull) {
      state.followedMangas.push(manga);
    },
    addOriginalLanguage(state, originalLanguage: string) {
      state.originalLanguages.push(originalLanguage);
    },
    addGenre(state, genre: string) {
      state.genres.push(genre);
    },
    addTheme(state, theme: string) {
      state.themes.push(theme);
    },
    addFormat(state, format: string) {
      state.formats.push(format);
    },
    addAuthor(state, author: string) {
      state.authors.push(author);
    },
    addArtist(state, artist: string) {
      state.artists.push(artist);
    },
  },
});
