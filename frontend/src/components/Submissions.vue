<template>
  <el-container style="height: 100%">
    <el-header>
      <el-page-header @back="this.$router.back()">
        <template #content>
          <span class="text-large font-600 mr-3">
            {{ $route.params.userId }} 's submissions
          </span>
        </template>
      </el-page-header>
    </el-header>
    <el-divider style="margin: 0" />
    <el-table
      :data="tableData"
      stripe
      style="width: 100%"
      align="center"
      height="calc(100% - 62px)"
    >
      <el-table-column label="Problem" width="180px">
        <template #default="scope">
          <el-link
            type="primary"
            :href="
              scope.row.title_slug
                ? `https://leetcode.cn/problems/${scope.row.title_slug}`
                : `https://codeforces.com/problemset/problem/${scope.row.codeforces_problem_id}`
            "
            target="_blank"
            >{{ scope.row.title }}</el-link
          >
        </template>
      </el-table-column>
      <el-table-column label="Status">
        <template #default="scope">
          <el-link
            :type="getStatusColor(scope.row.status)"
            :href="
              scope.row.title_slug
                ? `https://leetcode.cn/submissions/detail/${scope.row.submission_id}`
                : `https://codeforces.com/contest/${
                    scope.row.codeforces_problem_id.split('/')[0]
                  }/submission/${scope.row.submission_id}`
            "
            target="_blank"
            >{{
              scope.row.status === `OK` ? `ACCEPTED` : scope.row.status
            }}</el-link
          >
        </template>
      </el-table-column>
    </el-table>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
    };
  },
  methods: {
    getStatusColor(status) {
      switch (status) {
        case "Accepted":
          return "success";
        case "Wrong Answer":
        case "Time Limit Exceeded":
          return "error";
        default:
          return "warning";
      }
    },
  },
  async created() {
    try {
      const res = await this.$http.post("/api/submissions", {
        condition: {
          user_id: parseInt(this.$route.params.userId),
        },
        page: 0,
      });
      if (res.data.ok) {
        this.tableData = res.data.result;
        console.log(this.tableData);
      }
    } catch (err) {
      console.error(err);
      this.$message.error(err);
    }
  },
};
</script>
