import { createStore } from "vuex";

export default createStore({
  state: {
    token: null,
    refresh: null,
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
    },
    setRefresh(state, refresh) {
      state.refresh = refresh;
    },
  },
  actions: {},
  modules: {},
});
