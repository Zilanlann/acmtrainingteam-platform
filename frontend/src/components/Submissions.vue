<template>
  <el-page-header @back="this.$router.back()">
    <template #content>
      <span class="text-large font-600 mr-3">
        {{ $route.params.userId }} 's submissions
      </span>
    </template>
  </el-page-header>
  <el-divider />
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {},
};
</script>
