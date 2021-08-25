import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Search from "../views/Search.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Search",
    component: Search,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
