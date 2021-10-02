import { AuthorArtist, Cover, Manga } from "@/ts/model/manga";
import Token from "@/ts/model/token";
import { InjectionKey } from "vue";
import { createStore, Store } from "vuex";

export interface State {
  token: Token;
  followedMangas: {
    manga: Manga;
    status: string | null;
    author: AuthorArtist | null;
    artist: AuthorArtist | null;
    cover: Cover | null;
  }[];
}

export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
  state: {
    token: { session: "", refresh: "" },
    followedMangas: [],
  },
  mutations: {
    setToken(state, token: Token) {
      state.token = token;
    },
    addManga(
      state,
      manga: {
        manga: Manga;
        status: string | null;
        author: AuthorArtist | null;
        artist: AuthorArtist | null;
        cover: Cover | null;
      }
    ) {
      state.followedMangas.push(manga);
    },
  },
});
