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
import { getRatingColor, getProblemUrl } from "@/logic/dataShowing";
import { post } from "@/logic/dataGetting";
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
    getRatingColor,
    getProblemUrl,
    getTableData() {
      post(
        "/api/problems",
        {
          condition: this.condition,
          page: parseInt(this.page),
        },
        (result) => {
          this.tableData = result;
        }
      );
    },
    async getPageNumber() {
      post(
        "/api/problems/number",
        {
          condition: this.condition,
        },
        (result) => {
          this.itemNumber = result;
        }
      );
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
