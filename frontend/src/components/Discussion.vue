<template>
  <el-container style="height: 100%; padding: 20px">
    <v-md-preview :text="text"></v-md-preview>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      text: `## 研究背景
`,
    };
  },
};
</script>
