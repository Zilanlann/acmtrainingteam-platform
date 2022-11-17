<template>
  <el-container v-if="!$route.params.userId">
    To view your user page, please sign in first.
  </el-container>
  <div v-else>
    <el-container>{{ $route.params.userId }} 's information</el-container>
    <el-divider />
    <el-container
      >Recent submissions
      <el-link :href="`/submissions/${$route.params.userId}`">more</el-link>
    </el-container>
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
