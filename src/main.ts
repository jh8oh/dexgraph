import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { store, key } from "./store";
import axiosThrottle from "axios-request-throttle";
import axios from "axios";

axiosThrottle.use(axios, { requestsPerSecond: 10 });
createApp(App).use(store, key).use(router).mount("#app");
