import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Index from "@/views/Index.vue";
import Ranking from "@/components/Ranking.vue";
import Discussion from "@/components/Discussion.vue";
import Following from "@/components/Following.vue";
import Problems from "@/components/Problems.vue";
import Settings from "@/components/Settings.vue";
import User from "@/components/User.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: Index,
    children: [
      { path: "/ranking", component: Ranking },
      { path: "/discussion", component: Discussion },
      { path: "/following", component: Following },
      { path: "/problems", component: Problems },
      { path: "/settings", component: Settings },
      { path: "/user", component: User },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
