<template>
  <div>
    <el-container v-if="!$route.params.userName">
      To view page of your user, please sign in first.
    </el-container>
    <div v-else>
      <el-container>{{ $route.params.userName }} 's information</el-container>
      <el-divider />
      <el-container>Recent submissions </el-container>
      <el-button
        @click="
          this.$router.push(`/submissions/user/${$route.params.userName}`)
        "
        text
      >
        More
      </el-button>
    </div>
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
