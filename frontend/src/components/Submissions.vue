<template>
  <div>
    <el-page-header @back="this.$router.back()">
      <template #content>
        <span class="text-large font-600 mr-3">
          {{ $route.params.userId }} 's submissions
        </span>
      </template>
    </el-page-header>
    <el-divider />
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="date" label="日期" width="180"> </el-table-column>
      <el-table-column prop="name" label="姓名" width="180"> </el-table-column>
      <el-table-column prop="address" label="地址"> </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
    };
  },
  methods: {},
  async created() {
    try {
      const res = await this.$http.post("/api/submissions", {
        user_id: parseInt(this.$route.params.userId),
      });
      if (res.data.ok) {
        this.tableData = res.data.result;
      }
    } catch (err) {
      console.error(err);
      this.$message.error(err);
    }
  },
};
</script>
