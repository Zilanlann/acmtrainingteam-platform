import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Index from "../views/index.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/index",
  },
  {
    path: "/index",
    name: "index",
    component: Index,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
