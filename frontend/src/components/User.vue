<template>
  <el-container v-if="!$route.params.userId">
    To view your user page, please sign in first.
  </el-container>
  <div v-else>
    <el-container>{{ $route.params.userId }} 's information</el-container>
    <el-divider />
    <el-container>Recent submissions </el-container>
    <el-button
      @click="this.$router.push(`/submissions/${$route.params.userId}`)"
      text
    >
      More
    </el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {},
};
</script>
