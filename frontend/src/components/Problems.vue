<template>
  <el-container style="height: 100%; width: 100%">
    <el-header v-if="$route.params.tag">
      <el-page-header @back="this.$router.back()">
        <template #content>
          <span class="text-large font-600 mr-3">
            <span> Problem of tag "{{ $route.params.tag }}" </span>
          </span>
        </template>
      </el-page-header>
    </el-header>
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
            :href="getProblemUrl(scope.row)"
            target="_blank"
            >{{ scope.row.title }}</el-link
          >
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
      <el-table-column label="Tags" align="center">
        <template #default="scope">
          <el-link
            v-for="item of scope.row.tags.split(',')"
            :key="item"
            :underline="false"
          >
            <el-tag
              @click="this.$router.push(`/problems/tag/${item}`)"
              style="margin: 0 2px"
              size="small"
            >
              {{ item }}
            </el-tag>
          </el-link>
        </template>
      </el-table-column>
      <el-table-column label="Submissions" align="center">
        <template #default="scope">
          <el-button
            @click="
              this.$router.push(`/submissions/problem/${scope.row.problem_id}`)
            "
            type="info"
            plain
            size="small"
            >Details</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin: 0 auto"
      v-model:current-page="page"
      :page-size="15"
      :pager-count="11"
      layout="prev, pager, next"
      :total="itemNumber"
    />
    <el-footer height="0"> </el-footer>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      page: 1,
      itemNumber: 1000,
      condition: null,
    };
  },
  methods: {
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
    getProblemUrl(row) {
      if (row.title_slug) {
        return `https://leetcode.cn/problems/${row.title_slug}`;
      }
      const [contestId, index] = row.codeforces_problem_id.split("/");
      if (contestId.length >= 6) {
        return `https://codeforces.com/gym/${contestId}/problem/${index}`;
      }
      return `https://codeforces.com/problemset/problem/${row.codeforces_problem_id}`;
    },
    async getTableData() {
      try {
        const res = await this.$http.post("/api/problems", {
          condition: this.condition,
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
    async getPageNumber() {
      try {
        const res = await this.$http.post("/api/problems/number", {
          condition: this.condition,
        });
        if (res.data.ok) {
          this.itemNumber = res.data.number;
        }
      } catch (err) {
        console.error(err);
        this.$message.error(err);
      }
    },
    initializeCondition() {
      if (this.$route.params.tag) {
        this.condition = {
          tag: this.$route.params.tag,
        };
      }
    },
  },
  watch: {
    page() {
      this.getTableData();
    },
    $route() {
      this.initializeCondition();
      this.getPageNumber();
      this.getTableData();
    },
  },
  async created() {
    this.initializeCondition();
    this.getPageNumber();
    this.getTableData();
  },
};
</script>
<style scoped>
.first-letter-black::first-letter {
  color: #000000 !important;
}
</style>
