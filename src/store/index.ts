import { Token, MangaFull } from "@/ts/model/data";
import { InjectionKey } from "vue";
import { createStore, Store } from "vuex";

export interface State {
  token: Token;
  username: string; // User info
  followedMangas: MangaFull[]; // Followed manga list
}

export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
  state: {
    token: { session: "", refresh: "" },
    username: "",
    followedMangas: [],
  },
  mutations: {
    initialize(state) {
      const token = localStorage.getItem("token");
      if (token != null) {
        state.token = JSON.parse(token);
      }

      const username = localStorage.getItem("username");
      if (username != null) {
        state.username = username;
      }

      const followedManga = localStorage.getItem("followedMangas");
      if (followedManga != null) {
        (JSON.parse(followedManga) as MangaFull[]).forEach((manga) => {
          state.followedMangas.push(manga);
        });
      }
    },
    setToken(state, token: Token) {
      localStorage.setItem("token", JSON.stringify(token));
      state.token = token;
    },
    setUsername(state, username: string) {
      localStorage.setItem("username", username);
      state.username = username;
    },
    addManga(state, manga: MangaFull) {
      state.followedMangas.push(manga);
    },
    clear(state) {
      state.token = { session: "", refresh: "" };
      state.username = "";
      state.followedMangas = [];
    },
  },
});
