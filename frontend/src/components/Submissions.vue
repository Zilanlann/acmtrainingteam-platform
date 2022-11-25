<template>
  <el-container style="height: 100%">
    <el-header>
      <el-page-header @back="this.$router.back()">
        <template #content>
          <span class="text-large font-600 mr-3">
            <span> {{ $route.params.userName }} 's submissions </span>
          </span>
        </template>
      </el-page-header>
    </el-header>
    <el-divider style="margin: 0" />
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column width="26px" style="padding: 0">
        <template #default="scope">
          <img
            v-if="scope.row.title_slug"
            src="../image/leetcode.png"
            alt="L"
            width="14"
            height="14"
          />
          <img
            v-else
            src="../image/codeforces.png"
            alt="C"
            width="14"
            height="14"
          />
        </template>
      </el-table-column>
      <el-table-column label="Problem" align="center">
        <template #default="scope">
          <el-link
            type="primary"
            :href="
              scope.row.title_slug
                ? `https://leetcode.cn/problems/${scope.row.title_slug}`
                : `https://codeforces.com/problemset/problem/${scope.row.codeforces_problem_id}`
            "
            target="_blank"
          >
            <span style="margin-left: 2px">{{ scope.row.title }}</span></el-link
          >
        </template>
      </el-table-column>
      <el-table-column label="User" align="center">
        <template #default="scope">
          <el-link
            @click="this.$router.push(`/user/${$route.params.userName}`)"
          >
            {{ scope.row.user_name }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column label="Rating" align="center">
        <template #default="scope">
          <span :style="`color: ${getRatingColor(scope.row.rating)}`">
            <div :class="scope.row.rating >= 3000 ? `first-letter-black` : ``">
              {{ scope.row.rating }}
            </div>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="Status" align="center">
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
      <el-table-column label="Tags" align="center">
        <template #default="scope">
          <el-link
            v-for="item of scope.row.tags.split(',')"
            :key="item"
            :underline="false"
          >
            <el-tag
              @click="this.$router.push(`/problem/tag/${item}`)"
              style="margin: 0 2px"
              size="small"
            >
              {{ item }}
            </el-tag>
          </el-link>
        </template>
      </el-table-column>
      <el-table-column label="Time" align="center">
        <template #default="scope">
          {{ getLocalTime(scope.row.submit_time) }}
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <el-pagination
        style="margin: 0 auto"
        v-model:current-page="page"
        :page-size="15"
        :pager-count="11"
        layout="prev, pager, next"
        :total="itemNumber"
      />
    </el-row>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      page: 1,
      itemNumber: 1000,
    };
  },
  methods: {
    getStatusColor(status) {
      switch (status) {
        case "Accepted":
          return "success";
        case "Wrong Answer":
        case "Time Limit Exceeded":
          return "danger";
        case "Testing":
          return "primary";
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
    getLocalTime(time) {
      return new Date(time * 1000).toLocaleString()
    },
    async getTableData() {
      try {
        const res = await this.$http.post("/api/submissions", {
          condition: {
            user_name: this.$route.params.userName,
          },
          page: parseInt(this.page),
        });
        if (res.data.ok) {
          this.tableData = res.data.result;
        }
      } catch (err) {
        console.error(err);
        this.$message.error(err);
      }
    },
  },
  watch: {
    page() {
      this.getTableData();
    },
  },
  async created() {
    try {
      const res = await this.$http.post("/api/submissions/number", {
        condition: {
          user_name: this.$route.params.userName,
        },
      });
      if (res.data.ok) {
        this.itemNumber = res.data.number;
      }
    } catch (err) {
      console.error(err);
      this.$message.error(err);
    }
    this.getTableData();
  },
};
</script>
<style scoped>
.first-letter-black::first-letter {
  color: #000000 !important;
}
</style>
