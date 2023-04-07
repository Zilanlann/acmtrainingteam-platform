<template>
  <el-container>
    <el-container>
      <el-header>
        <el-page-header @back="this.$router.back()">
          <template #content>
            Discussion of &nbsp;
            <el-link
              type="primary"
              :href="getProblemUrl(problem)"
              target="_blank"
              size="large"
            >
              <img
                v-if="problem.title_slug"
                src="../image/leetcode.png"
                alt="L"
                width="14"
                height="14"
              />
              <img
                v-else
                src="../image/codeforces.png"
                alt="C"
                width="14"
                height="14"
              />{{ problem.title ? problem.title : "No Title" }}</el-link
            >
            &nbsp;&nbsp;&nbsp;&nbsp;Rating:&nbsp;
            <span :style="`color: ${getRatingColor(problem.rating)}`">
              <span :class="problem.rating >= 3000 ? `first-letter-black` : ``">
                {{ problem.rating ? problem.rating : "No rating" }}
              </span>
            </span>
            &nbsp;&nbsp;&nbsp;&nbsp;Tags:&nbsp;
            <span
              v-for="item of problem.tags.split(',')"
              :key="item"
              :underline="false"
            >
              <el-tag style="margin: 0 2px" size="small">
                {{ item }}
              </el-tag>
            </span>
          </template>
        </el-page-header>
      </el-header>
      <el-divider style="margin: 0" />
      <el-container
        v-for="post of posts"
        :key="post.floor_id"
        style="width: 90%; margin: 10px auto"
        direction="vertical"
      >
        <el-card style="margin: 0px">
          <template #header>
            <div class="card-header">
              <span>
                #{{ post.floor_id }} &nbsp;
                <el-link
                  @click="this.$router.push(`/user/${post.user_name}`)"
                  :underline="false"
                >
                  <el-avatar
                    :size="28"
                    :src="
                      post.codeforces_avatar
                        ? getCodeforcesAvatar(post)
                        : getLeetcodeAvatar(post)
                    "
                    style="margin-right: 6px"
                  />
                  {{ post.user_name }}
                </el-link>
                <el-popconfirm
                  v-if="
                    $cookies.get('token')?.id === 9999 ||
                    $cookies.get('token')?.id === post.user_id
                  "
                  confirm-button-text="Yes"
                  cancel-button-text="No"
                  title="Sure to delete?"
                  @confirm="onDelete(post.floor_id)"
                >
                  <template #reference>
                    <el-button
                      style="margin-left: 6px"
                      text
                      size="small"
                      type="danger"
                      >Delete</el-button
                    >
                  </template>
                </el-popconfirm>
              </span>
              <span> {{ getFromNowTime(post.time) }} </span>
            </div>
          </template>
          <v-md-preview :text="post.content"></v-md-preview>
        </el-card>
      </el-container>
      <el-container style="width: 90%; margin: 10px auto" direction="vertical">
        <v-md-editor v-model="postText" height="400px"></v-md-editor>
        <el-button style="margin: 10px 0" text @click="onPost"
          >Click to post</el-button
        >
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import {
  getProblemUrl,
  getRatingColor,
  getCodeforcesAvatar,
  getLeetcodeAvatar,
  getFromNowTime,
} from "@/logic/dataShowing";
import { post } from "@/logic/dataGetting";
import moment from "moment";

export default {
  data() {
    return {
      problem: {
        title_slug: "two-sum",
        rating: 0,
        tags: "",
      },
      posts: [],
      postText: "",
    };
  },
  methods: {
    getCodeforcesAvatar,
    getLeetcodeAvatar,
    getProblemUrl,
    getRatingColor,
    getFromNowTime(time) {
      return getFromNowTime(moment(time).unix());
    },
    onPost() {
      post(
        "/api/post/add",
        {
          content: this.postText,
          problem_id: this.$route.params.problemId,
          auth: this.$cookies.get("token"),
        },
        () => {
          this.getPosts();
          this.postText = "";
          this.$message.success({
            message: "Post successfully.",
            duration: 1000,
          });
        }
      );
    },
    onDelete(floorId) {
      post(
        "/api/post/delete",
        {
          problem_id: this.$route.params.problemId,
          auth: this.$cookies.get("token"),
          floor_id: floorId,
        },
        () => {
          this.getPosts();
          this.$message.success({
            message: "Delete successfully.",
            duration: 1000,
          });
        }
      );
    },
    getPosts() {
      post(
        "/api/post/get",
        {
          problem_id: this.$route.params.problemId,
        },
        (result) => {
          this.problem = result.problem;
          this.posts = result.posts;
        }
      );
    },
  },
  created() {
    this.getPosts();
  },
};
</script>
<style scoped>
.first-letter-black::first-letter {
  color: #000000 !important;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
