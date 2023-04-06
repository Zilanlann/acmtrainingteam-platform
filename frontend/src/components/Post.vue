<template>
  <el-container>
    <el-container>
      <el-header>
        <el-page-header @back="this.$router.back()">
          <template #content>
            <span>
              <el-text size="small">Discussion of </el-text>
              <el-link
                type="primary"
                :href="getProblemUrl(problem)"
                target="_blank"
                size="large"
                >{{ problem.title ? problem.title : "No Title" }}</el-link
              >
              Rating:
              <span :style="`color: ${getRatingColor(problem.rating)}`">
                <span
                  :class="problem.rating >= 3000 ? `first-letter-black` : ``"
                >
                  {{ problem.rating ? problem.rating : "No rating" }}
                </span>
              </span>
              Tags:
              <span
                v-for="item of problem.tags.split(',')"
                :key="item"
                :underline="false"
              >
                <el-tag style="margin: 0 2px" size="small">
                  {{ item }}
                </el-tag>
              </span>
            </span>
          </template>
        </el-page-header>
      </el-header>
      <el-divider style="margin: 0" />
      <el-container style="width: 90%; margin: 10px auto" direction="vertical">
        <el-card style="margin: 10px">
          <template #header>
            <div class="card-header">
              <span>Card name</span>
              <el-button class="button" text>Operation button</el-button>
            </div>
          </template>
          <v-md-preview :text="text"></v-md-preview>
        </el-card>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import { getProblemUrl, getRatingColor } from "@/logic/dataShowing";
import { post } from "@/logic/dataGetting";

export default {
  data() {
    return {
      text: `## 研究背景`,
      problem: {
        title_slug: "two-sum",
        rating: 0,
        tags: ""
      },
      posts: [],
    };
  },
  methods: {
    getProblemUrl,
    getRatingColor,
  },
  created() {
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
