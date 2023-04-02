<template>
  <el-container>
    <el-container v-if="!$route.params.postId" style="padding: 20px">
      The post is not found.
    </el-container>
    <el-container v-else>
      <el-header>
        <el-page-header @back="this.$router.back()">
          <template #content>
            <span class="text-large font-600 mr-3 card-header">
              Name of post {{ $route.params.postId }}
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

<style>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

<script>
export default {
  data() {
    return {
      text: `## 研究背景`,
    };
  },
};
</script>
