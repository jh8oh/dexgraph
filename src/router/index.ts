import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Login from "../views/Login.vue";
import Loading from "../views/Loading.vue";
import Result from "../views/Result.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "login",
    component: Login,
  },
  {
    path: "/loading",
    name: "loading",
    component: Loading,
  },
  {
    path: "/result",
    name: "result",
    component: Result,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
