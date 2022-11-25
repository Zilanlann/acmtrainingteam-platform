import { createRouter, createWebHistory } from "vue-router";
import Index from "@/views/Index.vue";
import SignIn from "@/components/SignIn.vue";
import Ranking from "@/components/Ranking.vue";
import Discussion from "@/components/Discussion.vue";
import Following from "@/components/Following.vue";
import Problems from "@/components/Problems.vue";
import Settings from "@/components/Settings.vue";
import User from "@/components/User.vue";
import Submissions from "@/components/Submissions.vue";
import Register from "@/components/Register.vue";

const routes = [
  {
    path: "/",
    redirect: "signin",
  },
  {
    path: "/",
    component: Index,
    children: [
      { path: "/signin", component: SignIn },
      { path: "/ranking", component: Ranking },
      { path: "/discussion", component: Discussion },
      { path: "/following", component: Following },
      { path: "/problems", component: Problems },
      { path: "/settings", component: Settings },
      { path: "/user", component: User },
      { path: "/user/:userName", component: User },
      { path: "/submissions/user/:userName", component: Submissions },
      { path: "/submissions/problem/:problemId", component: Submissions },
      { path: "/register", component: Register },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
