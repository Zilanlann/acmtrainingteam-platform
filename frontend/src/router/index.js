import { createRouter, createWebHistory } from "vue-router";
import Index from "@/views/Index.vue";
import SignIn from "@/components/SignIn.vue";
import Ranking from "@/components/Ranking.vue";
import Discussion from "@/components/Discussion.vue";
import Post from "@/components/Post.vue";
import ListDetails from "@/components/ListDetails.vue";
import Problems from "@/components/Problems.vue";
import Settings from "@/components/Settings.vue";
import User from "@/components/User.vue";
import Submissions from "@/components/Submissions.vue";
import Register from "@/components/Register.vue";
import List from "@/components/List.vue";
import Admin from "@/components/Admin.vue";
import Import from "@/components/Import.vue";
import Error from "@/components/Error.vue";

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
      { path: "/discussion/:postId", component: Post },
      { path: "/list", component: List },
      { path: "/list/:listId/:listName", component: ListDetails },
      { path: "/problems", component: Problems },
      { path: "/problems/tag", component: Problems },
      { path: "/problems/tag/:tag", component: Problems },
      { path: "/settings", component: Settings },
      { path: "/settings/:userName", component: Settings },
      { path: "/user", component: User },
      { path: "/user/:userName", component: User },
      { path: "/submissions/user/:userName", component: Submissions },
      { path: "/submissions/problem/:problemId", component: Submissions },
      { path: "/register", component: Register },
      { path: "/admin", component: Admin },
      { path: "/import", component: Import },
      { path: "/error", component: Error },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
