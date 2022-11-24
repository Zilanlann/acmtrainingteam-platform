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
    <el-table :data="tableData" stripe style="width: 100%" align="center">
      <el-table-column label="Problem">
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
      <el-table-column label="Rating">
        <template #default="scope">
          <span :style="`color: ${getRatingColor(scope.row.rating)}`">
            <div :class="scope.row.rating >= 3000 ? `first-letter-black` : ``">
              {{ scope.row.rating }}
            </div>
          </span>
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
            >{{ scope.row.status }}</el-link
          >
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <el-pagination
        style="margin: 0 auto"
        :page-size="20"
        :pager-count="11"
        layout="prev, pager, next"
        :total="1000"
      />
    </el-row>
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
    getRatingColor(rating) {
      let color;
      if (rating < 1200) {
        color = "#808080";
      } else if (rating >= 1200 && rating < 1400) {
        color = "#008000";
      } else if (rating >= 1400 && rating < 1600) {
        color = "#03a89e";
      } else if (rating >= 1600 && rating < 1900) {
        color = "#0000ff";
      } else if (rating >= 1900 && rating < 2100) {
        color = "#aa00aa";
      } else if (rating >= 2100 && rating < 2400) {
        color = "#ff8c00";
      } else if (rating >= 2400) {
        color = "#ff0000";
      }
      return color;
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
<style scoped>
.first-letter-black::first-letter {
  color: #000000 !important;
}
</style>
